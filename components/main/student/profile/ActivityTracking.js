import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  LogBox,
  TouchableOpacityBase,
} from "react-native";
import MentionsTextInput from "react-native-mentions";
import ParsedText from 'react-native-parsed-text';
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function FavDiscussion(props) {
  const [data, setData] = useState("");
  const [keyword, setKeyword] = useState("");
  const [caption, setCaption] = useState("");

  const [animatePress, setAnimatePress] = useState(new Animated.Value(1));

  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }, []);

  const renderSuggestionsRow = ({ item }, hidePanel) => {
    return (
      <TouchableOpacity onPress={() => onSuggestionTap(item.name, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image
              style={{ aspectRatio: 1 / 1, height: 45 }}
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onSuggestionTap = (name, hidePanel) => {
    hidePanel();
    const comment = caption.slice(0, -keyword.length);
    setCaption(comment + "@" + name + " ");
  };

  const xxx = () => {
    console.log(caption)
  };

  const callback = (keyword) => {
    setKeyword(keyword);
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", keyword.substring(1))
      .limit(10)
      .get()
      .then((snapshot) => {
        let result = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setData(result);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ justifyContent:"flex-end", flex: 1 }}>
      <View style={{justifyContent:"flex-start"}}>
      <Text>jhbuyg</Text>
      </View>

      <MentionsTextInput
        textInputStyle={{
          borderColor: "#ebebeb",
          borderWidth: 1,
          padding: 5,
          fontSize: 15,
          width: "100%",
        }}
        suggestionsPanelStyle={{ backgroundColor: "rgba(100,100,100,0.1)" }}
        loadingComponent={() => (
          <View
            style={{
              flex: 1,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        textInputMinHeight={30}
        textInputMaxHeight={80}
        trigger={"@"}
        triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
        value={caption}
        onChangeText={setCaption}
        triggerCallback={callback.bind(this)}
        renderSuggestionsRow={renderSuggestionsRow.bind(this)}
        suggestionsData={data}
        keyExtractor={(item, index) => item.name}
        suggestionRowHeight={45}
        horizontal={false}
        MaxVisibleRowCount={3}
      />

      <TouchableOpacity onPress={()=>xxx()}>
        <Text>see result</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "center",
    paddingTop: 100,
  },
  suggestionsRowContainer: {
    flexDirection: "row",
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#54c19c",
  },
  usernameInitials: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
});