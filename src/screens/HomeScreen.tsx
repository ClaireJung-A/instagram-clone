import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import {
  getFirestore,
  getDocs,
  collection,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";

import Header from "../components/Home/header";
import Stories from "../components/Home/stories";
import Post from "../components/Home/posts";
import { PostProps } from "../components/Home/posts";
import { ImageSourcePropType } from "react-native";
import { StatusBar, Platform } from "react-native";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

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

type StoryOrPost = Post | {};

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  // Define unsubscribeListeners as a ref so we can access it inside the cleanup function
  const unsubscribeListeners = useRef<(() => void)[]>([]);

  useEffect(() => {
    fetchData();

    // Cleanup function: unsubscribe from all listeners
    return () => {
      unsubscribeListeners.current.forEach((unsubscribe) => unsubscribe());
    };
  }, []); // Only run once when component mounts

  const fetchData = async () => {
    const db = getFirestore();
    const querySnapshot_post = await getDocs(collection(db, "posts"));

    querySnapshot_post.docs.forEach((doc) => {
      const postRef = doc.ref;

      const unsubscribe = onSnapshot(postRef, (postDoc: DocumentSnapshot) => {
        if (postDoc.exists()) {
          const postData = postDoc.data() as any;
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
              // If post doesn't exist, add it
              postsCopy.push(updatedPost);
            }

            // Sort the posts by createdAt
            postsCopy.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

            return postsCopy;
          });
        }
      });
      unsubscribeListeners.current.push(unsubscribe);
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: StoryOrPost;
    index: number;
  }) => {
    if (index === 0) {
      // Render the Stories component for the first item
      return <Stories />;
    }
    const postItem = item as Post;
    const postProps: PostProps = {
      post: postItem, // Pass the post object to the Post component
    };
    // For other items, render the Post component
    return <Post {...postProps} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <FlatList
        data={[{} as StoryOrPost, ...posts]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={refreshing}
        onRefresh={fetchData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
});

export default Home;
