import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../FirebaseConfig";

type UploadImageAsync = (uri: string) => Promise<string | void>;

export const uploadImageAsync: UploadImageAsync = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profilePic/pic-${Date.now()}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};


export const uploadPostImageAsync: UploadImageAsync = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `postPic/pic-${Date.now()}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
