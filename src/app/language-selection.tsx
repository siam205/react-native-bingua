import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { LanguageCard } from "@/components/LanguageCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { DEFAULT_LANGUAGE_ID, languages } from "@/data/languages";
import { colors, fontFamily } from "@/theme";
import type { LanguageCode } from "@/types/learning";

/**
 * `earth.png` is a square canvas with the illustration inset inside it — its
 * alpha channel runs from 17.07% to 82.93% of the height, leaving an empty
 * strip above the artwork. Cancelling that strip is what keeps the globe from
 * sitting too low in its box and getting clipped mid-tower.
 */
const EARTH_ARTWORK_TOP = 0.1707;

/**
 * Language picker — prompt_material/04-language-selection-screen.png.
 *
 * The header and search stay put while the list scrolls, so the confirm button
 * and the earth illustration are always pinned to the bottom of the screen.
 */
export default function LanguageSelection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<LanguageCode>(DEFAULT_LANGUAGE_ID);

  const term = query.trim().toLowerCase();
  const results = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(term) ||
      language.nativeName.toLowerCase().includes(term),
  );

  const handleConfirm = () => {
    // The choice lives in local state for now; it moves into a Zustand store
    // once the learning store exists.
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="h-11 flex-row items-center justify-center px-5">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.6}
          className="absolute left-3 h-10 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <View
            className="h-3 w-3 border-b-2 border-l-2 border-ink"
            style={styles.chevronLeft}
          />
        </TouchableOpacity>

        <Text className="font-poppins-bold text-[19px] text-ink">Choose a language</Text>
      </View>

      <View className="mx-5 mt-6 h-11 flex-row items-center gap-5 rounded-full border border-border bg-surface px-4">
        <Image
          source={images.searchIcon}
          className="h-[18px] w-[18px]"
          contentFit="contain"
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search languages"
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-4 mt-8 px-5 font-poppins-semibold text-[17px] text-ink">
          Popular
        </Text>

        {results.length > 0 ? (
          <View className="gap-2 px-5">
            {results.map((language) => (
              <LanguageCard
                key={language.id}
                language={language}
                selected={language.id === selectedId}
                onPress={() => setSelectedId(language.id)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center px-10 pt-6">
            <Text className="text-[34px]">🌍</Text>
            <Text className="text-body-md mt-3 text-center text-ink-muted">
              No languages match “{query.trim()}”. More are on the way!
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-3 pt-2">
        <PrimaryButton label="Continue" onPress={handleConfirm} />
      </View>

      {/* The globe bleeds off the bottom edge. `contentFit="contain"` renders the
          square canvas at `width x width`, so lifting it by the artwork's top
          inset puts the tip of the tallest tower flush with the top of the box. */}
      <View className="h-[190px] w-full overflow-hidden">
        <Image
          source={images.earth}
          style={{ width, height: width, marginTop: -width * EARTH_ARTWORK_TOP }}
          contentFit="contain"
        />
      </View>
    </SafeAreaView>
  );
}

// StyleSheet only for SafeAreaView, the ScrollView content container, the
// TextInput and the chevron transform (see the style exceptions in AGENTS.md).
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Without flex:1 the ScrollView sizes to its content and pushes the confirm
  // button and the earth illustration off the bottom of the screen.
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.ink,
  },
  chevronLeft: {
    transform: [{ rotate: "45deg" }],
  },
});
