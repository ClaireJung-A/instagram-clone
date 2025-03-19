import React, { useState } from "react";
import {
  View,
  Image,
  Dimensions,
  ImageSourcePropType,
  FlatList,
  StyleSheet,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Post } from "../../../screens/HomeScreen";
import { PostProps } from "../posts";

const { width } = Dimensions.get("window");

export const PostImage: React.FC<
  PostProps & { onLike: () => void; liked: boolean }
> = ({ post, onLike }) => {
  const windowWidth = Dimensions.get("window").width;
  const [lastPressTime, setLastPressTime] = useState<number>(0);

  const handleDoublePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPressTime;

    if (delta < 300) {
      if (onLike) {
        onLike();
      }
    }

    setLastPressTime(time);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.postView}>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={post.imageUrl}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={handleDoublePress}>
              <Image source={item} style={styles.postImage} />
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  postView: {
    width: "100%",
    height: 450,
  },
  postImage: {
    width: width,
    height: "100%",
  },
});

export default PostImage;
