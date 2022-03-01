import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
require("firebase/firestore");
function EditRoom(props) {
  const { currentUser, comments, posts } = props;
  const [nameToBeEditted, setNameToBeEditted] = useState(
    firebase.auth().currentUser.uid
  );
  const [comment, setComment] = useState(comments);
  const [cntbu, setCntbu] = useState([]);
  const [discussion, setDiscussion] = useState(posts);
  const [dntbc, setDntbc] = useState([]);
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cu, setCu] = useState(currentUser);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/p2pl-bcbbd.appspot.com/o/default%2FnewProfile.png?alt=media&token=b2e22482-506a-4e78-ae2e-e38c83ee7c27";

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        setUserId(snapshot.data().name);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("Discussion")
        .get()
        .then((snapshot) => {
          let discussion = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          //discussion
         
          const newArray2 = discussion.filter(
            (e) => e.userId === nameToBeEditted
          );
          
          const secArray2 = newArray2.map((element) => element.id);
          //console.log(secArray2);
          setDntbc(secArray2);
        });

      firebase
        .firestore()
        .collection("Comment")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let comment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const newArray = comment.filter(
            (element) => element.userId === nameToBeEditted
          );
          const secArray = newArray.map((element) => element.id);
          setCntbu(secArray);
        });

      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          setCu(snapshot.data());
        });
    }, [])
  );

  const Save = async () => {
    setModalVisible(!isModalVisible);
    if (imageChanged) {
      const uri = image;
      const childPath = `profile/${firebase.auth().currentUser.uid}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          firebase
            .firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
              name: userId,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              image: snapshot,
            })
            .then(() => {
              yyy(userId, snapshot);
            });
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .update({
          name: userId,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          xxx(userId);
        });
    }
  };

  const xxx = (newName) => {
    for (var i = 0; i < cntbu.length; i++) {
      firebase
        .firestore()
        .collection("Comment")
        .doc(cntbu[i])
        .update({
          postedBy: newName,
        })
        .then(() => {
          console.log("updated");
        });
    }

    for (var i = 0; i < dntbc.length; i++) {
      firebase
        .firestore()
        .collection("Discussion")
        .doc(dntbc[i])
        .update({
          postedBy: newName,
        })
        .then(() => {});
      //console.log(24);
    }
    setModalVisible(!isModalVisible);
    props.navigation.goBack();
  };

  const yyy = (newName, image) => {
    for (var i = 0; i < cntbu.length; i++) {
      firebase
        .firestore()
        .collection("Comment")
        .doc(cntbu[i])
        .update({
          postedBy: newName,
          image: image,
        })
        .then(() => {});
    }
    for (var i = 0; i < dntbc.length; i++) {
      firebase
        .firestore()
        .collection("Discussion")
        .doc(dntbc[i])
        .update({
          postedBy: newName,
          image: image,
        })
        .then(() => {});
    }
    setModalVisible(!isModalVisible);
    props.navigation.goBack();
  };

  // const Save = () => {
  //       firebase.firestore()
  //         .collection("users")
  //         .doc(props.route.params.uid)
  //         .update({
  //             name:userId,
  //             creation: firebase.firestore.FieldValue.serverTimestamp  ()
  //         }).then(()=> {
  //             props.navigation.goBack()
  //             console.log("save")
  //         })
  // }

  const pickImage = async () => {
    if (true) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setImageChanged(true);
      }
    }
  };

  const removePicture = () => {
    setModalVisible(!isModalVisible);
    firebase
      .firestore()
      .collection("users")
      .doc(nameToBeEditted)
      .update({
        image: defaultImage,
      })
      .then(() => {
        //setModalVisible(!isModalVisible);
        yyy(cu.name, defaultImage )
      });
  };

  return (
    <View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>User Id</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={(userId) => setUserId(userId)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Profile Picture</Text>
          <View style={{ flexDirection: "row" }}>
            {cu.image != defaultImage ? (
              <TouchableOpacity
                style={styles.logout}
                onPress={() => removePicture()}
              >
                <Text style={styles.Ltext}>Remove Existing Image</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.logout} onPress={() => pickImage()}>
              <Text style={styles.Ltext}>New Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        {image && (
          <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />
        )}
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.logout} onPress={() => Save()}>
          <Text style={styles.Ltext}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={{ justifyContent: "center", flex: 1 }}>
          <ActivityIndicator size="large" color="#E3562A" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 20,
    marginVertical: 8,
  },
  input: {
    fontFamily: "Poppins",
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },

  logout: {
    width: 160,
    height: 40,
    marginTop: 5,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(EditRoom);
