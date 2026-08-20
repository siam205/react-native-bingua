import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { PrimaryButton } from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { colors } from "@/theme";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1">
        <View className="flex-row items-center justify-center gap-2 px-8 pt-4">
          <Image source={images.mascotLogo} className="h-9 w-9" contentFit="contain" />
          <Text className="text-h2 text-ink">Bingua</Text>
        </View>

        <View className="mt-10 px-8">
          <Text className="text-h1 text-ink">Your AI language</Text>
          <Text className="text-h1 text-purple">teacher.</Text>
          <Text className="text-body-lg mt-3 text-ink-muted">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="relative w-full flex-1 items-center justify-center">
            <Image
              source={images.mascotWelcome}
              className="w-full flex-1"
              contentFit="contain"
            />

            <View
              className="absolute left-[2%] top-[10%] rounded-2xl bg-bubble-blue px-4 py-2"
              style={styles.bubbleShadow}
            >
              <Text className="font-poppins-medium text-[15px] text-ink">Hello!</Text>
            </View>

            <View
              className="absolute right-[4%] top-[2%] rounded-2xl bg-bubble-purple px-4 py-2"
              style={styles.bubbleShadow}
            >
              <Text className="font-poppins-medium text-[15px] text-purple">¡Hola!</Text>
            </View>

            <View
              className="absolute right-[-2%] top-[32%] rounded-2xl bg-bubble-peach px-4 py-2"
              style={styles.bubbleShadow}
            >
              <Text className="font-poppins-medium text-[15px] text-error">你好!</Text>
            </View>
          </View>
        </View>

        <View className="px-8 pb-6">
          <PrimaryButton
            label="Get Started"
            trailingChevron
            onPress={() => router.push("/sign-up")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet is used only for the cases AGENTS.md calls out: SafeAreaView
// and platform-specific shadow syntax.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bubbleShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
