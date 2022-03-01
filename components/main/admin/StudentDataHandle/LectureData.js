import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';

function LectureData(props) {
  const [data, setData] = useState([]);
	const faculty = props.route.params.did;
  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .where('status', '==', 1, '&&', 'faculty', '==', faculty)
      .get()
      .then((snapshot) => {
        let user = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        const updatedUser = user.filter((e) => e.faculty === faculty);
        setData(updatedUser);
      });
  }, []);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection('users')
      .where(
        'name',
        '>=',
        search,
        '&&',
        'status',
        '==',
        1,
        '&&',
        'faculty',
        '==',
        faculty
      )
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const updatedUser = users.filter((e) => e.faculty === faculty);
        setData(updatedUser);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.input}>
        <TextInput
          underlineColorAndroid='transparent'
          placeholder='Search Discussion'
          placeholderTextColor='#000'
          autoCapitalize='none'
          onChangeText={(search) => fetchUsers(search)}
          style={{ paddingLeft: 10, fontSize: 18 }}
        />
      </View>

      <FlatList
        horizontal={false}
        extraData={data}
        data={data}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                props.navigation.navigate('ViewLectureDetail', {
                  did: item.id,
                })
              }
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item.name}
                  </Text>
                  <Text style={styles.faculty}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#003565',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 5,
    marginVertical: 5,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
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

  button: {
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    margin: 10,
    borderColor: '#E3562A',
    borderWidth: 1,
    height: Dimensions.get('window').height / 15,
    backgroundColor: '#FFF',
    // width: 370,
    borderRadius: 12,
    fontFamily: 'Poppins',
    flexDirection: 'row',
    paddingLeft: 10,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(LectureData);
