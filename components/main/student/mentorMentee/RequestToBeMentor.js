import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');
import * as DocumentPicker from 'expo-document-picker';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

function requesttobementor(props) {
  const { currentUser } = props;
  const [problem1, setProblem1] = useState(false);
  const [problem2, setProblem2] = useState(false);
  const [problem3, setProblem3] = useState(false);
  const [problem4, setProblem4] = useState(false);
  const [problem5, setProblem5] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [finalValue, setFinalValue] = useState([]);
  const [Doc, setDoc] = useState(null);
  const [name, setName] = useState(null);
  const [desc, setDesc] = useState('');
  const [qualification, setQualification] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = firebase.auth().currentUser.uid;

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
    }
    console.log(result);
  };

  const removeDocument = () =>{
    setName(null)
  }

  const uploadDoc = async () => {
    if (problem1 === true) {
      finalValue.push('Academic');
    }
    if (problem2 === true) {
      finalValue.push('Internship');
    }
    if (problem3 === true) {
      finalValue.push('Subject Registration');
    }
    if (problem4 === true) {
      finalValue.push('Club Activities');
    }
    if (problem5 === true) {
      finalValue.push('Personal Projects');
    }

    if (finalValue.length === 0) {
      return Alert.alert(
        'Issue cannot be empty ',
        'Please check atlest one issue',
        [
          // The "Yes" button
          {
            text: 'Ok',
          },
        ]
      );
    }

    if (desc.trim() === '') {
      return Alert.alert(
        'Description cannot be empty ',
        'Please enter description',
        [
          // The "Yes" button
          {
            text: 'Ok',
          },
        ]
      );
    }

    if (qualification.trim() === '') {
      return Alert.alert(
        'Qualification cannot be empty ',
        'Please enter qualification',
        [
          // The "Yes" button
          {
            text: 'Ok',
          },
        ]
      );
    }

    if (name != null) {
      if (name.slice(-4) !== '.pdf') {
        return Alert.alert(
          'Only PDF file can be uploaded ',
          'Please upload a PDF file',
          [
            // The "Yes" button
            {
              text: 'Ok',
            },
          ]
        );
      }
    }

    setModalVisible(!isModalVisible);
    if (name != null) {
      const childPath = `doc/${1234}/${Math.random().toString(36)}`;
      const response = await fetch(Doc);
      const blob = await response.blob();
      const task = firebase.storage().ref().child(childPath).put(blob);
      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          savePostDoc(snapshot);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on('state_changed', taskProgress, taskError, taskCompleted);
    } else {
      savePostDoc(null);
    }
  };

  const savePostDoc = (downloadURL) => {
    firebase
      .firestore()
      .collection('RequestToBeMentor')
      .add({
        name: user.realName,
        faculty: user.faculty,
        year: user.year,
        qualificationProof: downloadURL,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        description: desc,
        qualification,
        problems: finalValue,
        image: user.image,
        //commented out for testing purpose
        matricNumber: user.matricNumber,
        userId,
        pushToken: user.pushToken, //change for notification
      })
      .then(function () {
        setModalVisible(!isModalVisible);
        return Alert.alert(
          'Request send succeccfully',
          'The lecture will review this requst for further action',
          [
            {
              text: 'Ok',
              onPress: () => {
                props.navigation.goBack();
              },
            },
          ]
        );
      });
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Name :</Text>
            <Text style={styles.inputfornotedit}>{user.realName}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Matric Number :</Text>
            <Text style={styles.inputfornotedit}>{user.matricNumber}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty :</Text>
            <Text style={styles.inputfornotedit}>{user.faculty}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year :</Text>
            <Text style={styles.inputfornotedit}>{user.year}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={{ paddingBottom: 10, ...styles.label }}>
              Issue can handle:{' '}
            </Text>
            <View style={styles.row}>
              <CheckBox
                value={problem1}
                onValueChange={setProblem1}
                //onChange={() => xxx()}
              />
              <Text style={styles.label2}>Academic</Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={problem2}
                onValueChange={setProblem2}
                // onChange={() => xxx()}
              />
              <Text style={styles.label2}>Internship</Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={problem3}
                onValueChange={setProblem3}
                // onChange={() => xxx()}
              />
              <Text style={styles.label2}>Subject Registration</Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={problem4}
                onValueChange={setProblem4}
                //onChange={() => xxx()}
              />
              <Text style={styles.label2}>Club Activities</Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={problem5}
                onValueChange={setProblem5}
                //onChange={() => xxx()}
              />
              <Text style={styles.label2}>Personal Projects</Text>
            </View>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description: </Text>
            <TextInput
              placeholder='Description'
              autoCapitalize='sentences'
              style={styles.input}
              multiline={true}
              value={desc}
              onChangeText={(desc) => setDesc(desc)}
            />
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Qualification: </Text>
            <TextInput
              placeholder='Qualification'
              autoCapitalize='sentences'
              style={styles.input}
              multiline={true}
              value={qualification}
              onChangeText={(qualification) => setQualification(qualification)}
            />
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Proves: </Text>
          </View>
        </View>
        {name ? (
          <View style={styles.attachment}>
            <Text>{name}</Text>
          </View>
        ) : null}

        <View
          style={{ justifyContent: 'center', marginLeft: 20, marginBottom: 10 }}
        >
          {name === null ? (
            <TouchableOpacity
              style={styles.logout}
              onPress={() => pickDocument()}
            >
              <Text style={styles.Ltext}>Upload Document </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.logout}
              onPress={() => removeDocument()}
            >
              <Text style={styles.Ltext}>Remove Document </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={() => uploadDoc()}
        icon={<Icon reverse name='send' type='font-awesome' color='#E3562A' />}
      />
      <Modal isVisible={isModalVisible}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size='large' color='#E3562A' />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 3,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 20,
    marginVertical: 5,
  },

  label2: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
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

  attachment: {
    backgroundColor: '#808080',
    height: 45,
    marginHorizontal: 20,
    borderColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    elevation: 2,
    marginVertical: 3,
  },

  logout: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.13,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 20,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(requesttobementor);