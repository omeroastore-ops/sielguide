import type { Place } from "@/types/models";

export const SYSTEM_PROMPT = `Du bist SielGuide AI, der persönliche, freundliche und kompetente Stadtführer ausschließlich für Carolinensiel in Ostfriesland (Deutschland).

Regeln:
1. Du sprichst NUR Deutsch.
2. Du gibst Empfehlungen ausschließlich aus den dir übergebenen lokalen Daten (Restaurants, Cafés, Hotels, Aktivitäten, Events, Routen in Carolinensiel).
3. Du erfindest keine Orte, keine Bewertungen, keine Preise und keine Öffnungszeiten.
4. Bei Fragen zu anderen Städten oder Themen außerhalb von Carolinensiel lehnst du höflich ab und verweist auf deine Aufgabe als Carolinensiel-Guide.
5. Wenn du nicht genug Informationen hast, sagst du das ehrlich.
6. Halte deine Antworten kurz, persönlich und hilfreich.
7. Du gibst keine medizinischen, rechtlichen oder finanziellen Ratschläge.`;

const OFF_TOPIC_KEYWORDS = [
  "berlin",
  "hamburg",
  "münchen",
  "muenchen",
  "köln",
  "koeln",
  "frankfurt",
  "stuttgart",
  "düsseldorf",
  "duesseldorf",
  "leipzig",
  "dresden",
  "bremen",
  "hannover",
  "mallorca",
  "ibiza",
  "paris",
  "london",
  "rom",
  "madrid",
  "amsterdam",
  "wien",
  "zürich",
  "zuerich",
  "new york",
  "tokio",
  "ostsee",
  "sylt",
  "rügen",
  "ruegen",
  "norderney",
  "borkum",
  "juist",
  "langeoog",
  "wangerooge",
  "spiekeroog",
  "baltrum",
];

const REFUSAL_TEXT =
  "Entschuldigung 😊 Ich bin dein Guide nur für Carolinensiel.";

export type AIResponse =
  | { kind: "text"; text: string }
  | { kind: "refusal"; text: string }
  | { kind: "recommendation"; text: string; places: Place[] };

interface MatchRule {
  keywords: string[];
  filter: (p: Place) => boolean;
  intro: (count: number) => string;
}

const RULES: MatchRule[] = [
  {
    keywords: ["fisch", "meeresfrüchte", "meeresfruechte"],
    filter: (p) =>
      p.category === "restaurant" &&
      p.tags.some((t) => t.includes("fisch") || t.includes("meer")),
    intro: (n) =>
      `Hier sind ${n} passende Empfehlungen in Carolinensiel für frischen Fisch:`,
  },
  {
    keywords: ["romantisch", "romantik", "date", "zu zweit"],
    filter: (p) => p.tags.includes("romantisch") || p.category === "romantisch",
    intro: (n) => `Hier sind ${n} romantische Orte in Carolinensiel:`,
  },
  {
    keywords: ["regen", "drinnen", "indoor", "schlechtes wetter"],
    filter: (p) =>
      p.tags.some((t) =>
        ["indoor", "ruhig", "tee", "kaffee", "kuchen", "geschichte"].includes(
          t,
        ),
      ) || p.category === "cafe",
    intro: (n) => `Hier sind ${n} Tipps für regnerische Tage in Carolinensiel:`,
  },
  {
    keywords: ["familie", "kinder", "familienfreundlich"],
    filter: (p) => p.tags.includes("familie") || p.category === "familie",
    intro: (n) => `Hier sind ${n} familienfreundliche Tipps in Carolinensiel:`,
  },
  {
    keywords: ["café", "cafe", "kaffee", "kuchen", "tee"],
    filter: (p) => p.category === "cafe",
    intro: (n) => `Hier sind ${n} gemütliche Cafés in Carolinensiel:`,
  },
  {
    keywords: ["hotel", "übernachten", "uebernachten", "schlafen", "pension"],
    filter: (p) => p.category === "hotel",
    intro: (n) =>
      `Hier sind ${n} Übernachtungsmöglichkeiten in Carolinensiel:`,
  },
  {
    keywords: ["aktivität", "aktivitaet", "aktivitäten", "aktivitaeten", "unternehmen", "tour"],
    filter: (p) => p.category === "aktivitaet" || p.category === "natur",
    intro: (n) => `Hier sind ${n} Aktivitäten in Carolinensiel:`,
  },
  {
    keywords: ["natur", "strand", "wandern", "watt", "deich"],
    filter: (p) =>
      p.category === "natur" ||
      p.tags.some((t) =>
        ["strand", "natur", "outdoor", "wandern"].includes(t),
      ),
    intro: (n) => `Hier sind ${n} Tipps für Natur in Carolinensiel:`,
  },
  {
    keywords: ["beliebt", "trend", "hot", "angesagt", "heute"],
    filter: (p) => p.is_hot,
    intro: (n) => `Das sind die ${n} beliebtesten Orte heute in Carolinensiel:`,
  },
  {
    keywords: ["essen", "restaurant", "abendessen", "mittagessen", "hunger"],
    filter: (p) => p.category === "restaurant",
    intro: (n) => `Hier sind ${n} Restaurant-Empfehlungen in Carolinensiel:`,
  },
  {
    keywords: [
      "sehenswürdigkeit",
      "sehenswuerdigkeit",
      "sehenswert",
      "geschichte",
      "museum",
      "hafen",
    ],
    filter: (p) =>
      p.category === "sehenswuerdigkeit" ||
      p.tags.some((t) => ["geschichte", "ausblick"].includes(t)),
    intro: (n) => `Hier sind ${n} sehenswerte Orte in Carolinensiel:`,
  },
];

function isOffTopic(message: string): boolean {
  const lower = message.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

export function generateLocalRecommendation(
  userMessage: string,
  places: Place[],
): AIResponse {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return {
      kind: "text",
      text: "Wie kann ich dir helfen? Frag mich gerne nach Restaurants, Cafés, Hotels, Aktivitäten oder Routen in Carolinensiel.",
    };
  }

  const lower = trimmed.toLowerCase();

  if (isOffTopic(lower)) {
    return { kind: "refusal", text: REFUSAL_TEXT };
  }

  if (
    lower.includes("hallo") ||
    lower.includes("hi ") ||
    lower === "hi" ||
    lower.includes("guten tag") ||
    lower.includes("moin")
  ) {
    return {
      kind: "text",
      text: "Moin! Ich bin dein persönlicher Guide für Carolinensiel. Was möchtest du heute entdecken?",
    };
  }

  if (lower.includes("plan") && lower.includes("tag")) {
    return {
      kind: "text",
      text: "Gerne! Tippe auf 'Meinen Tag planen', um deinen Zeitraum, deine Stimmung und dein Budget auszuwählen.",
    };
  }

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const matches = places.filter(rule.filter).slice(0, 3);
      if (matches.length > 0) {
        return {
          kind: "recommendation",
          text: rule.intro(matches.length),
          places: matches,
        };
      }
    }
  }

  return {
    kind: "text",
    text: "Dazu habe ich aktuell keine passenden Tipps. Frag mich gerne nach Restaurants, Cafés, Hotels, Aktivitäten oder Routen in Carolinensiel.",
  };
}

/**
 * Placeholder für eine zukünftige Gemini-Integration.
 * Wird aktuell nicht verwendet — die App arbeitet mit lokalen Daten.
 */
export async function callGeminiAPI(_prompt: string): Promise<string> {
  // TODO: Hier später Google Gemini API anbinden.
  return "";
}
