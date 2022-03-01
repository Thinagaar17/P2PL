import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import MainCommentCard from '../../component/mainCommentCard';
import MMCommentCard from '../../component/mmCommentCard';
import { connect } from 'react-redux';
import ReplyCommentCard from '../../component/replyCommentCard';
import Modal from 'react-native-modal';
import firebase from 'firebase';
require('firebase/firestore');
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { timeDifference } from '../../../utils';
import { ListItem, BottomSheet } from 'react-native-elements';

function RoomReplyComment(props) {
  const { currentUser } = props;
  const [currentUserName, setCurrentUserName] = useState(currentUser.name);
  const [loginCurrentUser, setLoginCurrentUser] = useState(currentUser); //numberOfReply
  const [mainCommentId, setMainCommentId] = useState(props.route.params.rroomId);
  const [numberOfReply, setNumberOfReply] = useState(0);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const [mainComment, setMainComment] = useState([]);
  const [data, setData] = useState(0);
  const [datas, setDatas] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editReplyComment, setEditReplyComment] = useState('');
  const [editReplyCommentId, setEditReplyCommentId] = useState('');
  const [authorOfRepliedSubComment, setAuthorOfRepliedSubComment] =
    useState('');
  const [idOfRepliedSubComment, setIdOfRepliedSubComment] = useState('');
  const [replyOfSubComment, setReplyOfSubComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyComment, setReplyComment] = useState([]);
  const [likeBy, setLikeBy] = useState(props.route.params.xxx);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleV2, setIsVisibleV2] = useState(false);
  const [temporaryId, setTemporaryId] = useState(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [interactionPoint, setInteractionPoint] = useState([]);
  const [date, setDate] = useState([]);
  const [member, setMember] = useState([]);
  const [mainCommentAuthorName, setMainCommentAuthorName] = useState(
    props.route.params.mainCommentAuthorName
  );
  const [allUsers, setAllUsers] = useState([]); //change for noti
  const [replyCommentToken, setReplyCommentToken] = useState();//changes for notification
  const [repliedSubCommentUserId, setRepliedSubCommentUserId] = useState(null);//noti

  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [isEditReplyCommentModalVisible, setEditReplyCommentModalVisible] =
    useState(false);
  const [isReplyCommentModalVisible, setReplyCommentModalVisible] =
    useState(false);
  const [isReplySubCommentModalVisible, setReplySubCommentModalVisible] =
    useState(false);

  const [loadMore, setLoadMore] = useState(8);
  const [totalComment, setTotalComment] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const [
    totalNumberOfAttachedDocument,
    setTotalNumberOfAttachedDocumenInteraction,
  ] = useState(0);
  const [totalNumberOfAttachedImage, setTotalNumberOfAttachedImage] =
    useState(0);
  const [totalNumberOfReplyComment, setTotalNumberOfReplyComment] = useState(0);

  const userId = firebase.auth().currentUser.uid;
  const time = props.route.params.time;
  



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

  const listV2 = [
    {
      title: 'Edit',
      onPress: () => EditReplyComment(temporaryId),
    },
    {
      title: 'Delete',
      onPress: () => DeleteReplyComment(temporaryId),
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisibleV2(false),
    },
  ];

  

  useEffect(() => {
    setImage(null);
    setDoc(null);
    setCaption('');
    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .get()
      .then((snapshot) => {
        setMainComment(snapshot.data());
        setNumberOfReply(snapshot.data().numberOfReply);
        //  console.log('Reply ' + snapshot.data().numberOfReply);
      });

    //change for noti
    firebase
      .firestore()
      .collection('users')
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setAllUsers(users);
      });
    //change for noti

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .collection('Reply')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        let replyComment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setTotalComment(replyComment.length);
      });

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .collection('Reply')
      .orderBy('creation', 'asc')
      .limit(loadMore)
      .get()
      .then((snapshot) => {
        let replyComment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setReplyComment(replyComment);
      });

    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setDate(snapshot.data().date);
        setMember(snapshot.data().groupMember);
        setInteractionPoint(snapshot.data().interaction);
        setTotalNumberOfAttachedDocumenInteraction(
          snapshot.data().totalNumberOfAttachedDocument
        );
        setTotalNumberOfAttachedImage(
          snapshot.data().totalNumberOfAttachedImage
        );
        setTotalNumberOfReplyComment(snapshot.data().totalNumberOfReplyComment);
      });
    // setTimeout(function () {
    //   setLoadMoreLoading(false);
    // }, 2000);
  }, [data]);


  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .get()
        .then((snapshot) => {
          setMainComment(snapshot.data());
        });

      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .collection('Reply')
        .orderBy('creation', 'asc')
        .limit(loadMore)
        .get()
        .then((snapshot) => {
          let replyComment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setReplyComment(replyComment);
        });

      setData(24);
    }, [data])
  );

  

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
    let y = totalNumberOfReplyComment + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberOfReplyComment: y,
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
        })
        .then(() => {
          console.log('done');
        });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      console.log(result.uri);
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

  const UploadComment = () => {
    addCommentPieChart();

    if (image == null && Doc == null) {
      ReplyComment(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV2();
      addImgPieChart();
      addDocPieChart();
    }

    if (image == null && Doc != null) {
      uploadDoc();
      addDocPieChart();
    }

    if (image != null && Doc == null) {
      uploadImage();
      addImgPieChart();
    }

    addInteraction();

    

  };

  const UploadCommentV2 = () => {
    addCommentPieChart();
    if (image == null && Doc == null) {
      ReplySubComment(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV3();
      addImgPieChart();
      addDocPieChart();
    }

    if (image == null && Doc != null) {
      uploadDocV1();
      addDocPieChart();
    }

    if (image != null && Doc == null) {
      uploadImageV1();
      addImgPieChart();
    }

    addInteraction();

  
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
        ReplyComment(snapshot, null);
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
        ReplyComment(null, snapshot);
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
        ReplyComment(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadDocV1 = async () => {
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
        ReplySubComment(snapshot, null);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImageV1 = async () => {
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
        ReplySubComment(null, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadDocV3 = async () => {
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
        uploadImageV3(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImageV3 = async (docSnapshot) => {
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
        ReplySubComment(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

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

  const callback = (keyword) => {
    setKeyword(keyword);
    let x = keyword.substring(1);
    const newArray2 = member.filter((e) => e.name >= x);
    setDatas(newArray2);
  };

  const addLike = (nol) => {
    addInteraction();
    const x = nol + 1;
    if (mainComment.likeBy.includes(userId)) {
    } else {
      mainComment.likeBy.push(userId);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(2);

   
  };

  const removeLike = (nol) => {
    const x = nol - 1;
    const indexx = mainComment.likeBy.indexOf(userId);
    if (indexx > -1) {
      mainComment.likeBy.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(3);
  };

  const Delete = () => {
    // firebase.firestore().collection("Comment").doc(cid).delete();
    // console.log("delete");
    // props.navigation.goBack();

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
              .doc(mainCommentId)
              .delete();

            props.navigation.goBack();
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

  const EditComment = () => {
    setCaption(mainComment.comment);
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const EditReplyComment = (rcid) => {
    setIsVisibleV2(false);
    setEditReplyCommentId(rcid);
    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .get()
      .then((snapshot) => {
        setCaption(snapshot.data().comment);
      });
    setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    //console.log(rcid);
  };

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const toggleVisibilityV2 = (cid) => {
    setIsVisibleV2(true);
    setTemporaryId(cid);
  };

  const uploadUpdatedComment = () => {
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
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

  const toggleReplyComment = () => {
    setReplyCommentModalVisible(!isReplyCommentModalVisible);
  };

  const toggleReplyEditComment = () => {
    setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
  };

  const toggleSubReplyComment = (id, posted, userId) => {
    setIdOfRepliedSubComment(id);
    setAuthorOfRepliedSubComment(posted);
    setRepliedSubCommentUserId(userId); //added
    setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
  };

  const ReplySubComment = (doc, img) => {
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .collection('Reply')
        .add({
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: loginCurrentUser.image, //current user
          likeBy: [],
          numOfLike: 0,
          postedBy: loginCurrentUser.name, // current user
          userId, // current user
          repliedTo: authorOfRepliedSubComment, // author of comment being replied
          mainCommentId: idOfRepliedSubComment, // id of comment being replied
          attachedDocument: doc,
          attachedImage: img,
     
        });

      const totalReply = numberOfReply + 1;
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .update({
          numberOfReply: totalReply,
        });
      setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
    }

    setData(55);
  };

  const ReplyComment = (doc, img) => {
 
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .collection('Reply')
        .add({
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: loginCurrentUser.image,
          likeBy: [],
          numOfLike: 0,
          postedBy: loginCurrentUser.name,
          userId,
          repliedTo: mainCommentAuthorName,
          mainCommentId,
          attachedDocument: doc,
          attachedImage: img,
   
        });

      const totalReply = numberOfReply + 1;
      console.log('totalReply ' + totalReply);
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .update({
          numberOfReply: totalReply,
        });
      setReplyCommentModalVisible(!isReplyCommentModalVisible);
    }

    setData(55);
  };

  const DeleteReplyComment = (rcid) => {
    setIsVisibleV2(false);
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
              .doc(mainCommentId)
              .collection('Reply')
              .doc(rcid)
              .delete();

            const totalReply = numberOfReply - 1;
            firebase
              .firestore()
              .collection('DiscussionRoomComment')
              .doc(mainCommentId)
              .update({
                numberOfReply: totalReply,
              });

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

  const AddLikeToReplyComment = (rcid, nol, lb, uid) => {
    addInteraction();
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(2);

  };

  const RemoveLikeToReplyComment = (rcid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(3);
  };

  const UploadEditSubComment = () => {
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(mainCommentId)
        .collection('Reply')
        .doc(editReplyCommentId)
        .update({
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('save');
        });

      setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    }

    setData(44);
  };

  const loadMoreComment = () => {
    setLoadMoreLoading(true);
    let x = 8;
    setLoadMore(loadMore + x);
    setData(9);
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        extraData={replyComment}
        data={replyComment}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 30, marginTop: 5 }}>
            <ReplyCommentCard
              componentStatus={0}
              removeVerifyReplyComment={() => removeVerifyReplyComment(item.id)}
              verifyReplyComment={() => verifyReplyComment(item.id)}
              image={item.image}
              status={loginCurrentUser.status}
              verify={item.verify}
              firstUserId={item.userId}
              secondUserId={userId}
              xxx={() => toggleVisibilityV2(item.id)}
              postedBy={item.postedBy}
              maincommentIdV1={item.mainCommentId}
              mainCommentIdV2={mainCommentId}
              repliedTo={item.repliedTo}
              currentUserName={currentUserName}
              creation={item.creation}
              comment={item.comment}
              attachedImage={item.attachedImage}
              attachedDocument={item.attachedDocument}
              numOfLike={item.numOfLike}
              likeBy={item.likeBy.includes(userId)}
              RemoveLikeToReplyComment={() =>
                RemoveLikeToReplyComment(item.id, item.numOfLike, item.likeBy)
              }
              AddLikeToReplyComment={() =>
                AddLikeToReplyComment(item.id, item.numOfLike, item.likeBy, item.userId)
              }
              toggleSubReplyComment={() =>
                toggleSubReplyComment(item.id, item.postedBy, item.userId)
              }
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            <MainCommentCard
              componentStatus={0}
              picture={mainComment.image}
              time={time}
              status={loginCurrentUser.status}
              verify={mainComment.verify}
              postedBy={mainComment.postedBy}
              creation={mainComment.creation}
              comment={mainComment.comment}
              attachedDocument={mainComment.attachedDocument}
              attachedImage={mainComment.attachedImage}
              numOfLike={mainComment.numOfLike}
              likeBy={likeBy}
              removeVerifyComment={() => removeVerifyComment()}
              verifyComment={() => verifyComment()}
              removeLike={() => removeLike(mainComment.numOfLike)}
              xxx={() => toggleVisibility(mainComment.id)}
              addLike={() => addLike(mainComment.numOfLike)}
              firstUserId={mainComment.userId}
              secondUserId={userId}
              delete={() => Delete(mainComment.id)}
              editComment={() => EditComment(mainComment.id)}
              toggleReplyComment={() => toggleReplyComment()}
            />
          </View>
        }
        ListFooterComponent={
          <View>
            {loadMoreLoading && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size='large' color='#E3562A' />
              </View>
            )}
            {replyComment.length != 0 &&
              loadMoreLoading == false &&
              totalComment > loadMore ? (
              <TouchableOpacity
                onPress={loadMoreComment}
                style={{ marginLeft: 50, flex: 1 }}
              >
                <Text style={{ fontSize: 15, fontFamily: 'Poppins' }}>
                  Load More ...
                </Text>
              </TouchableOpacity>
            ) : null}
            <BottomSheet
              isVisible={isVisible}
              containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
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

            <BottomSheet
              isVisible={isVisibleV2}
              containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
              {listV2.map((l, i) => (
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

            {/* Edit Reply Modal */}
            <Modal isVisible={isEditCommentModalVisible}>
              <MMCommentCard
                loadingComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      width: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                )}
                caption={caption}
                setCaption={setCaption}
                callback={callback.bind(this)}
                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                datas={datas}
                keyExtractor={(item, index) => item.name}
                UploadComment={() => uploadUpdatedComment()}
                toggleModal={() => toggleEditComment()}
                status={1}
              />
            </Modal>

            {/* Reply Comment Modal */}
            <Modal isVisible={isReplyCommentModalVisible}>
              <MMCommentCard
                loadingComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      width: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                )}
                caption={caption}
                setCaption={setCaption}
                callback={callback.bind(this)}
                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                datas={datas}
                keyExtractor={(item, index) => item.name}
                UploadComment={() => UploadComment()}
                toggleModal={() => toggleReplyComment()}
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                status={0}
                image={image}
                Doc={Doc}
              />
            </Modal>

            {/* Reply to Reply Comment Modal */}

            <Modal isVisible={isReplySubCommentModalVisible}>
              <MMCommentCard
                loadingComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      width: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                )}
                caption={caption}
                setCaption={setCaption}
                callback={callback.bind(this)}
                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                datas={datas}
                keyExtractor={(item, index) => item.name}
                UploadComment={() => UploadCommentV2()}
                toggleModal={() => toggleSubReplyComment()}
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                status={0}
                image={image}
                Doc={Doc}
              />
            </Modal>

            {/* Edit Reply Comment */}

            <Modal isVisible={isEditReplyCommentModalVisible}>
              <MMCommentCard
                loadingComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      width: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                )}
                caption={caption}
                setCaption={setCaption}
                callback={callback.bind(this)}
                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                datas={datas}
                keyExtractor={(item, index) => item.name}
                UploadComment={() => UploadEditSubComment()}
                toggleModal={() => toggleReplyEditComment()}
                status={1}
              />
            </Modal>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    // marginTop: 20,
    marginBottom: 5,
    // marginLeft: 20,
    // marginLeft:20
  },

  titlex: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titley: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#140F38',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
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

  input: {
    height: 60,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    width: 340,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 5,
  },

  commentCon: {
    borderColor: '#E3562A',
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
    fontFamily: 'Poppins',
    marginTop: 10,
  },

  comT: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
  },

  userT: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 15,
  },

  userC: {
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontSize: 15,
  },

  blogout: {
    width: 140,
    height: 40,
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
    fontSize: 15,
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
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(RoomReplyComment);
