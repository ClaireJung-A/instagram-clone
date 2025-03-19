import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../FirebaseConfig";
import { ImageSourcePropType } from "react-native";

export function useAllUsers(currentUserId: string) {
  const q = query(collection(db, "users"), where("uid", "!=", currentUserId));
  const [users, isLoading, error] = useCollectionData(q);
  if (error) throw error;
  return { users, isLoading };
}

export function useAllFollowers(uid: string) {
  const [followers, setFollowers] = useState([]);

  const fetchData = useCallback(async () => {
    const db = getFirestore();
    const followCollectionRef = collection(db, "follower-following-list");
    const followDocRef = doc(followCollectionRef, uid);
    const followDocSnapshot = await getDoc(followDocRef);

    if (followDocSnapshot.exists()) {
      const followData = followDocSnapshot.data();
      setFollowers(followData.follower);
    }
  }, [uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const usersCollectionRef = collection(db, "users");

  const q =
    followers.length > 0
      ? query(usersCollectionRef, where("uid", "in", followers))
      : query(usersCollectionRef, where("uid", "in", ["nonExistingId"]));

  const [users, isLoading, error] = useCollectionData(q);
  if (error) throw error;
  return { users, isLoading };
}

export function useAllFollowing(uid: string) {
  const [following, setFollowing] = useState([]);

  const fetchData = useCallback(async () => {
    const db = getFirestore();
    const followCollectionRef = collection(db, "follower-following-list");
    const followDocRef = doc(followCollectionRef, uid);
    const followDocSnapshot = await getDoc(followDocRef);

    if (followDocSnapshot.exists()) {
      const followData = followDocSnapshot.data();
      setFollowing(followData.following);
    }
  }, [uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const usersCollectionRef = collection(db, "users");

  const q =
    following.length > 0
      ? query(usersCollectionRef, where("uid", "in", following))
      : query(usersCollectionRef, where("uid", "in", ["nonExistingId"]));

  const [users, isLoading, error] = useCollectionData(q);
  if (error) throw error;
  return { users, isLoading };
}

export interface Post {
  imageUrl: ImageSourcePropType[];
  authorUID: string;
  createdAt: Date;
  post_id: string;
}

export const useFetchProfileData = () => {
  const [accountName, setAccountName] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const fetchData = useCallback(async () => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    const followCollectionRef = collection(db, "follower-following-list");
    const usersDocRef = doc(usersCollectionRef, uid);
    const followDocRef = doc(followCollectionRef, uid);
    const usersDocSnapshot = await getDoc(usersDocRef);
    const followDocSnapshot = await getDoc(followDocRef);
    const postsCollectionRef = collection(db, "posts");
    const postQuery = query(postsCollectionRef, where("user_id", "==", uid));
    const postsQuerySnapshot = await getDocs(postQuery);
    let fetchedPosts: Post[] = [];

    postsQuerySnapshot.forEach((doc) => {
      const postData = doc.data();
      fetchedPosts.push({
        imageUrl: postData.imageUrl,
        authorUID: postData.user_id,
        createdAt: new Date(postData.createdAt),
        post_id: postData.post_id,
      });
    });
    fetchedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setPosts(fetchedPosts);

    if (usersDocSnapshot.exists() && followDocSnapshot.exists()) {
      const userData = usersDocSnapshot.data();
      setAccountName(userData.accountName);
      setPic(userData.profileImage);
      setBio(userData.bio);
      setName(userData.name);

      const followData = followDocSnapshot.data();
      if (followData.follower.length !== undefined) {
        setFollowerCount(followData.follower.length);
      }
      if (followData.following.length !== undefined) {
        setFollowingCount(followData.following.length);
      }
    }
    setHasFetchedData(true);
  }, [uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    accountName,
    name,
    pic,
    bio,
    posts,
    followerCount,
    followingCount,
    hasFetchedData,
    fetchData,
  };
};

const useFriendProfile = (uid: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser?.uid;
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchData = useCallback(async () => {
    const db = getFirestore();
    const followCollectionRef = collection(db, "follower-following-list");
    const followDocRef = doc(followCollectionRef, uid);
    const followDocSnapshot = await getDoc(followDocRef);
    const postsCollectionRef = collection(db, "posts");
    const postQuery = query(postsCollectionRef, where("user_id", "==", uid));
    const postsQuerySnapshot = await getDocs(postQuery);
    let fetchedPosts: Post[] = [];

    postsQuerySnapshot.forEach((doc) => {
      const postData = doc.data();
      fetchedPosts.push({
        imageUrl: postData.imageUrl,
        authorUID: postData.user_id,
        createdAt: new Date(postData.createdAt),
        post_id: postData.post_id,
      });
    });

    fetchedPosts = fetchedPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    setPosts(fetchedPosts);

    if (followDocSnapshot.exists()) {
      const followData = followDocSnapshot.data();
      if (followData.follower.length !== undefined) {
        setFollowerCount(followData.follower.length);
      }
      if (followData.following.length !== undefined) {
        setFollowingCount(followData.following.length);
      }
    }
  }, [uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { followerCount, followingCount, posts, currentUser, fetchData };
};

export default useFriendProfile;
