import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { colors } from "@/theme";

/**
 * Circle diameter, and the height of the icon slot it is centred in. Kept as a
 * number because the slide animation computes offsets from it; the matching
 * `h-12` on the icon slot and the row's `h-[63px]` (48 + a 15pt label row) have
 * to be updated alongside it.
 */
const CIRCLE_SIZE = 48;

const SPRING = { damping: 18, stiffness: 190, mass: 0.9 };
const FADE = { duration: 180 };

type TabIcon = { inactive: number; active: number };

/** Route name -> icon + label. Route names come from the files in app/(tabs). */
const TABS: Record<string, { label: string; icon: TabIcon }> = {
  index: { label: "Home", icon: images.tabs.home },
  learn: { label: "Learn", icon: images.tabs.learn },
  "ai-teacher": { label: "AI Teacher", icon: images.tabs.aiTeacher },
  chat: { label: "Chat", icon: images.tabs.chat },
  profile: { label: "Profile", icon: images.tabs.profile },
};

/**
 * Bottom tab bar with a purple circle that slides to the selected tab.
 *
 * The selected tab shows its icon alone inside the circle; every other tab
 * shows icon and label. Labels keep their space either way (they fade rather
 * than unmount), so nothing shifts as the circle travels.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const tabWidth = barWidth / state.routes.length;
  const circleX = tabWidth * state.index + (tabWidth - CIRCLE_SIZE) / 2;

  const translateX = useSharedValue(0);
  const hasPositioned = useRef(false);

  useEffect(() => {
    if (!barWidth) return;

    // Drop the circle straight onto the first tab; only later moves animate.
    if (!hasPositioned.current) {
      hasPositioned.current = true;
      translateX.value = circleX;
      return;
    }

    translateX.value = withSpring(circleX, SPRING);
  }, [barWidth, circleX, translateX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="rounded-t-3xl bg-background"
      style={[styles.barShadow, { paddingBottom: insets.bottom }]}
    >
      <View
        className="h-[63px] flex-row pt-1.5"
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.circle, circleStyle]} />

        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;

          const isFocused = state.index === index;

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={tab.label}
              icon={tab.icon}
              focused={isFocused}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabItemProps = {
  label: string;
  icon: TabIcon;
  focused: boolean;
  onPress: () => void;
};

/**
 * The white icon fades in *on top of* the grey one rather than replacing it,
 * so the icon is never white-on-white during the moment before the circle
 * arrives underneath it.
 */
function TabItem({ label, icon, focused, onPress }: TabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, FADE);
  }, [focused, progress]);

  const activeIconStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      activeOpacity={0.7}
      className="flex-1 items-center"
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center">
        <Image source={icon.inactive} className="h-6 w-6" contentFit="contain" />
        <Animated.View style={[styles.activeIcon, activeIconStyle]}>
          <Image source={icon.active} className="h-6 w-6" contentFit="contain" />
        </Animated.View>
      </View>

      <Animated.View style={labelStyle}>
        <Text
          numberOfLines={1}
          className="font-poppins-medium text-[11px] leading-[15px] text-ink-muted"
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// StyleSheet only for the platform shadow and for the two Animated.View
// layers, which Reanimated does not route through className (see AGENTS.md).
const styles = StyleSheet.create({
  barShadow: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  circle: {
    position: "absolute",
    top: 6,
    left: 0,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.deepPurple,
  },
  activeIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
