import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import firebase from 'firebase';
require('firebase/firestore');

function UploadStudentEmail(props) {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState('first');
  const [student, setStudent] = useState([]);
  const [lecture, setLecture] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('Student')
      .get()
      .then((snapshot) => {
        let student = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        // console.log(student);
        setStudent(student);
      });
    firebase
      .firestore()
      .collection('Lecture')
      .get()
      .then((snapshot) => {
        let lecture = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        // console.log(lecture);
        setLecture(lecture);
      });
  }, []);

  const uploadEmail = () => {
    const found = student.some((el) => el.email === email);

    if (checked === 'first') {
      const found = student.some((el) => el.email === email);
      if (found) {
        return Alert.alert(
          'Email already exsist',
          'Duplicate data being formed',
          [
            {
              text: 'Retry',
            },
          ]
        );
      }
      if (!email.match(mailformat)) {
        return Alert.alert('Invalid Email Format', 'Enter valid email', [
          {
            text: 'Retry',
          },
        ]);
      } else {
        firebase
          .firestore()
          .collection('Student')
          .add({
            email,
          })
          .then(function () {
            props.navigation.goBack();
          });
      }
    } else {
      const found = lecture.some((el) => el.email === email);
      if (found) {
        return Alert.alert(
          'Email already exsist',
          'Duplicate data being formed',
          [
            {
              text: 'Retry',
            },
          ]
        );
      }
      if (!email.match(mailformat)) {
        return Alert.alert('Invalid Email Format', 'Enter valid email', [
          {
            text: 'Retry',
          },
        ]);
      } else {
        firebase
          .firestore()
          .collection('Lecture')
          .add({
            email,
          })
          .then(function () {
            props.navigation.goBack();
          });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Email : </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </View>
      </View>
      <View style={styles.form}>
        <View style={{ flexDirection: 'row' }}>
          <RadioButton
            value='first'
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('first')}
          />
          <View style={{ marginTop: 4 }}>
            <Text style={styles.label}>Student</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <RadioButton
            value='second'
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('second')}
          />
          <View style={{ marginTop: 4 }}>
            <Text style={styles.label}>Lecture</Text>
          </View>
        </View>
      </View>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={uploadEmail}
        size='large'
        icon={
          <Icon reverse name='upload' type='font-awesome-5' color='#E3562A' />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 20,
  },

  label2: {
    fontFamily: "Poppins",
    fontSize: 16,
    marginLeft:5,
    marginBottom:5,
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

export default UploadStudentEmail;
