import React, { FunctionComponent, ReactNode } from "react";
import { Animated, StyleSheet, View, ViewProps } from "react-native";
import { CBTabViewOffset } from "./CBAnimatedTabView";
import { FriendTheme } from "./CBFriendTheme";
import { Theme } from "./CBTheme";

export interface CBAnimatedTabBarProps extends Omit<ViewProps, "style"> {
  scrollY: Animated.AnimatedValue;
  children: ReactNode;
  friend: boolean;
}

export const CBAnimatedTabBar: FunctionComponent<CBAnimatedTabBarProps> = ({
  children,
  scrollY,
  friend,
  ...otherProps
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [
      CBTabViewOffset({ friend }),
      CBTabViewOffset({ friend }) + (friend ? FriendTheme : Theme).sizing.header,
    ],
    outputRange: [(friend ? FriendTheme : Theme).sizing.header, 0],
    extrapolateRight: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [
      CBTabViewOffset({ friend }) + (friend ? FriendTheme : Theme).sizing.header,
      CBTabViewOffset({ friend }) + (friend ? FriendTheme : Theme).sizing.header + 20,
    ],
    outputRange: [0, 1],
    extrapolateRight: "clamp",
  });

  return (
    <Animated.View
      style={[styles.tabBar, { transform: [{ translateY }] }]}
      {...otherProps}
    >
      {children}
      <Animated.View style={{ opacity }}>
        <View style={styles.border} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: "100%",
    zIndex: 2,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  border: {
    height: 1,
    backgroundColor: "#eee",
  },
});
