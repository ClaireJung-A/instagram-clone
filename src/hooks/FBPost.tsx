import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";
import { Post } from "../screens/HomeScreen";

export interface User {
  accountName: string;
  bio: string;
  name: string;
  email: string;
  uid: string;
  profileImage: ImageSourcePropType;
}

//fetch user collection data and returns user object
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    // use onSnapshot to subscribe to the user document
    const unsubscribe = onSnapshot(userRef, (doc) => {
      // this callback will be invoked whenever the user document changes
      if (doc.exists()) {
        const userData = doc.data();
        setUser({
          accountName: userData.accountName,
          bio: userData.bio,
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          profileImage: userData.profileImage,
        });
        setLoading(false);
      }
    });

    // unsubscribe from the document when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  return { user };
};
