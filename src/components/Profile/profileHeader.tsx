import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { ProfileBody, ProfileButtons } from "./profileBody";

function isValidUri(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch (e) {
    return false;
  }
}

type ProfileHeaderProps = {
  uid?: string;
  accountName: string;
  name?: string;
  bio?: string;
  pic?: string;
  post: number;
  followerCount: number;
  followingCount: number;
  hasFetchedData: boolean;
};

export const Header: React.FC<ProfileHeaderProps> = ({
  uid,
  accountName,
  name,
  bio,
  pic,
  post,
  followerCount,
  followingCount,
  hasFetchedData,
}) => {
  let circles = [];
  let numCircles = 5;

  for (let index = 0; index < numCircles; index++) {
    circles.push(
      <View key={index} pointerEvents="none">
        {index === 0 ? (
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
                borderWidth: 1,
                opacity: 0.7,
                marginHorizontal: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="plus" style={{ fontSize: 40, color: "black" }} />
            </View>
            <View style={{ paddingTop: 5 }}>
              <Text style={{ fontSize: 12 }}>새로 만들기</Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              backgroundColor: "black",
              opacity: 0.1,
              marginHorizontal: 5,
            }}
          ></View>
        )}
      </View>
    );
  }

  return hasFetchedData ? (
    <SafeAreaView style={{ backgroundColor: "white" }} pointerEvents="box-none">
      <View pointerEvents="box-none">
        <ProfileBody
          uid={uid ?? ""}
          name={name ? name : accountName}
          accountName={accountName}
          bio={bio ?? ""}
          profileImage={
            pic && isValidUri(pic)
              ? { uri: pic }
              : require("../../images/default-pic.png")
          }
          post={post}
          followers={followerCount}
          following={followingCount}
        />

        <ProfileButtons
          id={0}
          uid={uid ?? ""}
          name={name ? name : accountName}
          accountName={accountName}
          bio={bio ?? ""}
          profileImage={
            pic && isValidUri(pic)
              ? { uri: pic }
              : require("../../images/default-pic.png")
          }
        />
      </View>

      <View pointerEvents="box-none">
        <View pointerEvents="none">
          <Text
            style={{
              padding: 10,
              paddingTop: 2,
              letterSpacing: 1,
              fontSize: 14,
            }}
          >
            스토리 하이라이트
          </Text>
          <Text
            style={{
              paddingHorizontal: 10,
              paddingVertical: 2,
              letterSpacing: 1,
              fontSize: 14,
            }}
          >
            좋아하는 스토리를 프로필에 보관하세요
          </Text>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 5, paddingHorizontal: 10 }}
          pointerEvents="box-none"
        >
          {circles}
        </ScrollView>
      </View>
    </SafeAreaView>
  ) : null;
};
