import React from "react";
import { SafeAreaView, View } from "react-native";
import { ProfileBody, ProfileButtons } from "../Profile/profileBody";

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
  refreshParent: () => void;
}

export const FriendProfileHeader: React.FC<FriendProfileHeaderProps> = ({
  navigation,
  uid,
  accountName,
  name,
  bio,
  profileImage,
  post,
  followerCount,
  followingCount,
  currentUser,
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
            profileImage={profileImage}
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
            profileImage={profileImage}
            onFollowChange={refreshParent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FriendProfileHeader;
