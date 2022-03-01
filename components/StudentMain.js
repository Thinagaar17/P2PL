import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Notifications from "expo-notifications";//changes
import { bindActionCreators } from 'redux';
import {
  fetchUser,
  fetchUserPosts,
  fetchUserComment,
  fetchOption,
  fetchReportedDiscussion,
  fetchDiscussionRoom,
} from '../redux/actions/index';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
require('firebase/firestore');

import FeedScreen from './main/student/feed/Feed';
import ProfileScreen from './main/student/profile/Profile';
import InventoryScreen from './main/student/inventory/Inventory';
import MentorMenteeMainScreen from './main/student/mentorMentee/MainScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const Stack = createStackNavigator();

const HomeStackScreen = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName='Feed'>
      <Stack.Screen
        name='Feed'
        component={FeedScreen}
        options={{
          headerTitle: 'P2PL',
          headerRight: () => (
            <View style={{ flexDirection: 'row', paddingRight: 15 }}>
              <TouchableOpacity>
                <Icon
                  name='ios-search'
                  type='ionicon'
                  size={30}
                  color='#000'
                  onPress={() => navigation.navigate('Search Results')}
                />
              </TouchableOpacity>


              <TouchableOpacity>
                <Icon
                  name='notifications-outline'
                  type='ionicon'
                  size={32}
                  color='#000'
                  onPress={() => navigation.navigate("Notification")}
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
    </Stack.Navigator>
  );
};

const InventoryStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='Inventory'>
      <Stack.Screen
        name='Inventory'
        component={InventoryScreen}
        options={{ headerTitle: 'Inventory' }}
      />
    </Stack.Navigator>
  );
};

const MentorMenteeStackScreen = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName='MentorMenteeMainScreen'>
      <Stack.Screen
        name='MentorMenteeMainScreen'
        component={MentorMenteeMainScreen}
        options={{
          headerTitle: 'Mentor Mentee Rooms',
        }}
        navigation={navigation}
      />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='Profile'>
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          headerRight: () => (
            <View style={{ flexDirection: 'row', paddingRight: 15 }}>
              <TouchableOpacity>
                <Icon
                  name='exit-outline'
                  type='ionicon'
                  size={30}
                  color='#000'
                  onPress={() => LogOut()}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

function LogOut() {
  return Alert.alert('Log Out', 'Are you sure you want to log out ?', [
    // The "Yes" button
    {
      text: 'Yes',
      onPress: () => {
        firebase.auth().signOut();
      },
    },
    // The "No" button
    // Does nothing but dismiss the dialog when tapped
    {
      text: 'No',
    },
  ]);
}

export class StudentMain extends Component {
  componentDidMount() {
    //this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserComment();
    this.props.fetchOption();
    this.props.fetchReportedDiscussion();
    this.props.fetchDiscussionRoom();


    //  triggered when user responded to the push notification
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      const data = response.notification.request.content.data;
      // console.log(data);

      if (data.id) {
        let nid;
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("Notifications")
          .get()
          .then((snapshot) => {
            snapshot.docs.map((doc) => {
              if (doc.data().userId === data.userId && doc.data().description === data.description) {
                nid = doc.id;
              }

            });

            firebase
              .firestore()
              .collection('Discussion')
              .get()
              .then((snapshot) => {
                let list = snapshot.docs.map((doc) => {
                  let id = doc.id;
                  return { id };
                });
                if (list.some((el) => el.id === data.id)) {
                  this.props.navigation.navigate("Discussion", { did: data.id, notificationId: nid, owner: data.ownerId })
                  return;
                } else {
                  this.props.navigation.navigate("Feed")
                  Alert.alert('Deleted', 'The discussion or comment might have been deleted', [
                    {
                      text: 'Ok',
                    },
                  ]);
                }
              });
          });
      } else if (data.cid) {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("Notifications")
          .get()
          .then((snapshot) => {
            let nid;
            snapshot.docs.map((doc) => {
              if (doc.data().userId === data.userId && doc.data().description === data.description) {
                nid = doc.id;
              }
            });

            firebase
              .firestore()
              .collection('Comment')
              .get()
              .then((snapshot) => {
                let list = snapshot.docs.map((doc) => {
                  let id = doc.id;
                  return { id };
                });
                if (list.some((el) => el.id === data.cid)) {
                  this.props.navigation.navigate("Reply Discussion", { cid: data.cid, notificationId: nid, discussionId: data.discussionId, mainCommentUserId: data.mainId, mainCommentAuthorName: data.mainCommentAuthorName, pushToken: data.pushToken })
                  return;
                }
                else if(!(list.some((el) => el.id === data.cid))) {
                  this.props.navigation.navigate("Feed")
                  Alert.alert('Deleted', 'The discussion or comment might have been deleted', [
                    {
                      text: 'Ok',
                    },
                  ]);
                }
              });


          });

      } else if (data.mmid) {
        let nid;
        const loadAsync = async () => {
          await firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("Notifications")
            .get()
            .then((snapshot) => {
              snapshot.docs.map((doc) => {
                if (doc.data().userId === data.userId && doc.data().description === data.description) {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("Notifications")
                    .doc(doc.id)
                    .delete();
                  // nid = doc.id;
                  // getId(nid);
                }
              });
              this.props.navigation.navigate("MentorMenteeMainScreenTab", { mmid: data.mmid })
            });
        }
        loadAsync();
      } else if (data.deleteId) {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("Notifications")
          .get()
          .then((snapshot) => {
            let nid;
            snapshot.docs.map((doc) => {
              if (doc.data().userId === data.userId && doc.data().description === data.description) {
                nid = doc.id;
              }
            });
            this.props.navigation.navigate("Created Discussions", { notificationId: nid });
          });

      }


    })
    // manage notification when the app is running
    const foregroundSubscription = Notifications.addNotificationReceivedListener((notification => {
      // console.log(notification);
    }))

    return () => {
      cleanUp
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    }



  }
  HomeStackScreen = () => {
    const navigation = useNavigation();
    return (
      <Stack.Navigator initialRouteName='Feed'>
        <Stack.Screen
          name='Feed'
          component={FeedScreen}
          options={{
            headerTitle: 'P2PL',
            headerRight: () => (
              <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                <TouchableOpacity>
                  <Icon
                    name='ios-search'
                    type='ionicon'
                    size={30}
                    color='#000'
                    onPress={() => navigation.navigate('Search Results')}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Icon
                    name='notifications-outline'
                    type='ionicon'
                    size={30}
                    color='#000'
                  />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: { backgroundColor: '#fff' },
          }}
        />
      </Stack.Navigator>
    );
  };

  render() {
    return (
      <Tab.Navigator
        initialRouteName='FeedTab'
        activeColor='#f0edf6'
        inactiveColor='#3e2465'
        labeled={false}
        barStyle={{
          backgroundColor: '#694fad',
        }}
        lazy='true'
      >
        <Tab.Screen
          name='InventoryTab'
          component={InventoryStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='database' color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name='MentorMenteeMainScreenTab'
          component={MentorMenteeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='school' color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name='FeedTab'
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='home' color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name='AddContainer'
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Add Discussion');
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='plus-box' color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name='ProfileTab'
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account-circle'
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

//map to reducer
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      fetchUser,
      fetchUserPosts,
      fetchUserComment,
      fetchOption,
      fetchReportedDiscussion,
      fetchDiscussionRoom,
    },
    dispatch
  );
//, fetchUserPosts, fetchUserFollowing, clearData

export default connect(mapStateToProps, mapDispatchProps)(StudentMain);
