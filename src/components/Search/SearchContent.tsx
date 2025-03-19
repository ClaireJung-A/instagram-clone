import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useAllUsers } from "../../hooks/FBUserQuery";

interface SearchContentProps {
  searchText: string;
}

const SearchContent: React.FC<SearchContentProps> = ({ searchText }) => {
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const { users, isLoading } = useAllUsers(uid ?? "");

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const filteredUsers = users?.filter((user) =>
    user.accountName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <FlatList
      style={{ margin: 10 }}
      data={filteredUsers}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => (
        <View key={item.uid} style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={() =>
              navigation.push("FriendProfile", {
                uid: item.uid,
                accountName: item.accountName,
                name: item.name,
                profileImage: item.profileImage,
                bio: item.bio,
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              width: "100%",
            }}
          >
            <Image
              source={{ uri: item.profileImage }}
              defaultSource={require("../../images/default-pic.png")}
              style={{
                width: 45,
                height: 45,
                borderRadius: 100,
                marginRight: 10,
              }}
            />
            <View>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {item.accountName}
              </Text>
              <Text style={{ fontSize: 12 }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default SearchContent;
