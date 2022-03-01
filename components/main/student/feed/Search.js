import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import SelectPicker from 'react-native-form-select-picker';

import firebase from 'firebase';
require('firebase/firestore');

function Search(props) {
  const { posts } = props;
  const [users, setUsers] = useState(null);
  const [fac, setFac] = useState(' ');
  const [selected, setSelected] = useState(null);
  const [faculty, setFaculty] = useState('');
  const [availableDiscussion, setAvailableDiscussion] = useState(posts);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
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
        setFac(faculty);
      });
  }, []);

  const fetchUsers = (search) => {
    if (search != null) {
      const result = availableDiscussion.filter((x) =>
        x.title.toUpperCase().includes(search.toUpperCase())
      );
      setUsers(result);
    }
  };
  //setUsers(users); <- pass final data into this
  const searchByCategory = (xxx) => {
    if (selected === null) {
    } else {
      setFaculty(xxx);
      firebase
        .firestore()
        .collection('Discussion')
        .where('faculty', '==', selected)
        .get()
        .then((snapshot) => {
          let users = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUsers(users);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Icon
          name='ios-search'
          type='ionicon'
          size={25}
          color='#3C3A36'
          onPress={searchByCategory}
        />
        <TextInput
          underlineColorAndroid='transparent'
          placeholder='Search Discussion'
          placeholderTextColor='#000'
          autoCapitalize='none'
          onChangeText={(search) => fetchUsers(search)}
          style={{ flex: 1, paddingLeft: 10, fontSize: 18 }}
        />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <SelectPicker
          placeholder='Faculty'
          placeholderStyle={{
            fontFamily: 'Poppins',
            fontSize: 20,
            color: '#fff',
          }}
          onSelectedStyle={{
            fontFamily: 'Poppins',
            fontSize: 20,
            color: '#fff',
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.ui,
          }}
          onValueChange={(value) => {
            setSelected(value);
          }}
          selected={selected}
        >
          {Object.values(fac).map((val) => (
            <SelectPicker.Item
              label={val.faculty}
              value={val.faculty}
              key={val.id}
            />
          ))}
        </SelectPicker>
      </View>

      {users != null ? (
        <FlatList
          horizontal={false}
          extraData={users}
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item === ' ' ? null : (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  {userId === 'aszrJayRTbZNtcX5DPzXU5HTD6a2' ||
                  userId === 'uvlRbumPXGb0cie0E75eUClfYHR2' ? (
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        props.navigation.navigate('LectureDiscussionView', {
                          did: item.id,
                        })
                      }
                    >
                      <Text numberOfLines={2} style={styles.title}>
                        {item.title}
                      </Text>
                      <Text style={styles.faculty}>{item.faculty}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        props.navigation.navigate('Discussion', {
                          did: item.id,
                        })
                      }
                    >
                      <Text numberOfLines={2} style={styles.title}>
                        {item.title}
                      </Text>
                      <Text style={styles.faculty}>{item.faculty}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  ui: {
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.12,
    backgroundColor: '#E3562A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    borderRadius: Dimensions.get('window').width / 24.5,
    elevation: 5,
    backgroundColor: '#003565',
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get('window').width * 0.95,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  dropdown: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: '#E3562A',
    height: Dimensions.get('window').height / 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    margin: 10,
    borderColor: '#E3562A',
    borderWidth: 1,
    height: Dimensions.get('window').height / 15,
    backgroundColor: '#FFF',
    width: 370,
    borderRadius: 12,
    fontFamily: 'Poppins',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },

  search: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  faculty: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    lineHeight: 25,
  },
});

const mapStateToProps = (store) => ({
  posts: store.userState.posts,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Search);
