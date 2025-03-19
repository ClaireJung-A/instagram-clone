import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { Divider, Image } from "react-native-elements";
import { Post as PostType } from "../screens/HomeScreen";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

type RootStackParamList = {
  PostComment: { postId: string };
};

const Comments: React.FC<{ post: PostType | null }> = ({ post }) => {
  const [userComments, setUserComments] = useState<
    { accountName: string; comment: string; profileImage: string }[]
  >([]);

  useEffect(() => {
    if (!post || !post.comments || post.comments.length === 0) {
      return;
    }
    const fetchUserComments = async () => {
      const userIds = post.comments.map((comment: any) => comment.user_id);
      const users = collection(db, "users");
      const q = query(users, where("uid", "in", userIds));
      const querySnapshot = await getDocs(q);
      const userCommentsTemp: {
        accountName: string;
        comment: string;
        profileImage: string;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const accountName = userData.accountName;
        const comments = post.comments.filter((c: any) => c.user_id === doc.id);

        comments.forEach((comment: any) => {
          userCommentsTemp.push({
            accountName,
            comment: comment.comment,
            profileImage: userData.profileImage,
          });
        });
      });

      setUserComments(userCommentsTemp);
    };

    fetchUserComments();
  }, [post?.comments]);

  return (
    <ScrollView>
      {userComments.map((userComment, index) => (
        <SafeAreaView key={index} style={styles.commentContainer}>
          <TouchableOpacity style={styles.commentItem}>
            <Image
              source={{ uri: userComment.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.commentContent}>
              <Text style={styles.username}>{userComment.accountName}</Text>
              <Text style={styles.commentText}>{userComment.comment}</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ backgroundColor: "gray" }} />
        </SafeAreaView>
      ))}
    </ScrollView>
  );
};

const PostComment: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "PostComment">>();
  const postId = route.params.postId;

  // This state will hold the post data
  const [post, setPost] = useState<PostType | null>(null);

  // This effect will fetch the post data when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = doc(db, "posts", postId);
      const postSnap = await getDoc(postDoc);
      if (postSnap.exists()) {
        setPost(postSnap.data() as PostType);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <>
      <Header navigation={navigation} />
      <Comments post={post} />
    </>
  );
};

const Header = ({ navigation }: { navigation: any }) => (
  <SafeAreaView style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Feather name="chevron-left" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerText}>COMMENTS</Text>
    <Text></Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  commentContainer: {
    paddingHorizontal: 5,
    marginStart: 10,
    marginEnd: 10,
    paddingTop: 10,
  },
  commentContent: {
    flex: 1,
  },
  container: {
    marginHorizontal: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    paddingTop: 30,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    marginRight: 25,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    marginRight: 5,
  },
  commentText: {
    fontWeight: "400",
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

export default PostComment;
