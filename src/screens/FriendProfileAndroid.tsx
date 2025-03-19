import React, { useEffect, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FriendProfileHeaderAndroid from "../components/Friend/FriendHeaderAndroid";
import FriendNavBar from "../components/Friend/FriendNavBar";
import ProfilePost from "../components/Profile/profilePost";
import useFriendProfile from "../hooks/FBUserQuery";
import useFormatData from "../hooks/formatData";

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
  post_id: string;
}

const FriendProfileAndroid = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { uid, accountName, name, profileImage, bio } = route.params;
  const { followerCount, followingCount, posts, currentUser, fetchData } =
    useFriendProfile(uid);
  const [flatListKey, setFlatListKey] = useState("list1");
  const [activeButton, setActiveButton] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const formatData = useFormatData();

  const handleButtonPress = (buttonNumber: any) => {
    setActiveButton(buttonNumber);
    setFlatListKey(`list${buttonNumber}`);
  };

  const refreshParent = () => {
    fetchData();
  };

  useEffect(() => {
    const refreshData = navigation.addListener("focus", () => {
      fetchData();
    });

    return refreshData;
  }, [fetchData, navigation]);

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

  const renderHeader = () => (
    <FriendProfileHeaderAndroid
      navigation={navigation}
      uid={uid}
      accountName={accountName}
      name={name}
      bio={bio}
      profileImage={profileImage}
      post={posts.filter((post) => post.authorUID !== undefined).length}
      followerCount={followerCount}
      followingCount={followingCount}
      currentUser={currentUser ?? ""}
      onButtonPress={handleButtonPress}
      buttonActive={activeButton}
      refreshParent={refreshParent}
    />
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

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <FriendNavBar accountName={accountName} />
      {renderFlatList()}
    </SafeAreaProvider>
  );
};

export default FriendProfileAndroid;
