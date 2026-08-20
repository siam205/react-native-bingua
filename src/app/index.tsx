import { useAuth, useUser } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // Wait for Clerk to restore any cached session before deciding where to go.
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text className="text-h1 text-purple">Bingua</Text>
      <Text className="text-body-md text-ink-muted">
        {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
      </Text>

      {/* Placeholder home screen. The link and the sign-out button are temporary
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

      <TouchableOpacity className="mt-2" onPress={() => signOut()}>
        <Text className="font-poppins-semibold text-[15px] text-purple">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
