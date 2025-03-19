import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../../hooks/FBPost";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../App";

interface PostHeaderProps {
  user?: User;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user }) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "FriendProfile">>();

  if (!user) {
    return null;
  }

  const { accountName, uid, name, profileImage, bio } = user;

  return (
    <View style={styles.postHeader}>
      <TouchableOpacity
        style={styles.posts}
        onPress={() =>
          navigation.navigate("FriendProfile", {
            uid,
            accountName,
            name,
            profileImage,
            bio,
          })
        }
      >
        <Image source={{ uri: profileImage as string }} style={styles.story} />
        <Text style={styles.postsText}>{accountName}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <View>
          <Feather name="more-horizontal" size={18} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 7,
    marginLeft: 2,
  },
  posts: {
    flexDirection: "row",
    alignItems: "center",
  },
  postsText: {
    marginLeft: 10,
    fontWeight: "700",
  },
  story: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderColor: "#684551",
  },
  dots: {
    fontWeight: "900",
    marginRight: 7,
  },
});

export default PostHeader;
