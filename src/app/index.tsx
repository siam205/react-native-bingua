import { useAuth, useUser } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useLanguageStore } from "@/store/language-store";
import { colors } from "@/theme";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const clearStorage = useLanguageStore((state) => state.clearStorage);

  // Wait for Clerk to restore any cached session, and for the saved language to
  // come back from AsyncStorage, before deciding where to go.
  if (!isLoaded || !hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // Signed in but no language yet: the picker is the only way forward.
  if (!selectedLanguageId) {
    return <Redirect href="/language-selection" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text className="text-h1 text-purple">Bingua</Text>
      <Text className="text-body-md text-ink-muted">
        {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
      </Text>

      {/* Placeholder home screen. The link and the two text buttons are temporary
          scaffolding so the flows can be re-tested; they go away with the real
          home UI. */}
      <Link href="/language-selection" asChild>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          className="mt-6 rounded-full bg-deep-purple px-6 py-3"
        >
          <Text className="font-poppins-semibold text-[15px] text-white">
            Choose a language
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Clearing the saved language sends this screen straight back to the
          picker, which is the quickest way to re-test the first-run flow. */}
      <TouchableOpacity className="mt-2" onPress={() => clearStorage()}>
        <Text className="font-poppins-semibold text-[15px] text-error">
          Clear saved language
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-2" onPress={() => signOut()}>
        <Text className="font-poppins-semibold text-[15px] text-purple">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
