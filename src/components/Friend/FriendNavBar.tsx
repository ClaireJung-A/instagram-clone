import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent, ReactNode } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";

export const NAV_HEADER_HEIGHT = 82;
export const NAV_TITLE_HEIGHT = 56;

interface NavBarProps {
  accountName: string;
}

export const FriendNavBar: FunctionComponent<NavBarProps> = ({
  accountName,
}) => {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop }]}>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "92%",
          }}
        >
          <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: "bold" }}>
            {accountName}
          </Text>
          <Feather
            name="more-horizontal"
            style={{ fontSize: 20, color: "black" }}
          />
        </View>
      </View>
    </View>
  );
};

export const NavBarTitle = () => (
  <Text style={styles.title}>This is the title.</Text>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    zIndex: 10,
    paddingHorizontal: 10,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: NAV_TITLE_HEIGHT,
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default FriendNavBar;
