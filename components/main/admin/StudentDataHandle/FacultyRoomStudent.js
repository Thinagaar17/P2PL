import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');

function FacultyRoomStudent(props) {
  const [faculty, setFaculty] = useState('');

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
        setFaculty(faculty);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ margin: 8 }}>
        <FlatList
          horizontal={false}
          data={faculty}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    props.navigation.navigate('StudentData', {
                      did: item.faculty,
                    })
                  }
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ flex: 1 }}>
                          <Text numberOfLines={2} style={styles.title}>
                            {item.faculty}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    flex: 1,
    aspectRatio: 3 / 1,
  },
  postedTime: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
  },

  userName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
  },

  card: {
    //16
    borderRadius: Dimensions.get('window').width / 24.5,
    elevation: 5,
    backgroundColor: '#003565',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get('window').width * 0.95,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    lineHeight: 30,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(FacultyRoomStudent);
