import React from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import AddNewPost from "../components/newPost/AddNewPost";

const NewPostScreen = ({ navigation }: { navigation: any }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <AddNewPost />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewPostScreen;
