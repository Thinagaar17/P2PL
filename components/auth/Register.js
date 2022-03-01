import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from 'react-native';
import SelectPicker from 'react-native-form-select-picker';
import validator from 'validator';
import firebase from 'firebase';
import 'firebase/firestore';

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      Rpassword: '',
      name: '',
      faculty: null,
      year: null,
      mc: null,
      data: [],
      fac: [],
      options: [1, 2, 3, 4, 5],
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  updateYear = (year) => {
    this.setState({ year: year });
  };

  updateFaculty = (faculty) => {
    this.setState({ faculty: faculty });
  };

  getData() {
    // setTimeout(() => {
    firebase
      .firestore()
      .collection('Student')
      .get()
      .then((snapshot) => {
        let studentEmail = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data };
        });
        this.setState({
          data: studentEmail,
        });
      });
    // }, 1000);
  }

  getFac() {
    // setTimeout(() => {
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
        //   console.log(faculty);
        this.setState({
          fac: faculty,
        });
      });
    // }, 1000);
  }

  componentDidMount() {
    this.getData();
    this.getFac();
  }

  validate() {
    const { email, password, Rpassword, name, faculty, year, data } =
      this.state;
    const found = data.some((el) => el.email === email);
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // ------------------------------------------------------------------------ //

    if (!name.trim()) {
      return Alert.alert('Invalid Name', 'Please enter a valid user name', [
        {
          text: 'Retry',
        },
      ]);
    }

    if (email.match(mailformat)) {
      if (!found) {
        return Alert.alert(
          "Email doesn't exsist",
          'Contact admin for further details',
          [
            // The "Yes" button
            {
              text: 'Contact Admin',
              onPress: () => {
                this.props.navigation.navigate('ContactAdmin');
              },
            },
            {
              text: 'Retry',
            },
          ]
        );
      }
    } else {
      return Alert.alert(
        'Invalid Email Address',
        'You have entered and invalid email address',
        [
          {
            text: 'Retry',
          },
        ]
      );
    }

    if (!password.trim()) {
      return Alert.alert(
        'Invalid password',
        'The password must contain \n - at least 1 lowercase alphabetical character \n - at least 1 uppercase alphabetical character \n - at least 1 numeric character \n - at least one special character \n - must be eight characters or longer  ',
        [
          {
            text: 'Retry',
          },
        ]
      );
    } else {
      if (
        validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        console.log('Is Strong Password');
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
    }

    if (password != Rpassword) {
      return Alert.alert('Password does not match ', 'Please retry', [
        {
          text: 'Retry',
        },
      ]);
    }

    if (faculty == null) {
      return Alert.alert('Invalid faculty input', 'Please choose a faculty', [
        {
          text: 'Retry',
        },
      ]);
    }

    if (year == null) {
      return Alert.alert(
        'Invalid year input',
        'Please choose your current year of study',
        [
          {
            text: 'Retry',
          },
        ]
      );
    }

    this.onSignUp();
  }

  onSignUp() {
    const { email, password, name, faculty, year, mc } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            realName: name,
            name,
            email,
            matricNumber: mc,
            FavDiscussion: [],
            faculty,
            status: 0,
            year: parseInt(year),
            fca: true,
            fp: true,
            fs: true,
            fol: true,
            foe: true,
            fod: true,
            foeng: true,
            fom: true,
            foanss: true,
            fobna: true,
            foena: true,
            folnl: true,
            fobe: true,
            fcsit: true,
            aois: true,
            aoms: true,
            image:
              'https://firebasestorage.googleapis.com/v0/b/p2pl-bcbbd.appspot.com/o/default%2FnewProfile.png?alt=media&token=b2e22482-506a-4e78-ae2e-e38c83ee7c27',
            filteredFeed: [
              'FACULTY OF SCIENCE',
              'FACULTY OF CREATIVE ARTS',
              'FACULTY OF PHARMACY',
              'FACULTY OF LAW',
              'FACULTY OF EDUCATION',
              'FACULTY OF DENTISTRY',
              'FACULTY OF ENGINEERING',
              'FACULTY OF MEDICINE',
              'FACULTY OF ARTS AND SOCIAL SCIENCE',
              'FACULTY OF BUSINESS AND ACCOUNTANCY',
              'FACULTY OF ECONOMICS AND ADMINISTRATION',
              'FACULTY OF LANGUAGE AND LINGUISTICS',
              'FACULTY OF BUILT ENVIRONMENT',
              'FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY',
              'ACADEMY OF ISLAMIC STUDIES',
              'ACADEMY OF MALAY STUDIES',
            ],

            //change for contribution
            noOfComments: 0,
            noOfLikes: 0,
            totalPoints: 0,
            title: 'Beginner',
            awards: [],
            //change for contribution
          });
        //console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.title2}>Create your account</Text>
        </View>

        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Full Name'
          placeholderTextColor='#000'
          autoCapitalize='none'
          onChangeText={(name) => this.setState({ name })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Siswamail'
          placeholderTextColor='#000'
          autoCapitalize='none'
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Matric Number'
          placeholderTextColor='#000'
          autoCapitalize='none'
          onChangeText={(mc) => this.setState({ mc })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Password'
          placeholderTextColor='#000'
          autoCapitalize='none'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Re-Type Password'
          placeholderTextColor='#000'
          autoCapitalize='none'
          secureTextEntry={true}
          onChangeText={(Rpassword) => this.setState({ Rpassword })}
        />

        <SelectPicker
          placeholder='Faculty'
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
          onValueChange={this.updateFaculty}
          selected={this.state.faculty}
        >
          {Object.values(this.state.fac).map((val) => (
            <SelectPicker.Item
              label={val.faculty}
              value={val.faculty}
              key={val.id}
            />
          ))}
        </SelectPicker>

        <SelectPicker
          placeholder='Year'
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
          onValueChange={this.updateYear}
          selected={this.state.year}
        >
          {Object.values(this.state.options).map((val, index) => (
            <SelectPicker.Item label={val} value={val} key={val.toString()} />
          ))}
        </SelectPicker>

        <TouchableOpacity style={styles.button} onPress={() => this.validate()}>
          <Text style={styles.text}>Register</Text>
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
    fontSize: 15,
  },
});

export default Register;
