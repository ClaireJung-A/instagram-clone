import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionic from "react-native-vector-icons/Ionicons";
import { uploadImageAsync } from "../hooks/FBImage";
import {
  useUpdateAccountName,
  useUpdateBio,
  useUpdateName,
  useUpdateProfileImage,
} from "../hooks/useUpdateInfo";

const EditProfile = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const { name, accountName, bio, profileImage } = route.params;

  //accountname
  const [userNameInput, setUserNameInput] = useState("");
  const [newUserName, setNewUserName] = useState(accountName);
  //name
  const [nameInput, setNewNameInput] = useState("");
  const [newName, setNewName] = useState(name);
  //bio
  const [bioInput, setBioInput] = useState("");
  const [newBio, setNewBio] = useState(bio);

  //image
  const [fbImageLocation, setFbImageLocation] = useState("");
  const [imageInput, setImageInput] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      setImageInput(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await setNewUserName(userNameInput);
    await setNewName(nameInput);
    await setNewBio(bioInput);

    uploadImageAsync(imageInput)
      .then((location) => {
        setFbImageLocation(location ?? "");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error uploading image:", error);
      });
  };

  useUpdateAccountName(uid ?? "", newUserName);
  useUpdateName(uid ?? "", newName);
  useUpdateBio(uid ?? "", newBio);
  useUpdateProfileImage(uid ?? "", fbImageLocation);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionic name="close-outline" style={{ fontSize: 35 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>프로필 편집</Text>
          <TouchableOpacity onPress={() => handleSave()}>
            <Text style={{ color: "#3493D9", fontSize: 17, paddingRight: 10 }}>
              save
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20, alignItems: "center" }}>
          {imageInput && (
            <Image
              source={{ uri: imageInput }}
              style={{ width: 80, height: 80, borderRadius: 100 }}
            />
          )}
          {!imageInput && (
            <Image
              source={profileImage}
              style={{ width: 80, height: 80, borderRadius: 100 }}
            />
          )}
          <TouchableOpacity onPress={() => pickImage()}>
            <Text
              style={{
                color: "#3493D9",
                paddingTop: 10,
              }}
            >
              Change profile photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10 }}>
          <View>
            <Text
              style={{
                opacity: 0.5,
              }}
            >
              Name
            </Text>
            <TextInput
              placeholder="Name"
              defaultValue={name}
              autoCapitalize="none"
              onChangeText={(text) => setNewNameInput(text)}
              style={{
                fontSize: 16,
                borderBottomWidth: 1,
                borderColor: "#CDCDCD",
              }}
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text
              style={{
                opacity: 0.5,
              }}
            >
              Username
            </Text>
            <TextInput
              placeholder="Account Name"
              defaultValue={accountName}
              autoCapitalize="none"
              onChangeText={(text) => setUserNameInput(text)}
              style={{
                fontSize: 16,
                borderBottomWidth: 1,
                borderColor: "#CDCDCD",
              }}
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <TextInput
              placeholder="Website"
              style={{
                fontSize: 16,
                borderBottomWidth: 1,
                borderColor: "#CDCDCD",
              }}
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <TextInput
              placeholder="Bio"
              defaultValue={newBio}
              onChangeText={(text) => setBioInput(text)}
              style={{
                fontSize: 16,
                borderBottomWidth: 1,
                borderColor: "#CDCDCD",
              }}
            />
          </View>
        </View>
        <View>
          <Text
            style={{
              marginVertical: 10,
              padding: 10,
              color: "#3493D9",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#EFEFEF",
            }}
          >
            Switch to Professional account
          </Text>
          <Text
            style={{
              marginVertical: 10,
              padding: 10,
              color: "#3493D9",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#EFEFEF",
            }}
          >
            Personal information setting
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
