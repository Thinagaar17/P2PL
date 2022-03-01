import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-elements';
import validator from 'validator';

require('firebase/firestore');
function EditPassword(props) {
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const reauthenticate = (currentPassword) => {
    console.log("hi");
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    console.log("hi");
    return user.reauthenticateWithCredential(cred);
    
  };

  const changePassword = () => {
    let value;
    reauthenticate(currentPassword)
      .then(() => {
        if (
          validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          value = true;
          console.log('Is Strong Password');
        } else {
          value = false;
        }

        var user = firebase.auth().currentUser;
        if (value) {
          user
            .updatePassword(newPassword)
            .then(() => {
              Alert.alert('Success', 'Password has been changed', [
                {
                  text: 'Ok',
                  onPress: () => props.navigation.navigate('Profile'),
                },
              ]);
            })
            .catch((error) => {
              Alert.alert(error.message, [
                {
                  text: 'Ok',
                  onPress: () => props.navigation.navigate('Profile'),
                },
              ]);
            });
        } else {
          return Alert.alert(
            'Invalid password',
            'The password must contain \n - at least 1 lowercase alphabetical character \n - at least 1 uppercase alphabetical character \n - at least 1 numeric character \n - at least one special character \n - must be eight characters or longer  ',
            [
              {
                text: 'Retry',
              },
            ]
          );
        }
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert('Failed', 'Incorrect Current Password', [
          {
            text: 'Retry',
          },
        ]);
      });
  };

  const onChangePasswordPress = () => {
    if (currentPassword === null || newPassword === null) {
      Alert.alert('Empty field', 'Kindly fill up the required fields', [
        {
          text: 'Ok',
        },
      ]);
    } else {
      changePassword();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#140F38' }}>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Current Password :</Text>
          <TextInput
            placeholder='Current Password'
            autoCapitalize='none'
            secureTextEntry={true}
            style={styles.inputV2}
            value={currentPassword}
            onChangeText={(currentPassword) =>
              setCurrentPassword(currentPassword)
            }
          />
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>New Password :</Text>
          <TextInput
            placeholder='New Password'
            autoCapitalize='none'
            secureTextEntry={true}
            style={styles.inputV2}
            value={newPassword}
            onChangeText={(newPassword) => setNewPassword(newPassword)}
          />
        </View>
      </View>
      <FAB
        placement='right'
        color='#E3562A'
        style={styles.floatButton}
        onPress={() => onChangePasswordPress()}
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
    marginHorizontal: 20,
    marginVertical: 10,
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
    fontFamily: 'Poppins',
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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

  inputV2: {
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
    fontSize: 15,
  },
});

export default EditPassword;
