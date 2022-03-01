import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import firebase from "firebase";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  validation(){
    const { email, password } = this.state;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!email.match(mailformat)) {
      return Alert.alert(
        "Invalid Email Address",
        "You have entered and invalid email address",
        [
          {
            text: "Retry",
          },
        ]
      );
    }

    if (!password.trim()) {
      return Alert.alert(
        "Incorrect password",
        "You have entered and incorrect password",
        [
          {
            text: "Retry",
          },
        ]
      );
    }

    this.onSignUp();
  }

  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("Logged In");
      })
      .catch((error) => {
          return Alert.alert(
            "Invalid access",
            "Wrong email or password",
            [
              {
                text: "Retry",
              },
            ]
          );
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.title2}>Sign in with your account</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Siswamail"
          placeholderTextColor="#000"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#000"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <TouchableOpacity style={styles.button} onPress={() => this.validation()}>
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <Text style={styles.title2} onPress={() =>this.props.navigation.navigate('ResetPassword')}>Forgot Password </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  title2: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    marginBottom: 20,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  input: {
    margin: 5,
    height: 53,
    borderColor: "#E3562A",
    borderWidth: 1,
    backgroundColor: "#FFF",
    width: 275,
    borderRadius: 12,
    padding: 10,
    fontFamily: "Poppins",
  },
});

export default Login;
