import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../components/Search/SearchBox";
import SearchContent from "../components/Search/SearchContent";

const Search = () => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            position: "relative",
          }}
        >
          <SearchBox onTextChange={handleTextChange} />
          <SearchContent searchText={searchText} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Search;
