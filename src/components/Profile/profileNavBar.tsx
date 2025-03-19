import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";

export const NAV_HEADER_HEIGHT = 82;
export const NAV_TITLE_HEIGHT = 56;


interface NavBarProps {
  accountName: string;
}

export const NavBar: FunctionComponent<NavBarProps> = ({ accountName }) => {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View>
        {accountName ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {accountName}
              </Text>
              <Feather
                name="chevron-down"
                style={{
                  fontSize: 20,
                  color: "black",
                  paddingHorizontal: 5,
                  opacity: 0.5,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => navigation.push("NewPostScreen")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name="plus-square"
                    style={{
                      fontSize: 25,
                      color: "black",
                      paddingHorizontal: 15,
                    }}
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>

              <Feather
                name="menu"
                style={{
                  fontSize: 25,
                }}
              />
            </View>
          </View>
        ) : null}
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
