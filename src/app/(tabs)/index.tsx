import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { PlanRow } from "@/components/PlanRow";
import { images } from "@/constants/images";
import { getLanguage } from "@/data/languages";
import { getLessonsForUnit, getVocabularyForUnit } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { colors } from "@/theme";

/**
 * Progress the app does not track yet. Both move into a progress store
 * alongside completed lessons; they are here so the screen matches the design
 * instead of rendering an empty bar and three unchecked rows.
 */
const XP_EARNED_TODAY = 15;
const STREAK_DAYS = 12;

/**
 * Home — prompt_material/05-home-and-tab-navigation.png.
 *
 * Greeting and avatar come from Clerk plus the saved language; everything
 * below is derived from the hardcoded curriculum in `data/`.
 */
export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const language = selectedLanguageId ? getLanguage(selectedLanguageId) : undefined;

  // First name if Clerk has one, otherwise the part of the email before the @.
  const firstName =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "there";

  // Without progress tracking, "current" is simply the start of the course.
  const unit = language ? getUnitsForLanguage(language.id)[0] : undefined;
  const unitLessons = unit ? getLessonsForUnit(unit.id) : [];
  const currentLesson = unitLessons[0];
  const conversationLesson =
    unitLessons.find((lesson) => lesson.kind === "audio" || lesson.kind === "chat") ??
    currentLesson;
  const wordCount = unit ? getVocabularyForUnit(unit.id).length : 0;

  const dailyGoalXp = currentLesson?.xpReward ?? 20;
  const goalProgress = Math.min(XP_EARNED_TODAY / dailyGoalXp, 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Header ---------------------------------------------------------- */}
        <View className="h-11 flex-row items-center px-5">
          <View className="h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full bg-surface">
            <Text className="text-[22px] leading-[28px]">{language?.flag ?? "🌍"}</Text>
          </View>

          <Text className="ml-2.5 flex-1 font-poppins-bold text-[17px] text-ink">
            {language ? `${language.greeting}, ${firstName}!` : `Hi, ${firstName}!`} 👋
          </Text>

          <Text className="text-[19px] leading-[24px]">🔥</Text>
          <Text className="ml-2 font-poppins-semibold text-[15px] text-ink">
            {STREAK_DAYS}
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            activeOpacity={0.6}
            className="ml-6 h-9 w-9 items-center justify-center"
            onPress={() => {}}
          >
            <Image source={images.bellIcon} className="h-[22px] w-[22px]" contentFit="contain" />
          </TouchableOpacity>
        </View>

        {/* Daily goal ------------------------------------------------------ */}
        <View className="mx-5 mt-6 flex-row items-center rounded-2xl bg-peach-tint p-5">
          <View className="flex-1">
            <Text className="font-poppins-medium text-[14px] text-ink">Daily goal</Text>

            <View className="mt-1.5 flex-row items-baseline">
              <Text className="font-poppins-bold text-[23px] leading-[30px] text-ink">
                {XP_EARNED_TODAY}
              </Text>
              <Text className="ml-1.5 font-poppins-medium text-[14px] text-ink-muted">
                / {dailyGoalXp} XP
              </Text>
            </View>

            <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-peach-track">
              <View
                className="h-full rounded-full bg-streak"
                style={{ width: `${goalProgress * 100}%` }}
              />
            </View>
          </View>

          <Image
            source={images.treasure}
            className="ml-3 h-[78px] w-[95px]"
            contentFit="contain"
          />
        </View>

        {/* Continue learning ----------------------------------------------- */}
        {unit && language ? (
          <View className="mx-5 mt-6 h-[174px] overflow-hidden rounded-2xl bg-purple">
            {/* palace.png is a square canvas whose artwork stops 12.4% short of
                the bottom and 4.8% short of the right. The negative insets pull
                that transparent padding past the card edges so the illustration
                itself sits flush in the corner, as it does in the design. */}
            <Image
              source={images.palace}
              className="absolute bottom-[-24px] right-[-9px] h-[197px] w-[197px]"
              contentFit="contain"
            />

            <View className="flex-1 justify-center p-5">
              <Text className="font-poppins-medium text-[14px] text-white">
                Continue learning
              </Text>
              <Text className="mt-1 font-poppins-bold text-[23px] leading-[30px] text-white">
                {language.name}
              </Text>
              <Text className="mt-0.5 font-poppins-medium text-[14px] text-white">
                {unit.level} • Unit {unit.order}
              </Text>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                className="mt-4 h-[42px] w-[104px] items-center justify-center rounded-full bg-white"
                onPress={() => router.push("/learn")}
              >
                <Text className="font-poppins-bold text-[14px] text-purple">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="mx-5 mt-6 items-center rounded-2xl bg-purple-tint px-6 py-8">
            <Text className="text-[30px]">🚧</Text>
            <Text className="mt-2 text-center font-poppins-semibold text-[15px] text-ink">
              The {language?.name ?? "course"} course is still being built
            </Text>
            <Text className="text-body-md mt-1 text-center text-ink-muted">
              Pick another language to start learning today.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              className="mt-4 h-[42px] items-center justify-center rounded-full bg-deep-purple px-6"
              onPress={() => router.push("/language-selection")}
            >
              <Text className="font-poppins-bold text-[14px] text-white">
                Change language
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's plan ---------------------------------------------------- */}
        {unit && currentLesson ? (
          <View className="mt-6 px-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-poppins-bold text-[16px] text-ink">Today&apos;s plan</Text>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.6}
                onPress={() => router.push("/learn")}
              >
                <Text className="font-poppins-semibold text-[14px] text-purple">View all</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-5 gap-7">
              <PlanRow
                title="Lesson"
                subtitle={currentLesson.title}
                icon={images.tabs.learn.active}
                tint="purple"
                done
                onPress={() => router.push("/learn")}
              />
              <PlanRow
                title="AI Conversation"
                subtitle={conversationLesson.title}
                icon={images.headphonesIcon}
                tint="deep-purple"
                done={false}
                onPress={() => router.push("/ai-teacher")}
              />
              <PlanRow
                title="New words"
                subtitle={`${wordCount} words`}
                icon={images.tabs.chat.active}
                tint="error"
                done={false}
                onPress={() => router.push("/learn")}
              />
            </View>
          </View>
        ) : null}

        {/* Next up --------------------------------------------------------- */}
        <View className="mx-5 mt-6 h-[112px] flex-row items-center overflow-hidden rounded-2xl bg-mint-tint pl-5">
          <View className="flex-1">
            <Text className="font-poppins-medium text-[13px] text-ink-muted">Next up</Text>
            <Text className="mt-0.5 font-poppins-bold text-[16px] text-ink">
              AI Video Call
            </Text>
            <Text className="mt-0.5 font-poppins-regular text-[13px] text-ink-muted">
              Practice speaking
            </Text>
          </View>

          <Image
            source={images.tutorPortrait}
            className="h-[68px] w-[68px] rounded-full"
            contentFit="cover"
            transition={200}
          />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Start AI video call"
            activeOpacity={0.85}
            className="ml-5 mr-3 h-[42px] w-[42px] items-center justify-center rounded-full bg-green"
            onPress={() => router.push("/ai-teacher")}
          >
            <Image source={images.videoIcon} className="h-[20px] w-[20px]" contentFit="contain" />
          </TouchableOpacity>
        </View>
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
