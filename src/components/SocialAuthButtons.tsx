import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";

const PROVIDERS = [
  { key: "google", label: "Continue with Google", icon: images.googleIcon },
  { key: "facebook", label: "Continue with Facebook", icon: images.facebookIcon },
  { key: "apple", label: "Continue with Apple", icon: images.appleIcon },
] as const;

export type SocialProvider = (typeof PROVIDERS)[number]["key"];

type SocialAuthButtonsProps = {
  onPress: (provider: SocialProvider) => void;
};

/** "or continue with" divider plus the three social provider buttons. */
export function SocialAuthButtons({ onPress }: SocialAuthButtonsProps) {
  return (
    <View>
      <View className="mt-9 flex-row items-center gap-4">
        <View className="h-px flex-1 bg-border" />
        <Text className="font-poppins-regular text-[15px] text-ink-muted">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="mt-5 gap-2.5">
        {PROVIDERS.map((provider) => (
          <TouchableOpacity
            key={provider.key}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => onPress(provider.key)}
            className="h-[52px] flex-row items-center rounded-2xl border border-border bg-white pl-9"
            style={styles.card}
          >
            <Image source={provider.icon} className="h-6 w-6" contentFit="contain" />
            <Text className="ml-7 font-poppins-medium text-[16px] text-ink">
              {provider.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// StyleSheet only for the platform shadow.
const styles = StyleSheet.create({
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
});
