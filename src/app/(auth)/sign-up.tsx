import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);

  // Covers every success path — password + code, and SSO.
  useEffect(() => {
    // replace() unmounts this screen, which tears down the sheet with it.
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  const handleSignUp = async () => {
    setBusy(true);
    try {
      const { error } = await signUp.password({ emailAddress: email, password });
      if (error) return showAuthError(error);

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) return showAuthError(sendError);

      setVerifying(true);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      showAuthError(error, "Invalid code");
      return false;
    }

    // Turns the verified sign-up into an active session.
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      showAuthError(finalizeError);
      return false;
    }

    return true;
  };

  const handleResend = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
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
          <AuthHeader
            title="Create your account"
            subtitle="Start your language journey today ✨"
          />

          <View className="px-8">
            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
            />

            <View className="mt-3.5">
              <AuthTextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secure
              />
            </View>

            <PrimaryButton
              label="Sign Up"
              className="mt-5"
              disabled={busy}
              onPress={handleSignUp}
            />

            <SocialAuthButtons onPress={handleSocial} disabled={busy} />

            <Text className="font-poppins-regular mt-12 text-center text-[15px] text-ink-muted">
              Already have an account?{" "}
              <Link href="/sign-in" replace className="font-poppins-semibold text-purple">
                Log in
              </Link>
            </Text>

            {/* Mount point for Clerk's bot protection. Renders nothing. */}
            <View nativeID="clerk-captcha" />
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
