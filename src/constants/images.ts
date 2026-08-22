import aiTeacherTab from "@/assets/images/tabIcons/ai-teacher.svg";
import aiTeacherTabActive from "@/assets/images/tabIcons/ai-teacher-active.svg";
import appleIcon from "@/assets/images/social/apple.svg";
import bellIcon from "@/assets/images/icons/bell.svg";
import bookmarkIcon from "@/assets/images/icons/bookmark.svg";
import bookmarkFilledIcon from "@/assets/images/icons/bookmark-filled.svg";
import chatTab from "@/assets/images/tabIcons/chat.svg";
import chatTabActive from "@/assets/images/tabIcons/chat-active.svg";
import earth from "@/assets/images/earth.png";
import eyeIcon from "@/assets/images/icons/eye.svg";
import eyeOffIcon from "@/assets/images/icons/eye-off.svg";
import facebookIcon from "@/assets/images/social/facebook.svg";
import googleIcon from "@/assets/images/social/google.svg";
import headphonesInkIcon from "@/assets/images/icons/headphones-ink.svg";
import headphonesIcon from "@/assets/images/icons/headphones.svg";
import homeTab from "@/assets/images/tabIcons/home.svg";
import homeTabActive from "@/assets/images/tabIcons/home-active.svg";
import learnTab from "@/assets/images/tabIcons/learn.svg";
import learnTabActive from "@/assets/images/tabIcons/learn-active.svg";
import micIcon from "@/assets/images/icons/mic.svg";
import micOffWhiteIcon from "@/assets/images/icons/mic-off-white.svg";
import micWhiteIcon from "@/assets/images/icons/mic-white.svg";
import phoneDownWhiteIcon from "@/assets/images/icons/phone-down-white.svg";
import profileTab from "@/assets/images/tabIcons/profile.svg";
import profileTabActive from "@/assets/images/tabIcons/profile-active.svg";
import searchIcon from "@/assets/images/icons/search.svg";
import speakerIcon from "@/assets/images/icons/speaker.svg";
import speakerPurpleIcon from "@/assets/images/icons/speaker-purple.svg";
import speakerWhiteIcon from "@/assets/images/icons/speaker-white.svg";
import subtitlesIcon from "@/assets/images/icons/subtitles.svg";
import subtitlesWhiteIcon from "@/assets/images/icons/subtitles-white.svg";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import palace from "@/assets/images/palace.png";
import sparkleBlue from "@/assets/images/icons/sparkle-blue.svg";
import sparkleOrange from "@/assets/images/icons/sparkle-orange.svg";
import sparkleYellow from "@/assets/images/icons/sparkle-yellow.svg";
import treasure from "@/assets/images/treasure.png";
import videoIcon from "@/assets/images/icons/video.svg";

export const images = {
  mascotLogo,
  mascotWelcome,
  mascotAuth,

  // Illustrations
  earth,
  palace,
  treasure,

  // Social auth brand marks
  googleIcon,
  facebookIcon,
  appleIcon,

  // UI icons
  eyeIcon,
  eyeOffIcon,
  searchIcon,
  bellIcon,
  bookmarkIcon,
  bookmarkFilledIcon,
  headphonesIcon,
  headphonesInkIcon,
  videoIcon,

  // Audio lesson controls — one file per colour, since the stroke colour is
  // baked into the SVG and cannot be restyled at runtime.
  micIcon,
  micWhiteIcon,
  micOffWhiteIcon,
  speakerIcon,
  speakerWhiteIcon,
  speakerPurpleIcon,
  subtitlesIcon,
  subtitlesWhiteIcon,
  phoneDownWhiteIcon,

  // Bottom tab icons — one file per colour, since the stroke colour is baked
  // into the SVG and cannot be restyled at runtime.
  tabs: {
    home: { inactive: homeTab, active: homeTabActive },
    learn: { inactive: learnTab, active: learnTabActive },
    aiTeacher: { inactive: aiTeacherTab, active: aiTeacherTabActive },
    chat: { inactive: chatTab, active: chatTabActive },
    profile: { inactive: profileTab, active: profileTabActive },
  },

  // Decorative sparkles
  sparkleOrange,
  sparkleBlue,
  sparkleYellow,

  /**
   * Remote placeholder. The design shows a photo of the AI tutor, which is not
   * in assets/ yet — swap this for a local import once the portrait exists.
   */
  tutorPortrait: { uri: "https://picsum.photos/seed/lingua-tutor/240" },
};

/**
 * Artwork for a lesson.
 *
 * No per-lesson illustrations exist in assets/ yet, so this falls back to a
 * deterministic placeholder keyed by the lesson id — the same lesson always
 * gets the same picture. Set `image` on a lesson in `data/lessons.ts` to
 * override it with a real asset once the artwork lands.
 */
export function lessonImage(lesson: { id: string; image?: number }) {
  return lesson.image ?? { uri: `https://picsum.photos/seed/${lesson.id}/640/480` };
}
