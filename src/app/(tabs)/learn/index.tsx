import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { LessonCard, type LessonCardStatus } from "@/components/LessonCard";
import { images, lessonImage } from "@/constants/images";
import { getLessonsForUnit, getVocabularyForUnit } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import { useSelectedLanguage } from "@/hooks/use-selected-language";
import { colors } from "@/theme";

/**
 * Which lesson starts out in progress. Mock progress, matching the design's
 * "3 / 6 lessons" — everything before it reads as completed, everything after
 * as upcoming. This moves into a progress store once lessons can be played.
 */
const INITIAL_LESSON_INDEX = 2;

type Segment = "lessons" | "practice";

/**
 * Lessons — prompt_material/06-lesson-screen.png.
 *
 * Shows the first unit of the saved language. Tapping a lesson selects it,
 * which moves the progress marker and swaps the hero artwork; nothing is
 * locked, so every lesson is reachable.
 */
export default function Learn() {
  const router = useRouter();
  const language = useSelectedLanguage();

  const unit = language ? getUnitsForLanguage(language.id)[0] : undefined;
  const lessons = unit ? getLessonsForUnit(unit.id) : [];

  const [segment, setSegment] = useState<Segment>("lessons");
  const [bookmarked, setBookmarked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(INITIAL_LESSON_INDEX, Math.max(lessons.length - 1, 0)),
  );

  const currentLesson = lessons[currentIndex];

  if (!unit || !currentLesson) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-[34px]">📚</Text>
          <Text className="mt-3 text-center font-poppins-semibold text-[16px] text-ink">
            No lessons yet
          </Text>
          <Text className="text-body-md mt-1 text-center text-ink-muted">
            The {language?.name ?? "selected"} course is still being written. Pick
            another language from your profile to keep learning.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusFor = (index: number): LessonCardStatus => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "in-progress";
    return "upcoming";
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header ---------------------------------------------------------- */}
        <View className="flex-row items-start px-5 pt-2">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            activeOpacity={0.6}
            className="mt-0.5 h-10 w-10 items-center justify-center"
            onPress={() => router.push("/")}
          >
            <View className="h-3 w-3 rotate-45 border-b-2 border-l-2 border-ink" />
          </TouchableOpacity>

          <View className="ml-1 flex-1">
            <Text className="font-poppins-bold text-[19px] leading-[26px] text-ink">
              {currentLesson.title}
            </Text>
            <Text className="mt-0.5 font-poppins-regular text-[14px] text-ink-muted">
              Unit {unit.order} • {currentIndex + 1} / {lessons.length} lessons
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={bookmarked ? "Remove bookmark" : "Bookmark this unit"}
            accessibilityState={{ selected: bookmarked }}
            activeOpacity={0.6}
            className="h-10 w-10 items-center justify-center"
            onPress={() => setBookmarked((current) => !current)}
          >
            <Image
              source={bookmarked ? images.bookmarkFilledIcon : images.bookmarkIcon}
              className="h-[26px] w-[26px]"
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Hero — the artwork of whichever lesson is selected --------------- */}
        <Image
          source={lessonImage(currentLesson)}
          className="mt-3 h-[215px] w-full"
          contentFit="cover"
          transition={250}
        />

        {/* Lessons / Practice ---------------------------------------------- */}
        <View className="mx-5 mt-[-4px] h-[52px] flex-row overflow-hidden rounded-2xl bg-surface">
          {(["lessons", "practice"] as const).map((value) => {
            const active = segment === value;

            return (
              <TouchableOpacity
                key={value}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                activeOpacity={0.8}
                className={`flex-1 items-center justify-center rounded-2xl ${
                  active ? "bg-white" : ""
                }`}
                onPress={() => setSegment(value)}
              >
                <Text
                  className={`font-poppins-semibold text-[16px] ${
                    active ? "text-purple" : "text-ink-muted"
                  }`}
                >
                  {value === "lessons" ? "Lessons" : "Practice"}
                </Text>

                {active ? (
                  <View className="absolute bottom-0 h-[3px] w-3/5 rounded-full bg-purple" />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {segment === "lessons" ? (
          <View className="mt-5 gap-2.5 px-5">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                status={statusFor(index)}
                onPress={() => {
                  // Selecting also moves the progress marker, so returning
                  // from the session shows this lesson as the current one.
                  setCurrentIndex(index);
                  router.push(`/learn/${lesson.id}`);
                }}
              />
            ))}
          </View>
        ) : (
          /* Practice is not in the design; the unit's vocabulary is the most
             useful thing to show here until review activities are built. */
          <View className="mt-5 gap-2.5 px-5">
            {getVocabularyForUnit(unit.id).map((word) => (
              <View
                key={word.id}
                className="flex-row items-center rounded-2xl border border-border bg-white px-5 py-3.5"
              >
                <View className="flex-1">
                  <Text className="font-poppins-semibold text-[16px] text-ink">
                    {word.term}
                  </Text>
                  <Text className="font-poppins-regular text-[13px] text-ink-muted">
                    {word.pronunciation}
                  </Text>
                </View>
                <Text className="text-body-md ml-3 text-ink-muted">{word.translation}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet only for SafeAreaView, which react-native-safe-area-context does
// not route through className (see AGENTS.md).
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
