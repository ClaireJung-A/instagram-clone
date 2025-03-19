import React, { memo, ReactElement } from "react";
import { Animated, FlatListProps, Platform, ViewProps } from "react-native";
import { FriendTheme } from "./CBFriendTheme";
import { Theme } from "./CBTheme";

// we provide this bc ios allows overscrolling but android doesn't
// so on ios because of pull to refresh / rubberbaanding we set scroll pos to negtaive header pos
export const CBTabViewOffset = ({ friend }: { friend: boolean }) =>
  friend ? -FriendTheme.sizing.header : -Theme.sizing.header;

export interface CBAnimatedTabViewProps<T>
  extends ViewProps,
    Pick<
      FlatListProps<T>,
      | "data"
      | "getItemLayout"
      | "initialNumToRender"
      | "maxToRenderPerBatch"
      | "onContentSizeChange"
      | "onMomentumScrollBegin"
      | "onMomentumScrollEnd"
      | "onScrollEndDrag"
      | "renderItem"
      | "updateCellsBatchingPeriod"
      | "windowSize"
      | "ListEmptyComponent"
      | "numColumns"
    > {
  onRef: (scrollableChild: Animated.FlatList<T>) => void;
  scrollY?: Animated.AnimatedValue;
  refreshControl?: ReactElement;
  friend: boolean; // New prop
  numColumns: number;
}

const CBAnimatedTabViewWithoutMemo = <T extends any>({
  data,
  renderItem,
  getItemLayout,
  onContentSizeChange,
  initialNumToRender,
  maxToRenderPerBatch,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  onRef,
  scrollY,
  refreshControl,
  ListEmptyComponent,
  friend,
  numColumns,
}: CBAnimatedTabViewProps<T>) => {
  const handleScroll =
    scrollY &&
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: true,
    });

  const theme = friend ? FriendTheme : Theme;

  return (
    <Animated.FlatList<T>
      data={data as readonly Animated.WithAnimatedValue<T>[]}
      renderItem={renderItem}
      keyboardShouldPersistTaps="always"
      ListEmptyComponent={ListEmptyComponent}
      getItemLayout={getItemLayout}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      ref={onRef}
      refreshControl={refreshControl}
      onContentSizeChange={onContentSizeChange}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScroll={handleScroll}
      onScrollEndDrag={onScrollEndDrag}
      nestedScrollEnabled={true}
      numColumns={numColumns}
      // ios has over scrolling and other things which make this look and feel nicer
      contentInset={Platform.select({ ios: { top: theme.sizing.header } })}
      contentOffset={Platform.select({
        ios: {
          x: 0,
          y: -theme.sizing.header,
        },
      })}
      contentContainerStyle={Platform.select({
        ios: {
          flexGrow: 1,
          paddingBottom: theme.spacing.gutter,
        },
        android: {
          flexGrow: 1,
          paddingTop: theme.sizing.header,
          paddingBottom: theme.spacing.gutter,
        },
      })}
    />
  );
};

// Creating an unmemoized component and casting as that type is the only way
// I can get Typescript to respect the generics of the memoized function.
export const CBAnimatedTabView = memo(
  CBAnimatedTabViewWithoutMemo
) as typeof CBAnimatedTabViewWithoutMemo;
