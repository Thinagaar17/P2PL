import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Dimensions,
  LogBox,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import MentionsTextInput from 'react-native-mentions';

import { WebView } from 'react-native-webview';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import Images from 'react-native-scalable-image';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FAB } from 'react-native-elements';
require('firebase/firestore');

function AddCommentScreen(props) {
  const { currentUser } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [web, setWeb] = useState(false);
  const [name, setName] = useState('');
  const [editComment, setEditComment] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [data, setData] = useState(null);
  const [cu, setCu] = useState(currentUser);
  const [keyword, setKeyword] = useState('');
  const [caption, setCaption] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [datas, setDatas] = useState([]);
  const [mid, setMid] = useState([]);
  const [temporaryId, setTemporaryId] = useState(null);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [member, setMember] = useState([]);
  const [interactionPoint, setInteractionPoint] = useState([]);
  const [date, setDate] = useState([]);
  const [userStatus, setUserStatus] = useState(0);
  const [loadMore, setLoadMore] = useState(12);
  const [totalComment, setTotalComment] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  //
  const [
    totalNumberOfAttachedDocument,
    setTotalNumberOfAttachedDocumenInteraction,
  ] = useState(0);
  const [totalNumberOfAttachedImage, setTotalNumberOfAttachedImage] =
    useState(0);
  const [totalNumberOfLike, setTotalNumberOfLike] = useState(0);
  const [totalNumberOfReplyComment, setTotalNumberOfReplyComment] = useState(0);
  const [totalNumberofComment, setTotalNumberofComment] = useState(0);
  //
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;
  const [animatePress, setAnimatePress] = useState(new Animated.Value(1));

  const list = [
    {
      title: 'Edit',
      onPress: () => EditComment(temporaryId),
    },
    {
      title: 'Delete',
      onPress: () => Delete(temporaryId),
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const { currentUser } = props;
    if (currentUser.FavDiscussion !== null) {
      setUser(currentUser);
    }
    setUser(currentUser);
    if (props.route.params.did) {
      setDiscussionId(props.route.params.did);
    }
    setCaption('');
    setImage(null);
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
        setMember(snapshot.data().groupMember);
        setMid(snapshot.data().memberId);
        setDate(snapshot.data().date);
        setInteractionPoint(snapshot.data().interaction);
        setTotalNumberOfAttachedDocumenInteraction(
          snapshot.data().totalNumberOfAttachedDocument
        );
        setTotalNumberOfAttachedImage(
          snapshot.data().totalNumberOfAttachedImage
        );
        setTotalNumberOfLike(snapshot.data().totalNumberOfLike);
        setTotalNumberOfReplyComment(snapshot.data().totalNumberOfReplyComment);
        setTotalNumberofComment(snapshot.data().totalNumberofComment);
      });

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .orderBy('creation', 'desc')
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setTotalComment(comment.length);
      });

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .orderBy('creation', 'desc')
      .limit(loadMore)
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setComment(comment);
      });

    // setTimeout(function () {
    //   setLoadMoreLoading(false);
    // }, 1000);
    setUserStatus(currentUser.status);
    setData(11);
  }, [props.currentUser, props.route.params.did, data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .orderBy('creation', 'desc')
        .limit(loadMore)
        .get()
        .then((snapshot) => {
          let comment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setComment(comment);
        });

      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data());
          } else {
            console.log('does not exist');
          }
        });
    }, [])
  );

  if (user === null) {
    return <View />;
  }

  const addImgPieChart = () => {
    let u = totalNumberOfAttachedImage + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberOfAttachedImage: u,
      })
      .then(() => {
        console.log('done');
      });
  };

  const addDocPieChart = () => {
    let z = totalNumberOfAttachedDocument + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberOfAttachedDocument: z,
      })
      .then(() => {
        console.log('done');
      });
    console.log('pie chart comment updated');
  };

  const addCommentPieChart = () => {
    let y = totalNumberofComment + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberofComment: y,
      })
      .then(() => {
        console.log('done uploading number of comment');
      });
  };

  const addInteraction = () => {
    const today = new Date();
    const n = today.getMonth() + 1;
    const tomorrow = new Date(today);
    const createdDay = tomorrow.getDate();
    const finalDate = createdDay + '/' + n;

    if (date.includes(finalDate)) {
      const index = date.indexOf(finalDate);

      interactionPoint[index] = interactionPoint[index] + 1;

      firebase
        .firestore()
        .collection('DiscussionRoom')
        .doc(discussionId)
        .update({
          interaction: interactionPoint,
        })
        .then(() => {
          console.log('done');
        });
    } else {
      date.shift();
      interactionPoint.shift();
      date.push(finalDate);
      interactionPoint.push(0);
      const index = date.indexOf(finalDate);
      interactionPoint[index] = interactionPoint[index] + 1;
      firebase
        .firestore()
        .collection('DiscussionRoom')
        .doc(discussionId)
        .update({
          interaction: interactionPoint,
          date,
        })
        .then(() => {
          console.log('done');
        });
    }
  };

  const navtodetail = () => {
    props.navigation.navigate('GroupDetail', { did: discussionId, mid: mid });
  };

  const navtostats = () => {
    props.navigation.navigate('GroupStats', { did: discussionId });
  };

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setLoadMoreLoading(false);
  };

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const UploadComment = () => {
    addCommentPieChart();

    if (image == null && Doc == null) {
      finalCommentUpload(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV2();
      //add doc
      addImgPieChart();
      addDocPieChart();
      //add img
    }

    if (image == null && Doc != null) {
      uploadDoc();
      //add doc
      addDocPieChart();
    }

    if (image != null && Doc == null) {
      uploadImage();
      addImgPieChart();
    }

    addInteraction();


    props.navigation.goBack();
  };

  const removeImage = () => {
    setImage(null);
  };

  const removeDoc = () => {
    setDoc(null);
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImage = async () => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${firebase.auth().currentUser.uid
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImageV2 = async (docSnapshot) => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${firebase.auth().currentUser.uid
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  if (hasGalleryPermission === false) {
    return <View />;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
    setCaption(comment + '@' + name + ' ');
  };

  const xxx = () => {
    console.log(caption);
  };

  const callback = (keyword) => {
    setKeyword(keyword);
    let x = keyword.substring(1);
    const newArray2 = member.filter((e) => e.name >= x);
    setDatas(newArray2);
  };

  const finalCommentUpload = (doc, img) => {
    // noti
    let pushToken = null;
    if (cu.status === 0) {
      pushToken = cu.pushToken;
    }
    // noti
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .add({
          userId,
          postedBy: cu.name,
          discussionRoomId: discussionId,
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: cu.image,
          likeBy: [],
          numOfLike: 0,
          numberOfReply: 0,
          attachedDocument: doc,
          attachedImage: img,
        })
        .then(function () {
          setModalVisible(!isModalVisible);
        });
      setData(57);
    }
  };

  const Delete = (cid) => {
    setIsVisible(false);
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want to delete this comment ?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            firebase
              .firestore()
              .collection('DiscussionRoomComment')
              .doc(cid)
              .delete();
            setData(4);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ]
    );
  };

  const addLike = (cid, nol, lb) => {
    addLikePieChart();
    // add like
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });

    addInteraction();
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
      .collection('DiscussionRoomComment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(3);
  };

  const EditComment = (cid) => {
    setIsVisible(false);
    setCommentId(cid);
    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(cid)
      .get()
      .then((snapshot) => {
        setCaption(snapshot.data().comment);
      });
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const uploadUpdatedComment = () => {
    if (!editComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(commentId)
        .update({
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('save');
        });
      setEditCommentModalVisible(!isEditCommentModalVisible);
    }

    setData(88);
  };

  const loadMoreComment = () => {
    setLoadMoreLoading(true);
    let x = 8;
    setLoadMore(loadMore + x);
    setData(9);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={{ width: '100%' }}>
            <MentionsTextInput
              textInputStyle={{
                borderColor: '#E3562A',
                borderWidth: 1,
                backgroundColor: '#FFF',
                borderRadius: 12,
                padding: 10,
                fontFamily: 'Poppins',
                fontSize: 15,
                margin: 20
              }}
              suggestionsPanelStyle={{
                backgroundColor: '#fff',
              }}
              textInputMinHeight={50}
              textInputMaxHeight={800}
              trigger={'@'}
              triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
              value={caption}
              onChangeText={setCaption}
              triggerCallback={callback}
              renderSuggestionsRow={renderSuggestionsRow}
              suggestionsData={datas}
              keyExtractor={(item, index) => item.name}
              suggestionRowHeight={45}
              horizontal={false}
              MaxVisibleRowCount={3}
            />

            {/* <TextInput
              style={styles.desc}
              placeholder='Type here'
              multiline={true}
              defaultValue={description}
             onChangeText={(description) => setDescription(description)}
            /> */}
          </View>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        {image == null ? (
          <TouchableOpacity style={styles.blogout} onPress={pickImage}>
            <Text style={styles.Ltext}>Attach Image</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.blogout} onPress={removeImage}>
            <Text style={styles.Ltext}>Remove Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ alignItems: 'center' }}>
        {image && (
          <Images
            width={Dimensions.get('window').width} // height will be calculated automatically
            source={{ uri: image }}
          />
        )}
      </View>

      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        {Doc == null ? (
          <TouchableOpacity style={styles.blogout} onPress={pickDocument}>
            <Text style={styles.Ltext}>Attach Document</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.blogout} onPress={removeDoc}>
            <Text style={styles.Ltext}>Remove Document</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {Doc && (
          <View style={styles.attachment}>
            <TouchableOpacity style={styles.icon} onPress={() => setWeb(true)}>
              <Text
                style={{
                  fontFamily: 'Poppins',
                }}
              >
                {name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {web ? <WebView source={{ uri: Doc }} /> : null}

      <FAB
        placement='right'
        color='#E3562A'
        onPress={UploadComment}
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
  desc: {
    color: '#000',
    margin: 20,
    height: 250,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    width: 350,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },

  attachment: {
    backgroundColor: '#808080',
    height: 45,
    margin: 20,
    borderColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 2,
    paddingLeft: 10,
  },

  icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },

  blogout: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.12,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 20,
    justifyContent: 'space-between',
    paddingTop: 8,
  },

  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54c19c',
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
});

export default connect(mapStateToProps, null)(AddCommentScreen);
