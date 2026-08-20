import { Text, View } from "react-native";

/** Placeholder while the bottom tab navigation is built out. */
export default function Learn() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background px-8">
      <Text className="text-h2 text-ink">Learn</Text>
      <Text className="text-body-md text-center text-ink-muted">
        The lesson map and units land here.
      </Text>
    </View>
  );
}
