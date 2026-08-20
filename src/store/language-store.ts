import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

type LanguageState = {
  /** The language being learned, or null until the user picks one. */
  selectedLanguageId: LanguageCode | null;
  /**
   * False until AsyncStorage has been read back. Reading it is asynchronous, so
   * the app has to wait for this before deciding where to route — otherwise a
   * returning user flashes the language picker for a frame.
   */
  hasHydrated: boolean;
  setLanguage: (id: LanguageCode) => void;
  /** Behind the home screen test button: forgets the saved language. */
  clearStorage: () => Promise<void>;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,

      setLanguage: (id) => set({ selectedLanguageId: id }),

      clearStorage: async () => {
        // Only this store's key. A blanket AsyncStorage.clear() would also wipe
        // whatever other libraries keep there.
        await useLanguageStore.persist.clearStorage();
        set({ selectedLanguageId: null });
      },
    }),
    {
      name: "bingua-language",
      storage: createJSONStorage(() => AsyncStorage),
      // hasHydrated describes this session only, so it is never written out.
      partialize: (state) => ({ selectedLanguageId: state.selectedLanguageId }),
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
