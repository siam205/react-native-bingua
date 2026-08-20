import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
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

      {/* Placeholder home screen. The sign-out button is temporary scaffolding
          so the auth flow can be re-tested; it goes away with the real home UI. */}
      <TouchableOpacity className="mt-6" onPress={() => signOut()}>
        <Text className="font-poppins-semibold text-[15px] text-purple">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
