import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
//import AppLoading from 'expo-app-loading';
//-----------------REDUX---------------//
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));
//-----------------REDUX---------------//

//-----------------FIREBASE---------------//
import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyDPYOE3Lff7hHBqmOUxFp18JwONipAVPEg',
  authDomain: 'p2pl-bcbbd.firebaseapp.com',
  projectId: 'p2pl-bcbbd',
  storageBucket: 'p2pl-bcbbd.appspot.com',
  messagingSenderId: '363868767911',
  appId: '1:363868767911:web:e3cc40d0d5ea10527f3d82',
  measurementId: 'G-HHLLCS1WDW',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
//-----------------FIREBASE---------------//

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

//Student Profile
import CreatedDiscussion from './components/main/student/profile/CreatedDiscussion';
import ActivityTracking from './components/main/student/profile/ActivityTracking';
import FilterFeed from './components/main/student/profile/FilterFeed';
import FavoriteDiscussion from './components/main/student/profile/FavoriteDiscussion';
import EditProfile from './components/main/student/profile/EditProfile';
import EditDeleteDiscussion from './components/main/student/profile/EditDeleteDiscussion';
import EditPassword from './components/main/student/profile/EditPassword';
import NotificationPage from './components/main/student/Notification/NotificationPage';
import FallBack from './components/main/student/Notification/FallBack';

//Auth
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import LectureRegister from './components/auth/LectureRegister';
import ResetPassword from './components/auth/ResetPassword';
import ContactAdmin from './components/auth/ContactAdmin';

//Main Screen
import MainScreen from './components/StudentMain';

//Add Discussion
import AddScreen from './components/main/student/addDiscussion/Add';
import EditDiscussion from './components/main/student/addDiscussion/EditDiscussion';
import EditComment from './components/main/student/addDiscussion/EditComment';

//Lecture
import LectureMainScreen from './components/LectureMain';
import LectureDiscussionView from './components/main/lecture/Discussion/LectureDiscussionView';

//feed
import DiscussionTitle from './components/main/student/feed/ViewDiscussion';
import PostComment from './components/main/student/addDiscussion/PostComment';
import Search from './components/main/student/feed/Search';
import Reply from './components/main/student/feed/Reply';

//MentorMentee
import Choose from './components/main/student/mentorMentee/Choose';
import RequestForMentor from './components/main/student/mentorMentee/RequestForMentor';
import RequestToBeMentor from './components/main/student/mentorMentee/RequestToBeMentor';

//LectureMentorMentee
import CreateRoom from './components/main/lecture/MentorMentee/CreateRoom';
import ViewRoom from './components/main/lecture/MentorMentee/ViewRoom';
import RoomReplyComment from './components/main/lecture/MentorMentee/RoomReplyComment';
import ViewRequest from './components/main/lecture/MentorMentee/ViewRequest';
import ViewDetailMentor from './components/main/lecture/MentorMentee/ViewDetailMentor';
import ViewDetailMentee from './components/main/lecture/MentorMentee/ViewDetailMentee';
import AddInGroup from './components/main/lecture/MentorMentee/AddInGroup';
import AddInGroupV2 from './components/main/lecture/MentorMentee/AddInGroupV2';
import GroupDetail from './components/main/lecture/MentorMentee/GroupDetail';
import ViewRequestCreateRoom from './components/main/lecture/MentorMentee/ViewRequestCreateRoom';
import GroupStats from './components/main/lecture/MentorMentee/GroupStats';
import AddCommentScreen from './components/main/lecture/MentorMentee/AddCommentScreen';

//Admin
import AdminMainScreen from './components/AdminMain';
import ViewDiscussion from './components/main/admin/ReportDiscussion/ViewDiscussion';
import ViewReply from './components/main/admin/ReportDiscussion/ViewReply';
import FacultyRoomStudent from './components/main/admin/StudentDataHandle/FacultyRoomStudent';
import FacultyRoomLecture from './components/main/admin/StudentDataHandle/FacultyRoomLecture';
import StudentData from './components/main/admin/StudentDataHandle/StudentData';
import LectureData from './components/main/admin/StudentDataHandle/LectureData';
import ViewLectureDetail from './components/main/admin/StudentDataHandle/ViewLectureDetail';
import ViewStudentDetail from './components/main/admin/StudentDataHandle/ViewStudentDetail';
import UploadStudentEmail from './components/main/admin/StudentDataHandle/UploadStudentEmail';
import IssueHandle from './components/main/admin/Profile/IssueHandle';
import ViewIssue from './components/main/admin/Profile/ViewIssue';

