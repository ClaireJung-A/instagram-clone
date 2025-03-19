import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header, NavBar, Scene } from "../components/Profile";
import { useScrollManager } from "../hooks";
import { useFetchProfileData } from "../hooks/FBUserQuery";
import {
  CBAnimatedHeader,
  CBAnimatedTabBar,
  CBTabBar,
  CBTabRoute,
  CBTabView,
} from "../lib";
import ProfileAndroid from "./ProfileAndroid";

const initialWidth = Dimensions.get("window").width;

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
  post_id: string;
}
export type tabKeys = "Feed" | "Reels" | "Guide" | "Effect" | "Tag";
export const tabs = [
  { key: "Feed" as tabKeys, title: "Feed" },
  { key: "Reels" as tabKeys, title: "Reels" },
  { key: "Guide" as tabKeys, title: "Guide" },
  { key: "Effect" as tabKeys, title: "Effect" },
  { key: "Tag" as tabKeys, title: "Tag" },
];

export default function Profile({ navigation }: { navigation: any }) {
  if (Platform.OS === "android") {
    return <ProfileAndroid navigation={navigation} />;
  }
  const { scrollY, index, setIndex, getRefForKey, ...sceneProps } =
    useScrollManager(tabs, false);
  const uid = getAuth().currentUser?.uid;
  const {
    accountName,
    name,
    pic,
    bio,
    posts,
    followerCount,
    followingCount,
    hasFetchedData,
    fetchData,
  } = useFetchProfileData();

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
        uid={uid ?? ""}
        friend={false}
      />
    ),
    [getRefForKey, index, tabs, scrollY]
  );

  return hasFetchedData ? (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <NavBar accountName={accountName} />

      <View style={styles.screen}>
        <CBAnimatedHeader scrollY={scrollY} friend={false}>
          <Header
            uid={uid}
            accountName={accountName}
            name={name}
            bio={bio}
            pic={pic}
            post={posts.filter((post) => post.authorUID !== undefined).length}
            followerCount={followerCount}
            followingCount={followingCount}
            hasFetchedData={hasFetchedData}
          />
        </CBAnimatedHeader>

        <CBTabView
          index={index}
          setIndex={setIndex}
          width={initialWidth}
          routes={tabs}
          renderTabBar={(p) => (
            <CBAnimatedTabBar scrollY={scrollY} friend={false}>
              <CBTabBar {...p} />
            </CBAnimatedTabBar>
          )}
          renderScene={renderScene}
        />
      </View>
    </SafeAreaProvider>
  ) : (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
