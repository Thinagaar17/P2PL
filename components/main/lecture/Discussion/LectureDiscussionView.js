import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
} from 'react-native';
//---------reusable component-----------//
import Report from '../../component/report';
import AddComment from '../../component/addComment';
import EditCommentCom from '../../component/editComment';
import CommentCard from '../../component/commentCard';
//----------------------------------------------
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as Linking from 'expo-linking';
import Images from 'react-native-scalable-image';
import { timeDifference } from '../../../utils';
import { FAB, ListItem, BottomSheet } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
require('firebase/firestore');

function LectureDiscussionView(props) {
  const { currentUser, options, discussionList, report } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newOption, setOption] = useState(options);
  const [editComment, setEditComment] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
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
  const [loadMore, setLoadMore] = useState(11);
  const [totalComment, setTotalComment] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  //changes for reported discussion
  const [reportData, setReportData] = useState(report);
  const [admin, setAdmin] = useState([]); //notifications
  //changes for reported discussion

  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

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

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='alert-circle-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                toggleReport();
              }}
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
      setHasGalleryPermission(galleryStatus.status === 'granted');
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
      .collection('Discussion')
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
      });

    firebase
      .firestore()
      .collection('Comment')
      .orderBy('creation', 'desc')
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
        setTotalComment(newArray2.length);
      });

    //changes for reported discussion
    firebase
      .firestore()
      .collection('ReportedDiscussion')
      .get()
      .then((snapshot) => {
        let report2 = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setReportData(report2);
      });

    firebase
      .firestore()
      .collection('users')
      .get()
      .then((snapshot) => {
        let adminToken = [];
        snapshot.docs.map((doc) => {
          if (doc.data().status === 2) {
            const token = doc.data().pushToken;
            adminToken.push({ token });
          }
        });

        setAdmin(adminToken);
      });
    //changes for reported discussion

    //change for contribution module
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
    //change for contribution module

    firebase
      .firestore()
      .collection('Comment')
      .orderBy('creation', 'desc')
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
        .collection('Comment')
        .orderBy('creation', 'desc')
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
      //changes
      firebase
        .firestore()
        .collection('Discussion')
        .doc(props.route.params.did)
        .get()
        .then((snapshot) => {
          setUserPosts(snapshot.data());
        });
      //changes

      setData(89);
    }, [])
  );

  if (user === null) {
    return <View />;
  }

  const xxx = () => {
    console.log(24);
  };

  const sendReport = (rid) => {
    //change for reported Discussion
    console.log(reportData);
    const alert = () => {
      setReportVisible(!isReportVisible);
      Alert.alert(
        'Done',
        'Your report has been received and will be reviewed',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    };

    if (reportData.length > 0) {
      const foundElement = reportData.find(
        (el) => el.reportedDiscussion === discussionId
      );
      if (foundElement) {
        if (foundElement.Reason.find((el) => el === rid)) {
          const rB = foundElement.reportedBy;
          if (rB.includes(userId)) {
            console.log('Already reported');
            alert();
          } else {
            rB.push(userId);
            // console.log(rB)
            firebase
              .firestore()
              .collection('ReportedDiscussion')
              .doc(foundElement.id)
              .update({
                reportedBy: rB,
              })
              .then(() => {
                alert();
              });
          }
        } else {
          const rB = foundElement.reportedBy;
          const reason = foundElement.Reason;
          if (rB.includes(userId)) {
            console.log('Name already in reportedBy list');
            reason.push(rid);
            firebase
              .firestore()
              .collection('ReportedDiscussion')
              .doc(foundElement.id)
              .update({
                Reason: reason,
              })
              .then(() => {
                alert();
              });
          } else {
            rB.push(userId);
            reason.push(rid);
            firebase
              .firestore()
              .collection('ReportedDiscussion')
              .doc(foundElement.id)
              .update({
                reportedBy: rB,
                Reason: reason,
              })
              .then(() => {
                alert();
              });
          }
        }
      } else {
        firebase
          .firestore()
          .collection('ReportedDiscussion')
          .add({
            reportedBy: [userId],
            Reason: [rid],
            reportedDiscussion: discussionId,
            discussionTitle: userPosts.title,
            timeReported: firebase.firestore.FieldValue.serverTimestamp(),
            discussionPostedBy: userPosts.userId,
          })
          .then(() => {
            alert();
          });
      }
    } else {
      firebase
        .firestore()
        .collection('ReportedDiscussion')
        .add({
          reportedBy: [userId],
          Reason: [rid],
          reportedDiscussion: discussionId,
          discussionTitle: userPosts.title,
          timeReported: firebase.firestore.FieldValue.serverTimestamp(),
          discussionPostedBy: userPosts.userId,
        })
        .then(() => {
          alert();
        });
    }
    setData(71);
    //change for reported Discussion

    for (let i = 0; i < admin.length; i++) {
      //  ------------------ Sending Push Notification To Admin-----------------------

      // console.log(token);
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: admin[i].token,
          title: `${cu.name} reported a discussion`,
          body: 'Tap to see the discussion',
          priority: 'normal',
          data: { rdid: discussionId },
        }),
      });
      //  ------------------ Sending Push Notification To Admin-----------------------
    }
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

  const verifyComment = (cid) => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .update({
        verify: true,
      })
      .then(() => {
        console.log('done');
      });
    setData(11);

    //  ------------------ Sending Push Notification To Author of Comment -----------------------
    const notificationTitle = `A lecturer verfied your comment`;

    const notificationTitle2 = `A lecturer verfied a comment in your discussion thread`;
    const mainDiscussion = discussionList.find((el) => el.id === discussionId);
    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .get()
      .then((snapshot) => {
        firebase
          .firestore()
          .collection('users')
          .doc(snapshot.data().userId)
          .collection('Notifications')
          .add({
            title: notificationTitle,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            pageId: snapshot.data().discussionId,
            description: snapshot.data().comment,
            userId: userId,
            dataType: 'id',
          });

        firebase
          .firestore()
          .collection('users')
          .doc(mainDiscussion.userId)
          .collection('Notifications')
          .add({
            title: notificationTitle2,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            pageId: snapshot.data().discussionId,
            description: snapshot.data().comment,
            userId: userId,
            dataType: 'id',
          });

        fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: snapshot.data().pushToken,
            title: notificationTitle,
            body: 'Tap to see the comment',
            priority: 'normal',
            data: {
              id: snapshot.data().discussionId,
              description: snapshot.data().comment,
              userId: userId,
            },
          }),
        });

        fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: mainDiscussion.pushToken,
            title: notificationTitle2,
            body: 'Tap to see the comment',
            priority: 'normal',
            data: {
              id: snapshot.data().discussionId,
              description: snapshot.data().comment,
              userId: userId,
            },
          }),
        });
      });
    //  ------------------ Sending Push Notification To Author of Comment -----------------------
  };

  const removeVerifyComment = (cid) => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .update({
        verify: false,
      })
      .then(() => {
        console.log('done');
      });
    setData(6);
  };

  const finalCommentUpload = (doc, img) => {
    if (!newComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
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
          pushToken: null,
        })
        .then(function () {
          setLoading1(false);
          setModalVisible(!isModalVisible);
        })
        .catch((error) => {
          this.errorMessage = 'Error - ' + error.message;
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

    console.log(userPosts.noOfComments);
    const discussionCommentNo = userPosts.noOfComments + 1;

    firebase
      .firestore()
      .collection('Discussion')
      .doc(discussionId)
      .update({
        noOfComments: discussionCommentNo,
      })
      .then(() => {
        console.log('done');
      });

    //  ------------------ Sending Push Notification To Author of Discussion -----------------------
    const notificationTitle = `A lecturer commented on you discussion thread`;

    if (userPosts.userId !== userId) {
      const discussionToken = userPosts.pushToken;
      // console.log(token);
      firebase
        .firestore()
        .collection('users')
        .doc(userPosts.userId)
        .collection('Notifications')
        .add({
          title: notificationTitle,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          pageId: discussionId,
          description: newComment,
          userId: userId,
          dataType: 'id',
        });

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: discussionToken,
          title: notificationTitle,
          body: 'Tap to see the comments',
          priority: 'normal',
          data: { id: discussionId, description: newComment, userId: userId },
        }),
      });
    }

    //  ------------------ Sending Push Notification To Author of Discussion -----------------------
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
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

    task.on('state_changed', taskProgress, taskError, taskCompleted);
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
      console.log('already added to fav');
    } else {
      FD.push(discussionId);
    }

    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log('done');
      });

    const FB = userPosts.favBy;
    FB.push(userId);
    firebase
      .firestore()
      .collection('Discussion')
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log('done');
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
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log('done');
      });

    const FB = userPosts.favBy;

    const indexx = FB.indexOf(userId);
    if (indexx > -1) {
      FB.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('Discussion')
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log('done');
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
      'Are your sure?',
      'Are you sure you want to delete this comment ?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            const commentList = [...comment];
            //obtain noOfReplies for a mainComment
            //needed for lecturer
            const currentReplyNo = commentList.find(
              (el) => el.id === cid
            ).numberOfReply;
            console.log(currentReplyNo);
            //needed for lecturer
            //obtain noOfReplies for a mainComment

            firebase.firestore().collection('Comment').doc(cid).delete();
            setData(4);

            //updating noOfComments under discussion
            //needed for lecturer
            console.log(userPosts.noOfComments);
            const discussionCommentNo =
              userPosts.noOfComments - 1 - currentReplyNo;
            console.log(discussionCommentNo);
            firebase
              .firestore()
              .collection('Discussion')
              .doc(discussionId)
              .update({
                noOfComments: discussionCommentNo,
              })
              .then(() => {
                console.log('done update');
              });
            //needed for lecturer
            //updating noOfComments under discussion
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
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(2);

    const commentList = [...comment];
    const commentPostedBy = commentList.find((el) => el.id === cid).userId;
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);
    console.log(x);

    if (commentOwner.status == 0) {
      let points = commentOwner.totalPoints;
      let userTitle = commentOwner.title;
      let likesNo = commentOwner.noOfLikes;
      if (commentPostedBy !== userId) {
        likesNo = likesNo + 1;
      }
      console.log(likesNo);

      firebase
        .firestore()
        .collection('users')
        .doc(commentPostedBy)
        .update({
          noOfLikes: likesNo,
        })
        .then(() => {
          console.log('done');
        });
      //updating number of likes under user

      //updating totalPoints and awards based on noOfLikes
      const award = commentOwner.awards;
      console.log(award);
      let creation = new Date();
      if (
        likesNo === 1 &&
        !award.some((el) => el.title === 'Somebody Likes You')
      ) {
        award.push({
          title: 'Somebody Likes You',
          description:
            'Somebody out there liked one of your comments. Keep posting for more',
          pointsToBeAdded: 2,
          creation: creation.toISOString(),
        });
        points = points + 2;
      } else if (
        likesNo === 25 &&
        !award.some((el) => el.title === 'I Like it A Lot')
      ) {
        award.push({
          title: 'I Like it A Lot',
          description: 'Your comments have been liked 25 times',
          pointsToBeAdded: 7,
          creation: creation.toISOString(),
        });
        points = points + 7;
      } else if (
        likesNo === 50 &&
        !award.some((el) => el.title === 'Seriously Likeable')
      ) {
        award.push({
          title: 'Seriously Likeable',
          description: 'Your comments have been liked 50 times',
          pointsToBeAdded: 10,
          creation: creation.toISOString(),
        });
        points = points + 10;
      } else if (x === 25 && !award.some((el) => el.title === 'Helpful')) {
        award.push({
          title: 'Helpful',
          description: 'One of your comments has attracted 25 likes',
          pointsToBeAdded: 15,
          creation: creation.toISOString(),
        });
        points = points + 15;
      } else if (
        x === 50 &&
        !award.some((el) => el.title === 'Super Helpful')
      ) {
        award.push({
          title: 'Super Helpful',
          description: 'One of your comments has attracted 50 likes',
          pointsToBeAdded: 25,
          creation: creation.toISOString(),
        });
        points = points + 25;
      }

      //updating userTitle based on Points
      if (points >= 0 && points <= 100) {
        userTitle = 'Beginner';
      } else if (points > 100 && points <= 300) {
        userTitle = 'Intermediate';
      } else if (points > 300 && points <= 500) {
        userTitle = 'Expert';
      } else if (points > 500) {
        userTitle = 'Legend';
      }
      //updating userTitle based on Points

      firebase
        .firestore()
        .collection('users')
        .doc(commentPostedBy)
        .update({
          totalPoints: points,
          awards: award,
          title: userTitle,
        })
        .then(() => {
          console.log('done');
        });

      //updating totalPoints and awards based on noOfLikes
    }
    // change for contribution

    const notificationTitle = `A lecturer liked your comment`;
    //  ------------------ Sending Push Notification To Author of Comment -----------------------
    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .get()
      .then((snapshot) => {
        if (snapshot.data().userId !== userId) {
          firebase
            .firestore()
            .collection('users')
            .doc(snapshot.data().userId)
            .collection('Notifications')
            .add({
              title: notificationTitle,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              pageId: snapshot.data().discussionId,
              description: snapshot.data().comment,
              userId: userId,
              dataType: 'id',
            });

          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: snapshot.data().pushToken,
              title: notificationTitle,
              body: 'Tap to see the comment',
              priority: 'normal',
              data: {
                id: snapshot.data().discussionId,
                description: snapshot.data().comment,
                userId: userId,
              },
            }),
          });
        }
      });
    //  ------------------ Sending Push Notification To Author of Comment -----------------------
  };

  const removeLike = (cid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('Comment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(3);

    //change for contribution

    //updating number of likes under user
    //needed for lecturer
    const commentList = [...comment];
    const commentPostedBy = commentList.find((el) => el.id === cid).userId;
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);

    if (commentOwner.status == 0) {
      let likesNo = commentOwner.noOfLikes;
      if (commentPostedBy !== userId) {
        likesNo = likesNo - 1;
      }

      firebase
        .firestore()
        .collection('users')
        .doc(commentPostedBy)
        .update({
          noOfLikes: likesNo,
        })
        .then(() => {
          console.log('done');
        });
      //updating number of likes under user
    }
    //change for contribution
  };

  const EditComment = (cid) => {
    setIsVisible(false);
    setCommentId(cid);
    firebase
      .firestore()
      .collection('Comment')
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
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
        .doc(commentId)
        .update({
          comment: editComment,
          //creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('save');
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
              status={1}
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
              removeVerifyComment={() => removeVerifyComment(item.id)}
              verifyComment={() => verifyComment(item.id)}
              onSelect={() =>
                props.navigation.navigate('Reply Discussion', {
                  cid: item.id,
                  time: timeDifference(new Date(), item.creation.toDate()),
                  xxx: item.likeBy.includes(userId),
                  mainCommentAuthorName: item.postedBy,
                  mainCommentUserId: item.userId,
                  pushToken: item.pushToken,
                  discussionId: discussionId,
                })
              }
            />
          ) : null
        }
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={{ width: '100%' }}>
                  <Text style={styles.title}>{userPosts.title}</Text>
                </View>
              </View>
            </View>

            {userPosts.downloadURL && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 10,
                  justifyContent: 'center',
                }}
              >
                {/* <Image style={styles.image} source={{ uri: userPosts.downloadURL }} /> */}
                <Images
                  width={Dimensions.get('window').width} // height will be calculated automatically
                  source={{ uri: userPosts.downloadURL }}
                />
              </View>
            )}

            {userPosts.description ? (
              <Text style={styles.descT}>{userPosts.description}</Text>
            ) : null}
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
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size='large' color='#E3562A' />
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

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                  style={{ justifyContent: 'center', alignItems: 'center' }}
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
                  style={{ justifyContent: 'center', alignItems: 'center' }}
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

  floatButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
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

  title: {
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
    marginBottom: 5,
  },

  descT: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'Poppins',
    marginTop: 10,
  },

  comT: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 18,
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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  fullComments: store.userState.comment,
  options: store.userState.option,
  discussionList: store.userState.posts,
  report: store.userState.reportedDiscussion,
});

export default connect(mapStateToProps, null)(LectureDiscussionView);
