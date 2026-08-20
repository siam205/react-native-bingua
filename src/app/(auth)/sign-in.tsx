import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
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
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { VerificationModal } from "@/components/VerificationModal";
import { colors } from "@/theme";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerified = () => {
    setVerifying(false);
    router.replace("/");
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
            title="Welcome back"
            subtitle="Log in to continue learning ✨"
          />

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
              onPress={() => setVerifying(true)}
            />

            <SocialAuthButtons onPress={() => setVerifying(true)} />

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
        onComplete={handleVerified}
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
