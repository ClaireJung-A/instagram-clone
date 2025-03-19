import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FormikUploader from "./FormikUploader";

const AddNewPost = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FormikUploader navigation={navigation} />
    </View>
  );
};

const Header = ({ navigation }: { navigation: any }) => (
  <SafeAreaView style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Feather name="chevron-left" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerText}>NEW POST</Text>
    <Text></Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    marginRight: 25,
  },
});

export default AddNewPost;
