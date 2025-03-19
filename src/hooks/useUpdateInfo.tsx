import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useUpdateAccountName = (uid: string, newAccountName: string) => {
  const db = getFirestore();
  const [userSnapshot] = useDocumentData(doc(db, "users", uid));

  useEffect(() => {
    if (!newAccountName) return; // Return early if newAccountName is empty or null

    if (userSnapshot) {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, uid);

      updateDoc(docRef, { accountName: newAccountName });
    }
  }, [uid, newAccountName, userSnapshot]);
};

export const useUpdateName = (uid: string, newName: string) => {
  const db = getFirestore();
  const [userSnapshot] = useDocumentData(doc(db, "users", uid));

  useEffect(() => {
    if (!newName) return; // Return early if newName is empty or null

    if (userSnapshot) {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, uid);

      updateDoc(docRef, { name: newName });
    }
  }, [uid, newName, userSnapshot]);
};

export const useUpdateBio = (uid: string, newBio: string) => {
  const db = getFirestore();
  const [userSnapshot] = useDocumentData(doc(db, "users", uid));

  useEffect(() => {
    if (!newBio) return; // Return early if newBio is empty or null

    if (userSnapshot) {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, uid);

      updateDoc(docRef, { bio: newBio });
    }
  }, [uid, newBio, userSnapshot]);
};

export const useUpdateProfileImage = (uid: string, newImage: string) => {
  const db = getFirestore();
  const [userSnapshot] = useDocumentData(doc(db, "users", uid));

  useEffect(() => {
    if (!newImage) return; // Return early if newImage is empty or null

    if (userSnapshot) {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, uid);

      updateDoc(docRef, { profileImage: newImage });
    }
  }, [uid, newImage, userSnapshot]);
};
