import React, { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  updateDoc,
  doc,
  getFirestore,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import PostHeader from "./MakePost/postHeader";
import PostImage from "./MakePost/postImage";
import { Post as PostType } from "../../screens/HomeScreen";
import {
  PostFooter,
  Likes,
  Caption,
  CommentSection,
  CommentInput,
} from "./MakePost/postFooter";
import { useUser } from "../../hooks/FBPost";

export interface PostProps {
  post: PostType;
}

//main Post function
const Post: React.FC<PostProps> = ({ post }) => {
  // current user information
  const currentUserUID = getAuth().currentUser?.uid || "";
  const { user } = useUser(post.user_id);

  // liked status
  const [liked, setLiked] = useState<boolean>(() =>
    post.likes_by_users.includes(currentUserUID)
  );

  // Handling Like Main Function
  const handleLike = async () => {
    const db = getFirestore();
    const postRef = doc(db, "posts", post.post_id);

    let currentLikeStatus = post.likes_by_users.includes(currentUserUID);

    try {
      await updateDoc(postRef, {
        likes_by_users: currentLikeStatus
          ? arrayRemove(currentUserUID)
          : arrayUnion(currentUserUID),
      });

      setLiked(!currentLikeStatus);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Handling Comment Main Function
  const handleCommentSubmit = async (comment: string) => {
    const post_id = post.post_id;
    const db = getFirestore();
    const postRef = doc(db, "posts", post_id);

    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          user_id: currentUserUID,
          comment: comment,
        }),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //Post returning main components
  return (
    <View>
      <PostHeader user={user} />
      <PostImage post={post} onLike={handleLike} liked={liked} />
      <View style={styles.postFooterView}>
        <PostFooter post={post} onLike={handleLike} liked={liked} />
        <Likes post={post} />
        <Caption post={post} />
        <CommentSection post={post} />
        <CommentInput onSubmit={handleCommentSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooterView: {
    marginHorizontal: 15,
    marginTop: 10,
  },
});

export default memo(Post);
