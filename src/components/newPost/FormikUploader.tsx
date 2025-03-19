
import React, { useEffect, useState } from 'react';
import { TextInput, Text, View, Button, Image, Alert, StyleSheet, TouchableOpacity, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, limit, query, setDoc, where } from "firebase/firestore";
import { Divider } from 'react-native-elements';
import { db } from '../../../FirebaseConfig';
import { uploadPostImageAsync } from '../../hooks/FBImage';


const PLACEHOLDER_IMG = 'https://via.placeholder.com/150.png';

const NewPost = ({ navigation }: { navigation: any }) => {
  const auth = getAuth();
  const uid = auth.currentUser!.uid;
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState<any>(null);
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      allowsMultipleSelection: true, // allowing multiple selection from gallery!
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map(asset => asset.uri));
    }
  };

  const fetchCurrentLoggedInUser = async () => {
    const db = getFirestore();
    const userQuery = query(
      collection(db, 'users'),
      where('uid', '==', uid),
      limit(1)
    );

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      setCurrentLoggedInUser(userDoc.data());
    }
  };

  const handlePost = async () => {
    if (!caption || selectedImages.length === 0) {
      Alert.alert('Please fill all the fields');
      return;
    }

    // Disable the button to prevent multiple clicks
    setIsPosting(true);

    const imageLocations: string[] = [];
    try {
      for (const image of selectedImages) {
        const uploadResult = await uploadPostImageAsync(image);
        if (uploadResult) {
          imageLocations.push(uploadResult);
        } else {
          throw new Error(`Image upload failed`);
        }
      }
    } catch (error) {
      Alert.alert('Error uploading images:', (error as Error).toString());
      setIsPosting(false);
      return;
    }

    try {
      const postsCollection = collection(db, `posts`);
      const newPostRef = await addDoc(postsCollection, {
        imageUrl: imageLocations,
        user_id: uid,
        caption: caption,
        createdAt: new Date().toISOString(),
        likes_by_users: [],
        comments: [],
      });
  
      const post_id = newPostRef.id;
  
      await setDoc(newPostRef, { post_id: post_id }, { merge: true });
  
      Alert.alert('Post uploaded successfully');
      setSelectedImages([]); // clear the array
      setCaption('');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error adding document:', (error as Error).toString());
    } finally {
      setIsPosting(false); // Enable the button after the post is saved or in case of an error
    }
  };

  useEffect(() => {
    fetchCurrentLoggedInUser();
  }, []);

  return (
    <View>
      <FlatList
        data={selectedImages}
        horizontal
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => {}}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index.toString()}
      />


      <TouchableOpacity onPress={pickImage}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>Pick images</Text>
      </TouchableOpacity>

      <Divider style={styles.divider} />
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          onChangeText={setCaption}
          value={caption}
          placeholder="Write a Caption..."
        />
      </View>
      <TouchableOpacity
        onPress={handlePost}
        disabled={isPosting} // Disable the button when isPosting is true
        style={{
          marginHorizontal: 20,
          backgroundColor: isPosting ? 'gray' : 'blue', // Change the button color when disabled
          borderRadius: 5,
          paddingVertical: 10,
          alignItems: 'center',
          marginTop: 50,
        }}
      >
        <Text style={{ color: 'white', fontSize: 17 }}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  divider: {
    width: 0.2,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  textInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 17,
  },
  textInputContainer: {
    padding: 5,
    borderRadius: 10,
  },
});

export default NewPost;
