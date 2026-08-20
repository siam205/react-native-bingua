import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  /**
   * Called with the full code once the 6th digit is typed. Resolve `true` when
   * the code was accepted; resolve `false` to clear the boxes and let the user
   * try again (the caller is responsible for showing the error).
   */
  onSubmitCode: (code: string) => Promise<boolean>;
  /** Called when the user taps "Resend". */
  onResend: () => Promise<void>;
};

/**
 * Bottom sheet asking for the 6-digit email code.
 *
 * A single hidden TextInput holds the whole code; the six boxes are just a
 * visual representation of it. That keeps focus handling simple (no per-box
 * refs) while still giving us the number pad and auto-submit behaviour.
 *
 * Keyboard handling note: on Android a <Modal> renders in its own window that
 * the system never resizes for the keyboard, so KeyboardAvoidingView does
 * nothing there and the sheet ends up hidden behind the keyboard. Instead we
 * read the keyboard height from the Keyboard events (which do fire inside a
 * modal) and pad the sheet by that much — it is bottom-anchored, so the extra
 * padding lifts its content clear of the keyboard on both platforms.
 */
export function VerificationModal({
  visible,
  email,
  onClose,
  onSubmitCode,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleShow = () => {
    setCode("");
    setIsSubmitting(false);
    // Wait for the sheet slide-in before opening the keyboard.
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  const handleChangeText = async (value: string) => {
    if (isSubmitting) return;

    const digits = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length < CODE_LENGTH) return;

    Keyboard.dismiss();
    setIsSubmitting(true);
    const accepted = await onSubmitCode(digits);
    setIsSubmitting(false);

    // Wrong code: clear the boxes and hand focus back for another attempt.
    if (!accepted) {
      setCode("");
      inputRef.current?.focus();
    }
  };

  const handleResend = async () => {
    if (isSubmitting) return;
    setCode("");
    await onResend();
    inputRef.current?.focus();
  };

  const dismiss = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={dismiss}
      onShow={handleShow}
    >
      <View className="flex-1 justify-end bg-[#0D132B73]">
        <Pressable className="flex-1" onPress={dismiss} />

        <View
          className="rounded-t-[28px] bg-white px-8 pt-4"
          style={{ paddingBottom: keyboardHeight + 40 }}
        >
          <View className="mb-6 h-1 w-10 self-center rounded-full bg-border" />

          <Text className="text-h3 text-ink">Check your email</Text>
          <Text className="text-body-md mt-2 text-ink-muted">
            We sent a 6-digit verification code to{" "}
            <Text className="font-poppins-medium text-ink">{email || "your inbox"}</Text>
            . Enter it below to continue.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enter verification code"
            className="mt-6 flex-row gap-2.5"
            onPress={() => inputRef.current?.focus()}
          >
            {Array.from({ length: CODE_LENGTH }).map((_, index) => {
              const isActive = index === code.length;

              return (
                <View
                  key={index}
                  className={`h-[56px] flex-1 items-center justify-center rounded-2xl border ${
                    isActive ? "border-purple bg-white" : "border-border bg-surface"
                  }`}
                >
                  <Text className="text-h3 text-ink">{code[index] ?? ""}</Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
            caretHidden
            contextMenuHidden
            editable={!isSubmitting}
            className="absolute h-px w-px opacity-0"
          />

          <Text className="text-body-md mt-6 text-center text-ink-muted">
            Didn&apos;t get the code?{" "}
            <Text className="font-poppins-semibold text-purple" onPress={handleResend}>
              Resend
            </Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
}
