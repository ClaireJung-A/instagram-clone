import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { Image } from "react-native-elements";
import tailwind from "twrnc";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<any>();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={tailwind`flex-1 items-center justify-center bg-slate-50`}>
        <View style={tailwind`p-8 w-full max-w-sm`}>
          <Image
            source={require("../images/You-Gram.png")}
            style={{ width: "100%", height: 80, resizeMode: "contain" }}
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
            <TouchableOpacity onPress={() => navigation.push("Register")}>
              <Text style={tailwind`text-blue-400 font-bold`}>회원가입</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tailwind`h-12 bg-pink-500 rounded-md flex flex-row justify-center items-center px-6`}
            onPress={() => signIn()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={tailwind`flex-1 flex items-center`}>
                <Text style={tailwind`text-white text-base font-medium`}>
                  Login
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
