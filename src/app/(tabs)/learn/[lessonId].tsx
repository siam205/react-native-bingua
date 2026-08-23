import { useUser } from "@clerk/expo";
import {
  callManager,
  StreamCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { useSelectedLanguageId } from "@/hooks/use-selected-language";
import { useLessonCall, type LessonCallStatus } from "@/hooks/use-lesson-call";
import { colors } from "@/theme";
import type { Language, Lesson, Unit } from "@/types/learning";

/** Streak, and the end-of-session scores. Mock until scoring is wired up. */
const STREAK_DAYS = 12;
const FEEDBACK = [
  { label: "Speaking", value: "Excellent", tone: "text-success" },
  { label: "Pronunciation", value: "Great", tone: "text-blue" },
  { label: "Grammar", value: "Good", tone: "text-purple" },
];

type SpokenLine = { text: string; translation: string };

/** Status pill copy and dot colour for each phase of the session. */
const STATUS_LABEL: Record<LessonCallStatus, { text: string; dot: string }> = {
  idle: { text: "Tap the mic to start", dot: "bg-border" },
  loading: { text: "Preparing session…", dot: "bg-warning" },
  connecting: { text: "Connecting…", dot: "bg-warning" },
  joined: { text: "Live", dot: "bg-success" },
  ended: { text: "Session ended", dot: "bg-ink-muted" },
  error: { text: "Connection problem", dot: "bg-error" },
};

/**
 * AI Teacher audio lesson — prompt_material/07-audio-lesson-screen.png.
 *
 * Audio only: the camera is disabled before joining, so no video track is ever
 * published. The route owns the Stream call; the UI below is unchanged from the
 * design and simply reads real state instead of local placeholders.
 */
export default function AudioLesson() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const selectedLanguageId = useSelectedLanguageId();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const unit = lesson ? getUnit(lesson.unitId) : undefined;
  const language = getLanguage(unit?.languageId ?? selectedLanguageId ?? "es");

  const { status, call, error, start, end } = useLessonCall(lesson?.id);

  if (!lesson || !language) {
    return <LessonMissing />;
  }

  const shared = { lesson, unit, language, status, error, onStart: start, onEnd: end };

  // Everything that reads call state must sit inside <StreamCall>; before the
  // call exists the same screen renders with its pre-join defaults.
  return call ? (
    <StreamCall call={call}>
      <ConnectedSession {...shared} />
    </StreamCall>
  ) : (
    <LessonSession {...shared} isMuted={false} onToggleMic={start} speakerOn participants={[]} />
  );
}

type SharedProps = {
  lesson: Lesson;
  unit: Unit | undefined;
  language: Language;
  status: LessonCallStatus;
  error: string | undefined;
  onStart: () => Promise<void>;
  onEnd: () => Promise<void>;
};

/**
 * Bridges live Stream state into the presentational screen. Only rendered
 * inside `<StreamCall>`, so the call-state hooks always resolve.
 */
function ConnectedSession(props: SharedProps) {
  const { useMicrophoneState, useParticipants } = useCallStateHooks();
  const { microphone, optimisticIsMute, isSpeakingWhileMuted } = useMicrophoneState();
  const participants = useParticipants();
  const [speakerOn, setSpeakerOn] = useState(true);

  const toggleMic = async () => {
    await microphone.toggle();
  };

  const toggleSpeaker = () => {
    setSpeakerOn((current) => {
      const next = !current;
      callManager.speaker.setForceSpeakerphoneOn(next);
      return next;
    });
  };

  return (
    <LessonSession
      {...props}
      // optimisticIsMute flips immediately so the button never lags the tap.
      isMuted={optimisticIsMute}
      isSpeakingWhileMuted={isSpeakingWhileMuted}
      onToggleMic={toggleMic}
      speakerOn={speakerOn}
      onToggleSpeaker={toggleSpeaker}
      participants={participants.map((participant) => ({
        id: participant.sessionId,
        name: participant.name || participant.userId,
        image: participant.image,
        isSpeaking: participant.isSpeaking,
      }))}
    />
  );
}

type SessionParticipant = {
  id: string;
  name: string;
  image?: string;
  isSpeaking: boolean;
};

type LessonSessionProps = SharedProps & {
  isMuted: boolean;
  isSpeakingWhileMuted?: boolean;
  onToggleMic: () => void | Promise<void>;
  speakerOn: boolean;
  onToggleSpeaker?: () => void;
  participants: SessionParticipant[];
};

