import { useUser } from "@clerk/expo";

import { getLanguage } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import type { Language, LanguageCode } from "@/types/learning";

/**
 * The signed-in user's chosen language id, or null before they pick one.
 *
 * Always read the saved language through here rather than off the store
 * directly — the store keys choices by Clerk user id so that two accounts on
 * the same device do not share one language.
 */
export function useSelectedLanguageId(): LanguageCode | null {
  const { user } = useUser();

  return useLanguageStore((state) =>
    user ? (state.languageByUser[user.id] ?? null) : null,
  );
}

/** The full language record for the signed-in user, when one is chosen. */
export function useSelectedLanguage(): Language | undefined {
  const id = useSelectedLanguageId();
  return id ? getLanguage(id) : undefined;
}
