import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import { TouchableOpacity } from 'react-native';
require('firebase/firestore');

function ViewDetailMentee(props) {
  const [info, setInfo] = useState([]);
  const [array, setarray] = useState([]);
  const infoId = props.route.params.did;

  const xxx = () => {
    props.navigation.navigate('AddInGroup', {
      did: infoId,
    });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection('RequestForMentor')
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
          setarray(snapshot.data().problems);
        } else {
          console.log('does not exist');
        }
      });
  }, []);

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

        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description :</Text>
            <Text style={styles.input}>{info.description} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Issue: </Text>
            <View style={styles.input}>
              {array.map((item, key) => (
                <Text key={key} style={styles.labelIssue}>
                  {' '}
                  - {item}{' '}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <FAB
        placement='right'
        title='Add in group'
        color='#E3562A'
        style={styles.floatButton}
        onPress={() => xxx()}
        icon={<Icon name='add-outline' type='ionicon' size={30} color='#fff' />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    marginVertical: 5,
    fontSize: 20,
  },

  label2: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 5,
  },
  labelIssue: {
    fontFamily: 'Poppins',
    fontSize: 15,
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

export default ViewDetailMentee;
