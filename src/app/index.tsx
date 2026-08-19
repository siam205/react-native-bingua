import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text className="text-h1 text-purple">Bingua</Text>
      <Link href="/onboarding" className="text-body-lg text-deep-purple">
        View onboarding
      </Link>
    </View>
  );
}

