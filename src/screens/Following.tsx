import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"; // Import the Image component
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllFollowing } from "../hooks/FBUserQuery";
import Ionic from "react-native-vector-icons/Ionicons";

const Following = ({ route, navigation }: { route: any; navigation: any }) => {
  const { uid } = route.params;

  const { users, isLoading } = useAllFollowing(uid ?? "");

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionic name="chevron-back" style={{ fontSize: 20, color: "black" }} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingLeft: 10,
          }}
        >
          Following
        </Text>
      </View>
      <ScrollView style={{ margin: 10, height: "100%" }}>
        <View>
          {users?.slice(0, 10).map((data, index) => {
            return (
              <View key={index} style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push("FriendProfile", {
                        uid: data.uid,
                        accountName: data.accountName,
                        name: data.name,
                        profileImage: data.profileImage,
                        bio: data.bio,
                      })
                    }
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      maxWidth: "64%",
                    }}
                  >
                    <Image
                      source={{ uri: data.profileImage }}
                      defaultSource={require("../images/default-pic.png")}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 100,
                        marginRight: 10,
                      }}
                    />
                    <View style={{ alignItems: "flex-start" }}>
                      <View>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                          {data.accountName}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12 }}>{data.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Following;
