import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";

interface SearchBoxProps {
  onTextChange: (text: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onTextChange }) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onTextChange(text);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingVertical: 10,
        position: "relative",
      }}
    >
      <Ionic
        name="search"
        style={{
          fontSize: 18,
          opacity: 0.7,
          position: "absolute",
          zIndex: 1,
          left: 25,
        }}
      />

      <TextInput
        placeholder="Search"
        autoCapitalize="none"
        placeholderTextColor={"#909090"}
        style={{
          width: "94%",
          height: 35,
          backgroundColor: "#EBEBEB",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          padding: 4,
          paddingLeft: 40,
        }}
        value={searchText}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

export default SearchBox;
