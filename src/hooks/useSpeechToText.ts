// Voice-to-text for the trip prompt, via the browser's built-in Web Speech API
// (SpeechRecognition). Free, no backend, no key. Not supported in Firefox, so
// callers should hide the mic when status is "unsupported". HTTPS only.

import { useCallback, useEffect, useRef, useState } from "react";

type TranscriptResults = ArrayLike<ArrayLike<{ transcript: string }>>;

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: TranscriptResults }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type SpeechStatus = "unsupported" | "idle" | "listening" | "error";

// Calls onResult with the final transcript each time the user finishes speaking.
export function useSpeechToText(onResult: (text: string) => void) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  // Keep the latest callback without re-creating start().
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (!getRecognitionCtor()) setStatus("unsupported");
    return () => recRef.current?.abort();
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0]?.transcript ?? "";
      text = text.trim();
      if (text) onResultRef.current(text);
    };
    rec.onerror = () => setStatus("error");
    // onend fires after a result or a stop; settle back to idle unless an error
    // already set the state (so the caller can surface it).
    rec.onend = () => setStatus((s) => (s === "error" ? s : "idle"));
    recRef.current = rec;
    setStatus("listening");
    try {
      rec.start();
    } catch {
      setStatus("error");
    }
  }, []);

  const toggle = useCallback(() => {
    if (status === "listening") stop();
    else start();
  }, [status, start, stop]);

  return { status, start, stop, toggle };
}
