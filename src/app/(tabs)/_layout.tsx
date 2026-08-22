import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import { ActivityIndicator, View } from "react-native";

import { TabBar } from "@/components/TabBar";
import { useSelectedLanguageId } from "@/hooks/use-selected-language";
import { useLanguageStore } from "@/store/language-store";
import { colors } from "@/theme";

/**
 * The signed-in area of the app. Everything behind the tab bar assumes a
 * Clerk session and a chosen language, so both are checked once here rather
 * than in each tab screen.
 */
export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const selectedLanguageId = useSelectedLanguageId();

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
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
