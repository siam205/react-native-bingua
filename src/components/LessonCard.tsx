import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/Image";
import { lessonImage } from "@/constants/images";
import type { Lesson } from "@/types/learning";

/**
 * Progress shown on a card. Nothing is locked — every lesson is tappable —
 * so an untouched lesson reads as "upcoming" rather than the padlock in the
 * design.
 */
export type LessonCardStatus = "completed" | "in-progress" | "upcoming";

type LessonCardProps = {
  lesson: Lesson;
  status: LessonCardStatus;
  onPress: () => void;
};

/**
 * One row in the unit's lesson list — prompt_material/06-lesson-screen.png.
 *
 * The in-progress card is the one that carries the accent: purple border,
 * tinted background, a status line and the lesson's own artwork.
 */
export function LessonCard({ lesson, status, onPress }: LessonCardProps) {
  const inProgress = status === "in-progress";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: inProgress }}
      accessibilityLabel={`Lesson ${lesson.order}, ${lesson.title}, ${
        status === "completed" ? "completed" : inProgress ? "in progress" : "not started"
      }`}
      activeOpacity={0.85}
      className={`flex-row items-center rounded-2xl px-5 py-4 ${
        inProgress ? "border-[1.5px] border-purple bg-purple-tint" : "border border-border bg-white"
      }`}
      onPress={onPress}
    >
      <View className="flex-1">
        <Text
          className={`font-poppins-regular text-[14px] leading-[20px] ${
            inProgress ? "text-purple" : "text-ink-muted"
          }`}
        >
          Lesson {lesson.order}
        </Text>

        <Text className="mt-0.5 font-poppins-semibold text-[16px] leading-[22px] text-ink">
          {lesson.title}
        </Text>

        {inProgress ? (
          <Text className="mt-0.5 font-poppins-regular text-[13px] leading-[18px] text-purple">
            In progress
          </Text>
        ) : status === "upcoming" ? (
          <Text className="mt-0.5 font-poppins-regular text-[13px] leading-[18px] text-ink-muted">
            {lesson.estimatedMinutes} min • {lesson.xpReward} XP
          </Text>
        ) : null}
      </View>

      {inProgress ? (
        <Image
          source={lessonImage(lesson)}
          className="ml-3 h-11 w-11 rounded-xl"
          contentFit="cover"
          transition={200}
        />
      ) : status === "completed" ? (
        <View className="ml-3 h-6 w-6 items-center justify-center rounded-full bg-success">
          <View className="mt-[-2px] h-[5px] w-[9px] -rotate-45 border-b-2 border-l-2 border-white" />
        </View>
      ) : (
        <View className="ml-3 h-6 w-6 rounded-full border-[1.5px] border-border" />
      )}
    </TouchableOpacity>
  );
}
