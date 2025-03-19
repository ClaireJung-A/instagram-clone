import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";

const Header = ({ navigation }: { navigation: any }) => {
  const handleLogout = async () => {
    try {
      // Sign out the user
      await signOut(FIREBASE_AUTH);

      // Navigate to the Login screen
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            style={styles.logo}
            source={require("../../../src/images/You-Gram.png")}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.push("NewPostScreen")}>
          <View style={styles.icon}>
            <Feather name="plus-square" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.icon}>
            <Feather name="heart" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.icon}>
            <Feather name="send" size={24} color="black" />
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>5</Text>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 15,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: "#FF0025",
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  unreadBadgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
  },
});

export default Header;
