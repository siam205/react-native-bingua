// Typography tokens from prompt_material/01-design-system.png.
// Font family is Poppins; each weight is a separate loaded font file (see fonts.ts)
// since React Native cannot synthesize bold/medium weights for custom fonts.

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typeScale = {
  h1: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 32 * 1.2 },
  h2: { fontFamily: fontFamily.semiBold, fontSize: 24, lineHeight: 24 * 1.3 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 20 * 1.3 },
  h4: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 16 * 1.4 },
  bodyLarge: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 16 * 1.6 },
  bodyMedium: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 14 * 1.6 },
  bodySmall: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 13 * 1.6 },
  caption: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 11 * 1.4 },
} as const;

export type TypeScaleToken = keyof typeof typeScale;
