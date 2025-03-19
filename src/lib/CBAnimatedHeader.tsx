import React, { FunctionComponent } from "react";
import { Animated, StyleSheet, ViewProps } from "react-native";

import { CBTabViewOffset } from "./CBAnimatedTabView";
import { Theme } from "./CBTheme";
import { FriendTheme } from "./CBFriendTheme";

export interface CBAnimatedHeaderProps extends Omit<ViewProps, "style"> {
  scrollY: Animated.AnimatedValue;
  friend: boolean;
}

export const CBAnimatedHeader: FunctionComponent<CBAnimatedHeaderProps> = ({
  scrollY,
  children,
  friend,
  ...otherProps
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [
      CBTabViewOffset({ friend }),
      CBTabViewOffset({ friend }) + (friend ? FriendTheme : Theme).sizing.header,
    ],
    outputRange: [0, -(friend ? FriendTheme : Theme).sizing.header],
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY }],
          height: (friend ? FriendTheme : Theme).sizing.header,
          paddingHorizontal: (friend ? FriendTheme : Theme).spacing.gutter,
        },
      ]}
      {...otherProps}
    pointerEvents={"box-none"}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 1,
    justifyContent: "center",
  },
});
