import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface ProfileBodyProps {
  uid: string;
  name: string;
  accountName: string;
  bio: string;
  profileImage: ImageSourcePropType;
  post: number;
  followers: number;
  following: number;
}

export const ProfileBody = ({
  uid,
  name,
  accountName,
  bio,
  profileImage,
  post,
  followers,
  following,
}: ProfileBodyProps) => {

  
  const navigation = useNavigation<any>();
  return (
    <View pointerEvents="box-none">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: 20,
        }}
        pointerEvents="box-none"
      >
        <View
          style={{
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={profileImage}
            style={{
              resizeMode: "cover",
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{post}</Text>
          <Text>게시물</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push("Follower", {
              uid: uid,
            })
          }
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {followers}
            </Text>
            <Text>팔로워</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.push("Following", {
              uid: uid,
            })
          }
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {following}
            </Text>
            <Text>팔로잉</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View pointerEvents="none">
        <Text
          style={{
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            paddingBottom: 5,
          }}
        >
          {bio
            ? bio.split("\n").map((line, index) => (
                <Text key={index}>
                  {line}
                  {"\n"}
                </Text>
              ))
            : null}
        </Text>
      </View>
    </View>
  );
};

//If id is 0 -> My Profile
//If id is 1 -> Other Profile
export const ProfileButtons = ({
  id,
  uid,
  name,
  accountName,
  bio,
  profileImage,
  onFollowChange,
}: {
  id: number;
  uid: string;
  name: string;
  accountName: string;
  bio: string;
  profileImage: ImageSourcePropType;
  onFollowChange?: () => void;
}) => {
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const currentUseruid = auth.currentUser?.uid;

  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const db = getFirestore();
    const followCollectionRef = collection(db, "follower-following-list");
    const followDocRef = doc(followCollectionRef, currentUseruid);
    const followDocSnapshot = await getDoc(followDocRef);

    if (followDocSnapshot.exists()) {
      const followData = followDocSnapshot.data();
      setFollow(followData.following.includes(uid));
    }
    setLoading(false);
  }, [currentUseruid, uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const refreshData = navigation.addListener("focus", () => {
      fetchData();
    });

    return refreshData;
  }, [fetchData, navigation]);

  const handleFollow = async () => {
    setLoading(true);
    const db = getFirestore();
    const followCollectionRef = collection(db, "follower-following-list");
    const followDocRef = doc(followCollectionRef, currentUseruid);
    const followingDocRef = doc(followCollectionRef, uid);

    if (follow) {
      await updateDoc(followDocRef, {
        following: arrayRemove(uid),
      });
      await updateDoc(followingDocRef, {
        follower: arrayRemove(currentUseruid),
      });
    } else {
      await updateDoc(followDocRef, {
        following: arrayUnion(uid),
      });
      await updateDoc(followingDocRef, {
        follower: arrayUnion(currentUseruid),
      });
    }
    setFollow(!follow);
    setLoading(false);
    if (onFollowChange) {
      onFollowChange();
    }
  };

  return (
    <>
      {id === 0 ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingVertical: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.push("EditProfile", {
                name: name,
                accountName: accountName,
                bio: bio,
                profileImage: profileImage,
              })
            }
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                height: 35,
                borderRadius: 5,
                borderColor: "transparent",
                backgroundColor: "#f2f2f2",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: 1,
                  opacity: 0.8,
                }}
              >
                프로필 수정
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => handleFollow()}
            style={{ width: "42%" }}
          >
            <View
              style={{
                width: "100%",
                height: 35,
                borderRadius: 5,
                backgroundColor: follow ? undefined : "#3493D9",
                borderWidth: follow ? 1 : 0,
                borderColor: "#DEDEDE",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: follow ? "black" : "white" }}>
                {follow ? "팔로잉" : "팔로우"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.push("Message", {
                uid: uid,
              })
            }
            style={{ width: "42%" }}
          >
            <View
              style={{
                width: "100%",
                height: 35,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#DEDEDE",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Message</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: "10%",
              height: 35,
              borderWidth: 1,
              borderColor: "#DEDEDE",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Feather
              name="chevron-down"
              style={{ fontSize: 20, color: "black" }}
            />
          </View>
        </View>
      )}
    </>
  );
};
