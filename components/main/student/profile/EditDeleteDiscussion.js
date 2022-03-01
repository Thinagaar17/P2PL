import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
  Dimensions,
} from "react-native";
//---------reusable component-----------//
import Report from "../../component/report";
import AddComment from "../../component/addComment";
import EditCommentCom from "../../component/editComment";
import CommentCard from "../../component/commentCard";
//----------------------------------------------
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import firebase from "firebase";
import * as Linking from "expo-linking";
import Images from "react-native-scalable-image";
import { timeDifference } from "../../../utils";
import { FAB, ListItem, BottomSheet } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
require("firebase/firestore");

function EditDeleteDiscussion(props) {
  const { currentUser, options, fullComments } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newOption, setOption] = useState(options);
  const [editComment, setEditComment] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [data, setData] = useState(null);
  const [cu, setCu] = useState(currentUser);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const [isVisible, setIsVisible] = useState(false);
  const [temporaryId, setTemporaryId] = useState(null);
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [name, setName] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [docURI, setDocURI] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadMore, setLoadMore] = useState(8);
  const [totalComment, setTotalComment] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [totalCommentIdOfDiscussion, setTotalCommentIdOfDiscussion] =
    useState(0);

  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

  const list = [
    {
      title: "Edit",
      onPress: () => EditComment(temporaryId),
    },
    {
      title: "Delete",
      onPress: () => Delete(temporaryId),
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name="create-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                EditDiscussion();
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="trash-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => DeleteDiscussion()}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

  useEffect(() => {
    const { currentUser, comments } = props;
    setDoc(null);
    setImage(null);
    (async () => {
      // const cameraStatus = await Camera.requestPermissionsAsync();
      // setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();

    if (currentUser.FavDiscussion !== null) {
      setUser(currentUser);
    }
    setUser(currentUser);
    if (props.route.params.did) {
      setDiscussionId(props.route.params.did);
    }

    firebase
      .firestore()
      .collection("Discussion")
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
      });

    firebase
      .firestore()
      .collection("Comment")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const newArray2 = comment.filter(
          (e) => e.discussionId === discussionId
        );
        const IdForComment = newArray2.map((element) => element.id);
        setTotalCommentIdOfDiscussion(IdForComment);
        setTotalComment(newArray2.length);
      });

    firebase
      .firestore()
      .collection("Comment")
      .orderBy("creation", "desc")
      .limit(loadMore)
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const newArray2 = comment.filter(
          (e) => e.discussionId === discussionId
        );
        setComment(newArray2);
      });
    // setTimeout(function () {
    //   setLoadMoreLoading(false);
    // }, 2000);

    setData(5);
  }, [props.currentUser, props.route.params.did, data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("Comment")
        .orderBy("creation", "desc")
        .limit(loadMore)
        .get()
        .then((snapshot) => {
          let comment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const newArray2 = comment.filter(
            (e) => e.discussionId === discussionId
          );
          setComment(newArray2);
        });
      setData(6);
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
    }, [])
  );

  if (user === null) {
    return <View />;
  }

  const DeleteDiscussionAndRelatedData = () => {
    firebase.firestore().collection("Discussion").doc(discussionId).delete();

    for (var i = 0; i < totalCommentIdOfDiscussion.length; i++) {
      firebase
        .firestore()
        .collection("Comment")
        .doc(totalCommentIdOfDiscussion[i])
        .delete();
    }

    props.navigation.goBack({ data: 5 });
  };

  const EditDiscussion = () => {
    props.navigation.navigate("Edit Discussion", {
      did: discussionId,
    });
  };

  const DeleteDiscussion = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this discussion ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            DeleteDiscussionAndRelatedData();
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

  const sendReport = (rid) => {
    firebase
      .firestore()
      .collection("ReportedDiscussion")
      .add({
        reportedBy: userId,
        Reason: rid,
        reportedDiscussion: discussionId,
        discussionTitle: userPosts.title,
        timeReported: firebase.firestore.FieldValue.serverTimestamp(),
        discussionPostedBy: userPosts.userId,
      })
      .then(function () {
        setReportVisible(!isReportVisible);
        Alert.alert(
          "Done",
          "Your report has been received and will be reviewed",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      });
  };
  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleReport = () => {
    setReportVisible(!isReportVisible);
  };

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const finalCommentUpload = (doc, img) => {
    if (!newComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .add({
          userId,
          postedBy: cu.name,
          discussionId,
          comment: newComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: cu.image,
          likeBy: [],
          numOfLike: 0,
          numberOfReply: 0,
          attachedDocument: doc,
          attachedImage: img,
        })
        .then(function () {
          setLoading1(false);
          setModalVisible(!isModalVisible);
        });
      setData(7);
    }
  };

  const UploadComment = () => {
    setLoading1(true);
    if (image == null && Doc == null) {
      finalCommentUpload(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV2();
    }

    if (image == null && Doc != null) {
      uploadDoc();
    }

    if (image != null && Doc == null) {
      uploadImage();
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
      console.log(result.name);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadDoc = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(snapshot, null);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImage = async () => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(null, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadDocV2 = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        uploadImageV2(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImageV2 = async (docSnapshot) => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  if (hasGalleryPermission === false) {
    return <View />;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const AddFavDiscussion = () => {
    const FD = user.FavDiscussion;

    if (FD.includes(discussionId)) {
      console.log("already added to fav");
    } else {
      FD.push(discussionId);
    }

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log("done");
      });

    const FB = userPosts.favBy;
    FB.push(userId);
    firebase
      .firestore()
      .collection("Discussion")
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log("done");
      });
    setData(1);
  };

  const RemoveFavDiscussion = () => {
    const FD = user.FavDiscussion;

    const index = FD.indexOf(discussionId);
    if (index > -1) {
      FD.splice(index, 1);
    }

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log("done");
      });

    const FB = userPosts.favBy;

    const indexx = FB.indexOf(userId);
    if (indexx > -1) {
      FB.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Discussion")
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log("done");
      });
    setData(0);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: userPosts.description,
        title: userPosts.title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const Delete = (cid) => {
    setIsVisible(false);
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this comment ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase.firestore().collection("Comment").doc(cid).delete();
            setData(4);
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

  const addLike = (cid, nol, lb) => {
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(2);
  };

  const removeLike = (cid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(3);
  };

  const EditComment = (cid) => {
    setIsVisible(false);
    setCommentId(cid);
    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .get()
      .then((snapshot) => {
        setEditComment(snapshot.data().comment);
      });
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const uploadUpdatedComment = () => {
    setLoading2(true);
    if (!editComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .doc(commentId)
        .update({
          comment: editComment,
          //creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("save");
        });
      setLoading2(false);
      setEditCommentModalVisible(!isEditCommentModalVisible);
    }

    setData(8);
  };

  const downlaodDoc = () => {
    console.log(36);
  };

  const loadMoreComment = () => {
    setLoadMoreLoading(true);
    let x = 8;
    setLoadMore(loadMore + x);
    setData(9);
  };

  return (
    <View style={{ flex: 1, margin: 10, marginBottom: 5 }}>
      <FlatList
        horizontal={false}
        extraData={comment}
        data={comment}
        renderItem={({ item }) =>
          item.discussionId === discussionId ? (
            <CommentCard
              picture={item.image}
              status={0}
              verify={item.verify}
              postedBy={item.postedBy}
              creation={item.creation}
              comment={item.comment}
              attachedDocument={item.attachedDocument}
              attachedImage={item.attachedImage}
              numOfLike={item.numOfLike}
              likeBy={item.likeBy.includes(userId)}
              removeLike={() =>
                removeLike(item.id, item.numOfLike, item.likeBy)
              }
              xxx={() => toggleVisibility(item.id)}
              addLike={() => addLike(item.id, item.numOfLike, item.likeBy)}
              firstUserId={item.userId}
              secondUserId={userId}
              delete={() => Delete(item.id)}
              downlaodDoc={() => downlaodDoc()}
              editComment={() => EditComment(item.id)}
              numberOfReply={item.numberOfReply}
              onSelect={() =>
                props.navigation.navigate("Reply Discussion", {
                  cid: item.id,
                  time: timeDifference(new Date(), item.creation.toDate()),
                  xxx: item.likeBy.includes(userId),
                  mainCommentAuthorName: item.postedBy,
                })
              }
            />
          ) : null
        }
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.title}>{userPosts.title}</Text>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                {user.FavDiscussion.includes(discussionId) ? (
                  <Icon
                    name="bookmark"
                    type="ionicon"
                    size={35}
                    Color="#000"
                    onPress={() => RemoveFavDiscussion()}
                  />
                ) : (
                  <Icon
                    name="bookmark-outline"
                    type="ionicon"
                    size={35}
                    Color="#000"
                    onPress={() => AddFavDiscussion()}
                  />
                )}
              </View>
            </View>

            {userPosts.downloadURL && (
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: 10,
                  justifyContent: "center",
                }}
              >
                {/* <Image style={styles.image} source={{ uri: userPosts.downloadURL }} /> */}
                <Images
                  width={Dimensions.get("window").width} // height will be calculated automatically
                  source={{ uri: userPosts.downloadURL }}
                />
              </View>
            )}

            <View style={styles.desc}>
              <Text style={styles.descT}>{userPosts.description}</Text>
            </View>
            <View style={{ paddingBottom: 10 }}>
              <Text style={styles.comT}>Comments:</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View>
            {loadMoreLoading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#E3562A" />
              </View>
            )}
            {comment.length != 0 &&
            loadMore >= 8 &&
            totalComment > loadMore &&
            loadMoreLoading == false ? (
              <TouchableOpacity
                onPress={loadMoreComment}
                style={{ marginLeft: 50, flex: 1 }}
              >
                <Text style={{ fontSize: 15, fontFamily: "Poppins" }}>
                  Load More...
                </Text>
              </TouchableOpacity>
            ) : null}

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
                    <ListItem.Title style={l.titleStyle}>
                      {l.title}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))}
            </BottomSheet>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Modal isVisible={isModalVisible}>
                <AddComment
                  setNewComment={(newComment) => setNewComment(newComment)}
                  pickDocument={() => pickDocument()}
                  pickImage={() => pickImage()}
                  UploadComment={() => UploadComment()}
                  toggleModal={() => toggleModal()}
                  loading={loading1}
                />
              </Modal>

              <Modal isVisible={isEditCommentModalVisible}>
                <EditCommentCom
                  editComment={editComment}
                  setEditComment={(editComment) => setEditComment(editComment)}
                  uploadUpdatedComment={() => uploadUpdatedComment()}
                  toggleEditComment={() => toggleEditComment()}
                  loading={loading2}
                />
              </Modal>

              <Modal isVisible={isReportVisible}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={styles.titley}>
                    Why are you reporting this post
                  </Text>
                  <FlatList
                    horizontal={false}
                    extraData={newOption}
                    data={newOption}
                    renderItem={({ item }) => (
                      <Report
                        Option={item.Option}
                        sendReport={() => sendReport(item.Option)}
                      />
                    )}
                  />
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    style={styles.blogout}
                    onPress={toggleReport}
                  >
                    <Text style={styles.Ltext}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
        }
      />
      <FAB
        placement='right'
        color='#E3562A'
        onPress={toggleModal}
        icon={
          <Icon
            reverse
            name='add-outline'
            type='ionicon'
            color='#E3562A'
            size={35}
            containerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 11,
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginBottom: 5,
  },

  titlex: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  floatButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },

  titley: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#140F38",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E3562A",
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "700",
    marginBottom: 5,
  },

  commentCon: {
    borderColor: "#E3562A",
    borderBottomWidth: 5,
    width: 300,
    paddingVertical: 3,
  },

  desc: {
    fontSize: 14,
  },

  descT: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: "Poppins",
    marginTop: 10,
  },

  comT: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 18,
  },

  userT: {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 15,
  },

  userC: {
    fontFamily: "Poppins",
    lineHeight: 20,
    fontSize: 15,
  },

  blogout: {
    width: 140,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  fullComments: store.userState.comment,
  options: store.userState.option,
});

export default connect(mapStateToProps, null)(EditDeleteDiscussion);
