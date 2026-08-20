import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  /** Shows the trailing ">" chevron used on the onboarding CTA. */
  trailingChevron?: boolean;
  className?: string;
};

/** Full-width purple pill CTA used across onboarding and auth. */
export function PrimaryButton({
  label,
  onPress,
  trailingChevron = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      className={`relative h-[56px] flex-row items-center justify-center rounded-full bg-deep-purple ${className}`}
      style={styles.shadow}
    >
      <Text className="font-poppins-bold text-[17px] text-white">{label}</Text>

      {trailingChevron ? (
        <View
          className="absolute right-6 h-[9px] w-[9px] border-r-2 border-t-2 border-white"
          style={styles.chevron}
        />
      ) : null}
    </TouchableOpacity>
  );
}

// StyleSheet only for the platform shadow and the transform array.
const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.deepPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  chevron: {
    transform: [{ rotate: "45deg" }],
  },
});
