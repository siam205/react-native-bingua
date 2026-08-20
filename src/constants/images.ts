import aiTeacherTab from "@/assets/images/tabIcons/ai-teacher.svg";
import aiTeacherTabActive from "@/assets/images/tabIcons/ai-teacher-active.svg";
import appleIcon from "@/assets/images/social/apple.svg";
import bellIcon from "@/assets/images/icons/bell.svg";
import chatTab from "@/assets/images/tabIcons/chat.svg";
import chatTabActive from "@/assets/images/tabIcons/chat-active.svg";
import earth from "@/assets/images/earth.png";
import eyeIcon from "@/assets/images/icons/eye.svg";
import eyeOffIcon from "@/assets/images/icons/eye-off.svg";
import facebookIcon from "@/assets/images/social/facebook.svg";
import googleIcon from "@/assets/images/social/google.svg";
import headphonesIcon from "@/assets/images/icons/headphones.svg";
import homeTab from "@/assets/images/tabIcons/home.svg";
import homeTabActive from "@/assets/images/tabIcons/home-active.svg";
import learnTab from "@/assets/images/tabIcons/learn.svg";
import learnTabActive from "@/assets/images/tabIcons/learn-active.svg";
import profileTab from "@/assets/images/tabIcons/profile.svg";
import profileTabActive from "@/assets/images/tabIcons/profile-active.svg";
import searchIcon from "@/assets/images/icons/search.svg";
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
  headphonesIcon,
  videoIcon,

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
