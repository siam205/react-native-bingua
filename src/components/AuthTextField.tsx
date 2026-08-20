import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type KeyboardTypeOptions,
} from "react-native";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { colors, fontFamily } from "@/theme";

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  /** Renders the input masked with a show/hide eye toggle. */
  secure?: boolean;
};

/** Rounded card input with a floating label, matching the auth design. */
export function AuthTextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
  secure = false,
}: AuthTextFieldProps) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View
      className="rounded-2xl border border-border bg-white px-4 pb-3.5 pt-3"
      style={styles.card}
    >
      <Text className="font-poppins-regular text-[13px] text-ink-muted">{label}</Text>

      <View className="flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={hidden}
          style={styles.input}
        />

        {secure ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            activeOpacity={0.6}
            className="ml-3 h-8 w-8 items-center justify-center"
            onPress={() => setHidden((current) => !current)}
          >
            <Image
              source={hidden ? images.eyeIcon : images.eyeOffIcon}
              className="h-[22px] w-[22px]"
              contentFit="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// StyleSheet only for the TextInput style prop and the platform shadow.
const styles = StyleSheet.create({
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 26,
    marginTop: 4,
    padding: 0,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.ink,
  },
});
