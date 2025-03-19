import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionic from "react-native-vector-icons/Ionicons";
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
  onButtonPress: (buttonName: number) => void;
  buttonActive: number;
};

const ProfileHeaderAndroid: React.FC<ProfileHeaderProps> = ({
  uid,
  accountName,
  name,
  bio,
  pic,
  post,
  followerCount,
  followingCount,
  hasFetchedData,
  onButtonPress,
  buttonActive,
}) => {
  let circles = [];
  let numCircles = 5;

  for (let index = 0; index < numCircles; index++) {
    circles.push(
      <View key={index}>
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
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={{ width: "100%", backgroundColor: "white" }}>
        <View style={{ width: "100%", padding: 10 }}>
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

        <View>
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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ paddingVertical: 5, paddingHorizontal: 10 }}
          >
            {circles}
          </ScrollView>
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
  ) : null;
};

export default ProfileHeaderAndroid;
