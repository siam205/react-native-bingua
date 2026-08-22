/**
 * Learning content types.
 *
 * The whole curriculum is hardcoded TypeScript (see `data/`), so these types
 * are the contract every screen, store and future backend call relies on.
 *
 * Shape of the content tree:
 *   Language  ->  Unit  ->  Lesson  ->  Activity
 *                            |
 *                            +-- vocabulary / phrases / goals / aiTeacher
 */

/* -------------------------------------------------------------------------- */
/* Languages                                                                   */
/* -------------------------------------------------------------------------- */

/** ISO 639-1 code of a language the app can teach. Add new codes here first. */
export type LanguageCode = "es" | "fr" | "ja" | "ko" | "de" | "zh";

/** CEFR proficiency levels. The sample content only goes up to A2. */
export type CEFRLevel = "A1" | "A2" | "B1" | "B2";

export interface Language {
  id: LanguageCode;
  /** English name shown in the language list, e.g. "Spanish". */
  name: string;
  /** Name in the language itself, e.g. "Español". */
  nativeName: string;
  /** Flag emoji used as the list avatar. */
  flag: string;
  /** Short native greeting, used in the home header ("Hola, Alex!"). */
  greeting: string;
  /** Raw learner count. The UI formats it as "28.4M learners". */
  learnerCount: number;
  /** Shown in the "Popular" section of the language picker. */
  isPopular: boolean;
  /** False while the language has no units yet ("Coming soon"). */
  isAvailable: boolean;
  /** BCP 47 tag for text-to-speech and the AI teacher voice session. */
  speechLocale: string;
}

/* -------------------------------------------------------------------------- */
/* Units                                                                       */
/* -------------------------------------------------------------------------- */

/** Theme colour token for a unit card. Matches the tokens in `global.css`. */
export type AccentToken = "purple" | "blue" | "green" | "streak";

export interface Unit {
  id: string;
  languageId: LanguageCode;
  level: CEFRLevel;
  /** 1-based position inside the language, rendered as "Unit 3". */
  order: number;
  title: string;
  description: string;
  /** Emoji shown on the unit card. */
  icon: string;
  accent: AccentToken;
}

/* -------------------------------------------------------------------------- */
/* Lesson building blocks                                                      */
/* -------------------------------------------------------------------------- */

/** How a lesson is delivered. Drives which screen the lesson opens in. */
export type LessonKind = "vocabulary" | "chat" | "audio" | "video";

/** Runtime progress of a lesson. Owned by the Zustand store, not the content. */
export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

/** A single thing the learner should be able to do after the lesson. */
export interface LessonGoal {
  id: string;
  label: string;
}

export interface VocabularyWord {
  id: string;
  /** The word in the target language, e.g. "el café". */
  term: string;
  /** English meaning. */
  translation: string;
  /** Plain-English pronunciation hint, e.g. "el ka-FEH". */
  pronunciation: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  /** Optional sentence showing the word in context. */
  example?: {
    text: string;
    translation: string;
  };
}

/** A ready-made sentence the learner drills as a whole. */
export interface Phrase {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  /** When to use it, e.g. "Polite greeting before noon". */
  usage: string;
}

/* -------------------------------------------------------------------------- */
/* Activities                                                                  */
/* -------------------------------------------------------------------------- */

interface ActivityBase {
  id: string;
  /** Instruction shown above the activity. */
  prompt: string;
  /** XP awarded for a correct answer. */
  xp: number;
}

/** Pick the right option out of a list. */
export interface MultipleChoiceActivity extends ActivityBase {
  type: "multiple-choice";
  options: string[];
  /** Index into `options`. */
  answerIndex: number;
}

/** Type the translation of a word or sentence. */
export interface TranslateActivity extends ActivityBase {
  type: "translate";
  source: string;
  answer: string;
  hint?: string;
}

/** Drag terms onto their translations. */
export interface MatchPairsActivity extends ActivityBase {
  type: "match-pairs";
  pairs: { term: string; translation: string }[];
}

/** Hear a phrase, then say it back. Uses the device/agent voice. */
export interface SpeakActivity extends ActivityBase {
  type: "speak";
  text: string;
  translation: string;
}

/** Free-form turn with the AI tutor, graded loosely. */
export interface ConversationActivity extends ActivityBase {
  type: "conversation";
  /** What the tutor opens with. */
  openingLine: string;
  /** Words the learner is expected to use in their reply. */
  expectedVocabularyIds: string[];
}

export type Activity =
  | MultipleChoiceActivity
  | TranslateActivity
  | MatchPairsActivity
  | SpeakActivity
  | ConversationActivity;

export type ActivityType = Activity["type"];

/* -------------------------------------------------------------------------- */
/* AI teacher                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Everything the server needs to boot a Stream Vision Agent session for a
 * lesson. Kept as plain content so it stays reviewable and easy to tweak;
 * the prompt is sent from the backend, never used to call an AI from the app.
 */
export interface AITeacherPrompt {
  /** Who the agent plays, e.g. "Rio, a warm and patient Spanish teacher". */
  persona: string;
  /** Voice id passed to the speech provider. */
  voice: string;
  /** System instructions for the session. */
  systemPrompt: string;
  /** First thing the teacher says when the call connects. */
  openingLine: {
    text: string;
    translation: string;
  };
  /** Prompts the teacher falls back to when the learner goes quiet. */
  conversationStarters: string[];
  /** How hard the teacher pushes on mistakes. */
  correctionStyle: "gentle" | "direct";
  /** Vocabulary ids the teacher should get the learner to use. */
  targetVocabularyIds: string[];
  /** Plain-language checks the teacher uses to decide the lesson is done. */
  successCriteria: string[];
}

/* -------------------------------------------------------------------------- */
/* Lessons                                                                     */
/* -------------------------------------------------------------------------- */

export interface Lesson {
  id: string;
  unitId: string;
  /** 1-based position inside the unit, rendered as "Lesson 3". */
  order: number;
  title: string;
  /** One-line summary shown under the title. */
  description: string;
  kind: LessonKind;
  icon: string;
  /**
   * Optional local artwork (a `require`d asset from `constants/images.ts`).
   * When absent the UI falls back to a placeholder — see `lessonImage()`.
   */
  image?: number;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyWord[];
  phrases: Phrase[];
  activities: Activity[];
  /** Present on lessons that can be run as an AI teacher call. */
  aiTeacher?: AITeacherPrompt;
}
