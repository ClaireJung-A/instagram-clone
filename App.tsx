import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import Ionic from "react-native-vector-icons/Ionicons";
import MaterialCommuniuty from "react-native-vector-icons/MaterialCommunityIcons";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import ComingSoon from "./src/screens/ComingSoon";
import EditProfile from "./src/screens/EditProfile";
import Follower from "./src/screens/Follower";
import Following from "./src/screens/Following";
import FriendProfile from "./src/screens/FriendProfile";
import HomeScreen from "./src/screens/HomeScreen";
import Login from "./src/screens/Login";
import Message from "./src/screens/Message";
import NewPostScreen from "./src/screens/NewPostScreen";
import Profile from "./src/screens/Profile";
import ProfileList from "./src/screens/ProfileList";
import Register from "./src/screens/Register";
import Search from "./src/screens/Search";
import PostComment from "./src/screens/PostComment";
import { Post as PostType } from "./src/screens/HomeScreen";
import { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
  HomeMain: {};
  PostComment: { postId: string };
  FriendProfile: {
    uid: string;
    accountName: string;
    name: string;
    profileImage: ImageSourcePropType;
    bio: string;
  };
  Following: { userId: string };
  Follower: { userId: string };
  NewPostScreen: undefined;
  ProfileList: { user_id: string; post_id: string };
  ProfileMain: undefined;
  Browse: undefined;
  Login: undefined;
  LoggedIn: undefined;
  Register: undefined;
  Message: { uid: string };
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const screenOptions = {
  headerShown: false,
};

function HomeTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostComment"
        component={PostComment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Follower"
        component={Follower}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Following"
        component={Following}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileList"
        component={ProfileList}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Follower"
        component={Follower}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Following"
        component={Following}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileList"
        component={ProfileList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostComment"
        component={PostComment}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function SearchTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Browse"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Follower"
        component={Follower}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Following"
        component={Following}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileList"
        component={ProfileList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostComment"
        component={PostComment}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AfterLogin() {
  return (
    <SafeAreaProvider>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={HomeTabNavigator}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Foundation name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchTabNavigator}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Create Post"
          component={NewPostScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommuniuty name="plus-box" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Reels"
          component={ComingSoon}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Foundation name="play-video" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileTabNavigator}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Ionic name="ios-person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        {user ? (
          <>
            <Stack.Screen name="LoggedIn" component={AfterLogin} />
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
