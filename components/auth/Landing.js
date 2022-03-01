import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ListItem, BottomSheet } from "react-native-elements";
export default function Landing({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsVisible(false);
    }, [])
  );

  const list = [
    {
      title: "Register as Student",
      onPress: () => navigation.navigate("Register"),
    },
    {
      title: "Register as Lecture",
      onPress: () => navigation.navigate("LectureRegister"),
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];


  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../../assets/Logo.png")} />
      <View>
        <Text style={styles.title}>Peer to Peer Learning Platform</Text>
      </View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsVisible(true)}
        >
          <Text style={styles.text}>REGISTER</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>LOGIN</Text>
      </TouchableOpacity>

      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },

  button: {
    alignItems: "center",
    justifyContent:'center',
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.15,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  img: {
    width: 147,
    height: 184,
  },
});
