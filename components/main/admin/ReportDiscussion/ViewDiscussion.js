import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as Linking from 'expo-linking';
import Images from 'react-native-scalable-image';
import { timeDifference } from '../../../utils';
import { version } from 'react-dom';
import ReportComment from '../../component/ReportCommet';
require('firebase/firestore');

function LectureDiscussionView(props) {
  const { currentUser, options, discussionList } = props; //notification
  const [commentId, setCommentId] = useState(null);
  const [newOption, setOption] = useState(options);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [isReportVisible, setReportVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [data, setData] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [cu, setCu] = useState(currentUser);
  const [discussList, setDiscussList] = useState();
  const [discussionId, setDiscussionId] = useState(props.route.params.rdid);
  const [ReportedDiscussionId, setReportedDiscussionId] = useState(
    props.route.params.rid
  );
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

  useEffect(() => {
    const { currentUser, comments } = props;
    setUser(currentUser);

    if (props.route.params.rdid) {
      setDiscussionId(props.route.params.rdid);
    }

    firebase
      .firestore()
      .collection('Discussion')
      .doc(props.route.params.rdid)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
      });

    firebase
      .firestore()
      .collection('Comment')
      .orderBy('creation', 'asc')
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

    setData(11);
  }, [props.currentUser, props.route.params.rdid, data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('Comment')
        .orderBy('creation', 'asc')
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
        .collection('Discussion')
        .doc(props.route.params.rdid)
        .get()
        .then((snapshot) => {
          setUserPosts(snapshot.data());
        });
    }, [data])
  );

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='remove-circle-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                Ignore();
              }}
            />
          </TouchableOpacity>
          <Icon
            name='trash-outline'
            type='ionicon'
            size={30}
            color='#000'
            onPress={() => Delete()}
          />
        </View>
      ),
    });
  }, [data]);

  const Delete = () => {
    const discussionToDelete = discussionList.find(
      (el) => el.id === discussionId
    );
    const token = discussionToDelete.pushToken;
    const title = discussionToDelete.title;
    const discussionOwnerId = discussionToDelete.userId;
    console.log({ token, title, discussionOwnerId });
    const notificationTitle = `Your discussion entitled ${title} has been deleted following the receival of reports from the user/users`;

    return Alert.alert(
      'Delete',
      'Are you sure you want to remove this Discussion ?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            setIsVisible(false);
            firebase
              .firestore()
              .collection('Discussion')
              .doc(discussionId)
              .delete();
            firebase
              .firestore()
              .collection('ReportedDiscussion')
              .doc(ReportedDiscussionId)
              .delete();

            //  -------------------- Sending Push Notification To Author of Discussion -----------------------
            setData(60);
            firebase
              .firestore()
              .collection('users')
              .doc(discussionOwnerId)
              .collection('Notifications')
              .add({
                title: notificationTitle,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                pageId: 'null',
                description: title,
                userId: userId,
                dataType: 'deleteId',
              });

            fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: token,
                title: notificationTitle,
                body: `${title}: Deleted`,
                priority: 'normal',
                data: { deleteId: 'null', description: title, userId: userId },
              }),
            });
            //  ------------------ Sending Push Notification To Author of Discussion -----------------------
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

  const Ignore = () => {
    return Alert.alert(
      'Ignore',
      'Are you sure you want to ignore this Discussion ?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            firebase
              .firestore()
              .collection('ReportedDiscussion')
              .doc(ReportedDiscussionId)
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

  if (user === null) {
    return <View />;
  }

  if (!isVisible) {
    return <View></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row' }}>
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

            <View style={styles.desc}>
              <Text style={styles.descT}>{userPosts.description}</Text>
            </View>
            <View style={{ paddingBottom: 10 }}>
              <Text style={styles.comT}>Comments:</Text>
            </View>
          </View>
        }
        horizontal={false}
        extraData={comment}
        data={comment}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.discussionId === discussionId ? (
            <ReportComment
              picture={item.image}
              status={2}
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
                props.navigation.navigate('ViewReply', {
                  cid: item.id,
                  time: timeDifference(new Date(), item.creation.toDate()),
                  xxx: item.likeBy.includes(userId),
                  mainCommentAuthorName: item.postedBy,
                })
              }
            />
          ) : null
        }
      />
    </View>
  );
}

////(credits < 30) ? "freshman" : (credits >= 30 && credits < 60) ?"sophomore" : (credits >= 60 && credits < 90) ? "junior" : "senior"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    // marginTop: 20,
    marginBottom: 5,
    // marginLeft: 20,
    // marginLeft:20
  },
  container3: {
    justifyContent: 'center',
    alignItems: 'center',
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

  logo: {
    width: 300,
    height: 400,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
    marginBottom: 5,
  },
  image: {
    flex: 1,
    //aspectRatio: 3 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    resizeMode: 'contain',
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
    fontFamily: 'Poppins',
  },

  comT: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
  },

  userT: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
  },

  userC: {
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontSize: 15,
  },

  userT: {
    fontFamily: 'Poppins',
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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
  options: store.userState.option,
  discussionList: store.userState.posts,
});

export default connect(mapStateToProps, null)(LectureDiscussionView);
