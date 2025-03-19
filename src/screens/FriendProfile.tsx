import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FriendProfileHeader from "../components/Friend/FriendHeader";
import FriendNavBar from "../components/Friend/FriendNavBar";
import { Scene } from "../components/Profile";
import { useScrollManager } from "../hooks";
import useFriendProfile from "../hooks/FBUserQuery";
import {
  CBAnimatedHeader,
  CBAnimatedTabBar,
  CBTabBar,
  CBTabRoute,
  CBTabView,
} from "../lib";
import FriendProfileAndroid from "./FriendProfileAndroid";

const initialWidth = Dimensions.get("window").width;

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
}
export type tabKeys = "Feed" | "Reels" | "Guide" | "Effect" | "Tag";
export const tabs = [
  { key: "Feed" as tabKeys, title: "Feed" },
  { key: "Reels" as tabKeys, title: "Reels" },
  { key: "Guide" as tabKeys, title: "Guide" },
  { key: "Effect" as tabKeys, title: "Effect" },
  { key: "Tag" as tabKeys, title: "Tag" },
];
const FriendProfile = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  if (Platform.OS === "android") {
    return <FriendProfileAndroid route={route} navigation={navigation} />;
  }
  const { uid, accountName, name, profileImage, bio } = route.params;
  const { scrollY, index, setIndex, getRefForKey, ...sceneProps } =
    useScrollManager(tabs, true);
  const { followerCount, followingCount, posts, currentUser, fetchData } =
    useFriendProfile(uid);

  const refreshParent = () => {
    fetchData();
  };

  useEffect(() => {
    const refreshData = navigation.addListener("focus", () => {
      fetchData();
    });

    return refreshData;
  }, [fetchData, navigation]);

  const renderScene = useCallback(
    ({ route: tab }: { route: CBTabRoute }) => (
      <Scene
        isActive={tabs[index].key === tab.key}
        tabKey={tab.key}
        routeKey={tab.key}
        scrollY={scrollY}
        {...sceneProps}
        uid={uid}
        friend={true}
      />
    ),
    [getRefForKey, index, tabs, scrollY]
  );

  function isValidUri(uri: string): boolean {
    try {
      new URL(uri);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <FriendNavBar accountName={accountName} />
      <View style={styles.screen}>
        <CBAnimatedHeader scrollY={scrollY} friend={true}>
          <FriendProfileHeader
            navigation={navigation}
            uid={uid}
            accountName={accountName}
            name={name}
            bio={bio}
            profileImage={
              profileImage && isValidUri(profileImage)
                ? { uri: profileImage as string }
                : require("../images/default-pic.png")
            }
            post={posts.filter((post) => post.authorUID !== undefined).length}
            followerCount={followerCount}
            followingCount={followingCount}
            currentUser={currentUser ?? ""}
            refreshParent={refreshParent}
          />
        </CBAnimatedHeader>
        <CBTabView
          index={index}
          setIndex={setIndex}
          width={initialWidth}
          routes={tabs}
          renderTabBar={(p) => (
            <CBAnimatedTabBar scrollY={scrollY} friend={true}>
              <CBTabBar {...p} />
            </CBAnimatedTabBar>
          )}
          renderScene={renderScene}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default FriendProfile;
