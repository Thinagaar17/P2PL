import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { timeDifference } from '../../../utils';
import firebase from 'firebase';
require('firebase/firestore');

// copy paste whole feed
function Feed(props) {
  const { posts, currentUser } = props;

  if (currentUser === null || currentUser.filteredFeed === null) {
    return <View />;
  }

  const [post, setPost] = useState([]);
  const [data, setData] = useState(0);
  const [rerender, setrerender] = useState(0);
  const [numberOfItem, setNumberOfItem] = useState(50);
  const [loadingMore, setLoadingMore] = useState(false);
  const [FilterFeed, setCu] = useState(currentUser.filteredFeed);
  let stopFetchMore = true;

  useEffect(() => {
    LoadDiscussion();
    FetchAllDiscussion();
  }, [rerender]);

  useFocusEffect(
    React.useCallback(() => {
      LoadDiscussion();
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data().filteredFeed);
          } else {
            console.log('does not exist');
          }
        });
    }, [])
  );

  const LoadDiscussion = () => {
    setLoadingMore(!loadingMore);
    firebase
      .firestore()
      .collection('Discussion')
      .orderBy('creation', 'desc')
      .limit(numberOfItem)
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setPost(posts);
      });
    //setLoadingMore(false)
  };

  const FetchAllDiscussion = () => {
    firebase
      .firestore()
      .collection('Discussion')
      .orderBy('creation', 'desc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setData(posts);
      });
  };

  const ListFooterComponent = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#140F38',
      }}
    >
      <ActivityIndicator size='large' color='#E3562A' />
    </View>
  );

  const handleOnEndReached = () => {
    if (numberOfItem == data.length || numberOfItem > data.length) {
      setLoadingMore(false);
      return null;
    } else {
      let newArray = [];
      if (!stopFetchMore) {
        for (var i = numberOfItem; i < numberOfItem + 5; i++) {
          if (data[i]) {
            newArray.push(data[i]);
          } else {
            break;
          }
        }
        setNumberOfItem(numberOfItem + 5);

        setPost([...post, ...newArray]);
        // console.log(post);
        // console.log(post.length);
        stopFetchMore = true;
        setrerender(4);
      }
    }

    // setTimeout(function () {
    //   setLoadingMore(false);
    // }, 1000);
  };

  const renderItem = ({ item }) => {
    return FilterFeed.indexOf(item.faculty) !== -1 ? (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              props.navigation.navigate('Discussion', {
                did: item.id,
                owner: item.userId, //changes
              })
            }
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 35 / 2,
                      marginBottom: 10,
                    }}
                    source={{ uri: item.image }}
                  />
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={styles.userName}>{item.postedBy}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.postedTime}>
                {timeDifference(new Date(), item.creation.toDate())}
              </Text>
            </View>
            <View
            // style={{
            //   borderBottomColor: '#fff',
            //   borderRightColor: '#003565',
            //   borderLeftColor: '#003565',
            //   borderWidth: 2,
            //   borderTopColor:"#003565",
            //   marginBottom:5
            // }}
            >
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
            </View>
            {/* <View>
              <Text style={{ color: '#fff' }}>{item.faculty}</Text>
            </View> */}
            <View
              style={{
                // position: 'absolute',
                bottom: 0,
                height: 45,
                // width: Dimensions.get('window').width * 0.4,
                backgroundColor: '#E3562A',
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {item.faculty}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  };

  // const handleOnEndReached = () => {

  //   if (posts.length === post.length) {
  //     setLoadingMore(false)
  //     return null;
  //   } else {
  //     if (!stopFetchMore) {
  //       setNumberOfItem(numberOfItem + 5);
  //       setTimeout(function () {
  //         LoadDiscussion();
  //       }, 1000);
  //       stopFetchMore = true;
  //     }
  //   }
  // };

  const FeedList = () => {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 8 }}>
          <FlatList
            horizontal={false}
            data={post}
            onEndReachedThreshold={0.01}
            renderItem={renderItem}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
            onEndReached={() => {
              handleOnEndReached();
            }}
            ListFooterComponent={() => loadingMore && <ListFooterComponent />}
          />
        </View>
      </View>
    );
  };

  if (post.length == 0) {
    return FeedList();
  }

  return FeedList();
}

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
  //name
  userName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
  },

  //title
  title: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'PoppinsSemiBold',
    lineHeight: 30,
  },

  //faculty
  faculty: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
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
});

const mapStateToProps = (store) => ({
  posts: store.userState.posts,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Feed);