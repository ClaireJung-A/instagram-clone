import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Post as PostType } from "../../screens/Profile";

interface PostProps {
  post: PostType;
  uid: string;
}

const ProfilePost: React.FC<PostProps> = ({ post, uid }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push("ProfileList", {
          uid: uid,
          post_id: post.post_id,
        })
      }
    >
      <View>
        <PostImage post={post} uid={uid} />
      </View>
    </TouchableOpacity>
  );
};

const PostImage: React.FC<PostProps> = ({ post, uid }) => {
  return (
    <View style={styles.postView}>
      <Image
        source={{ uri: post.imageUrl[0] as string }}
        style={styles.postImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  posts: {
    flexDirection: "row",
    alignItems: "center",
  },
  postView: {
    width: "100%",
    aspectRatio: 1, // Add this line to set the aspectRatio to 1:1
  },
  postImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover", // Add this line to maintain the aspect ratio of the image
  },
});

export default ProfilePost;
