import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList } from "react-native";
import { CBTabViewOffset } from "../lib";
import { FriendTheme } from "../lib/CBFriendTheme";
import { Theme } from "../lib/CBTheme";

export const useScrollManager = (
  routes: { key: string; title: string }[],
  friend: boolean,
  sizing = friend ? FriendTheme.sizing : Theme.sizing
) => {
  const scrollY = useRef(new Animated.Value(-sizing.header)).current;
  const [index, setIndex] = useState(0);
  const isListGliding = useRef(false);
  const tabkeyToScrollPosition = useRef<{ [key: string]: number }>({}).current;
  const tabkeyToScrollableChildRef = useRef<{ [key: string]: FlatList }>(
    {}
  ).current;

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const curRoute = routes[index].key;
      tabkeyToScrollPosition[curRoute] = value;
    });
    return () => {
      scrollY.removeListener(listener);
    };
  }, [index, scrollY, routes, tabkeyToScrollPosition]);

  return useMemo(() => {
    const syncScrollOffset = () => {
      const curRouteKey = routes[index].key;
      const scrollValue = tabkeyToScrollPosition[curRouteKey];

      Object.keys(tabkeyToScrollableChildRef).forEach((key) => {
        const scrollRef = tabkeyToScrollableChildRef[key];
        if (!scrollRef) {
          return;
        }

        if (/* header visible */ key !== curRouteKey) {
          if (scrollValue <= CBTabViewOffset({ friend }) + sizing.header) {
            scrollRef.scrollToOffset({
              offset: Math.max(
                Math.min(scrollValue, CBTabViewOffset({ friend }) + sizing.header),
                CBTabViewOffset({ friend })
              ),
              animated: false,
            });
            tabkeyToScrollPosition[key] = scrollValue;
          } else if (
            /* header hidden */
            tabkeyToScrollPosition[key] < CBTabViewOffset({ friend }) + sizing.header ||
            tabkeyToScrollPosition[key] == null
          ) {
            scrollRef.scrollToOffset({
              offset: CBTabViewOffset({ friend }) + sizing.header,
              animated: false,
            });
            tabkeyToScrollPosition[key] = CBTabViewOffset({ friend }) + sizing.header;
          }
        }
      });
    };

    const onMomentumScrollBegin = () => {
      isListGliding.current = true;
    };

    const onMomentumScrollEnd = () => {
      isListGliding.current = false;
      syncScrollOffset();
    };

    const onScrollEndDrag = () => {
      syncScrollOffset();
    };

    const trackRef = (key: string, ref: FlatList) => {
      tabkeyToScrollableChildRef[key] = ref;
    };

    const getRefForKey = (key: string) => tabkeyToScrollableChildRef[key];
    return {
      scrollY,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
      onScrollEndDrag,
      trackRef,
      index,
      setIndex,
      getRefForKey,
    };
  }, [
    index,
    routes,
    scrollY,
    tabkeyToScrollPosition,
    tabkeyToScrollableChildRef,
  ]);
};
