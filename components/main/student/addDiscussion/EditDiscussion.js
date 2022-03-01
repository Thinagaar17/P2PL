import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Images from 'react-native-scalable-image';
import { FAB } from 'react-native-elements';

import Modal from 'react-native-modal';
function EditDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [di, setDi] = useState(null);

  useEffect(() => {
    firebase
      .firestore()
      .collection('Discussion')
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        //   console.log(snapshot.data().description)
        setDescription(snapshot.data().description);
        setTitle(snapshot.data().title);
        setDi(snapshot.data().downloadURL);
      });
  }, []);

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
            .collection('Discussion')
            .doc(props.route.params.did)
            .update({
              downloadURL: snapshot,
              title,
              description,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              props.navigation.goBack();
              console.log('save');
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
        .collection('Discussion')
        .doc(props.route.params.did)
        .update({
          title,
          description,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          props.navigation.goBack();
          console.log('save');
        });
    }
    setModalVisible(!isModalVisible);
  };

  const pickImage = async () => {
    if (true) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setImageChanged(true);
      }
    }
  };

  const removeImage = () => {
    setModalVisible(!isModalVisible);
    firebase
      .firestore()
      .collection('Discussion')
      .doc(props.route.params.did)
      .update({
        downloadURL: null,
      })
      .then(() => {
        props.navigation.goBack();
        setModalVisible(!isModalVisible);
      });
  };

  return (
    <View style={styles.container}>
      {/* {image && <Image source={{ uri: image }} style={{ flex: 1 }} />} */}
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(title) => setTitle(title)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={{ ...styles.input }}
            value={description}
            multiline={true}
            onChangeText={(description) => setDescription(description)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Edit Discussion Image</Text>
          {di && (
            <TouchableOpacity
              style={styles.logout}
              onPress={() => removeImage()}
            >
              <Text style={styles.Ltext}>Remove Image</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logout} onPress={() => pickImage()}>
            <Text style={styles.Ltext}>Upload Image</Text>
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
      <Modal isVisible={isModalVisible}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size='large' color='#E3562A' />
        </View>
      </Modal>
      <FAB
        placement='right'
        color='#E3562A'
        style={styles.floatButton}
        onPress={() => Save(title, description)}
        size='large'
        icon={
          <Icon name='save-outline' type='ionicon' size={25} color='#FFF' />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
  logout: {
    width: 160,
    height: 40,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'space-between',
  },
});

export default EditDiscussion;
