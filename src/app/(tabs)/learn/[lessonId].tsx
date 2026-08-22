import { useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { getLanguage } from "@/data/languages";
import { getLesson } from "@/data/lessons";
import { getUnit } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { colors } from "@/theme";

/** How long the mock session spends "Connecting…" before it goes live. */
const CONNECT_MS = 1200;

/** Streak, and the end-of-session scores. Mock until a session really runs. */
const STREAK_DAYS = 12;
const FEEDBACK = [
  { label: "Speaking", value: "Excellent", tone: "text-success" },
  { label: "Pronunciation", value: "Great", tone: "text-blue" },
  { label: "Grammar", value: "Good", tone: "text-purple" },
];

type SpokenLine = { text: string; translation: string };

/**
 * AI Teacher audio lesson — prompt_material/07-audio-lesson-screen.png.
 *
 * Audio only: there is no camera and no video call. The stage is a still
 * teacher portrait, and the leftmost control is a speaker toggle where the
 * design has a camera button.
 */
export default function AudioLesson() {
  const router = useRouter();
  const { user } = useUser();
  const { height } = useWindowDimensions();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const unit = lesson ? getUnit(lesson.unitId) : undefined;
  const language = getLanguage(unit?.languageId ?? selectedLanguageId ?? "es");

  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLive(true), CONNECT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!lesson || !language) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-[34px]">🎧</Text>
          <Text className="mt-3 text-center font-poppins-semibold text-[16px] text-ink">
            Lesson not found
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            className="mt-4 h-[42px] items-center justify-center rounded-full bg-deep-purple px-6"
            onPress={() => router.back()}
          >
            <Text className="font-poppins-bold text-[14px] text-white">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const teacher = lesson.aiTeacher;

  // Not every lesson ships an AI teacher prompt, so fall back to its phrases —
  // that keeps every lesson openable from the list.
  const lines: SpokenLine[] = teacher
    ? [
        teacher.openingLine,
        ...teacher.conversationStarters.map((text) => ({ text, translation: "" })),
      ]
    : lesson.phrases.map((phrase) => ({
        text: phrase.text,
        translation: phrase.translation,
      }));

  const line = lines[lineIndex % lines.length];
  const goal = lesson.goals[0]?.label;

  const status = !isLive ? "Connecting…" : micOn ? "Online" : "Mic off";
  const statusColor = !isLive ? "bg-warning" : micOn ? "bg-success" : "bg-error";

  const nextLine = () => setLineIndex((current) => current + 1);

  // The mock is proportionally taller than a real handset, so the stage is
  // capped against the window rather than pinned to the measured height.
  const stageHeight = Math.min(560, Math.round(height * 0.62));

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
            accessibilityLabel="Go back"
            activeOpacity={0.6}
            className="-ml-1 mt-0.5 h-10 w-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <View className="h-3 w-3 rotate-45 border-b-2 border-l-2 border-ink" />
          </TouchableOpacity>

          <View className="ml-1 flex-1">
            <Text className="font-poppins-bold text-[19px] leading-[26px] text-ink">
              AI Teacher
            </Text>
            <View className="mt-0.5 flex-row items-center">
              <View className={`h-2 w-2 rounded-full ${statusColor}`} />
              <Text className="ml-2 font-poppins-regular text-[14px] text-ink-muted">
                {status} • {language.name}
              </Text>
            </View>
          </View>

          <View className="h-[34px] w-[34px] items-center justify-center rounded-full border border-border">
            <Image
              source={images.headphonesInkIcon}
              className="h-[18px] w-[18px]"
              contentFit="contain"
            />
          </View>
          <View className="ml-2 h-[34px] min-w-[34px] items-center justify-center rounded-full border border-border px-2">
            <Text className="font-poppins-semibold text-[14px] text-ink">{STREAK_DAYS}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            activeOpacity={0.6}
            className="ml-2 h-[34px] w-[34px] items-center justify-center rounded-full border border-border"
            onPress={() => {}}
          >
            <Image
              source={images.bellIcon}
              className="h-[18px] w-[18px]"
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Stage — teacher portrait, self avatar, bubble and controls ------- */}
        <View
          className="mx-5 mt-4 overflow-hidden rounded-3xl bg-purple-tint"
          style={{ height: stageHeight }}
        >
          <Image
            source={images.mascotWelcome}
            className="absolute bottom-[70px] left-0 right-0 top-6"
            contentFit="contain"
          />

          {/* Audio-only, so this is the learner's avatar, not a camera feed. */}
          <View className="absolute right-4 top-4 h-[128px] w-[86px] overflow-hidden rounded-2xl border-2 border-white bg-surface">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="h-full w-full"
                contentFit="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="font-poppins-bold text-[22px] text-ink-muted">
                  {(user?.firstName ?? "You").slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="absolute bottom-0 left-0 right-0 items-center bg-[#0D132B99] py-1">
              <Text className="font-poppins-medium text-[11px] text-white">You</Text>
            </View>
          </View>

          {/* Teacher response bubble */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Teacher says ${line.text}. Tap to hear the next line.`}
            activeOpacity={0.9}
            className="absolute bottom-[150px] left-5 right-12 flex-row items-center rounded-2xl bg-white px-4 py-3.5"
            style={styles.bubbleShadow}
            onPress={nextLine}
          >
            <View className="flex-1">
              <Text className="font-poppins-medium text-[16px] leading-[22px] text-ink">
                {line.text}
              </Text>
              {subtitlesOn && line.translation ? (
                <Text className="mt-0.5 font-poppins-regular text-[15px] leading-[21px] text-ink-muted">
                  {line.translation}
                </Text>
              ) : null}
            </View>
            <Image
              source={images.speakerPurpleIcon}
              className="ml-3 h-6 w-6"
              contentFit="contain"
            />

            <View className="absolute bottom-[-7px] right-9 h-4 w-4 rotate-45 rounded-[3px] bg-white" />
          </TouchableOpacity>

          {/* Controls */}
          <View className="absolute bottom-6 left-0 right-0 flex-row justify-evenly">
            <CallButton
              label="Speaker"
              icon={speakerOn ? images.speakerWhiteIcon : images.speakerIcon}
              filled={speakerOn ? "bg-ink" : "bg-white"}
              onPress={() => setSpeakerOn((current) => !current)}
            />
            <CallButton
              label="Mic"
              icon={micOn ? images.micIcon : images.micOffWhiteIcon}
              filled={micOn ? "bg-white" : "bg-error"}
              onPress={() => setMicOn((current) => !current)}
            />
            <CallButton
              label="Subtitles"
              icon={subtitlesOn ? images.subtitlesWhiteIcon : images.subtitlesIcon}
              filled={subtitlesOn ? "bg-ink" : "bg-white"}
              onPress={() => setSubtitlesOn((current) => !current)}
            />
            <CallButton
              label="End Call"
              icon={images.phoneDownWhiteIcon}
              filled="bg-error"
              onPress={() => router.back()}
            />
          </View>
        </View>

        {/* Session feedback ------------------------------------------------ */}
        <View
          className="mx-5 mt-3 flex-row rounded-2xl bg-white py-5"
          style={styles.cardShadow}
        >
          {FEEDBACK.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 items-center ${index > 0 ? "border-l border-border" : ""}`}
            >
              <Text className="font-poppins-semibold text-[14px] text-ink">{item.label}</Text>
              <Text className={`mt-2 font-poppins-semibold text-[14px] ${item.tone}`}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* What this lesson is about --------------------------------------- */}
        <View className="mx-5 mt-3 rounded-2xl border border-border bg-white px-5 py-4">
          <Text className="font-poppins-regular text-[13px] text-ink-muted">
            {language.name} • Unit {unit?.order ?? 1}
          </Text>
          <Text className="mt-0.5 font-poppins-bold text-[17px] text-ink">{lesson.title}</Text>

          {goal ? (
            <Text className="text-body-md mt-1 text-ink-muted">Goal: {goal}</Text>
          ) : null}

          {teacher ? (
            <Text className="text-body-md mt-3 text-ink-muted">{teacher.persona}</Text>
          ) : null}

          {lesson.phrases.length > 0 ? (
            <View className="mt-4 gap-3">
              <Text className="font-poppins-semibold text-[14px] text-ink">Key phrases</Text>
              {lesson.phrases.map((phrase) => (
                <View key={phrase.id}>
                  <Text className="font-poppins-medium text-[15px] leading-[21px] text-ink">
                    {phrase.text}
                  </Text>
                  <Text className="font-poppins-regular text-[13px] leading-[19px] text-ink-muted">
                    {phrase.translation} • {phrase.pronunciation}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type CallButtonProps = {
  label: string;
  icon: number;
  /** Background utility for the circle, e.g. "bg-white" or "bg-error". */
  filled: string;
  onPress: () => void;
};

/** One circular control plus its caption, as laid out along the stage bottom. */
function CallButton({ label, icon, filled, onPress }: CallButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.85}
      className="items-center"
      onPress={onPress}
    >
      <View
        className={`h-[54px] w-[54px] items-center justify-center rounded-full ${filled}`}
        style={styles.controlShadow}
      >
        <Image source={icon} className="h-6 w-6" contentFit="contain" />
      </View>
      <Text className="mt-2 font-poppins-medium text-[12px] text-ink">{label}</Text>
    </TouchableOpacity>
  );
}

// StyleSheet only for SafeAreaView and the platform shadows (see AGENTS.md).
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bubbleShadow: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  controlShadow: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
});
