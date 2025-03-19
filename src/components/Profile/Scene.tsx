import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { CBAnimatedTabView } from "../../lib";
import ProfilePost from "./profilePost";
import useFormatData from "../../hooks/formatData";

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
  post_id: string;
}

interface EmptyPostType extends Post {
  key: string;
  empty: true;
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface SceneProps {
  isActive: boolean;
  routeKey: string;
  scrollY: Animated.Value;
  trackRef: (key: string, ref: FlatList<any>) => void;
  onMomentumScrollBegin: (e: ScrollEvent) => void;
  onMomentumScrollEnd: (e: ScrollEvent) => void;
  onScrollEndDrag: (e: ScrollEvent) => void;
  uid: string;
  friend: boolean;
}

export const Scene: FunctionComponent<SceneProps & { tabKey: string }> = ({
  isActive,
  routeKey,
  tabKey,
  scrollY,
  trackRef,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  uid,
  friend,
}) => {
  const [posts, setPosts] = useState<(Post | EmptyPostType)[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();
  const formatData = useFormatData();

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    const db = getFirestore();
    const querySnapshot_post = await getDocs(
      query(collection(db, "posts"), where("user_id", "==", uid))
    );
    const fetchedPosts: Post[] = await Promise.all(
      querySnapshot_post.docs.map(
        async (doc) =>
          ({ ...doc.data(), createdAt: new Date(doc.data().createdAt) } as Post)
      )
    );
    fetchedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setPosts(formatData(fetchedPosts, 3));
    setRefreshing(false);
  }, [uid]);

  useEffect(() => {
    fetchData();
    return navigation.addListener("focus", fetchData);
  }, [fetchData, navigation]);

  const isEmptyPost = (item: Post | EmptyPostType): item is EmptyPostType =>
    (item as EmptyPostType).empty === true;

  if (routeKey !== tabKey) {
    return null; // Render nothing if the tabKey doesn't match the routeKey
  }

  const numColumns =
    tabKey === "Reels"
      ? 2
      : tabKey === "Guide"
      ? 1
      : tabKey === "Effect"
      ? 2
      : 3;

  return (
    <View style={styles.container}>
      <CBAnimatedTabView
        data={formatData(posts, numColumns)}
        windowSize={3}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => null} />
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, padding: 1 }}>
            {!isEmptyPost(item) && <ProfilePost post={item} uid={uid ?? ""} />}
          </View>
        )}
        onRef={(ref: any) => {
          trackRef(routeKey, ref);
        }}
        scrollY={isActive ? scrollY : undefined}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        numColumns={numColumns}
        friend={friend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
