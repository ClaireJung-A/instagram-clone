import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionic from "react-native-vector-icons/Ionicons";

type Message = {
  id: string;
  data: any;
};

const db = getFirestore();

const Message = ({ route, navigation }: { route: any; navigation: any }) => {
  const { uid } = route.params;
  const auth = getAuth();
  const currentUseruid = auth.currentUser?.uid;
  const [input, setInput] = useState("");
  const [recipientAccountName, setRecipientAccountName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientProfileImage, setRecipientProfileImage] = useState(
    "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg"
  );
  const [senderAccountName, setSenderAccountName] = useState("");
  const [senderProfileImage, setSenderProfileImage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchData = useCallback(async () => {
    const usersCollectionRef = collection(db, "users");
    const recipientDocRef = doc(usersCollectionRef, uid);
    const senderDocRef = doc(usersCollectionRef, currentUseruid);
    const recipientDocSnapshot = await getDoc(recipientDocRef);
    const senderDocSnapshot = await getDoc(senderDocRef);

    if (recipientDocSnapshot.exists()) {
      const recipientData = recipientDocSnapshot.data();
      setRecipientAccountName(recipientData.accountName);
      setRecipientProfileImage(recipientData.profileImage);
      setRecipientName(recipientData.name);
    }
    if (senderDocSnapshot.exists()) {
      const senderData = senderDocSnapshot.data();
      setSenderAccountName(senderData.accountName);
      setSenderProfileImage(senderData.profileImage);
    }
    setHasFetchedData(true);
  }, [uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const refreshData = navigation.addListener("focus", () => {
      fetchData();
    });

    return refreshData;
  }, [fetchData, navigation]);

  const sendMessage = async () => {
    if (currentUseruid) {
      await setDoc(doc(collection(db, "messages")), {
        timestamp: serverTimestamp(),
        authorUID: currentUseruid,
        authorName: senderAccountName,
        authorProfileImage: senderProfileImage,
        recipientUID: uid,
        recipientName: recipientAccountName,
        recipientProfileImage: recipientProfileImage,
        message: input,
      });
    }
    setInput("");
  };

  useLayoutEffect(() => {
    const messagesRef = collection(db, "messages");

    const q = query(
      messagesRef,
      where("authorUID", "in", [currentUseruid, uid]),
      where("recipientUID", "in", [currentUseruid, uid]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      scrollViewRef.current?.scrollToEnd({ animated: false });
    });

    return unsubscribe;
  }, [route, currentUseruid, uid]);

  const handleScrollViewLayout = () => {
    // Scroll to bottom when the image first loads
    scrollViewRef.current?.scrollToEnd({ animated: false });
  };

  return hasFetchedData ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionic
                name="chevron-back"
                style={{ fontSize: 35, color: "black" }}
              />
            </TouchableOpacity>

            <View style={styles.header}>
              <Avatar
                size="small"
                rounded
                source={{ uri: recipientProfileImage }}
                containerStyle={{ marginRight: 10 }}
              />
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {recipientAccountName}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{recipientName}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingTop: 10 }}
            onLayout={handleScrollViewLayout}
          >
            {messages.map(({ id, data }) =>
              data.authorUID === currentUseruid ? (
                <View key={id} style={styles.author}>
                  <Text style={styles.authorText}>{data.message}</Text>
                </View>
              ) : (
                <View
                  key={id}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Avatar
                    rounded
                    source={{ uri: recipientProfileImage }}
                    containerStyle={{ margin: 10 }}
                  />
                  <View key={id} style={styles.reciever}>
                    <Text style={styles.recieverText}>{data.message}</Text>
                  </View>
                </View>
              )
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              placeholder="메세지 보내기..."
              style={styles.textInput}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!input}>
              <Text style={{ color: input ? "#2B68E6" : "gray" }}>보내기</Text>
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  ) : (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color="#2B68E6" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { flexDirection: "row" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 10,
    maxWidth: "80%",
    position: "relative",
  },
  recieverText: {},
  author: {
    padding: 15,
    backgroundColor: "#87CEEB",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    maxWidth: "80%",
    position: "relative",
  },
  authorText: {},
});

export default Message;
