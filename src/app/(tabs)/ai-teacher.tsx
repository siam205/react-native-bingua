import { Text, View } from "react-native";

/** Placeholder while the bottom tab navigation is built out. */
export default function AiTeacher() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background px-8">
      <Text className="text-h2 text-ink">AI Teacher</Text>
      <Text className="text-body-md text-center text-ink-muted">
        Live video and audio lessons land here.
      </Text>
    </View>
  );
}
