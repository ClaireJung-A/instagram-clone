import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { USERS, User } from "../../data/users";

const Stories: React.FC = () => {
  return (
    <View style={{ marginBottom: 5, marginTop: 0 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {USERS.map((story: User, index: number) => (
          <View key={index} style={styles.storyView}>
            <Image source={story.image} style={styles.story} />

            <Text style={styles.storyText}>
              {story.user.length > 11
                ? story.user.slice(0, 9).toLowerCase() + "..."
                : story.user.toLowerCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  story: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 18,
    borderColor: "#684551",
  },
  storyText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 3,
  },
  storyView: {
    width: 80,
    alignItems: "center",
  },
});

export default Stories;
