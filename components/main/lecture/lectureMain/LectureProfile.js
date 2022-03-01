import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');
import { ListItem, BottomSheet } from 'react-native-elements';

function LectureProfile(props) {
  const userId = firebase.auth().currentUser.uid;
  const { currentUser, posts } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState([
    { label: 'Edit Personal Info', value: 'pi' },
    { label: 'Edit Password', value: 'ep' },
  ]);

  const list = [
    {
      title: 'Edit Personal Info',
      onPress: () => editPersonalInfo(),
    },
    {
      title: 'Edit Password',
      onPress: () => editPassword(),
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  const editPersonalInfo = () => {
    setIsVisible(false);
    props.navigation.navigate('EditProfile', { uid: userId });
  };

  const editPassword = () => {
    setIsVisible(false);
    props.navigation.navigate('Change Password');
  };

  const toggleVisibility = () => {
    setIsVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
            //console.log(snapshot.data())
          } else {
            console.log('does not exist');
          }
        });
    }, [])
  );

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);

  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(firebase.auth().currentUser.uid)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setUser(snapshot.data());
  //         //console.log(snapshot.data())
  //       } else {
  //         console.log("does not exist");
  //       }
  //     });
  //   setRefreshing(false);

  // }, [refreshing]);

  if (currentUser === null) {
    return <View />;
  }

  const xxx = (x) => {
    if (x === 'pi') {
      props.navigation.navigate('EditProfile', { uid: userId });
    }
    if (x === 'ep') {
      props.navigation.navigate('Change Password');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          style={{
            width: 140,
            height: 140,
            borderRadius: 140 / 2,
            marginBottom: 10,
          }}
          source={{
            uri: user.image,
          }}
        />
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.us}>{user.name}</Text>
        <View>
          <Text style={styles.fac}>({user.faculty})</Text>
        </View>
        <TouchableOpacity
          style={styles.title}
          onPress={() => toggleVisibility()}
        >
          <Text style={styles.Ltext}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('ViewRequest')}
      >
        <Text style={styles.text}>View Request</Text>
        <Icon
          style={styles.arrow}
          name='chevron-forward-outline'
          type='ionicon'
          size={20}
          color='#3C3A36'
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('Filter Feed')}
      >
        <Text style={styles.text}>Filter Feed</Text>
        <Icon
          style={styles.arrow}
          name='chevron-forward-outline'
          type='ionicon'
          size={20}
          color='#3C3A36'
        />
      </TouchableOpacity>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
      >
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'flex-end',
  },

  arrow: {
    alignItems: 'flex-end',
    left: 20,
  },

  logout: {
    width: 160,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'space-between',
    paddingTop: 8,
  },

  title: {
    width: 160,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },


  us: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#fff',
    fontSize: 24,
    marginTop: -20,
  },

  fac: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    alignItems: 'flex-end',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(LectureProfile);
