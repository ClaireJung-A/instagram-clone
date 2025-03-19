import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { NavBar } from "../components/Profile";
import ProfileHeaderAndroid from "../components/Profile/profileHeaderAndroid";
import ProfilePost from "../components/Profile/profilePost";
import { useFetchProfileData } from "../hooks/FBUserQuery";
import useFormatData from "../hooks/formatData";

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
  post_id: string;
}
const ProfileAndroid = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [flatListKey, setFlatListKey] = useState("list1");
  const [activeButton, setActiveButton] = useState<number>(1);
  const formatData = useFormatData();

  const handleButtonPress = (buttonNumber: any) => {
    setActiveButton(buttonNumber);
    setFlatListKey(`list${buttonNumber}`);
  };

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const {
    accountName,
    name,
    pic,
    bio,
    posts,
    followerCount,
    followingCount,
    hasFetchedData,
    fetchData,
  } = useFetchProfileData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const refreshData = navigation.addListener("focus", () => {
      fetchData();
    });

    return refreshData;
  }, [fetchData, navigation]);

  const renderHeader = () => (
    <ProfileHeaderAndroid
      uid={uid}
      accountName={accountName}
      name={name}
      bio={bio}
      pic={pic}
      post={posts.filter((post) => post.authorUID !== undefined).length}
      followerCount={followerCount}
      followingCount={followingCount}
      hasFetchedData={hasFetchedData}
      onButtonPress={handleButtonPress}
      buttonActive={activeButton}
    />
  );

  interface EmptyPostType extends Post {
    key: string;
    empty: true;
  }

  const isEmptyPost = (item: unknown): item is EmptyPostType => {
    return (item as EmptyPostType).empty === true;
  };

  const renderItem = ({ item }: { item: Post | EmptyPostType }) => (
    <View style={{ flex: 1, padding: 1 }}>
      {!isEmptyPost(item) && <ProfilePost post={item} uid={uid ?? ""} />}
    </View>
  );

  const renderFlatList = () => {
    if (activeButton === 1 || activeButton === 5) {
      return (
        <FlatList
          key={flatListKey}
          ListHeaderComponent={renderHeader}
          data={formatData(posts, 3)}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          refreshing={refreshing}
          onRefresh={fetchData}
        />
      );
    } else if (activeButton === 3) {
      return (
        <FlatList
          key={flatListKey}
          ListHeaderComponent={renderHeader}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={fetchData}
        />
      );
    } else {
      return (
        <FlatList
          key={flatListKey}
          ListHeaderComponent={renderHeader}
          data={formatData(posts, 2)}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={fetchData}
        />
      );
    }
  };

  return hasFetchedData ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <NavBar accountName={accountName} />
      {renderFlatList()}
    </SafeAreaView>
  ) : (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color="#808080" />
    </View>
  );
};
export default ProfileAndroid;
