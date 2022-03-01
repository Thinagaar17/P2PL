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
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";


function Room(props) {

  const [data, setData] = useState(0);
  const { discussionroom } = props;
  const [post, setPost] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("DiscussionRoom")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const newArray = posts.filter((element) => element.createrId === userId);
          setPost(newArray)
        });
    }, [])
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection("DiscussionRoom")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const newArray = posts.filter((element) => element.createrId === userId);
				setPost(newArray)
        setData(999)
      });
  }, [data]);

  const renderItem = (data) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() =>
            props.navigation.navigate("View Room", {
              roomId: data.item.id,
            })
          }
        >
          <Text numberOfLines={2} style={styles.title}>
            {data.item.title}
          </Text>
          <Text style={styles.faculty}>{data.item.description}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const closeRow = (rowKey) => {
    props.navigation.navigate("GroupDetail", {
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
           firebase.firestore().collection("DiscussionRoom").doc(x).delete();
           setData(1)
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ],

    );

  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Info</Text>
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
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#140F38", flex:1, paddingVertical:10  }}>
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
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    //16
    borderRadius: Dimensions.get("window").width / 24.5,
    elevation: 5,
    backgroundColor: "#003565",
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get("window").width * 0.95,
  },

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
    backgroundColor: "#140F38",
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

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  title: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "PoppinsSemiBold",
    justifyContent: "space-between",
    alignItems: "flex-start",
    lineHeight: 30,
  },
});

const mapStateToProps = (store) => ({
  discussionroom: store.userState.discussionroom,
});

export default connect(mapStateToProps, null)(Room);
