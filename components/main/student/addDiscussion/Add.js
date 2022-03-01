import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
require('firebase/firestore');
require('firebase/firebase-storage');
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-elements';
import Modal from 'react-native-modal';
import Images from 'react-native-scalable-image';
import SelectPicker from 'react-native-form-select-picker';

function Add(props) {
  const { currentUser } = props;
  const userId = firebase.auth().currentUser.uid;
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [faculty, setFaculty] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState();

  // useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     headerRight: () => (
  //       <View style={{ flexDirection: "row", paddingRight: 15 }}>
  //         <TouchableOpacity>
  //           <Icon
  //             name="arrow-up-circle-outline"
  //             type="ionicon"
  //             size={35}
  //             color="#000"
  //             onPress={uploadImage}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   });
  // }, [title, selected]);

  useEffect(() => {
    (async () => {
      // const cameraStatus = await Camera.requestPermissionsAsync();
      // setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();

    firebase
      .firestore()
      .collection('Faculty')
      .get()
      .then((snapshot) => {
        let faculty = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setFaculty(faculty);
      });
  }, [isLoading]);

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

  if (hasGalleryPermission === false) {
    return <View />;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const uploadImage = async () => {
    if (!title.trim()) {
      alert('Please Enter Title');
      return;
    }

    if (!selected) {
      alert('Please Enter Faculty');
      return;
    }

    setModalVisible(!isModalVisible);
    if (image != null) {
      //const uri = props.route.params.image;
      const childPath = `post/${
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
          savePostData(snapshot, title, description);
          console.log('downloadUri' + snapshot);
          setModalVisible(!isModalVisible);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on('state_changed', taskProgress, taskError, taskCompleted);
    } else {
      firebase
        .firestore()
        .collection('Discussion')
        .add({
          userId,
          title,
          faculty: selected,
          description,
          postedBy: currentUser.name,
          image: currentUser.image,
          favBy: [],
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          pushToken: currentUser.pushToken, //change for notification,
          noOfComments: 0, //change for contribution
        })
        .then(function () {
          setModalVisible(!isModalVisible);
          props.navigation.popToTop();
          console.log('Done');
        });
    }
  };

  const savePostData = (downloadURL, title, description) => {
    firebase
      .firestore()
      .collection('Discussion')
      .add({
        userId,
        downloadURL,
        title,
        faculty: selected,
        description,
        postedBy: currentUser.name,
        image: currentUser.image,
        favBy: [],
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        pushToken: currentUser.pushToken, // changes for notification,
        noOfComments: 0, // changes for contribution
      })
      .then(function () {
        setModalVisible(!isModalVisible);
        props.navigation.popToTop();
        console.log('Done');
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            margin: 20,
          }}
        >
          <View
            style={{
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
            }}
          >
            <Text style={styles.title}>Title </Text>
          </View>
          <TextInput
            style={styles.titleInput}
            placeholder='Place your title here'
            placeholderTextColor='#000'
            multiline={true}
            defaultValue={title}
            onChangeText={(title) => setTitle(title)}
          />
        </View>

        <View style={{ marginLeft: 20 }}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.title}>Add Faculty: </Text>
            <SelectPicker
              placeholder='Faculty'
              placeholderStyle={{
                fontFamily: 'Poppins',
                fontSize: 20,
                color: '#fff',
              }}
              onSelectedStyle={{
                fontFamily: 'Poppins',
                fontSize: 15,
                color: '#fff',
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
              onValueChange={(value) => {
                setSelected(value);
              }}
              selected={selected}
            >
              {Object.values(faculty).map((val) => (
                <SelectPicker.Item
                  label={val.faculty}
                  value={val.faculty}
                  key={val.id}
                />
              ))}
            </SelectPicker>
          </View>

          <View>
            <Text style={styles.title}>Add Image:</Text>
            <TouchableOpacity style={styles.ui} onPress={pickImage}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Poppins',
                  fontSize: 20,
                }}
              >
                Upload Image
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          {image && (
            <Images
              width={Dimensions.get('window').width} // height will be calculated automatically
              source={{ uri: image }}
            />
          )}
        </View>

        <View
          style={{
            borderBottomColor: '#fff',
            borderBottomWidth: 1,
            margin: 20,
          }}
        >
          <Text style={styles.title}>Discussion Description</Text>
        </View>
        <View>
          <TextInput
            style={styles.desc}
            placeholder='Place your description here'
            placeholderTextColor='#000'
            multiline={true}
            defaultValue={description}
            onChangeText={(description) => setDescription(description)}
          />
        </View>
        <Modal isVisible={isModalVisible}>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size='large' color='#E3562A' />
          </View>
        </Modal>
      </ScrollView>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={uploadImage}
        size='large'
        icon={
          <Icon reverse name='upload' type='font-awesome-5' color='#E3562A' />
        }
      />
    </View>
  );
}

/*

      <FAB
        placement="right"
        color="#E3562A"
        style={styles.floatButton}
        onPress={toggleModal}
        icon={<Icon name="add-outline" type="ionicon" size={30} color="#fff" />}
      />

*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
  },

  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },

  dropdown: {
    color: '#fff',
  },

  title: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 25,
    color: '#fff',
    alignContent: 'space-around',
  },

  fac: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 25,
    color: '#fff',
    alignContent: 'space-around',
    paddingBottom: 20,
  },

  image: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 25,
    color: '#fff',
    alignContent: 'space-around',
    paddingRight: 20,
  },

  ui: {
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.12,
    backgroundColor: '#E3562A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uit: {
    color: '#fff',
    justifyContent: 'center',
    left: 10,
    top: 2,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },

  desc: {
    color: '#000',
    marginTop: -10,
    margin: 20,
    height: 250,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    width: 350,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },

  titleInput: {
    color: '#000',
    marginTop:10,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },

  blogout: {
    width: 160,
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
});

export default connect(mapStateToProps, null)(Add);
