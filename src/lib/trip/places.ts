// Coordinate gazetteer for the trip map. Mirrors the curated place library in
// src/data/insights.json (same keys + aliases) and attaches an approximate
// centroid to each. Coordinates are regional, not street-level — the map only
// ever frames a whole region, so ~5km precision is invisible. Adding a place
// here makes it pin-able everywhere with zero other changes.
//
// Matching is substring-based and case-insensitive, just like insights.ts, but
// we always prefer the LONGEST matching needle so "Kuta Lombok" resolves to
// Lombok rather than to Seminyak's "kuta" alias.

export type Place = {
  key: string; // stable id (matches the insights.json key where one exists)
  name: string; // display label used on the pin
  lat: number;
  lng: number;
  aliases?: string[];
};

// Order is irrelevant — geocode() ranks by needle length, not array position.
export const PLACES: Place[] = [
  // --- Bali ---
  {
    key: "ubud",
    name: "Ubud",
    lat: -8.5069,
    lng: 115.2625,
    aliases: ["central bali", "tegalalang", "tegallalang", "campuhan", "tirta empul", "payangan"],
  },
  {
    key: "canggu",
    name: "Canggu",
    lat: -8.6478,
    lng: 115.1385,
    aliases: ["berawa", "batu bolong", "echo beach", "pererenan"],
  },
  {
    key: "seminyak",
    name: "Seminyak",
    lat: -8.6905,
    lng: 115.1686,
    aliases: ["kuta", "legian", "double six"],
  },
  {
    key: "uluwatu",
    name: "Uluwatu",
    lat: -8.8291,
    lng: 115.0849,
    aliases: ["bukit peninsula", "pecatu", "padang padang", "bingin", "padang-padang"],
  },
  { key: "jimbaran", name: "Jimbaran", lat: -8.79, lng: 115.165 },
  { key: "nusa dua", name: "Nusa Dua", lat: -8.8008, lng: 115.2317, aliases: ["benoa"] },
  {
    key: "mount batur",
    name: "Mount Batur",
    lat: -8.2422,
    lng: 115.3753,
    aliases: ["kintamani", "batur", "mt batur"],
  },
  {
    key: "east bali",
    name: "East Bali",
    lat: -8.41,
    lng: 115.58,
    aliases: ["sidemen", "amed", "tulamben", "candidasa", "east bali volcanoes"],
  },
  {
    key: "munduk",
    name: "Munduk",
    lat: -8.27,
    lng: 115.07,
    aliases: ["wanagiri", "git git", "gitgit", "bedugul", "tamblingan"],
  },
  { key: "lovina", name: "Lovina", lat: -8.158, lng: 115.026, aliases: ["singaraja"] },
  { key: "tanah lot", name: "Tanah Lot", lat: -8.621, lng: 115.087, aliases: ["tabanan"] },
  { key: "sanur", name: "Sanur", lat: -8.688, lng: 115.262 },
  {
    key: "denpasar",
    name: "Denpasar",
    lat: -8.6705,
    lng: 115.2126,
    aliases: ["ngurah rai", "dps", "denpasar airport"],
  },

  // --- Nusa islands ---
  { key: "nusa penida", name: "Nusa Penida", lat: -8.7273, lng: 115.5444, aliases: ["penida"] },
  {
    key: "nusa lembongan",
    name: "Nusa Lembongan",
    lat: -8.68,
    lng: 115.447,
    aliases: ["lembongan", "nusa ceningan", "ceningan"],
  },

  // --- Lombok + Gili ---
  {
    key: "gili islands",
    name: "Gili Islands",
    lat: -8.35,
    lng: 116.04,
    aliases: ["gili trawangan", "gili air", "gili meno", "gili t", "gilis"],
  },
  {
    key: "lombok",
    name: "Lombok",
    lat: -8.5833,
    lng: 116.35,
    aliases: [
      "mount rinjani",
      "rinjani",
      "kuta lombok",
      "tanjung aan",
      "mawun",
      "senggigi",
      "mataram",
    ],
  },

  // --- Java ---
  {
    key: "yogyakarta",
    name: "Yogyakarta",
    lat: -7.7956,
    lng: 110.3695,
    aliases: ["jogja", "yogya", "borobudur", "prambanan"],
  },
  {
    key: "mount bromo",
    name: "Mount Bromo",
    lat: -7.9425,
    lng: 112.953,
    aliases: ["bromo", "penanjakan", "cemoro lawang"],
  },
  {
    key: "ijen",
    name: "Ijen",
    lat: -8.0586,
    lng: 114.242,
    aliases: ["kawah ijen", "banyuwangi", "blue flames"],
  },
  { key: "jakarta", name: "Jakarta", lat: -6.2088, lng: 106.8456, aliases: ["soekarno", "cgk"] },

  // --- Flores / Komodo ---
  {
    key: "komodo",
    name: "Komodo",
    lat: -8.486,
    lng: 119.8877,
    aliases: ["komodo national park", "labuan bajo", "flores", "rinca", "padar", "pink beach"],
  },
  { key: "kelimutu", name: "Kelimutu", lat: -8.76, lng: 121.82, aliases: ["moni", "ende"] },

  // --- Sumatra ---
  {
    key: "bukit lawang",
    name: "Bukit Lawang",
    lat: 3.557,
    lng: 98.138,
    aliases: ["gunung leuser", "sumatra orangutans"],
  },
  {
    key: "lake toba",
    name: "Lake Toba",
    lat: 2.68,
    lng: 98.87,
    aliases: ["danau toba", "samosir", "tuk tuk", "parapat"],
  },
  {
    key: "mentawai",
    name: "Mentawai",
    lat: -1.8,
    lng: 99.25,
    aliases: ["mentawai islands", "siberut"],
  },

  // --- East Indonesia ---
  {
    key: "raja ampat",
    name: "Raja Ampat",
    lat: -0.5,
    lng: 130.6,
    aliases: ["wayag", "misool", "kri", "waisai", "piaynemo"],
  },
  {
    key: "sulawesi",
    name: "Sulawesi",
    lat: -2.97,
    lng: 119.9,
    aliases: ["tana toraja", "toraja", "rantepao"],
  },
  {
    key: "bunaken",
    name: "Bunaken",
    lat: 1.62,
    lng: 124.76,
    aliases: ["manado", "north sulawesi"],
  },
  {
    key: "banda islands",
    name: "Banda Islands",
    lat: -4.525,
    lng: 129.9,
    aliases: ["maluku", "spice islands", "ambon", "banda neira"],
  },

  // --- Widened coverage: more sub-locations + island gateways ---
  // Bali
  {
    key: "west bali",
    name: "West Bali",
    lat: -8.14,
    lng: 114.53,
    aliases: ["pemuteran", "menjangan", "west bali national park", "gilimanuk"],
  },
  { key: "jatiluwih", name: "Jatiluwih", lat: -8.37, lng: 115.13 },
  { key: "padangbai", name: "Padang Bai", lat: -8.53, lng: 115.51, aliases: ["padang bai"] },
  // Java
  { key: "surabaya", name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { key: "malang", name: "Malang", lat: -7.9819, lng: 112.6265 },
  { key: "bandung", name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { key: "semarang", name: "Semarang", lat: -6.9667, lng: 110.4167 },
  { key: "dieng", name: "Dieng Plateau", lat: -7.2056, lng: 109.9087, aliases: ["dieng plateau"] },
  { key: "karimunjawa", name: "Karimunjawa", lat: -5.85, lng: 110.43 },
  // Nusa Tenggara (Flores, Sumba, Sumbawa)
  { key: "bajawa", name: "Bajawa", lat: -8.7878, lng: 120.9803 },
  { key: "maumere", name: "Maumere", lat: -8.62, lng: 122.21 },
  { key: "wae rebo", name: "Wae Rebo", lat: -8.6553, lng: 120.2667, aliases: ["waerebo"] },
  {
    key: "sumba",
    name: "Sumba",
    lat: -9.65,
    lng: 120.26,
    aliases: ["waingapu", "tambolaka", "weekuri", "nihiwatu"],
  },
  {
    key: "sumbawa",
    name: "Sumbawa",
    lat: -8.5,
    lng: 117.42,
    aliases: ["moyo island", "maluk", "lakey peak"],
  },
  // Sumatra
  { key: "medan", name: "Medan", lat: 3.5952, lng: 98.6722 },
  { key: "padang", name: "Padang", lat: -0.9471, lng: 100.4172, aliases: ["west sumatra"] },
  {
    key: "bukittinggi",
    name: "Bukittinggi",
    lat: -0.3055,
    lng: 100.3691,
    aliases: ["minangkabau", "harau"],
  },
  {
    key: "sabang",
    name: "Pulau Weh",
    lat: 5.8744,
    lng: 95.3214,
    aliases: ["pulau weh", "iboih", "banda aceh"],
  },
  {
    key: "kerinci",
    name: "Kerinci",
    lat: -1.6974,
    lng: 101.2644,
    aliases: ["mount kerinci", "kerinci seblat"],
  },
  {
    key: "belitung",
    name: "Belitung",
    lat: -2.7333,
    lng: 107.6333,
    aliases: ["tanjung kelayang", "tanjung tinggi"],
  },
  // Sulawesi & Maluku
  { key: "makassar", name: "Makassar", lat: -5.1477, lng: 119.4327 },
  {
    key: "togean",
    name: "Togean Islands",
    lat: -0.4,
    lng: 121.95,
    aliases: ["togian", "togian islands"],
  },
  { key: "wakatobi", name: "Wakatobi", lat: -5.31, lng: 123.58 },
  { key: "ternate", name: "Ternate", lat: 0.7905, lng: 127.3667, aliases: ["tidore"] },
  // Kalimantan (Borneo)
  {
    key: "tanjung puting",
    name: "Tanjung Puting",
    lat: -2.7333,
    lng: 111.95,
    aliases: ["pangkalan bun", "kumai", "borneo orangutans"],
  },
  {
    key: "derawan",
    name: "Derawan Islands",
    lat: 2.2833,
    lng: 118.25,
    aliases: ["maratua", "kakaban"],
  },
  { key: "balikpapan", name: "Balikpapan", lat: -1.2379, lng: 116.8529 },
];

// One bookable experience at a stop, surfaced in the map's hover popup and
// linked back to its day in the itinerary.
export type StopExperience = {
  day: number;
  time?: string;
  title: string;
  price?: number;
  currency?: string;
  partner?: string;
  imageUrl?: string;
  category?: string;
  deepLink?: string;
};

export type Stop = {
  key: string;
  label: string;
  lat: number;
  lng: number;
  experiences: StopExperience[];
};

// Minimal shape tripStops needs from an itinerary item. ItineraryItem satisfies
// it structurally; the prototype maps its own item shape onto it.
export type StopInput = {
  day: number;
  location: string;
  type?: string;
  title?: string;
  time?: string;
  price?: number;
  currency?: string;
  partner?: string;
  imageUrl?: string;
  category?: string;
  deepLink?: string;
};

// Flat (needle -> place) index, sorted longest-first so the most specific name
// wins. Built once at module load.
const NEEDLES: Array<{ needle: string; place: Place }> = PLACES.flatMap((place) =>
  [place.key, ...(place.aliases ?? [])].map((n) => ({ needle: n.toLowerCase(), place })),
).sort((a, b) => b.needle.length - a.needle.length);

/** Resolve a free-text itinerary location string to a known place, or null. */
export function geocode(location: string): Place | null {
  const hay = location.toLowerCase();
  for (const { needle, place } of NEEDLES) {
    if (hay.includes(needle)) return place;
  }
  return null;
}

/**
 * Ordered map stops, one per geocodable location that has at least one BOOKABLE
 * experience. Informational / self-guided items never create a pin (the map is
 * about bookable value). Walks items in day order so pins and the route line
 * follow the trip's progression; each stop carries its bookable experiences,
 * in day order, for the hover popup.
 */
export function tripStops(items: StopInput[]): Stop[] {
  const ordered = [...items].sort((a, b) => a.day - b.day);
  const byKey = new Map<string, Stop>();
  const order: string[] = [];
  for (const item of ordered) {
    if (item.type !== "bookable") continue;
    const place = geocode(item.location);
    if (!place) continue;
    let stop = byKey.get(place.key);
    if (!stop) {
      stop = { key: place.key, label: place.name, lat: place.lat, lng: place.lng, experiences: [] };
      byKey.set(place.key, stop);
      order.push(place.key);
    }
    stop.experiences.push({
      day: item.day,
      time: item.time,
      title: item.title ?? place.name,
      price: item.price,
      currency: item.currency,
      partner: item.partner,
      imageUrl: item.imageUrl,
      category: item.category,
      deepLink: item.deepLink,
    });
  }
  return order.map((k) => byKey.get(k)!);
}
