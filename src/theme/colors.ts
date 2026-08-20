// Design tokens from prompt_material/01-design-system.png ("Lingua" brand).
// Mirrors the color tokens registered in global.css (@theme) so the same
// values are usable from JS in the StyleSheet-exception cases listed in AGENTS.md.

export const colors = {
  // Primary / brand
  purple: "#6C4EF5",
  deepPurple: "#5B3BF6",
  blue: "#4D8BFF",
  green: "#21C16B",

  // Semantic
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // Tinted surfaces
  purpleTint: "#F6F4FF",

  // Neutrals
  ink: "#0D132B",
  inkMuted: "#6B7280",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
