import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_COMMENT_STATE_CHANGE,
  USER_OPTION_STATE_CHANGE,
  USER_REPORTEDDISCUSSION_STATE_CHANGE,
  DISCUSSION_ROOM_STATE_CHANGE,
  USER_REQUESTFORAMENTOR_STATE_CHANGE,
  USER_REQUESTTOBEAMENTOR_STATE_CHANGE
} from "../constants/index";
//, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA

import firebase from "firebase";
//import { SnapshotViewIOSComponent } from 'react-native'
require("firebase/firestore");

// export function clearData() {
//     return ((dispatch) => {
//         dispatch({type: CLEAR_DATA})
//     })
// }
// ui trigger -> action -> reducer -> dispacth(store) -> value update
export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
         //console.log(snapshot.data())
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("Discussion")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
        //console.log(posts)
      });
  };
}

export function fetchUserComment() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("Comment")
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        //  console.log(comment)
        dispatch({ type: USER_COMMENT_STATE_CHANGE, comment });
      });
  };
}

export function fetchOption() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("ReportOptions")
      .get()
      .then((snapshot) => {
        let option = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_OPTION_STATE_CHANGE, option });
      });
  };
}


export function fetchDiscussionRoom() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("DiscussionRoom")
      .get()
      .then((snapshot) => {
        let discussionroom = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: DISCUSSION_ROOM_STATE_CHANGE, discussionroom });
      });
  };
}

export function fetchReportedDiscussion() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("ReportedDiscussion")
      .get()
      .then((snapshot) => {
        let reportedDiscussion = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_REPORTEDDISCUSSION_STATE_CHANGE, reportedDiscussion });
      });
  };
}

export function fetchRequestForMentor() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("RequestForMentor")
      .get()
      .then((snapshot) => {
        let rfam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_REQUESTFORAMENTOR_STATE_CHANGE, rfam });
      });
  };
}

export function fetchRequestToBeMentor() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("RequestToBeMentor")
      .get()
      .then((snapshot) => {
        let rtbam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_REQUESTTOBEAMENTOR_STATE_CHANGE, rtbam });
      });
  };
}

// export function fetchUsersData(uid, getPosts) {
//     return ((dispatch, getState) => {
//         const found = getState().usersState.users.some(el => el.uid === uid);
//         if (!found) {
//             firebase.firestore()
//                 .collection("users")
//                 .doc(uid)
//                 .get()
//                 .then((snapshot) => {
//                     if (snapshot.exists) {
//                         let user = snapshot.data();
//                         user.uid = snapshot.id;

//                         dispatch({ type: USERS_DATA_STATE_CHANGE, user });
//                     }
//                     else {
//                         console.log('does not exist')
//                     }
//                 })
//                 if(getPosts){
//                     dispatch(fetchUsersFollowingPosts(uid));
//                 }
//         }
//     })
// }

// export function fetchUsersFollowingPosts(uid) {
//     return ((dispatch, getState) => {
//         firebase.firestore()
//             .collection("posts")
//             .doc(uid)
//             .collection("userPosts")
//             .orderBy("creation", "asc")
//             .get()
//             .then((snapshot) => {
//                 const uid = snapshot.query.EP.path.segments[1];
//                 const user = getState().usersState.users.find(el => el.uid === uid);

//                 let posts = snapshot.docs.map(doc => {
//                     const data = doc.data();
//                     const id = doc.id;
//                     return { id, ...data, user }
//                 })

//                 for(let i = 0; i< posts.length; i++){
//                     dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
//                 }
//                 dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })

//             })
//     })
// }

// export function fetchUsersFollowingLikes(uid, postId) {
//     return ((dispatch, getState) => {
//         firebase.firestore()
//             .collection("posts")
//             .doc(uid)
//             .collection("userPosts")
//             .doc(postId)
//             .collection("likes")
//             .doc(firebase.auth().currentUser.uid)
//             .onSnapshot((snapshot) => {
//                 const postId = snapshot.ZE.path.segments[3];

//                 let currentUserLike = false;
//                 if(snapshot.exists){
//                     currentUserLike = true;
//                 }

//                 dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
//             })
//     })
// }
