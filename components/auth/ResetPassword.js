import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import firebase from 'firebase';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  validation() {
    const { email } = this.state;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.match(mailformat)) {
      return Alert.alert(
        'Invalid Email Address',
        'Enter a valid email address',
        [
          {
            text: 'Retry',
          },
        ]
      );
    }
    this.sendEmail();
  }

  sendEmail = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(function () {
        console.log('email sent');
      })
      .catch(function (e) {
        alert(e);
      });
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title2}>Forgot your password ?</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Siswamail'
          placeholderTextColor='#000'
          onChangeText={(email) => this.setState({ email })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.validation()}
        >
          <Text style={styles.text}>Send Email</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
  },

  title2: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    marginBottom: 20,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#E3562A',
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
    margin: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
  },

  input: {
    margin: 5,
    height: 53,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    width: 275,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },
});
export default ResetPassword;
