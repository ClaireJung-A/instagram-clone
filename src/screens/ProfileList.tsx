import { useIsFocused } from "@react-navigation/native";
import {
  DocumentSnapshot,
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Post, { PostProps } from "../components/Home/posts";
import Header from "../components/Profile/PostListHeader";

export interface Post {
  imageUrl: ImageSourcePropType[];
  likes_by_users: string[];
  caption: string;
  comments: Comment[];
  createdAt: Date;
  post_id: string;
  user_id: string;
}

export interface Comment {
  user_id: string;
  comment: string;
}

const ProfileList = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { uid, post_id } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [accountName, setAccountName] = useState("");
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const flatListRef = useRef<FlatList>(null);

  const scrollToPost = () => {
    const index = posts.findIndex((post) => post.post_id === post_id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: index, animated: false });
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // This useEffect listens for changes in the `posts` state
  useEffect(() => {
    if (posts.length > 0) {
      scrollToPost();
    }
  }, [posts.length]);

  const fetchData = async () => {
    setLoading(true);
    const db = getFirestore();
    const querySnapshot_post = await getDocs(
      query(collection(db, "posts"), where("user_id", "==", uid))
    );

    querySnapshot_post.docs.forEach((doc) => {
      const postRef = doc.ref;
      onSnapshot(postRef, async (postDoc: DocumentSnapshot) => {
        if (postDoc.exists()) {
          const postData = postDoc.data() as any;
          const userSnapshot = await getDocs(
            query(
              collection(db, "users"),
              where("uid", "==", postData.user_id),
              limit(1)
            )
          );
          const userData = userSnapshot.docs[0]?.data();
          setAccountName(userData.accountName);
          const updatedPost: Post = {
            imageUrl: postData.imageUrl.map((url: string) => ({ uri: url })),
            likes_by_users: postData.likes_by_users,
            caption: postData.caption,
            comments: postData.comments,
            createdAt: new Date(postData.createdAt),
            post_id: postData.post_id,
            user_id: postData.user_id,
          } as Post;
          setPosts((prevPosts) => {
            const postsCopy = [...prevPosts];
            const index = postsCopy.findIndex(
              (post) => post.post_id === updatedPost.post_id
            );
            if (index > -1) {
              // If post already exists, update it
              postsCopy[index] = updatedPost;
            } else {
              // If post doesn’t exist, add it
              postsCopy.push(updatedPost);
            }
            // Sort the posts by createdAt
            postsCopy.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );
            setLoading(false);
            return postsCopy;
          });
        }
      });
    });
  };

  const renderItem = ({ item }: { item: Post }) => {
    const postItem = item as Post;
    const postProps: PostProps = {
      post: postItem,
    };
    return <Post {...postProps} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} accountName={accountName} />
      {loading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#000000"
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={fetchData}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 200));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileList;
