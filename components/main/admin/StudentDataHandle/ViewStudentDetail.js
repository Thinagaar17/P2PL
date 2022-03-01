import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
require('firebase/firestore');
import SelectPicker from 'react-native-form-select-picker';

function ViewStudentDetail(props) {
  const [info, setInfo] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricNum, setMatricNum] = useState('');
  const [fac, setFac] = useState('');
  const [year, setYear] = useState(0);
  const [data, setData] = useState(0);
  const [facultyData, setFacultyData] = useState([]);
  let options = [1, 2, 3, 4, 5];
  const infoId = props.route.params.did;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='create-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                setIsEdit(true);
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [data]);

  const save = () => {
    //console.log({ name, email, matricNum, fac, year });
    firebase
      .firestore()
      .collection('users')
      .doc(infoId)
      .update({
        name: name,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        year: year,
        email,
        faculty: fac,
        year: year,
        matricNumber: matricNum,
      })
      .then(() => {
        setIsEdit(false);
        fetchData();
      });
  };

  const fetchData = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
          setName(snapshot.data().name);
          setEmail(snapshot.data().email);
          setMatricNum(snapshot.data().matricNumber);
          setFac(snapshot.data().faculty);
          setYear(snapshot.data().year);
        } else {
          console.log('does not exist');
        }
      });

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
        setFacultyData(faculty);
      });
  };

  const OriData = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.input}>{info.name} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Matric Number :</Text>
              <Text style={styles.input}>{info.matricNumber} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Email :</Text>
              <Text style={styles.input}>{info.email} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Faculty :</Text>
              <Text style={styles.input}>{info.faculty}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Year :</Text>
              <Text style={styles.input}>{info.year} </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const EditData = () => {
    return (
      <View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Name : </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(name) => setName(name)}
            />
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Matric Number :</Text>
            <TextInput
              style={styles.input}
              value={matricNum}
              onChangeText={(matricNum) => setMatricNum(matricNum)}
            />
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty</Text>
            <SelectPicker
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
            </SelectPicker>
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year of Study</Text>
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
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.logout} onPress={() => save()}>
            <Text style={styles.Ltext}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isEdit) {
    return EditData();
  }

  return OriData();
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
    marginTop: 5,
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

export default ViewStudentDetail;
