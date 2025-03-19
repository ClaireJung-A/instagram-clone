import React from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import { ProfileBody, ProfileButtons } from "../Profile/profileBody";

function isValidUri(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch (e) {
    return false;
  }
}

interface FriendProfileHeaderProps {
  navigation: any;
  uid: string;
  accountName: string;
  name: string;
  bio: string;
  profileImage: any;
  post: number;
  followerCount: number;
  followingCount: number;
  currentUser: string;
  onButtonPress: (buttonName: number) => void;
  buttonActive: number;
  refreshParent: () => void;
}

export const FriendProfileHeaderAndroid: React.FC<FriendProfileHeaderProps> = ({
  uid,
  accountName,
  name,
  bio,
  profileImage,
  post,
  followerCount,
  followingCount,
  currentUser,
  onButtonPress,
  buttonActive,
  refreshParent,
}) => {
  return (
    <SafeAreaView style={{ backgroundColor: "white" }} pointerEvents="box-none">
      <View
        style={{
          width: "100%",
        }}
        pointerEvents="box-none"
      >
        <View style={{ paddingHorizontal: 10 }} pointerEvents="box-none">
          <ProfileBody
            uid={uid}
            accountName=""
            name={name}
            bio={bio}
            profileImage={
              profileImage && isValidUri(profileImage)
                ? { uri: profileImage }
                : require("../../images/default-pic.png")
            }
            post={post}
            followers={followerCount}
            following={followingCount}
          />
          <ProfileButtons
            id={currentUser === uid ? 0 : 1}
            uid={uid}
            name={name}
            accountName={accountName}
            bio={bio}
            profileImage={
              profileImage && isValidUri(profileImage)
                ? { uri: profileImage }
                : require("../../images/default-pic.png")
            }
            onFollowChange={refreshParent}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => onButtonPress(1)}
            style={{ alignItems: "center" }}
          >
            <Ionic
              name={"ios-apps-sharp"}
              color={buttonActive === 1 ? "black" : "grey"}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onButtonPress(2)}
            style={{ alignItems: "center" }}
          >
            <Ionic
              name={"ios-play-circle"}
              color={buttonActive === 2 ? "black" : "grey"}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onButtonPress(3)}
            style={{ alignItems: "center" }}
          >
            <Ionic
              name={"ios-book"}
              color={buttonActive === 3 ? "black" : "grey"}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onButtonPress(4)}
            style={{ alignItems: "center" }}
          >
            <Ionic
              name={"ios-color-wand"}
              color={buttonActive === 4 ? "black" : "grey"}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onButtonPress(5)}
            style={{ alignItems: "center" }}
          >
            <Ionic
              name={"ios-person"}
              color={buttonActive === 5 ? "black" : "grey"}
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FriendProfileHeaderAndroid;
