import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

type LanguageState = {
  /**
   * The chosen language, keyed by Clerk user id.
   *
   * Keyed by user because AsyncStorage is device-wide: a single
   * `selectedLanguageId` meant the next account to sign in on the same phone
   * inherited the previous account's language and never saw the picker.
   */
  languageByUser: Record<string, LanguageCode>;
  /**
   * False until AsyncStorage has been read back. Reading it is asynchronous, so
   * the app has to wait for this before deciding where to route — otherwise a
   * returning user flashes the language picker for a frame.
   */
  hasHydrated: boolean;
  setLanguage: (userId: string, id: LanguageCode) => void;
  /** Forgets one user's choice, sending them back to the picker. */
  clearLanguage: (userId: string) => void;
  /** Forgets every saved choice on this device. */
  clearStorage: () => Promise<void>;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      languageByUser: {},
      hasHydrated: false,

      setLanguage: (userId, id) =>
        set((state) => ({
          languageByUser: { ...state.languageByUser, [userId]: id },
        })),

      clearLanguage: (userId) =>
        set((state) => {
          const { [userId]: _removed, ...rest } = state.languageByUser;
          return { languageByUser: rest };
        }),

      clearStorage: async () => {
        // Only this store's key. A blanket AsyncStorage.clear() would also wipe
        // whatever other libraries keep there.
        await useLanguageStore.persist.clearStorage();
        set({ languageByUser: {} });
      },
    }),
    {
      name: "bingua-language",
      storage: createJSONStorage(() => AsyncStorage),
      // hasHydrated describes this session only, so it is never written out.
      partialize: (state) => ({ languageByUser: state.languageByUser }),
      // v1 stored a single device-wide `selectedLanguageId`. There is no way to
      // tell which account picked it, so it is dropped: those users see the
      // picker once more, which is the correct answer rather than a guess.
      version: 2,
      migrate: () => ({ languageByUser: {} }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn("Could not read the saved language", error);
        }
        // Flip the flag either way — a storage error must not leave the app
        // stuck on the loading spinner forever.
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
