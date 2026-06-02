import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { sendContactMessage } from "@/lib/contact.functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

function validateEmail(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Please enter your email address.";
  if (value.length > 254) return "Email is too long.";
  const [local, domain, ...rest] = value.split("@");
  if (!local || !domain || rest.length > 0) return "Email must contain a single \u201C@\u201D.";
  if (local.length > 64) return "The part before \u201C@\u201D is too long.";
  if (!EMAIL_RE.test(value)) return "That email doesn't look right. Check for typos.";
  return null;
}

export function FeedbackDialog({
  trigger,
  title = "Send us feedback",
  description = "Tell us what worked, what didn't, or what you'd love to see next. It goes straight to the founder.",
}: {
  trigger: ReactNode;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, msg: false });
  const mountedAtRef = useRef<number>(Date.now());
  const send = useServerFn(sendContactMessage);

  useEffect(() => {
    if (open) mountedAtRef.current = Date.now();
  }, [open]);

  const reset = () => {
    setName("");
    setContactEmail("");
    setMsg("");
    setWebsite("");
    setStatus("idle");
    setErrorMsg("");
    setTouched({ name: false, email: false, msg: false });
  };

  const nameError = (() => {
    const v = name.trim();
    if (!v) return "Please enter your name.";
    if (v.length > 100) return "Name is too long.";
    return null;
  })();
  const emailError = validateEmail(contactEmail);
  const msgError = (() => {
    const m = msg.trim();
    if (m.length < 10) return "Please write at least 10 characters.";
    if (m.length > 2000) return "Message is too long.";
    return null;
  })();
  const validate = () => nameError ?? emailError ?? msgError;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
    setTouched({ name: true, email: true, msg: true });
    const v = validate();
    if (v) {
      setStatus("error");
      setErrorMsg(v);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await send({
        data: {
          name: name.trim(),
          email: contactEmail.trim(),
          message: msg.trim(),
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
        },
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      const raw = err instanceof Error ? err.message : "";
      setErrorMsg(
        /too many/i.test(raw)
          ? "Too many messages. Please try again in a minute."
          : "Couldn't send your message. Please try again.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {status === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">Message sent</DialogTitle>
              <DialogDescription className="sr-only">
                Your message has been received.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center text-base text-foreground">
              Thanks for the feedback, we'll get back to you soon. 💚
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 pt-2">
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  top: "auto",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  placeholder="Your name"
                  aria-label="Your name"
                  aria-invalid={(touched.name && !!nameError) || undefined}
                  className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring ${
                    touched.name && nameError ? "border-red-500 ring-1 ring-red-400" : ""
                  }`}
                />
                {touched.name && nameError && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{nameError}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  maxLength={254}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="Your email"
                  aria-label="Your email"
                  aria-invalid={(touched.email && !!emailError) || undefined}
                  className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring ${
                    touched.email && emailError ? "border-red-500 ring-1 ring-red-400" : ""
                  }`}
                />
                {touched.email && emailError && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, msg: true }))}
                  placeholder="Your feedback…"
                  aria-label="Your feedback"
                  aria-invalid={(touched.msg && !!msgError) || undefined}
                  className={`w-full px-4 py-2.5 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none ${
                    touched.msg && msgError ? "border-red-500 ring-1 ring-red-400" : ""
                  }`}
                />
                {touched.msg && msgError && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{msgError}</p>
                )}
              </div>

              {status === "error" && errorMsg && !nameError && !emailError && !msgError && (
                <p role="alert" className="text-xs text-red-500">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 px-5 py-2.5 rounded-md font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "var(--blue-bright)" }}
              >
                {status === "loading" ? "Sending…" : "Send feedback"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
