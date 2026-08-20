import { Image as ExpoImage } from "expo-image";
import { useCssElement } from "react-native-css";
import type { ComponentProps } from "react";

export type ImageProps = ComponentProps<typeof ExpoImage> & {
  className?: string;
};

/**
 * `expo-image` wrapped so that it understands `className`.
 *
 * NativeWind v5 makes `className` work by swapping React Native's own
 * primitives (View, Text, Image, ...) for styled versions at bundle time.
 * Third-party components like `expo-image` are never swapped, so a `className`
 * passed straight to it is silently dropped on native — the image ends up with
 * no width/height and renders as nothing.
 *
 * `useCssElement` maps `className` onto the `style` prop, which fixes that.
 * Always import Image from here instead of from `expo-image` directly.
 */
export function Image(props: ImageProps) {
  return useCssElement(ExpoImage, props, { className: "style" });
}

Image.displayName = "CSS(Image)";