function LessonSession({
  lesson,
  unit,
  language,
  status,
  error,
  onStart,
  onEnd,
  isMuted,
  isSpeakingWhileMuted,
  onToggleMic,
  speakerOn,
  onToggleSpeaker,
  participants,
}: LessonSessionProps) {
  const router = useRouter();
  const { user } = useUser();
  const { height } = useWindowDimensions();

  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

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

  const isBusy = status === "loading" || status === "connecting";
  const isJoined = status === "joined";
  // The mic reads as off before joining and whenever Stream reports it muted.
  const micOn = isJoined && !isMuted;

  const statusInfo =
    isJoined && isMuted ? { text: "Mic off", dot: "bg-error" } : STATUS_LABEL[status];

  const nextLine = () => setLineIndex((current) => current + 1);

  const handleEndCall = async () => {
    await onEnd();
    router.back();
  };

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
              {isBusy ? (
                <ActivityIndicator size="small" color={colors.warning} />
              ) : (
                <View className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
              )}
              <Text className="ml-2 font-poppins-regular text-[14px] text-ink-muted">
                {statusInfo.text} • {language.name}
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

        {/* Error banner ---------------------------------------------------- */}
        {status === "error" && error ? (
          <View className="mx-5 mt-3 flex-row items-center rounded-2xl bg-[#FFEDED] px-4 py-3">
            <Text className="flex-1 font-poppins-regular text-[13px] leading-[19px] text-error">
              {error}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.8}
              className="ml-3 rounded-full bg-error px-4 py-2"
              onPress={onStart}
            >
              <Text className="font-poppins-semibold text-[13px] text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

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
              <Text className="font-poppins-medium text-[11px] text-white">
                {user?.firstName ?? "You"}
              </Text>
            </View>
          </View>

          {/* Who is in the session ------------------------------------------ */}
          {isJoined ? (
            <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-[#0D132B99] px-3 py-1.5">
              <View
                className={`h-1.5 w-1.5 rounded-full ${
                  participants.some((p) => p.isSpeaking) ? "bg-success" : "bg-white"
                }`}
              />
              <Text className="ml-2 font-poppins-medium text-[11px] text-white">
                {participants.length === 1
                  ? "You're in the room"
                  : `${participants.length} in the room`}
              </Text>
            </View>
          ) : null}

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

          {/* "You're muted" hint, surfaced by the SDK's voice detection. */}
          {isSpeakingWhileMuted ? (
            <View className="absolute bottom-[122px] self-center rounded-full bg-error px-4 py-1.5">
              <Text className="font-poppins-medium text-[12px] text-white">
                You&apos;re muted
              </Text>
            </View>
          ) : null}

          {/* Controls */}
          <View className="absolute bottom-6 left-0 right-0 flex-row justify-evenly">
            <CallButton
              label="Speaker"
              icon={speakerOn ? images.speakerWhiteIcon : images.speakerIcon}
              filled={speakerOn ? "bg-ink" : "bg-white"}
              disabled={!isJoined}
              onPress={() => onToggleSpeaker?.()}
            />
            <CallButton
              label={isJoined ? "Mic" : "Start"}
              icon={micOn ? images.micIcon : images.micOffWhiteIcon}
              filled={micOn ? "bg-white" : isJoined ? "bg-error" : "bg-success"}
              busy={isBusy}
              onPress={onToggleMic}
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
              onPress={handleEndCall}
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

function LessonMissing() {
  const router = useRouter();

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

type CallButtonProps = {
  label: string;
  icon: number;
  /** Background utility for the circle, e.g. "bg-white" or "bg-error". */
  filled: string;
  disabled?: boolean;
  busy?: boolean;
  onPress: () => void | Promise<void>;
};

/** One circular control plus its caption, as laid out along the stage bottom. */
function CallButton({ label, icon, filled, disabled, busy, onPress }: CallButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy }}
      activeOpacity={0.85}
      className={`items-center ${disabled || busy ? "opacity-40" : ""}`}
      disabled={disabled || busy}
      onPress={onPress}
    >
      <View
        className={`h-[54px] w-[54px] items-center justify-center rounded-full ${filled}`}
        style={styles.controlShadow}
      >
        {busy ? (
          <ActivityIndicator size="small" color={colors.background} />
        ) : (
          <Image source={icon} className="h-6 w-6" contentFit="contain" />
        )}
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
