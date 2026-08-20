import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { colors } from "@/theme";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

/**
 * Back button + headline + waving mascot, shared by the Sign Up and Sign In screens.
 *
 * The geometry below is measured off prompt_material/03-auth-screen.png on its
 * 390pt-wide frame: the mascot is a 199pt square sitting in a 230pt box (wide
 * enough for the sparkles that sit outside the artwork), and its bottom 44pt is
 * covered by the first input card — which is what the negative bottom margin is
 * for. `mascot-auth.png` waves with the opposite paw to the design, so it is
 * flipped horizontally to match.
 */
export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const router = useRouter();

  return (
    <View>
      <View className="px-8 pt-[14px]">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.6}
          className="-ml-2 h-10 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <View
            className="h-3 w-3 border-b-2 border-l-2 border-ink"
            style={styles.chevronLeft}
          />
        </TouchableOpacity>

        <Text className="mt-[30px] font-poppins-bold text-[25px] leading-8 text-ink">
          {title}
        </Text>
        <Text className="mt-3 font-poppins-regular text-[15px] leading-6 text-ink-muted">
          {subtitle}
        </Text>
      </View>

      <View className="relative mb-[-44px] mt-[-18px] h-[199px] w-[230px] self-center">
        <Image
          source={images.mascotAuth}
          className="absolute left-[5px] top-0 h-[199px] w-[199px]"
          contentFit="contain"
          style={styles.mascotFlip}
        />
        <Image
          source={images.sparkleOrange}
          className="absolute left-[21px] top-[55px] h-[15px] w-[13px]"
          contentFit="contain"
        />
        <Image
          source={images.sparkleBlue}
          className="absolute left-[206px] top-[63px] h-[13px] w-[13px]"
          contentFit="contain"
        />
        <Image
          source={images.sparkleYellow}
          className="absolute left-[194px] top-[94px] h-[15px] w-[15px]"
          contentFit="contain"
        />
      </View>
    </View>
  );
}

// StyleSheet only for the transform arrays (see AGENTS.md style exceptions).
const styles = StyleSheet.create({
  chevronLeft: {
    transform: [{ rotate: "45deg" }],
    borderColor: colors.ink,
  },
  mascotFlip: {
    transform: [{ scaleX: -1 }],
  },
});
