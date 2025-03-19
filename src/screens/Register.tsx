import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tailwind from "twrnc";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<any>();

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const db = getFirestore();
      const userUid = response.user.uid; // Get the user's UID
      await setDoc(doc(db, "users", userUid), {
        uid: userUid,
        accountName: userName,
        email: email,
        name: "",
        bio: "",
        profileImage:
          "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
      });

      await setDoc(doc(db, "follower-following-list", userUid), {
        uid: userUid,
        follower: [],
        following: [],
      });
    } catch (error: any) {
      alert("Sign Up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={tailwind`flex-1 items-center justify-center bg-slate-50`}>
        <View style={tailwind`p-8 w-full max-w-sm`}>
          <TextInput
            value={userName}
            style={tailwind`w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4`}
            placeholderTextColor="#000"
            placeholder="닉네임"
            autoCapitalize="none"
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            style={tailwind`w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4`}
            placeholderTextColor="#000"
            value={email}
            placeholder="이메일"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={tailwind`w-full bg-white border border-slate-200 rounded-md h-12 px-4`}
            placeholderTextColor="#000"
            value={password}
            placeholder="비밀번호"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />

          <View
            style={tailwind`flex flex-row justify-between items-center my-8`}
          >
            <View style={tailwind`flex-row items-center`}></View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={tailwind`text-blue-400 font-bold`}>
                이미 회원이신가요?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tailwind`h-12 bg-pink-500 rounded-md flex flex-row justify-center items-center px-6`}
            onPress={() => signUp()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={tailwind`flex-1 flex items-center`}>
                <Text style={tailwind`text-white text-base font-medium`}>
                  회원가입
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;
