import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-elements';
import SelectPicker from 'react-native-form-select-picker';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';

require('firebase/firestore');

//copy paste whole thing
function EditProfile(props) {
  const { currentUser, comments, posts } = props;
  const [nameToBeEditted, setNameToBeEditted] = useState(
    firebase.auth().currentUser.uid
  );
  const [comment, setComment] = useState(comments);
  const [cntbu, setCntbu] = useState([]);
  const [discussion, setDiscussion] = useState(posts);
  const [facultyData, setFacultyData] = useState([]);
  const [dntbc, setDntbc] = useState([]);
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState(1);
  const [year, setYear] = useState(0);
  const [matricNum, setMatricNum] = useState('');
  const [fac, setFac] = useState('');
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cu, setCu] = useState(currentUser);
  const [isImage, setIsImage] = useState();
  const [rn, setRn] = useState('');
  const [isLoading, setIsLoading] = useState(false); //might
  let options = [1, 2, 3, 4, 5];
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const defaultImage =
    'https://firebasestorage.googleapis.com/v0/b/p2pl-bcbbd.appspot.com/o/default%2FnewProfile.png?alt=media&token=b2e22482-506a-4e78-ae2e-e38c83ee7c27';

  useEffect(() => {
    const loadAsync = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          setUserId(snapshot.data().name);
          setYear(snapshot.data().year);
          setFac(snapshot.data().faculty);
          setStatus(snapshot.data().status);
          setMatricNum(snapshot.data().matricNumber);
          setRn(snapshot.data().realName);
        });
      await firebase
        .firestore()
        .collection('Faculty')
        .get()
        .then((snapshot) => {
          let faculty = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setFacultyData(faculty);
        });

      setIsLoading(false);
    };

    loadAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadAsync = async () => {
        setIsLoading(true);
        await firebase
          .firestore()
          .collection('Discussion')
          .get()
          .then((snapshot) => {
            let discussion = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            //discussion

            const newArray2 = discussion.filter(
              (e) => e.userId === nameToBeEditted
            );

            const secArray2 = newArray2.map((element) => element.id);
            setDntbc(secArray2);
          });

        await firebase
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
            const newArray = comment.filter(
              (element) => element.userId === nameToBeEditted
            );
            const secArray = newArray.map((element) => element.id);
            setCntbu(secArray);
          });

        await firebase
          .firestore()
          .collection('users')
          .doc(props.route.params.uid)
          .get()
          .then((snapshot) => {
            setCu(snapshot.data());
            setIsImage(snapshot.data().image);
          });
        setIsLoading(false);
      };

      loadAsync();
    }, [])
  );

  // const validate =(id) =>{
  //   let value =false;
  //   if (id == null) {
  //     value = true;
  //     console.log("null")
  //     Alert.alert(
  //       "Empty field",
  //       "Kindly fill in the UserId",
  //       [
  //         {
  //           text: "Ok",
  //         },
  //       ]
  //     );
  //   }
  //   return value;
  // }

  const Save = async () => {
    setModalVisible(!isModalVisible);
    if (imageChanged) {
      const uri = image;
      const childPath = `profile/${firebase.auth().currentUser.uid}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          firebase
            .firestore()
            .collection('users')
            .doc(props.route.params.uid)
            .update({
              name: userId,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              image: snapshot,
              year: parseInt(year),
            })
            .then(() => {
              yyy(userId, snapshot);
            });
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on('state_changed', taskProgress, taskError, taskCompleted);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .update({
          name: userId,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          year: year,
        })
        .then(() => {
          xxx(userId);
        });
    }
  };

  const xxx = (newName) => {
    for (var i = 0; i < cntbu.length; i++) {
      firebase
        .firestore()
        .collection('Comment')
        .doc(cntbu[i])
        .update({
          postedBy: newName,
        })
        .then(() => {
          console.log('updated');
        });
    }

    for (var i = 0; i < dntbc.length; i++) {
      firebase
        .firestore()
        .collection('Discussion')
        .doc(dntbc[i])
        .update({
          postedBy: newName,
        })
        .then(() => {});
    }
    setModalVisible(!isModalVisible);
    props.navigation.goBack();
  };

  const yyy = (newName, image) => {
    for (var i = 0; i < cntbu.length; i++) {
      firebase
        .firestore()
        .collection('Comment')
        .doc(cntbu[i])
        .update({
          postedBy: newName,
          image: image,
        })
        .then(() => {});
    }
    for (var i = 0; i < dntbc.length; i++) {
      firebase
        .firestore()
        .collection('Discussion')
        .doc(dntbc[i])
        .update({
          postedBy: newName,
          image: image,
        })
        .then(() => {});
    }
    setModalVisible(!isModalVisible);
    props.navigation.goBack();
  };

  const pickImage = async () => {
    if (true) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setImageChanged(true);
      }
    }
  };

  const removePicture = () => {
    setModalVisible(!isModalVisible);
    firebase
      .firestore()
      .collection('users')
      .doc(nameToBeEditted)
      .update({
        image: defaultImage,
      })
      .then(() => {
        //setModalVisible(!isModalVisible);
        yyy(cu.name, defaultImage);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#140F38' }}>
      {isLoading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size='large' color='orange' />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.inputfornotedit}>{rn}</Text>
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>User Id</Text>
              <TextInput
                style={styles.input}
                value={userId}
                onChangeText={(userId) => setUserId(userId)}
              />
            </View>
            {status == 0 && (
              <View style={styles.formControl}>
                <Text style={styles.label}>Matric Number </Text>
                <Text style={styles.inputfornotedit}>{matricNum}</Text>
              </View>
            )}

            {status == 0 && (
              <View style={styles.formControl}>
                <Text style={styles.label}>Year of Study</Text>
                {/* <Text style={styles.input}>{year}</Text> */}
                <SelectPicker
                  placeholder={year}
                  placeholderStyle={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    color: '#000',
                    marginTop: 5,
                  }}
                  onSelectedStyle={{
                    fontSize: 15,
                    color: '#000',
                  }}
                  style={styles.input}
                  onValueChange={setYear}
                  selected={year}
                >
                  {Object.values(options).map((val, index) => (
                    <SelectPicker.Item label={val} value={val} key={index} />
                  ))}
                </SelectPicker>
              </View>
            )}

            <View style={styles.formControl}>
              <Text style={styles.label}>Faculty</Text>
              <Text style={styles.inputfornotedit}>{fac}</Text>
              {/* <SelectPicker
                placeholder={fac}
                placeholderStyle={{
                  fontFamily: 'Poppins',
                  fontSize: 20,
                  color: '#000',
                }}
                onSelectedStyle={{
                  fontFamily: 'Poppins',
                  fontSize: 15,
                  color: '#000',
                  ...Platform.select({
                    ios: {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 0,
                    },
                  }),
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...styles.ui,
                }}
                style={styles.input}
                onValueChange={setFac}
                selected={fac}
              >
                {Object.values(facultyData).map((val) => (
                  <SelectPicker.Item
                    label={val.faculty}
                    value={val.faculty}
                    key={val.id}
                  />
                ))}
              </SelectPicker> */}
            </View>

            <View style={{ ...styles.formControl, marginTop: 5 }}>
              <Text style={styles.label}>Profile Picture</Text>
              <View style={{ flexDirection: 'row' }}>
                {cu.image != defaultImage ? (
                  <TouchableOpacity
                    style={{ ...styles.logout, marginRight: 15 }}
                    onPress={() => removePicture()}
                  >
                    <Text style={styles.Ltext}>Remove Existing Image</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={styles.logout}
                  onPress={() => pickImage()}
                >
                  <Text style={styles.Ltext}>New Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ height: 200, width: 200 }}
              />
            )}
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={{ justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator size='large' color='#E3562A' />
            </View>
          </Modal>
        </ScrollView>
      )}
      <FAB
        placement='right'
        color='#E3562A'
        style={styles.floatButton}
        onPress={() => Save()}
        size='large'
        icon={
          <Icon name='save-outline' type='ionicon' size={25} color='#FFF' />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 20,
    marginVertical: 8,
    color: '#fff',
  },
  input: {
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  inputfornotedit: {
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#f3bba9',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
    fontSize: 15,
  },

  logout: {
    width: 120,
    height: 45,
    marginTop: 5,
    paddingHorizontal:4,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    justifyContent: 'space-between',
  },

  ui: {
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.1,
    backgroundColor: '#E3562A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(EditProfile);