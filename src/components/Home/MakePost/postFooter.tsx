import Feather from "react-native-vector-icons/Feather";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useUser } from "../../../hooks/FBPost";
import { useNavigation } from "@react-navigation/native";
import { PostProps } from "../posts";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Post } from "../../../screens/HomeScreen";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostComment"
>;

const currentUserUID = getAuth().currentUser?.uid || "";

// Post Footer -> has the four icon and called the function; like button color changing
export const PostFooter: React.FC<
  PostProps & { onLike: () => void; liked: boolean }
> = ({ post, onLike, liked }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const userHasLiked = () => {
    return post.likes_by_users.includes(currentUserUID);
  };

  liked = userHasLiked();

  return (
    <View style={styles.postFooterContainer}>
      <View style={styles.leftFooterIconsContainer}>
        <TouchableOpacity onPress={onLike}>
          <View>
            <Feather name="heart" size={24} color={liked ? "red" : "black"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PostComment", { postId: post.post_id })
          }
        >
          <View>
            <Feather name="message-circle" size={24} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Feather name="send" size={24} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.rightFooterIconsContainer}>
        <TouchableOpacity>
          <View>
            <Feather name="bookmark" size={24} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Likes -> shows the number of likes
export const Likes: React.FC<PostProps> = ({ post }) => (
  <View style={styles.likesView}>
    <Text style={{ fontWeight: "600" }}>
      {post.likes_by_users.length.toLocaleString("en")} likes
    </Text>
  </View>
);

// Caption -> shows the caption of the post
export const Caption: React.FC<PostProps> = ({ post }) => {
  const userID: string = post.user_id;
  const { user } = useUser(userID);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <View style={{ marginTop: 5 }}>
      <Text>
        <Text style={{ fontWeight: "600", marginRight: 5 }}>
          {user.accountName}
        </Text>
        <Text> {post.caption}</Text>
      </Text>
    </View>
  );
};

export const CommentSection: React.FC<PostProps> = ({ post }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  typeof post.post_id;
  return (
    <View style={{ margin: 3 }}>
      {!!post.comments.length ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PostComment", { postId: post.post_id })
          }
        >
          <Text style={{ marginBottom: -5 }}>
            View{post.comments.length > 1 ? " all" : ""} {post.comments.length}{" "}
            {post.comments.length > 1 ? "comments" : "comment"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text>No comment</Text>
      )}
    </View>
  );
};

// Comment Input -> input the comment calles handleSubmit
export const CommentInput: React.FC<{
  onSubmit: (comment: string) => Promise<void>;
}> = ({ onSubmit }) => {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = () => {
    if (comment.length > 0) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment..."
        onChangeText={setComment}
        value={comment}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={{ fontSize: 14, color: "blue" }}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerIcon: {
    width: 27,
    height: 27,
  },
  postFooterView: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  postFooterContainer: {
    flexDirection: "row",
  },
  leftFooterIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "32%",
    marginLeft: -10,
    margin: 5,
  },
  rightFooterIconsContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  likesView: {
    flexDirection: "row",
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 13,
  },
  submitButton: {
    padding: 10,
  },
});