//Contribution
import ContributionPoints from './components/main/student/contribution/ContributionPoints';
import AvailableAwards from './components/main/student/contribution/AvailableAwards';
import LeaderBoard from './components/main/student/contribution/LeaderBoard';

let customFonts = {
  Poppins: require('./assets/fonts/Poppins.ttf'),
  PoppinsMedium: require('./assets/fonts/PoppinsMedium.ttf'),
  PoppinsSemiBold: require('./assets/fonts/PoppinsSemiBold.ttf'),
};

//changes for notification
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      priority: 'low',
    };
  },
});

export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
      fontsLoaded: false,
      status: '', //changes
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this._loadFontsAsync();
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              this.setState({
                status: snapshot.data().status,
              });
              //changes for notification
              if (snapshot.data().status !== 1) {
                Notifications.getPermissionsAsync()
                  .then((statusObj) => {
                    if (statusObj.status !== 'granted') {
                      Notifications.requestPermissionsAsync();
                    }
                    return statusObj;
                  })
                  .then((statusObj) => {
                    if (statusObj.status !== 'granted') {
                      throw new Error('Permission not granted');
                    }
                  })
                  .then(() => {
                    // should login to expo account
                    //get the pushtoken
                    return Notifications.getExpoPushTokenAsync();
                  })
                  .then((response) => {
                    //console.log(response): figure out ExpoPushToken[****]
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(firebase.auth().currentUser.uid)
                      .update({
                        pushToken: response.data,
                      })
                      .then(() => {
                        console.log('done');
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(firebase.auth().currentUser.uid)
                  .update({
                    pushToken: null,
                  })
                  .then(() => {
                    console.log('done');
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
              // console.log(snapshot.data().status);
              //changes for notification
            } else {
              console.log('does not exist');
            }
          });
      }
    });

    this.setState({ loading: false });
  }
  render() {
    const { loggedIn, loaded, status, fontsLoaded } = this.state;
    if (!loaded || !fontsLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppLoading />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Landing'>
            <Stack.Screen
              name='Landing'
              component={LandingScreen}
              options={{ headerShown: false, headerBackTitleVisible: false }}
            />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen
              name='ResetPassword'
              component={ResetPassword}
              options={{
                headerTitle: 'Reset Password',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name='LectureRegister'
              component={LectureRegister}
              options={{
                headerTitle: 'Register',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name='ContactAdmin'
              component={ContactAdmin}
              options={{
                headerTitle: 'Contact Admin',
                headerBackTitleVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    //Lecture1
    if (status === 1) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Main2'>
              <Stack.Screen
                name='Main2'
                component={LectureMainScreen}
                options={{ headerShown: false, headerBackTitleVisible: false }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='LectureDiscussionView'
                options={{
                  headerTitle: 'Discussion',
                  headerBackTitleVisible: false,
                }}
                component={LectureDiscussionView}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='EditProfile'
                component={EditProfile}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Change Password'
                component={EditPassword}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Filter Feed'
                component={FilterFeed}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Search Results'
                component={Search}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Reply Discussion'
                component={Reply}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Create Room'
                component={CreateRoom}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='View Room'
                component={ViewRoom}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='RoomReplyComment'
                component={RoomReplyComment}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Replies',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='ViewRequest'
                component={ViewRequest}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'View Request',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='ViewDetailMentor'
                component={ViewDetailMentor}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Details',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='ViewDetailMentee'
                component={ViewDetailMentee}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Details',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='AddInGroup'
                component={AddInGroup}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Available Group',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='AddInGroupV2'
                component={AddInGroupV2}
                navigation={this.props.navigation}
                options={{ headerTitle: 'Available Group' }}
              />
              <Stack.Screen
                name='GroupDetail'
                component={GroupDetail}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Group Info',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='ViewRequestCreateRoom'
                component={ViewRequestCreateRoom}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Member List',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='GroupStats'
                component={GroupStats}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Group Statistics',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='AddCommentScreen'
                component={AddCommentScreen}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Add Comment',
                  headerBackTitleVisible: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }
    //Admin
    if (status === 2) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Main3'>
              <Stack.Screen
                name='Main3'
                component={AdminMainScreen}
                options={{ headerShown: false, headerBackTitleVisible: false }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='ViewDiscussion'
                options={{
                  headerTitle: 'Discussion',
                  headerBackTitleVisible: false,
                }}
                component={ViewDiscussion}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='ViewReply'
                options={{
                  headerTitle: 'Replies',
                  headerBackTitleVisible: false,
                }}
                component={ViewReply}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='FacultyRoomLecture'
                options={{
                  headerTitle: 'Faculty',
                  headerBackTitleVisible: false,
                }}
                component={FacultyRoomLecture}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='FacultyRoomStudent'
                options={{
                  headerTitle: 'Faculty',
                  headerBackTitleVisible: false,
                }}
                component={FacultyRoomStudent}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='LectureData'
                options={{
                  headerTitle: 'Lecture Data',
                  headerBackTitleVisible: false,
                }}
                component={LectureData}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='StudentData'
                options={{
                  headerTitle: 'Student Data',
                  headerBackTitleVisible: false,
                }}
                component={StudentData}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='ViewLectureDetail'
                options={{
                  headerTitle: 'Lecture Detail',
                  headerBackTitleVisible: false,
                }}
                component={ViewLectureDetail}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='ViewStudentDetail'
                options={{
                  headerTitle: 'Student Detail',
                  headerBackTitleVisible: false,
                }}
                component={ViewStudentDetail}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='UploadStudentEmail'
                options={{
                  headerTitle: 'Upload Email',
                  headerBackTitleVisible: false,
                }}
                component={UploadStudentEmail}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='IssueHandle'
                options={{
                  headerTitle: 'Available Issue',
                  headerBackTitleVisible: false,
                }}
                component={IssueHandle}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='ViewIssue'
                options={{
                  headerTitle: 'Issue Details',
                  headerBackTitleVisible: false,
                }}
                component={ViewIssue}
                navigation={this.props.navigation}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }

    if (status === 0) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='StudentMain'>
              <Stack.Screen
                name='StudentMain'
                component={MainScreen}
                options={{ headerShown: false, headerBackTitleVisible: false }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Add Discussion'
                component={AddScreen}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Created Discussions'
                component={CreatedDiscussion}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Activity Tracking'
                component={ActivityTracking}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Filter Feed'
                component={FilterFeed}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Favorite Discussion'
                component={FavoriteDiscussion}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Discussion'
                options={{ headerBackTitleVisible: false }} // add for everything to make ammend in ios
                component={DiscussionTitle}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Created Discussion'
                options={{
                  headerTitle: 'Discussion',
                  headerBackTitleVisible: false,
                }}
                component={EditDeleteDiscussion}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Edit Discussion'
                component={EditDiscussion}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='EditProfile'
                options={{
                  headerTitle: 'Edit Profile',
                  headerBackTitleVisible: false,
                }}
                component={EditProfile}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='Notification'
                options={{ headerTitle: 'Notifications' }}
                component={NotificationPage}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='FallBackPage'
                options={{ headerShown: false }}
                component={FallBack}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='EditComment'
                component={EditComment}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Post Comment'
                component={PostComment}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Search Results'
                component={Search}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Change Password'
                component={EditPassword}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Reply Discussion'
                component={Reply}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='Choose'
                component={Choose}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='RequestForMentor'
                component={RequestForMentor}
                options={{
                  headerTitle: 'Request For Mentor',
                  headerBackTitleVisible: false,
                }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='RequestToBeMentor'
                component={RequestToBeMentor}
                options={{
                  headerTitle: 'Request To Be Mentor',
                  headerBackTitleVisible: false,
                }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='View Room'
                component={ViewRoom}
                navigation={this.props.navigation}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen
                name='RoomReplyComment'
                component={RoomReplyComment}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Replies',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='GroupDetail'
                component={GroupDetail}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Group Info',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name='Contribution'
                component={ContributionPoints}
                options={{ headerTitle: 'Awards Received' }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='AvailableAwards'
                component={AvailableAwards}
                options={{ headerTitle: 'Available Awards' }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='LeaderBoard'
                component={LeaderBoard}
                options={{ headerTitle: 'Leaderboard' }}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name='AddCommentScreen'
                component={AddCommentScreen}
                navigation={this.props.navigation}
                options={{
                  headerTitle: 'Add Comment',
                  headerBackTitleVisible: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }

    return <AppLoading />;
  }
}

export default App;
