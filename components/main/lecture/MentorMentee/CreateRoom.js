import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import { Icon } from "react-native-elements";
import { ListItem, BottomSheet } from "react-native-elements";

function CreateRoom(props) {
  const { currentUser } = props;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const userId = firebase.auth().currentUser.uid;

  useFocusEffect(
    React.useCallback(() => {
      setIsVisible(false);
    }, [])
  );

  const toggleVisibility = () => {
    if (!title.trim()) {
      return Alert.alert("Invalid title input", "Title input cannot be empty", [
        {
          text: "Retry",
        },
      ]);
    }
    if (!desc.trim()) {
      return Alert.alert("Invalid description input", "Description input cannot be empty", [
        {
          text: "Retry",
        },
      ]);
    }

    props.navigation.navigate("ViewRequestCreateRoom",{title, desc})
  };

  const createRoom = () => {
    firebase
      .firestore()
      .collection("DiscussionRoom")
      .add({
        title: title,
        description: desc,
        admin: [],
        members: [],
        createdBy: currentUser.name,
        createrId: userId,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.navigate("Room");
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#140F38' }}>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Discussion Room Title : </Text>
          <TextInput
            placeholder="Room title"
            autoCapitalize="sentences"
            style={styles.input}
            multiline={true}
            value={title}
            onChangeText={(title) => setTitle(title)}
          />
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description : </Text>
          <TextInput
            placeholder="Description"
            autoCapitalize="sentences"
            style={styles.input}
            multiline={true}
            value={desc}
            onChangeText={(desc) => setDesc(desc)}
          />
        </View>
      </View>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.logout}
          onPress={() => toggleVisibility()}
        >
          <View style={{ flexDirection: "row" }}>
            <Icon
              name="person-add-outline"
              type="ionicon"
              size={20}
              color="#fff"
            />
            <Text style={styles.Ltext}>Add Members</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 20,
    marginVertical: 8,
    color: '#fff',
  },

  label2: {
    fontFamily: "Poppins",
    fontSize: 16,
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
  },

  input: {
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
    fontSize: 15,
  },

  logout: {
    width: 160,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingLeft: 10,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(CreateRoom);
