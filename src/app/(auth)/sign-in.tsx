import { useAuth, useSignIn } from "@clerk/expo";
import { useSSO } from "@clerk/expo/experimental";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthHeader } from "@/components/AuthHeader";
import { AuthTextField } from "@/components/AuthTextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SocialAuthButtons, type SocialStrategy } from "@/components/SocialAuthButtons";
import { VerificationModal } from "@/components/VerificationModal";
import { showAuthError } from "@/lib/auth-errors";
import { colors } from "@/theme";

export default function SignIn() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // replace() unmounts this screen, which tears down the sheet with it.
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  // This screen has no password field by design, so sign-in uses the
  // passwordless email code strategy and reuses the same verification sheet.
  const handleSignIn = async () => {
    setBusy(true);
    try {
      const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
      if (error) return showAuthError(error);

      setVerifying(true);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      showAuthError(error, "Invalid code");
      return false;
    }

    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      showAuthError(finalizeError);
      return false;
    }

    return true;
  };

  const handleResend = async () => {
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) showAuthError(error);
  };

  const handleSocial = async (strategy: SocialStrategy) => {
    setBusy(true);
    try {
      await startSSOFlow({ strategy });
    } catch (error) {
      showAuthError(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader title="Welcome back" subtitle="Log in to continue learning ✨" />

          <View className="px-8">
            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
            />

            <PrimaryButton
              label="Sign In"
              className="mt-5"
              disabled={busy}
              onPress={handleSignIn}
            />

            <SocialAuthButtons onPress={handleSocial} disabled={busy} />

            <Text className="font-poppins-regular mt-12 text-center text-[15px] text-ink-muted">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" replace className="font-poppins-semibold text-purple">
                Sign up
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={verifying}
        email={email}
        onClose={() => setVerifying(false)}
        onSubmitCode={handleVerifyCode}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}

// StyleSheet only for SafeAreaView, KeyboardAvoidingView and contentContainerStyle.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
