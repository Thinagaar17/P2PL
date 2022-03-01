import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import { useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import DiscussinCard from "../../component/discussionCard";

function Cd(props) {
  const [data, setData] = useState(0);
  const { posts } = props;
  const [post, setPost] = useState([]);
  const userId = firebase.auth().currentUser.uid;
  const notificationId = props.route.params.notificationId;

  const deleteNotifications = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Notifications")
      .doc(notificationId)
      .delete();

    console.log("deletion done");
  }

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("Discussion")
        .orderBy("creation", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const newArray = posts.filter((element) => element.userId === userId);
          setPost(newArray);
        });
    }, [])
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection("Discussion")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const newArray = posts.filter((element) => element.userId === userId);
        setPost(newArray);
        setData(999);
      });
  }, [data]);

  useEffect(() => {
    if (notificationId) {
      deleteNotifications();
    }
  }, [notificationId]);

  const renderItem = (data) => (
    <DiscussinCard
      title={data.item.title}
      faculty={data.item.faculty}
      onSelect={() =>
        props.navigation.navigate("Created Discussion", {
          did: data.item.id,
        })
      }
    />
  );

  const closeRow = (rowKey) => {
    props.navigation.navigate("Edit Discussion", {
      did: rowKey,
    });
  };

  const deleteRow = (x, y) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this Discussion ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase.firestore().collection("Discussion").doc(x).delete();
            setData(1);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <SwipeListView
        disableRightSwipe
        data={post}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        previewRowKey={"0"}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },

  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    borderRadius: 16,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get("window").width * 0.95,
    borderRadius: 16,
  },

  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },

  backTextWhite: {
    color: "#fff",
  },
});

const mapStateToProps = (store) => ({
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Cd);
