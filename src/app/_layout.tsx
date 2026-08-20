import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { posthog } from "@/lib/posthog";
import { fontAssets } from "@/theme";

import "../../global.css";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

/**
 * Keeps the PostHog identity synchronized with Clerk's persisted session. This
 * is the single identity boundary, so every event and captured error inherits
 * the authenticated Clerk user id until the session is cleared.
 */
function PostHogIdentity() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || !isAuthLoaded || !isUserLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    if (identifiedUserId.current) {
      posthog.reset();
    }

    const personProperties: Record<string, string> = {};
    if (user.primaryEmailAddress?.emailAddress) {
      personProperties.email = user.primaryEmailAddress.emailAddress;
    }
    if (user.firstName) {
      personProperties.first_name = user.firstName;
    }
    if (user.lastName) {
      personProperties.last_name = user.lastName;
    }

    posthog.identify(user.id, { $set: personProperties });
    identifiedUserId.current = user.id;
  }, [isAuthLoaded, isSignedIn, isUserLoaded, user]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // tokenCache keeps the Clerk session in encrypted storage so it survives restarts.
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        {posthog ? (
          <PostHogProvider client={posthog}>
            <PostHogErrorBoundary>
              <PostHogIdentity />
              <Stack />
            </PostHogErrorBoundary>
          </PostHogProvider>
        ) : (
          <Stack />
        )}
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
