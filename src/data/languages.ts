import type { Language, LanguageCode } from "@/types/learning";

/**
 * Every language the app offers. Order here is the order shown in the
 * "Popular" list on the language selection screen.
 *
 * To add a language: add its code to `LanguageCode`, add an entry here, then
 * add units in `data/units.ts` and lessons in `data/lessons.ts`.
 */
export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    greeting: "Hola",
    learnerCount: 28_400_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "es-ES",
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    greeting: "Salut",
    learnerCount: 19_400_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "fr-FR",
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    greeting: "こんにちは",
    learnerCount: 12_700_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "ja-JP",
  },
  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    greeting: "안녕",
    learnerCount: 9_300_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "ko-KR",
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    greeting: "Hallo",
    learnerCount: 8_100_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "de-DE",
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    greeting: "你好",
    learnerCount: 7_400_000,
    isPopular: true,
    isAvailable: true,
    speechLocale: "zh-CN",
  },
];

/** The default language a brand new user starts with. */
export const DEFAULT_LANGUAGE_ID: LanguageCode = "es";

export function getLanguage(id: LanguageCode): Language | undefined {
  return languages.find((language) => language.id === id);
}

export function getPopularLanguages(): Language[] {
  return languages.filter((language) => language.isPopular);
}

/** Formats a learner count the way the design shows it: "28.4M learners". */
export function formatLearnerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M learners`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K learners`;
  return `${count} learners`;
}
