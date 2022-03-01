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

function Profile(props) {
  const userId = firebase.auth().currentUser.uid;
  const { currentUser, posts } = props;
  const [user, setUser] = useState(currentUser);
  const [faculty, setFaculty] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const list = [
    {
      title: 'Edit Personal Info',
      onPress: () =>{
        setIsVisible(false);
        props.navigation.navigate('EditProfile', {uid: userId,facId: faculty,});
        
      },
    },
    {
      title: 'Edit Password',
      onPress: () => {
        setIsVisible(false);
        props.navigation.navigate('Change Password');
      },
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      setIsVisible(false);
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
            setFaculty(snapshot.data().faculty);
            //console.log(snapshot.data())
          } else {
            console.log('does not exist');
          }
        });
    }, [])
  );

  if (currentUser === null) {
    return <View />;
  }

  const toggleVisibility = () => {
    setIsVisible(true);
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
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

        <View>
          <Text style={styles.us}>{user.name}</Text>
        </View>
        <View>
          <Text style={styles.fac}>({user.faculty})</Text>
        </View>
        <View style={styles.bb}>
          <View style={{ marginHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Contribution', {
                  title: user.title,
                });
              }}
              style={styles.title}
            >
              <Text style={styles.Ltext}>{user.title}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.title}
              onPress={() => toggleVisibility()}
            >
              <Text style={styles.Ltext}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            props.navigation.navigate('Created Discussions', { data: 123 })
          }
        >
          <Text style={styles.text}>Created Discussion</Text>
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
          onPress={() =>
            props.navigation.navigate('Favorite Discussion', { uid: userId })
          }
        >
          <Text style={styles.text}>Favorite Discussion</Text>
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
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Activity Tracking')}
        >
          <Text style={styles.text}>Discussion Room</Text>
          <Icon
            style={styles.arrow}
            name='chevron-forward-outline'
            type='ionicon'
            size={20}
            color='#3C3A36'
          />
        </TouchableOpacity> */}
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

  Ltext: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    //justifyContent: "space-between",
    paddingTop: 8,
  },

  title: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginVertical: 10,
  },

  bb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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

export default connect(mapStateToProps, null)(Profile);
