import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";

const Header = ({
  navigation,
  accountName,
}: {
  navigation: any;
  accountName: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingLeft: 10 }}
      >
        <Ionic name="chevron-back" style={{ fontSize: 20, color: "black" }} />
      </TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            color: "gray",
            paddingBottom: 5,
          }}
        >
          {accountName}
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            color: "black",
          }}
        >
          게시물
        </Text>
      </View>
      <View style={{ width: 30, height: 20, paddingRight: 10 }} />
    </View>
  );
};

export default Header;
