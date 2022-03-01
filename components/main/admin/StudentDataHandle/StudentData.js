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

function StudentData(props) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(1);
  const faculty = props.route.params.did;
  const list = [
    {
      title: 'Year 1',
      id: 1,
    },
    {
      title: 'Year 2',
      id: 2,
    },
    {
      title: 'Year 3',
      id: 3,
    },
    {
      title: 'Year 4',
      id: 4,
    },
  ];

  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .where('year', '==', filter, '&&', 'faculty', '==', faculty)
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
  }, [filter]);

  const chageList = (id) => {
    setFilter(id);
  };

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection('users')
      .where(
        'name',
        '>=',
        search,
        '&&',
        'year',
        '==',
        filter,
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
        //console.log(updatedUser);
        setData(updatedUser);
      });
  };

  return (
    <View>
      <FlatList
        data={list}
        horizontal
        keyExtractor={(list) => list.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => chageList(item.id)}
              style={{
                backgroundColor: item.id == filter ? '#003565' : '#140F38',
                marginHorizontal: 5,
                width: Dimensions.get('window').width * 0.5,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
              }}
            >
              <Text style={{ color: '#fff' }}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.input}>
        <TextInput
          underlineColorAndroid='transparent'
          placeholder='Search Student'
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
                props.navigation.navigate('ViewStudentDetail', {
                  did: item.id,
                })
              }
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item.name}
                  </Text>
                  <Text style={styles.faculty}>{item.matricNumber}</Text>
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

  input: {
    margin: 10,
    borderColor: '#E3562A',
    borderWidth: 1,
    height: Dimensions.get('window').height / 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    fontFamily: 'Poppins',
    flexDirection: 'row',
    paddingLeft: 10,
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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(StudentData);
