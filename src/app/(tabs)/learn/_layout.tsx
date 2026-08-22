import { Stack } from "expo-router";

/**
 * Nested stack inside the Learn tab. Pushing the audio lesson from here keeps
 * the bottom tab bar visible with Learn still selected, which is what
 * prompt_material/07-audio-lesson-screen.png shows.
 */
export default function LearnLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
