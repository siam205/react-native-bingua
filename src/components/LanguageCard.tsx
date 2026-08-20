import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatLearnerCount } from "@/data/languages";
import type { Language } from "@/types/learning";

type LanguageCardProps = {
  language: Language;
  /** Draws the purple ring, tinted background and check badge. */
  selected: boolean;
  onPress: () => void;
};

/**
 * One row in the language picker: flag, name, learner count and a trailing
 * check badge (selected) or chevron (not selected).
 *
 * Geometry is measured off prompt_material/04-language-selection-screen.png on
 * its 390pt-wide frame: a 72pt row with 16pt padding around a 40pt flag circle.
 *
 * The flag is the emoji from `data/languages.ts`. Android has no glyphs for
 * regional-indicator emoji, so it falls back to the two-letter country code
 * inside the same circle — swap in flag images here if that matters.
 */
export function LanguageCard({ language, selected, onPress }: LanguageCardProps) {
  const learners = formatLearnerCount(language.learnerCount);

  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${language.name}, ${learners}`}
      activeOpacity={0.85}
      onPress={onPress}
      className={`h-[72px] flex-row items-center rounded-2xl px-4 ${
        selected ? "border-[1.5px] border-purple bg-purple-tint" : "bg-white"
      }`}
      style={selected ? undefined : styles.cardShadow}
    >
      <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface">
        <Text className="text-[26px] leading-[34px]">{language.flag}</Text>
      </View>

      <View className="ml-4 flex-1">
        <Text className="font-poppins-semibold text-[17px] text-ink">{language.name}</Text>
        <Text className="text-body-md text-ink-muted">{learners}</Text>
      </View>

      {selected ? (
        <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-deep-purple">
          <View className="mt-[-3px] h-[6px] w-[11px] -rotate-45 border-b-2 border-l-2 border-white" />
        </View>
      ) : (
        <View className="mr-1 h-2.5 w-2.5 rotate-45 border-r-2 border-t-2 border-ink-muted" />
      )}
    </TouchableOpacity>
  );
}

// StyleSheet only for the platform shadow, which has no Tailwind equivalent
// that preserves shadowColor and the Android elevation (see AGENTS.md).
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
