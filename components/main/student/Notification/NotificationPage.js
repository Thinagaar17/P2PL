import React, { useEffect, useState, useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NotificationList from '../../component/NotificationList';
import { SwipeListView } from 'react-native-swipe-list-view';
import firebase from 'firebase';
require('firebase/firestore');

const NotificationPage = (props) => {
  const [notificationList, setNotificationList] = useState([]);
  const [discussionId, setDiscussionId] = useState([]);
  const [commentId, setCommentId] = useState([]);
  const [roomId, setRoomId] = useState([]);
  const [roomCommentId, setRoomCommentId] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(0);

  useEffect(() => {
    const loadList = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('Notifications')
        .orderBy('creation', 'desc')
        .get()
        .then((snapshot) => {
          let list = snapshot.docs.map((doc) => {
            let id = doc.id;
            let title = doc.data().title;
            let pageId = doc.data().pageId;
            let description = doc.data().description;
            let creation = doc.data().creation;
            let dataType = doc.data().dataType;
            let discussion = null;
            let mainId = null;
            let ownerId = null;
            let mainCommentAuthorName = null;
            let pushToken = null;
            if (doc.data().discussionId) {
              discussion = doc.data().discussionId
            }
            if (doc.data().mainId) {
              mainId = doc.data().mainId
            }
            if (doc.data().ownerId) {
              ownerId = doc.data().ownerId
            }
            if (doc.data().mainCommentAuthorName) {
              mainCommentAuthorName = doc.data().mainCommentAuthorName
            }
            if (doc.data().pushToken) {
              pushToken = doc.data().pushToken
            }
            return { id, title, pageId, description, creation, dataType, discussion, mainId, ownerId, mainCommentAuthorName, pushToken };
          });
          setNotificationList(list);
          console.log(notificationList);
        });

      await firebase
        .firestore()
        .collection('Discussion')
        .get()
        .then((snapshot) => {
          let list = snapshot.docs.map((doc) => {
            let id = doc.id;
            return { id };
          });
          setDiscussionId(list);
        });

      await firebase
        .firestore()
        .collection('Comment')
        .get()
        .then((snapshot) => {
          let list = snapshot.docs.map((doc) => {
            let id = doc.id;
            return { id };
          });
          setCommentId(list);
        });

    
      setIsLoading(false);
    };
    loadList();
    // setData(2);
  }, [data]);

  const removeNotificationHandler = (id) => {
    setNotificationList((currentNotificationList) => {
      return currentNotificationList.filter(
        (notification) => notification.id !== id
      );
    });
  };

  const navigationFunction = (page, id, nId, discussion, mainId, ownerId, mainCommentAuthorName, pushToken) => {
    if (page === 'Discussion') {
      const fid = discussionId.some((el) => el.id === id);
      if (fid) {
        props.navigation.navigate(page, { did: id, notificationId: nId, owner: ownerId });
      } else {
        props.navigation.navigate('FallBackPage', { notificationId: nId });
      }
    } else if (page === 'Reply Discussion') {
      const fid = commentId.some((el) => el.id === id);
      console.log(commentId);
      if (fid) {
        props.navigation.navigate(page, { cid: id, notificationId: nId, discussionId: discussion, mainCommentUserId: mainId, mainCommentAuthorName: mainCommentAuthorName, pushToken:pushToken });
      } else {
        props.navigation.navigate('FallBackPage', { notificationId: nId });
      }
    }
  };

  const renderItem = (data) => (
    <NotificationList
      title={data.item.title}
      description={data.item.description}
      creation={data.item.creation}
      onSelect={() => {
        if (data.item.dataType === 'id') {
          removeNotificationHandler(data.item.id);
          navigationFunction('Discussion',
            data.item.pageId,
            data.item.id,
            null,
            null,
            data.item.ownerId,
            null,
            null,
          );
          // props.navigation.navigate("Discussion", { did: data.item.pageId, notificationId: data.item.id })
        } else if (data.item.dataType === 'cid') {
          removeNotificationHandler(data.item.id);
          navigationFunction(
            'Reply Discussion',
            data.item.pageId,
            data.item.id,
            data.item.discussion,
            data.item.mainId,
            null,
            data.item.mainCommentAuthorName,
            data.item.pushToken
          );
          // props.navigation.navigate("Reply Discussion", { cid: data.item.pageId, notificationId: data.item.id })
        } else if (data.item.dataType === 'mmid') {
          removeNotificationHandler(data.item.id);
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('Notifications')
            .doc(data.item.id)
            .delete();
          props.navigation.navigate('MentorMenteeMainScreenTab');
        } else if (data.item.dataType === 'deleteId') {
          removeNotificationHandler(data.item.id);
          props.navigation.navigate('Created Discussions', {
            notificationId: data.item.id,
          });
        }
      }}
    />
  );

  const deleteRow = (id) => {
    removeNotificationHandler(id);
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Notifications')
      .doc(id)
      .delete();
    console.log('done');
    setData(1);
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size='large' color='#E3562A' />
        </View>
      ) : notificationList.length === 0 ? (
        <View style={styles.fallBack}>
          <Text style={styles.fallbackText}>No New Notifications</Text>
        </View>
      ) : (
        <SwipeListView
          disableRightSwipe
          data={notificationList}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          previewRowKey={'0'}
          rightOpenValue={-85}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fallbackText: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: '#fff',
    padding: 30,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
    borderRadius: 16,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 16,
  },

  backRightBtnRight: {
    backgroundColor: '#FF0000',
    right: 0
  },
});
export default NotificationPage;
