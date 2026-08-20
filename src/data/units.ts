import type { LanguageCode, Unit } from "@/types/learning";

/**
 * Units group lessons into a themed chapter, e.g. "Unit 1 · First Words".
 *
 * Units do not list their lessons — a lesson points at its unit through
 * `unitId`, and `getLessonsForUnit()` in `data/lessons.ts` reads it back.
 * That keeps the two files free of circular imports.
 */
export const units: Unit[] = [
  /* ---------------------------------- Spanish -------------------------------- */
  {
    id: "es-a1-u1",
    languageId: "es",
    level: "A1",
    order: 1,
    title: "First Words",
    description: "Say hello, introduce yourself and talk about your day.",
    icon: "👋",
    accent: "purple",
  },
  {
    id: "es-a1-u2",
    languageId: "es",
    level: "A1",
    order: 2,
    title: "Out and About",
    description: "Order a coffee, ask for directions and go shopping.",
    icon: "☕️",
    accent: "blue",
  },

  /* ---------------------------------- French --------------------------------- */
  {
    id: "fr-a1-u1",
    languageId: "fr",
    level: "A1",
    order: 1,
    title: "Bonjour!",
    description: "Your first French greetings and a trip to the bakery.",
    icon: "🥐",
    accent: "streak",
  },

  /* --------------------------------- Japanese -------------------------------- */
  {
    id: "ja-a1-u1",
    languageId: "ja",
    level: "A1",
    order: 1,
    title: "はじめまして",
    description: "Greetings, polite introductions and counting to ten.",
    icon: "🌸",
    accent: "green",
  },
];

export function getUnit(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

/** All units of a language, in teaching order. */
export function getUnitsForLanguage(languageId: LanguageCode): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}
