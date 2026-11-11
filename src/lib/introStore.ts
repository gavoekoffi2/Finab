import { create } from "zustand";

// Indique si l'écran d'ouverture est terminé (les animations d'entrée attendent ce signal).
interface IntroState {
  done: boolean;
  finish: () => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  done: false,
  finish: () => set({ done: true }),
}));
