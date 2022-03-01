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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import firebase from 'firebase';
require('firebase/firestore');
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import ParsedText from 'react-native-parsed-text';
import * as Linking from 'expo-linking';
import AddComment from '../../component/addComment';
import EditCommentCom from '../../component/editComment';
import MainCommentCard from '../../component/mainCommentCard';
import ReportReplyCommentCard from '../../component/ReportReplyCommentCard';
import { ListItem, BottomSheet } from 'react-native-elements';
import ReportMainCommentCard from '../../component/ReportMainCommentCard';

function Reply(props) {
  const { currentUser, posts } = props;
  const [currentUserName, setCurrentUserName] = useState(currentUser.name);
  const [loginCurrentUser, setLoginCurrentUser] = useState(currentUser);
  const [cu, setCu] = useState(currentUser);
  const [mainCommentId, setMainCommentId] = useState(props.route.params.cid);
  const [mainComment, setMainComment] = useState([]);
  const [data, setData] = useState(0);
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
  const [temporaryId, setTemporaryId] = useState(null);
  const [isVisibleV2, setIsVisibleV2] = useState(false);
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [temporaryIdSubComment, setTemporaryIdSubComment] = useState(null);
  const [mainCommentAuthorName, setMainCommentAuthorName] = useState(
    props.route.params.mainCommentAuthorName
  );
  const [replyCommentToken, setReplyCommentToken] = useState(); //changes for notification
  const [repliedSubCommentUserId, setRepliedSubCommentUserId] = useState(null); //noti

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
  const [allUsers, setAllUsers] = useState([]); //change for contribution
  const [discussionData, setDiscussionData] = useState([]); //change for contribution

  const userId = firebase.auth().currentUser.uid;
  const userIdV2 = firebase.auth().currentUser.uid;
  const time = props.route.params.time;

  //changes
  const pushToken = props.route.params.pushToken;
  const mainCommentUserId = props.route.params.mainCommentUserId; //changes conti/noti
  const discussionId = props.route.params.discussionId;
  //changes

  const notificationId = props.route.params.notificationId;

  let totalReply; //change for contribution
  const images = [
    {
      uri: props.attachedImage,
    },
  ];

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

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const toggleVisibilityV2 = (cid) => {
    setIsVisibleV2(true);
    setTemporaryId(cid);
  };

  const deleteNotifications = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Notifications')
      .doc(notificationId)
      .delete();

    console.log('deletion done');
  };

  useEffect(() => {
    setImage(null);
    setDoc(null);
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .get()
      .then((snapshot) => {
        setMainComment(snapshot.data());
      });

    firebase
      .firestore()
      .collection('Comment')
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

    //change for contribution
    firebase
      .firestore()
      .collection('Discussion')
      .doc(discussionId)
      .get()
      .then((snapshot) => {
        setDiscussionData(snapshot.data());
      });
    //change for contribution

    //change for contribution
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
    //change for contribution

    firebase
      .firestore()
      .collection('Comment')
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
    // setTimeout(function () {
    //   setLoadMoreLoading(false);
    // }, 2000);

    setData(100); // changes
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('Comment')
        .doc(mainCommentId)
        .get()
        .then((snapshot) => {
          setMainComment(snapshot.data());
        });

      firebase
        .firestore()
        .collection('Comment')
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

      //change for contribution
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
      //change for contribution

      setData(24);
    }, [data])
  );

  useEffect(() => {
    if (notificationId) {
      deleteNotifications();
    }
  }, [notificationId]);

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
    if (image == null && Doc == null) {
      ReplyComment(null, null);
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

    //change for contribution

    //updating noOfComments under user
    let mainCommentOwner;
    let replyPoints;
    let replyAward;
    let replyUserTitle;
    let points;
    let userTitle;
    let award;
    let creation = new Date();
    if (currentUser.status === 0) {
      const commentNo = cu.noOfComments + 1;

      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .update({
          noOfComments: commentNo,
        })
        .then(() => {
          console.log('done');
        });
      console.log(commentNo);
      //updating noOfComments under user

      //update totalPoints and awards based on the noOfComments
      points = cu.totalPoints;
      userTitle = cu.title;
      award = cu.awards;
      console.log(award);

      if (
        commentNo === 1 &&
        !award.some((el) => el.title === 'First Comment')
      ) {
        award.push({
          title: 'First Comment',
          description:
            'Post a comment on any discussion created to receive this',
          pointsToBeAdded: 1,
          creation: creation.toISOString(),
        });
        points = points + 1;
      } else if (
        commentNo === 30 &&
        !award.some((el) => el.title === 'Keep Coming Back')
      ) {
        award.push({
          title: 'Keep Coming Back',
          description: '30 comments posted! You must like it here!',
          pointsToBeAdded: 5,
          creation: creation.toISOString(),
        });
        points = points + 5;
      } else if (
        commentNo === 100 &&
        !award.some((el) => el.title === "Can't Stop")
      ) {
        award.push({
          title: "Can't Stop",
          description:
            "You've posted 100 comments. I hope this took you more than a day",
          pointsToBeAdded: 10,
          creation: creation.toISOString(),
        });
        points = points + 10;
      } else if (
        commentNo === 300 &&
        !award.some((el) => el.title === 'Contribution Fanatic')
      ) {
        award.push({
          title: 'Contribution Fanatic',
          description: '300 comments. Impressive',
          pointsToBeAdded: 15,
          creation: creation.toISOString(),
        });
        points = points + 15;
      }
      console.log(points);

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
        .doc(userId)
        .update({
          totalPoints: points,
          awards: award,
          title: userTitle,
        })
        .then(() => {
          console.log('done');
        });
      //update totalPoints and awards based on the noOfComments
    }
    //update totalPoints and awards based on the noOfReplies
    mainCommentOwner = allUsers.find((el) => el.id === mainComment.userId);
    if (mainCommentOwner.status === 0) {
      if (userId === mainCommentOwner.id) {
        replyPoints = points;
        replyAward = award;
        replyUserTitle = userTitle;
      } else {
        replyPoints = mainCommentOwner.totalPoints;
        replyAward = mainCommentOwner.awards;
        replyUserTitle = mainCommentOwner.title;
      }

      if (
        totalReply === 20 &&
        !replyAward.some((el) => el.title === 'Attracter')
      ) {
        replyAward.push({
          title: 'Attracter',
          description: 'One of your main comments has obtained 20 replies ',
          pointsToBeAdded: 10,
          creation: creation.toISOString(),
        });
        replyPoints = replyPoints + 10;
      } else if (
        totalReply === 40 &&
        !replyAward.some((el) => el.title === 'Super Magnet')
      ) {
        replyAward.push({
          title: 'Super Magnet',
          description: 'One of your main comments has obtained 50 replies ',
          pointsToBeAdded: 20,
          creation: creation.toISOString(),
        });
        replyPoints = replyPoints + 20;
      }

      //updating userTitle based on Points
      if (replyPoints >= 0 && replyPoints <= 100) {
        replyUserTitle = 'Beginner';
      } else if (replyPoints > 100 && replyPoints <= 300) {
        replyUserTitle = 'Intermediate';
      } else if (replyPoints > 300 && replyPoints <= 500) {
        replyUserTitle = 'Expert';
      } else if (replyPoints > 500) {
        replyUserTitle = 'Legend';
      }
      //updating userTitle based on Points

      firebase
        .firestore()
        .collection('users')
        .doc(mainCommentUserId)
        .update({
          totalPoints: replyPoints,
          awards: replyAward,
          title: replyUserTitle,
        })
        .then(() => {
          console.log('done');
        })
        .catch((err) => {
          console.log(err);
        });

      //update totalPoints and awards based on the noOfReplies
    }
    //alteration needed
    //updating noOfComments under a specific discussion
    const discussionCommentNo = discussionData.noOfComments + 1;
    const discussionOwner = allUsers.find(
      (el) => el.id === discussionData.userId
    );
    let discussionOwnerPoints;
    let discussionOwnerAwards;
    let discussionOwnerTitle;

    firebase
      .firestore()
      .collection('Discussion')
      .doc(mainComment.discussionId)
      .update({
        noOfComments: discussionCommentNo,
      })
      .then(() => {
        console.log('done');
      })
      .catch((err) => {
        console.log(err);
      });

    //updating noOfComments under a specific discussion
    if (discussionOwner.status === 0) {
      //updating totalPoints and awards based on the noOfComments in a discussion
      if (
        (discussionOwner.id === userId &&
          discussionOwner.id === mainCommentOwner.id) ||
        (discussionOwner.id !== userId &&
          discussionOwner.id === mainCommentOwner.id)
      ) {
        discussionOwnerPoints = replyPoints;
        discussionOwnerAwards = replyAward;
        discussionOwnerTitle = replyUserTitle;
      } else if (
        discussionOwner.id === userId &&
        discussionOwner.id !== mainCommentOwner.id
      ) {
        discussionOwnerPoints = points;
        discussionOwnerAwards = award;
        discussionOwnerTitle = userTitle;
      } else {
        discussionOwnerPoints = discussionOwner.totalPoints;
        discussionOwnerAwards = discussionOwner.awards;
        discussionOwnerTitle = discussionOwner.title;
      }

      if (
        discussionCommentNo === 30 &&
        !discussionOwnerAwards.some((el) => el.title === 'Interesting Topic')
      ) {
        discussionOwnerAwards.push({
          title: 'Interesting Topic',
          description:
            'One of your posted disucssions has attracted 30 comments',
          pointsToBeAdded: 15,
          creation: creation.toISOString(),
        });
        discussionOwnerPoints = discussionOwnerPoints + 15;
      } else if (
        discussionCommentNo === 60 &&
        !discussionOwnerAwards.some(
          (el) => el.title === 'Super Interesting Topic'
        )
      ) {
        discussionOwnerAwards.push({
          title: 'Super Interesting Topic',
          description:
            'One of your posted disucssions has attracted 60 comments',
          pointsToBeAdded: 25,
          creation: creation.toISOString(),
        });
        discussionOwnerPoints = discussionOwnerPoints + 25;
      }

      //updating userTitle based on Points
      if (discussionOwnerPoints >= 0 && discussionOwnerPoints <= 100) {
        discussionOwnerTitle = 'Beginner';
      } else if (discussionOwnerPoints > 100 && discussionOwnerPoints <= 300) {
        discussionOwnerTitle = 'Intermediate';
      } else if (discussionOwnerPoints > 300 && discussionOwnerPoints <= 500) {
        discussionOwnerTitle = 'Expert';
      } else if (discussionOwnerPoints > 500) {
        discussionOwnerTitle = 'Legend';
      }
      //updating userTitle based on Points

      firebase
        .firestore()
        .collection('users')
        .doc(discussionOwner.id)
        .update({
          totalPoints: discussionOwnerPoints,
          awards: discussionOwnerAwards,
          title: discussionOwnerTitle,
        })
        .then(() => {
          console.log('done');
        });
      //updating totalPoints and awards based on the noOfComments in a discussion
    }
    //change for contribution

    //  ------------------ Sending Push Notification To Author of Main Comment -----------------------
    let notificationTitle = `${currentUser.name} replied to your comment`;

    if (cu.status === 1) {
      notificationTitle = `A lecturer replied to your comment`;
    }

    // console.log(token);
    if (mainCommentUserId !== userId) {
      firebase
        .firestore()
        .collection('users')
        .doc(mainCommentUserId)
        .collection('Notifications')
        .add({
          title: notificationTitle,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          pageId: mainCommentId,
          description: newReply,
          userId: userId,
          dataType: 'cid',
        });

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: pushToken,
          title: notificationTitle,
          body: 'Tap to see the comment',
          priority: 'normal',
          data: { cid: mainCommentId, description: newReply, userId: userId },
        }),
      });
    }

    //  ------------------ Sending Push Notification To Author of Main Comment  -----------------------
  };

  const UploadCommentV2 = () => {
    if (image == null && Doc == null) {
      ReplySubComment(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV3();
    }

    if (image == null && Doc != null) {
      uploadDocV1();
    }

    if (image != null && Doc == null) {
      uploadImageV1();
    }

    //change for contribution
    let mainCommentOwner;
    let replyPoints;
    let replyAward;
    let replyUserTitle;
    let points;
    let userTitle;
    let award;
    let creation = new Date();
    if (currentUser.status === 0) {
      //updating noOfComments under user
      const commentNo = cu.noOfComments + 1;

      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .update({
          noOfComments: commentNo,
        })
        .then(() => {
          console.log('done');
        });
      //updating noOfComments under user

      //update totalPoints and awards based on the noOfComments
      points = cu.totalPoints;
      userTitle = cu.title;
      award = cu.awards;

      if (
        commentNo === 1 &&
        !award.some((el) => el.title === 'First Comment')
      ) {
        award.push({
          title: 'First Comment',
          description:
            'Post a comment on any discussion created to receive this',
          pointsToBeAdded: 1,
          creation: creation.toISOString(),
        });
        points = points + 1;
      } else if (
        commentNo === 30 &&
        !award.some((el) => el.title === 'Keep Coming Back')
      ) {
        award.push({
          title: 'Keep Coming Back',
          description: '30 comments posted! You must like it here!',
          pointsToBeAdded: 5,
          creation: creation.toISOString(),
        });
        points = points + 5;
      } else if (
        commentNo === 100 &&
        !award.some((el) => el.title === "Can't Stop")
      ) {
        award.push({
          title: "Can't Stop",
          description:
            "You've posted 100 comments. I hope this took you more than a day",
          pointsToBeAdded: 10,
          creation: creation.toISOString(),
        });
        points = points + 10;
      } else if (
        commentNo === 300 &&
        !award.some((el) => el.title === 'Contribution Fanatic')
      ) {
        award.push({
          title: 'Contribution Fanatic',
          description: '300 comments. Impressive',
          pointsToBeAdded: 15,
          creation: creation.toISOString(),
        });
        points = points + 15;
      }

      // console.log(points);

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
        .doc(userId)
        .update({
          totalPoints: points,
          awards: award,
          title: userTitle,
        })
        .then(() => {
          console.log('done');
        });
      //update totalPoints and awards based on the noOfComments
    }

    //update totalPoints and awards based on the noOfReplies
    mainCommentOwner = allUsers.find((el) => el.id === mainComment.userId);
    // console.log(mainCommentOwner.name);

    if (mainCommentOwner.status === 0) {
      if (userId === mainCommentOwner.id) {
        replyPoints = points;
        replyAward = award;
        replyUserTitle = userTitle;
      } else {
        replyPoints = mainCommentOwner.totalPoints;
        replyAward = mainCommentOwner.awards;
        replyUserTitle = mainCommentOwner.title;
      }

      if (
        totalReply === 20 &&
        !replyAward.some((el) => el.title === 'Attracter')
      ) {
        replyAward.push({
          title: 'Attracter',
          description: 'One of your comments has obtained 20 replies ',
          pointsToBeAdded: 10,
          creation: creation.toISOString(),
        });
        replyPoints = replyPoints + 10;
      } else if (
        totalReply === 40 &&
        !replyAward.some((el) => el.title === 'Super Magnet')
      ) {
        replyAward.push({
          title: 'Super Magnet',
          description: 'One of your comments has obtained 50 replies ',
          pointsToBeAdded: 20,
          creation: creation.toISOString(),
        });
        replyPoints = replyPoints + 20;
      }
      // console.log(mainCommentUserId)
      // console.log(replyPoints);
      // console.log(replyAward);

      //updating userTitle based on Points
      if (replyPoints >= 0 && replyPoints <= 100) {
        replyUserTitle = 'Beginner';
      } else if (replyPoints > 100 && replyPoints <= 300) {
        replyUserTitle = 'Intermediate';
      } else if (replyPoints > 300 && replyPoints <= 500) {
        replyUserTitle = 'Expert';
      } else if (replyPoints > 500) {
        replyUserTitle = 'Legend';
      }
      //updating userTitle based on Points

      firebase
        .firestore()
        .collection('users')
        .doc(mainCommentUserId)
        .update({
          totalPoints: replyPoints,
          awards: replyAward,
          title: replyUserTitle,
        })
        .then(() => {
          console.log('done');
        })
        .catch((err) => {
          console.log(err);
        });

      //update totalPoints and awards based on the noOfReplies
    }
    console.log('hi');
    //updating noOfComments under a specific discussion
    const discussionCommentNo = discussionData.noOfComments + 1;
    const discussionOwner = allUsers.find(
      (el) => el.id === discussionData.userId
    );
    let discussionOwnerPoints;
    let discussionOwnerAwards;
    let discussionOwnerTitle;

    firebase
      .firestore()
      .collection('Discussion')
      .doc(mainComment.discussionId)
      .update({
        noOfComments: discussionCommentNo,
      })
      .then(() => {
        console.log('done');
      })
      .catch((err) => {
        console.log(err);
      });

    //updating noOfComments under a specific discussion

    if (discussionOwner.status === 0) {
      //updating totalPoints and awards based on the noOfComments in a discussion
      if (
        (discussionOwner.id === userId &&
          discussionOwner.id === mainCommentOwner.id) ||
        (discussionOwner.id !== userId &&
          discussionOwner.id === mainCommentOwner.id)
      ) {
        discussionOwnerPoints = replyPoints;
        discussionOwnerAwards = replyAward;
        discussionOwnerTitle = replyUserTitle;
      } else if (
        discussionOwner.id === userId &&
        discussionOwner.id !== mainCommentOwner.id
      ) {
        discussionOwnerPoints = points;
        discussionOwnerAwards = award;
        discussionOwnerTitle = userTitle;
      } else {
        discussionOwnerPoints = discussionOwner.totalPoints;
        discussionOwnerAwards = discussionOwner.awards;
        discussionOwnerTitle = discussionOwner.title;
      }

      if (
        discussionCommentNo === 30 &&
        !discussionOwnerAwards.some((el) => el.title === 'Interesting Topic')
      ) {
        discussionOwnerAwards.push({
          title: 'Interesting Topic',
          description:
            'One of your posted disucssions has attracted 30 comments',
          pointsToBeAdded: 15,
          creation: creation.toISOString(),
        });
        discussionOwnerPoints = discussionOwnerPoints + 15;
      } else if (
        discussionCommentNo === 60 &&
        !discussionOwnerAwards.some(
          (el) => el.title === 'Super Interesting Topic'
        )
      ) {
        discussionOwnerAwards.push({
          title: 'Super Interesting Topic',
          description:
            'One of your posted disucssions has attracted 60 comments',
          pointsToBeAdded: 25,
          creation: creation.toISOString(),
        });
        discussionOwnerPoints = discussionOwnerPoints + 25;
      }

      //updating userTitle based on Points
      if (discussionOwnerPoints >= 0 && discussionOwnerPoints <= 100) {
        discussionOwnerTitle = 'Beginner';
      } else if (discussionOwnerPoints > 100 && discussionOwnerPoints <= 300) {
        discussionOwnerTitle = 'Intermediate';
      } else if (discussionOwnerPoints > 300 && discussionOwnerPoints <= 500) {
        discussionOwnerTitle = 'Expert';
      } else if (discussionOwnerPoints > 500) {
        discussionOwnerTitle = 'Legend';
      }
      //updating userTitle based on Points

      firebase
        .firestore()
        .collection('users')
        .doc(discussionOwner.id)
        .update({
          totalPoints: discussionOwnerPoints,
          awards: discussionOwnerAwards,
          title: discussionOwnerTitle,
        })
        .then(() => {
          console.log('done');
        });

      //updating totalPoints and awards based on the noOfComments in a discussion
    }
    //change for contribution

    let notificationTitle = `${currentUser.name} replied to your comment`;
    console.log('hi');
    if (cu.status === 1) {
      notificationTitle = `A lecturer replied to your comment`;
    }
    //  ------------------ Sending Push Notification To Author of Reply Comment -----------------------
    if (repliedSubCommentUserId !== userId) {
      console.log('hi');
      firebase
        .firestore()
        .collection('users')
        .doc(repliedSubCommentUserId)
        .collection('Notifications')
        .add({
          title: notificationTitle,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          pageId: mainCommentId,
          description: replyOfSubComment,
          userId: userId,
          dataType: 'cid',
        });
      console.log('hi');
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: replyCommentToken,
          title: notificationTitle,
          body: 'Tap to see the comment',
          priority: 'normal',
          data: {
            cid: mainCommentId,
            description: replyOfSubComment,
            userId: userId,
          },
        }),
      });

      console.log('hi');
    }

    //  ------------------ Sending Push Notification To Author of Reply Comment -----------------------
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
        ReplySubComment(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const addLike = (nol) => {
    const x = nol + 1;
    if (mainComment.likeBy.includes(userId)) {
    } else {
      mainComment.likeBy.push(userId);
    }

    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(2);

    //change for contribution
    //updating number of likes under user
    const commentPostedBy = mainComment.userId;
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);
    console.log(x);

    if (commentOwner.status === 0) {
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
      //change for contribution
    }

    //  ------------------ Sending Push Notification To Author of  Main Comment -----------------------
    console.log(mainCommentUserId);
    console.log(userId);
    let notificationTitle = `${currentUser.name} liked your comment`;

    if (cu.status === 1) {
      notificationTitle = `A lecturer liked your comment`;
    }

    if (mainCommentUserId === userId) {
      console.log('Same user');
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(mainCommentUserId)
        .collection('Notifications')
        .add({
          title: notificationTitle,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          pageId: mainCommentId,
          description: mainComment.comment,
          userId: userId,
          dataType: 'cid',
        });

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: pushToken,
          title: notificationTitle,
          body: 'Tap to see the comment',
          priority: 'normal',
          data: {
            cid: mainCommentId,
            description: mainComment.comment,
            userId: userId,
          },
        }),
      });
    }
    //  ------------------ Sending Push Notification To Author of  Main Comment -----------------------
  };

  const removeLike = (nol) => {
    const x = nol - 1;
    const indexx = mainComment.likeBy.indexOf(userId);
    if (indexx > -1) {
      mainComment.likeBy.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(3);

    //change for contribution

    //updating number of likes under user
    const commentPostedBy = mainComment.userId;
    // console.log(commentPostedBy);
    // console.log(allUsers);
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);
    // console.log(commentPostedBy);
    // console.log(commentOwner);

    if (commentOwner.status === 0) {
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
      //change for contribution
    }
  };

  const Delete = () => {
    setIsVisible(false);
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
            //change for contribution

            //obtain noOfReplies for a mainComment
            const currentReplyNo = mainComment.numberOfReply;
            console.log(currentReplyNo);
            //obtain noOfReplies for a mainComment

            //change for contribution

            firebase
              .firestore()
              .collection('Comment')
              .doc(mainCommentId)
              .delete();

            //change for contribution
            if (currentUser.status === 0) {
              //updating noOfComments under user
              const commentNo = cu.noOfComments - 1;
              firebase
                .firestore()
                .collection('users')
                .doc(userId)
                .update({
                  noOfComments: commentNo,
                })
                .then(() => {
                  console.log('done');
                });
              //updating noOfComments under user
            }

            //updating noOfComments under discussion
            const discussionCommentNo =
              discussionData.noOfComments - 1 - currentReplyNo;
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
            //updating noOfComments under discussion

            //change for contribution

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
    setIsVisible(false);
    setEditComment(mainComment.comment);
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const EditReplyComment = (rcid) => {
    setIsVisibleV2(false);
    setEditReplyCommentId(rcid);
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .get()
      .then((snapshot) => {
        setEditReplyComment(snapshot.data().comment);
      });
    setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    console.log(rcid);
  };

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const uploadUpdatedComment = () => {
    if (!editComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
        .doc(mainCommentId)
        .update({
          comment: editComment,
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

  const toggleSubReplyComment = (id, posted, token, userId) => {
    setIdOfRepliedSubComment(id);
    setAuthorOfRepliedSubComment(posted);
    setReplyCommentToken(token); //added
    setRepliedSubCommentUserId(userId); //added
    setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
  };

  const ReplySubComment = (doc, img) => {
    if (!replyOfSubComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
        .doc(mainCommentId)
        .collection('Reply')
        .add({
          comment: replyOfSubComment,
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
          pushToken: currentUser.pushToken, // change for notification
        });

      totalReply = mainComment.numberOfReply + 1;
      firebase.firestore().collection('Comment').doc(mainCommentId).update({
        numberOfReply: totalReply,
      });
      setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
    }

    setData(59);
  };

  const ReplyComment = (doc, img) => {
    if (!newReply.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
        .doc(mainCommentId)
        .collection('Reply')
        .add({
          comment: newReply,
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
          pushToken: currentUser.pushToken, // change for notification
        });

      totalReply = mainComment.numberOfReply + 1;
      console.log(totalReply);
      firebase.firestore().collection('Comment').doc(mainCommentId).update({
        numberOfReply: totalReply,
      });
      console.log(totalReply);
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
              .collection('Comment')
              .doc(mainCommentId)
              .collection('Reply')
              .doc(rcid)
              .delete();

            //change for contribution
            setData(20);
            //update noOfReplies for a mainComment // already changed
            const totalReply = mainComment.numberOfReply - 1;
            firebase
              .firestore()
              .collection('Comment')
              .doc(mainCommentId)
              .update({
                numberOfReply: totalReply,
              });
            //update noOfReplies for a mainComment

            if (currentUser.status === 0) {
              //update noOfComments under user
              const commentNo = cu.noOfComments - 1;
              firebase
                .firestore()
                .collection('users')
                .doc(userId)
                .update({
                  noOfComments: commentNo,
                })
                .then(() => {
                  console.log('done');
                });
              //update noOfComments under user
            }

            //update noOfComments under discussion
            console.log(discussionData.noOfComments);
            const discussionCommentNo = discussionData.noOfComments - 1;
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
            //update noOfComments under discussion

            //change for contribution

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
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection('Comment')
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

    //change for contribution

    //updating number of likes under user
    const commentPostedBy = uid;
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);
    console.log(x);

    if (commentOwner.status === 0) {
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
    //change for contribution

    let notificationTitle = `${currentUserName} liked your comment`;
    if (cu.status === 1) {
      notificationTitle = `A lecturer liked to your comment`;
    }

    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .get()
      .then((snapshot) => {
        //  ------------------ Sending Push Notification To Author of ReplyComment -----------------------
        if (snapshot.data().postedBy !== currentUserName) {
          firebase
            .firestore()
            .collection('users')
            .doc(snapshot.data().userId)
            .collection('Notifications')
            .add({
              title: notificationTitle,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              pageId: mainCommentId,
              description: snapshot.data().comment,
              userId: userId,
              dataType: 'cid',
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
              priority: 'high',
              data: {
                cid: mainCommentId,
                description: snapshot.data().comment,
                userId: userId,
              },
            }),
          });
        }
        //  ------------------ Sending Push Notification To Author of ReplyComment -----------------------
      });
  };

  const RemoveLikeToReplyComment = (rcid, nol, lb, uid) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('Comment')
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

    //change for contribution

    //updating number of likes under user
    const commentPostedBy = uid;
    // console.log(commentPostedBy);
    // console.log(allUsers);
    const commentOwner = allUsers.find((el) => el.id === commentPostedBy);
    // console.log(commentPostedBy);
    // console.log(commentOwner);

    if (commentOwner.status === 0) {
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

  const UploadEditSubComment = () => {
    if (!editReplyComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('Comment')
        .doc(mainCommentId)
        .collection('Reply')
        .doc(editReplyCommentId)
        .update({
          comment: editReplyComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('save');
        });

      setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    }

    setData(44);
  };

  const removeVerifyComment = () => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .update({
        verify: false,
      })
      .then(() => {
        console.log('done');
      });
    setData(6);
  };

  const verifyComment = () => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .update({
        verify: true,
      })
      .then(() => {
        console.log('done');
      });
    setData(5);

    //  ------------------ Sending Push Notification To Author of Comment -----------------------

    const notificationTitle = `A lecturer verified your comment`;
    const notificationTitle2 = `A lecturer verfied a comment in your discussion thread`;
    const mainDiscussion = posts.find((el) => el.id === discussionId);

    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
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
            pageId: mainCommentId,
            description: snapshot.data().comment,
            userId: userId,
            dataType: 'cid',
          });

        firebase
          .firestore()
          .collection('users')
          .doc(mainDiscussion.userId)
          .collection('Notifications')
          .add({
            title: notificationTitle2,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            pageId: mainCommentId,
            description: snapshot.data().comment,
            userId: userId,
            dataType: 'cid',
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
              cid: mainCommentId,
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
              cid: mainCommentId,
              description: snapshot.data().comment,
              userId: userId,
            },
          }),
        });
      });
    //  ------------------ Sending Push Notification To Author of Comment -----------------------
  };

  const removeVerifyReplyComment = (rcid) => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .update({
        verify: false,
      })
      .then(() => {
        console.log('done');
      });

    setData(73);
  };

  const verifyReplyComment = (rcid) => {
    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
      .update({
        verify: true,
      })
      .then(() => {
        console.log('done');
      });
    setData(70);

    //  ------------------ Sending Push Notification To Author of Comment -----------------------
    const notificationTitle = `A lecturer verified your comment`;
    const notificationTitle2 = `A lecturer verfied a comment in your discussion thread`;
    const mainDiscussion = posts.find((el) => el.id === discussionId);

    firebase
      .firestore()
      .collection('Comment')
      .doc(mainCommentId)
      .collection('Reply')
      .doc(rcid)
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
            pageId: mainCommentId,
            description: snapshot.data().comment,
            dataType: 'cid',
          });

        firebase
          .firestore()
          .collection('users')
          .doc(mainDiscussion.userId)
          .collection('Notifications')
          .add({
            title: notificationTitle2,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            pageId: mainCommentId,
            description: snapshot.data().comment,
            userId: userId,
            dataType: 'cid',
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
              cid: mainCommentId,
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
              cid: mainCommentId,
              description: snapshot.data().comment,
              userId: userId,
            },
          }),
        });
      });
    //  ------------------ Sending Push Notification To Author of Comment -----------------------
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
            <ReportReplyCommentCard
              componentStatus={1}
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
                RemoveLikeToReplyComment(
                  item.id,
                  item.numOfLike,
                  item.likeBy,
                  item.userId
                )
              }
              AddLikeToReplyComment={() =>
                AddLikeToReplyComment(
                  item.id,
                  item.numOfLike,
                  item.likeBy,
                  item.userId
                )
              }
              toggleSubReplyComment={() =>
                toggleSubReplyComment(
                  item.id,
                  item.postedBy,
                  item.pushToken,
                  item.userId
                )
              }
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            <ReportMainCommentCard
              componentStatus={1}
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
              removeLike={() =>
                removeLike(
                  mainComment.id,
                  mainComment.numOfLike,
                  mainComment.likeBy
                )
              }
              xxx={() => toggleVisibility(mainComment.id)}
              addLike={() =>
                addLike(
                  mainComment.id,
                  mainComment.numOfLike,
                  mainComment.likeBy
                )
              }
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
            {/* BottomSheet for main comment */}
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

            {/* BottomSheet for sub comment */}
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
              <EditCommentCom
                editComment={editComment}
                setEditComment={(editComment) => setEditComment(editComment)}
                uploadUpdatedComment={() => uploadUpdatedComment()}
                toggleEditComment={() => toggleEditComment()}
              />
            </Modal>

            {/* Reply Comment Modal */}
            <Modal isVisible={isReplyCommentModalVisible}>
              <AddComment
                setNewComment={(newReply) => setNewReply(newReply)}
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                UploadComment={() => UploadComment()}
                toggleModal={() => toggleReplyComment()}
                image={image}
                Doc={Doc}
              />
            </Modal>

            {/* Reply to Reply Comment Modal */}
            <Modal isVisible={isReplySubCommentModalVisible}>
              <AddComment
                setNewComment={(replyOfSubComment) =>
                  setReplyOfSubComment(replyOfSubComment)
                }
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                UploadComment={() => UploadCommentV2()}
                toggleModal={() => toggleSubReplyComment()}
                image={image}
                Doc={Doc}
              />
            </Modal>

            {/* Edit Reply Comment */}
            <Modal isVisible={isEditReplyCommentModalVisible}>
              <EditCommentCom
                editComment={editReplyComment}
                setEditComment={(editReplyComment) =>
                  setEditReplyComment(editReplyComment)
                }
                uploadUpdatedComment={() => UploadEditSubComment()}
                toggleEditComment={() => toggleReplyEditComment()}
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
    margin: 10,
  },

  mainBubble: {
    borderColor: '#E3562A',
    borderBottomWidth: 5,
    width: '87%',
    padding: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    marginBottom: 5,
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

  url: {
    color: 'red',
    textDecorationLine: 'underline',
  },

  email: {
    textDecorationLine: 'underline',
  },

  text: {
    color: 'black',
    fontSize: 15,
  },

  phone: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  name: {
    color: 'red',
  },

  username: {
    color: 'green',
    fontWeight: 'bold',
  },

  hashTag: {
    fontStyle: 'italic',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Reply);
