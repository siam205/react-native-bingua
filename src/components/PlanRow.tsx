import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/Image";

/** Colour of the rounded icon tile. Maps to the theme tokens in global.css. */
export type PlanRowTint = "purple" | "deep-purple" | "error";

const TILE_TINT: Record<PlanRowTint, string> = {
  purple: "bg-purple",
  "deep-purple": "bg-deep-purple",
  error: "bg-error",
};

type PlanRowProps = {
  title: string;
  subtitle: string;
  /** White icon, drawn on the coloured tile. */
  icon: number;
  tint: PlanRowTint;
  done: boolean;
  onPress: () => void;
};

/**
 * One entry in "Today's plan": a coloured icon tile, two lines of text, and a
 * check on the right that is filled once the entry is done.
 *
 * Geometry is measured off prompt_material/05-home-and-tab-navigation.png on
 * its 390pt-wide frame: a 40pt tile, 16pt gap, and a 23pt status circle.
 */
export function PlanRow({ title, subtitle, icon, tint, done, onPress }: PlanRowProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${title}. ${subtitle}. ${done ? "Done" : "Not done"}`}
      activeOpacity={0.8}
      className="flex-row items-center"
      onPress={onPress}
    >
      <View className={`h-10 w-10 items-center justify-center rounded-xl ${TILE_TINT[tint]}`}>
        <Image source={icon} className="h-[22px] w-[22px]" contentFit="contain" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="font-poppins-semibold text-[15px] leading-[20px] text-ink">
          {title}
        </Text>
        <Text className="font-poppins-regular text-[14px] leading-[20px] text-ink-muted">
          {subtitle}
        </Text>
      </View>

      {done ? (
        <View className="h-[23px] w-[23px] items-center justify-center rounded-full bg-deep-purple">
          <View className="mt-[-2px] h-[5px] w-[9px] -rotate-45 border-b-2 border-l-2 border-white" />
        </View>
      ) : (
        <View className="h-[23px] w-[23px] rounded-full border-[1.5px] border-border" />
      )}
    </TouchableOpacity>
  );
}
