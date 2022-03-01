import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SpeedDial, FAB } from 'react-native-elements';
import { connect } from 'react-redux';
import { timeDifference } from '../../../utils';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
require('firebase/firestore');

function MainScreen(props) {
  const { discussionroom, currentUser } = props;

  if (currentUser === null || currentUser.filteredFeed === null) {
    return <View />;
  }
  const userId = firebase.auth().currentUser.uid;
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .orderBy('creation', 'desc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        //setPost(posts);
        const x = [];
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].groupMember.some((el) => el.userId === userId)) {
            x.push(posts[i]);
            setPost(x);
            // console.log(posts[i]);
          } else {
            // console.log(25);
          }
        }
      });
  }, []);

  //changes
  useFocusEffect(
    React.useCallback(() => {
      firebase
      .firestore()
      .collection('DiscussionRoom')
      .orderBy('creation', 'desc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        const x = [];
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].groupMember.some((el) => el.userId === userId)) {
            x.push(posts[i]);
            setPost(x);
            // console.log(posts[i]);
          } else {
            // console.log(25);
          }
        }
      });
    }, [])
  );
  //changes


  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);

  //   firebase
  //     .firestore()
  //     .collection('DiscussionRoom')
  //     .orderBy('creation', 'desc')
  //     .get()
  //     .then((snapshot) => {
  //       let posts = snapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         const id = doc.id;
  //         return { id, ...data };
  //       });
  //       setPost(posts);
  //       setRefreshing(false);
  //     });

  //   firebase
  //     .firestore()
  //     .collection('users')
  //     .doc(firebase.auth().currentUser.uid)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setCu(snapshot.data().filteredFeed);
  //       } else {
  //         console.log('does not exist');
  //       }
  //     });
  //   setRefreshing(false);
  // }, [refreshing]);

  return (
    <View style={styles.container}>
      <View style={{ margin: 8 }}>
        <FlatList
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          horizontal={false}
          data={post}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    props.navigation.navigate('View Room', {
                      roomId: item.id,
                    })
                  }
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ flex: 1 }}>
                          <Text numberOfLines={2} style={styles.title}>
                            {item.title}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.postedTime}>
                      {timeDifference(new Date(), item.creation.toDate())}
                    </Text>
                  </View>

                  <Text style={styles.faculty}>{item.description}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <SpeedDial
        isOpen={open}
        icon={{ name: 'edit', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={
            <Icon
              reverse
              name='chalkboard-teacher'
              type='font-awesome-5'
              color='#140F38'
            />
          }
          title='Request To Be Mentor'
          onPress={() => props.navigation.navigate('RequestToBeMentor')}
        />
        <SpeedDial.Action
          icon={
            <Icon
              reverse
              name='user-graduate'
              type='font-awesome-5'
              color='#140F38'
            />
          }
          title='Request For Mentor'
          onPress={() => props.navigation.navigate('RequestForMentor')}
        />
      </SpeedDial>
    </View>
  );
}
//<Image source={require('../../../../assets/rfm.png')} style={{height: 30, width:30}}/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    flex: 1,
    aspectRatio: 3 / 1,
  },
  postedTime: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
  },

  userName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
  },

  card: {
    //16
    borderRadius: Dimensions.get('window').width / 24.5,
    elevation: 5,
    backgroundColor: '#003565',
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get('window').width * 0.95,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
  },

  title: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'PoppinsSemiBold',
    lineHeight: 30,
  },
});

const mapStateToProps = (store) => ({
  discussionroom: store.userState.discussionroom,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(MainScreen);
