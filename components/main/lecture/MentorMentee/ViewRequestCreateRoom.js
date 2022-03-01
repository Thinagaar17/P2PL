import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-elements';
import ViewAvailableGroup from '../../component/viewAvailableGroup';
import Modal from 'react-native-modal';

function ViewRequestCreateRoom(props) {
  const { requestForAMentor, requestToBeAMentor, currentUser } = props;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(5);
  const [mentee, setMentee] = useState([]);
  const [mentor, setMentor] = useState([]);
  const [update, setUpdate] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentId, setStudentId] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isAddTrue, setIsAddTrue] = useState(false);
  const [isModalVisibleV2, setModalVisibleV2] = useState(false);
  const userId = firebase.auth().currentUser.uid;
  const title = props.route.params.title;
  const desc = props.route.params.desc;

  const list = [
    {
      title: 'View Request To Be Mentor',
      id: 5,
    },
    {
      title: 'View Request For Mentor',
      id: 6,
    },
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
    {
      title: 'Lecture',
      id: 7,
    },
  ];

  const today = new Date();
  const n = today.getMonth() + 1;
  const tomorrow = new Date(today);
  const createdDay = tomorrow.getDate();
  const first = today.getDate() + 1;
  const second = today.getDate() + 2;
  const third = today.getDate() + 3;
  const fourth = today.getDate() + 4;
  const fifth = today.getDate() + 5;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='add-circle-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                createRoom();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

  useEffect(() => {
    universalRequest();
  }, [filter, update]);

  const universalRequest = () => {
    setUpdate(99);
    if (filter == 5) {
      firebase
        .firestore()
        .collection('RequestToBeMentor')
        .where('faculty', '==', currentUser.faculty)
        .get()
        .then((snapshot) => {
          let rtbam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setData(rtbam);
        });
    } else if (filter == 6) {
      firebase
        .firestore()
        .collection('RequestForMentor')
        .where('faculty', '==', currentUser.faculty)
        .get()
        .then((snapshot) => {
          let rfam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setData(rfam);
        });
    } else if (filter == 7) {
      firebase
        .firestore()
        .collection('users')
        .where('faculty', '==', currentUser.faculty, '&&', 'status', '==', 1)
        .get()
        .then((snapshot) => {
          let user = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const updatedUser = user.filter((e) => e.status === 1);

          const updatedUser2 = updatedUser.filter(
            (e) => e.name != currentUser.name
          );

          setData(updatedUser2);
        });
    } else {
      firebase
        .firestore()
        .collection('users')
        .where('year', '==', filter, '&&', 'faculty', '==', currentUser.faculty)
        .get()
        .then((snapshot) => {
          let user = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          const updatedUser = user.filter(
            (e) => e.faculty === currentUser.faculty
          );
          setData(updatedUser);
        });
    }
  };

  const xxx = () => {
    if (filter == 5) {
      firebase
        .firestore()
        .collection('RequestToBeMentor')
        .where(
          'faculty',
          '==',
          currentUser.faculty,
          '&&',
          'name',
          '>=',
          searchQuery
        )
        .get()
        .then((snapshot) => {
          let rtbam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setData(rtbam);
        });
    } else if (filter == 6) {
      firebase
        .firestore()
        .collection('RequestForMentor')
        .where(
          'faculty',
          '==',
          currentUser.faculty,
          '&&',
          'name',
          '>=',
          searchQuery
        )
        .get()
        .then((snapshot) => {
          let rfam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setData(rfam);
        });
    } else if (filter == 7) {
      firebase
        .firestore()
        .collection('users')
        .where('name', '>=', searchQuery)
        .get()
        .then((snapshot) => {
          let user = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const updatedUser = user.filter((e) => e.status === 1);

          const updatedUser2 = updatedUser.filter(
            (e) => e.faculty == currentUser.faculty
          );

          const updatedUser3 = updatedUser2.filter(
            (e) => e.name != currentUser.name
          );

          setData(updatedUser3);
        });
    } else {
      firebase
        .firestore()
        .collection('users')
        .where('name', '>=', searchQuery)
        //'year', '==', filter, '&&', 'name', '>=', searchQuery
        .get()
        .then((snapshot) => {
          let user = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          const updatedUser = user.filter(
            (e) => e.faculty === currentUser.faculty
          );
          const updatedUserV2 = updatedUser.filter((e) => e.year === filter);
          setData(updatedUserV2);
        });
    }
  };

  const createRoom = () => {
    setModalVisibleV2(!isModalVisibleV2);
    let a = mentee;

    //adding creator
    a.push({
      userId: userId,
      name: currentUser.name,
      image: currentUser.image,
      status: 0,
    });
    //remove req id from request database
    const newArray = mentee.filter((element) => element.reqId != null);

    for (var i = 0; i < newArray.length; i++) {
      if (newArray[i].status == 1) {
        firebase
          .firestore()
          .collection('RequestToBeMentor')
          .doc(newArray[i].reqId)
          .delete();
      } else {
        firebase
          .firestore()
          .collection('RequestForMentor')
          .doc(newArray[i].reqId)
          .delete();
      }
    }

    firebase
      .firestore()
      .collection('DiscussionRoom')
      .add({
        title: title,
        description: desc,
        groupMember: a,
        createdBy: currentUser.name,
        createrId: userId,
        totalNumberOfLike: 0,
        totalNumberofComment: 0,
        totalNumberOfReplyComment: 0,
        totalNumberOfAttachedDocument: 0,
        totalNumberOfAttachedImage: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        date: [
          createdDay + '/' + n,
          first + '/' + n,
          second + '/' + n,
          third + '/' + n,
          fourth + '/' + n,
          fifth + '/' + n,
        ],
        interaction: [0, 0, 0, 0, 0, 0],
      })
      .then(function () {
        //change for notification
        for (let i = 0; i < mentee.length; i++) {
          if (mentee[i].status == 0) {
            continue;
          }

          firebase
            .firestore()
            .collection('users')
            .doc(mentee[i].userId)
            .collection('Notifications')
            .add({
              title: `You have been added to a discussion room`,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              pageId: 'default',
              description: `${title}`,
              userId: userId,
              dataType: 'mmid',
            });

          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: mentee[i].pushToken,
              title: `You have been added to a discussion room`,
              body: `Tap to see the rooms `,
              priority: 'normal',
              data: {
                mmid: 'navigate',
                description: `${title}`,
                userId: userId,
              },
            }),
          });
        }
        //change for notification
        setModalVisibleV2(!isModalVisibleV2);
        props.navigation.navigate('Room');
      });
  };

  const chageList = (id) => {
    setFilter(id);
  };
  const removeMember = (id) => {
    mentor.splice(
      mentor.findIndex((v) => v.userId === id),
      1
    );
    mentee.splice(
      mentee.findIndex((v) => v.userId === id),
      1
    );
    setUpdate(1);
  };

  const addAll = () => {
    firebase
      .firestore()
      .collection('users')
      .where('year', '==', filter, '&&', 'faculty', '==', currentUser.faculty)
      .get()
      .then((snapshot) => {
        let user = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        const updatedUser = user.filter(
          (e) => e.faculty === currentUser.faculty
        );

        let filterRequest = mentee;
        for (var i = 0; i < updatedUser.length; i++) {
          filterRequest.push({
            name: updatedUser[i].name,
            status: 1,
            image: updatedUser[i].image,
            userId: updatedUser[i].id,
            mc: updatedUser[i].matricNumber,
            pushToken: updatedUser[i].pushToken,
          });
        }

        setMentee(filterRequest);
        setIsAddTrue(true);
      });
  };

  const removeAll = () => {
    const updatedUser = mentee.filter((e) => e.year === filter);
    setMentee(updatedUser);
    setIsAddTrue(false);
  };

  const addAsMentor = () => {
    let a = mentee;
    a.push({ ...studentId, status: 1 });
    setMentee(a);
    setIsModalVisible(!isModalVisible);
  };

  const addAsMentee = () => {
    let b = mentee;
    b.push({ ...studentId, status: 2 });
    setMentee(b);
    setIsModalVisible(!isModalVisible);
  };

  const addInGroup = (id) => {
    setIsModalVisible(!isModalVisible);
    setStudentId(id);
  };

  const FilterRequest = (query) => {
    if (filter == 5) {
      firebase
        .firestore()
        .collection('RequestToBeMentor')
        .where('faculty', '==', currentUser.faculty)
        .get()
        .then((snapshot) => {
          let rtbam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          let filterRequest = [];
          for (var i = 0; i < rtbam.length; i++) {
            for (var j = 0; j < rtbam[i].problems.length; j++) {
              if (rtbam[i].problems[j] === query) {
                filterRequest.push(rtbam[i]);
              }
            }
          }

          setData(filterRequest);
          setIsFilterVisible(!isFilterVisible);
        });
    } else if (filter == 6) {
      firebase
        .firestore()
        .collection('RequestForMentor')
        .where('faculty', '==', currentUser.faculty)
        .get()
        .then((snapshot) => {
          let rfam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          let filterRequest = [];
          for (var i = 0; i < rfam.length; i++) {
            for (var j = 0; j < rfam[i].problems.length; j++) {
              if (rfam[i].problems[j] === query) {
                filterRequest.push(rfam[i]);
              }
            }
          }
          setData(filterRequest);
          setIsFilterVisible(!isFilterVisible);
        });
    }
  };

  const toggleModalV2 = () => {
    universalRequest();
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#140F38' }}>
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
                  backgroundColor: item.id == filter ? '#E3562A' : '#003565',
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
        {filter == 5 || filter == 6 ? (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <View style={{ width: '100%' }}>
                <View style={styles.input}>
                  <Icon
                    name='ios-search'
                    type='ionicon'
                    size={25}
                    color='#3C3A36'
                    onPress={() => xxx()}
                  />
                  <TextInput
                    underlineColorAndroid='transparent'
                    placeholder='Search Discussion'
                    placeholderTextColor='#000'
                    autoCapitalize='none'
                    onChangeText={(searchQuery) => setSearchQuery(searchQuery)}
                    style={{ flex: 1, paddingLeft: 10, fontSize: 18 }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 10,
                marginTop: 18,
              }}
            >
              <Icon
                name='filter-outline'
                type='ionicon'
                size={30}
                color='#fff'
                onPress={FilterRequest}
              />
            </View>
          </View>
        ) : (
          <View style={styles.input}>
            <Icon
              name='ios-search'
              type='ionicon'
              size={25}
              color='#3C3A36'
              onPress={() => xxx()}
            />
            <TextInput
              underlineColorAndroid='transparent'
              placeholder='Search Discussion'
              placeholderTextColor='#000'
              autoCapitalize='none'
              onChangeText={(searchQuery) => setSearchQuery(searchQuery)}
              style={{ flex: 1, paddingLeft: 10, fontSize: 18 }}
            />
          </View>
        )}

        <FlatList
          horizontal={false}
          extraData={data}
          data={data}
          keyExtractor={(data) => data.id}
          renderItem={({ item }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} style={styles.title}>
                      {item.name}
                    </Text>
                    {filter == 5 || filter == 6 ? (
                      <Text style={styles.faculty}>{item.description}</Text>
                    ) : (
                      <Text style={styles.faculty}>{item.matricNumber}</Text>
                    )}
                  </View>
                </View>
                {filter == 5 || filter == 6 ? (
                  <View>
                    {mentor.some((el) => el.userId === item.userId) ||
                    mentee.some((el) => el.userId === item.userId) ? (
                      <TouchableOpacity
                      // onPress={() =>
                      //   addInGroup({
                      //     userId: item.userId,
                      //     name: item.name,
                      //     mc: item.matricNumber,
                      //     image: item.image,
                      //     reqId: item.id,
                      //     year: item.year,
                      //     pushToken: item.pushToken // change for notification
                      //   })
                      // }
                      >
                        <Icon
                          name='remove-outline'
                          type='ionicon'
                          size={30}
                          color='#fff'
                          onPress={() => removeMember(item.userId)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          addInGroup({
                            userId: item.userId,
                            name: item.name,
                            mc: item.matricNumber,
                            image: item.image,
                            reqId: item.id,
                            year: item.year,
                            pushToken: item.pushToken, //change for notification
                          })
                        }
                      >
                        <Icon
                          name='add-outline'
                          type='ionicon'
                          size={30}
                          color='#fff'
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View>
                    {mentor.some((el) => el.userId === item.id) ||
                    mentee.some((el) => el.userId === item.id) ? (
                      <TouchableOpacity
                      // onPress={() =>
                      //   addInGroup({
                      //     userId: item.id,
                      //     name: item.name,
                      //     mc: item.matricNumber,
                      //     image: item.image,
                      //     year: item.year,
                      //     pushToken: item.pushToken // change for notification
                      //   })
                      // }
                      >
                        <Icon
                          name='remove-outline'
                          type='ionicon'
                          size={30}
                          color='#fff'
                          onPress={() => removeMember(item.id)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          addInGroup({
                            userId: item.id,
                            name: item.name,
                            mc: item.matricNumber,
                            image: item.image,
                            year: item.year,
                            pushToken: item.pushToken, // change for notification
                          })
                        }
                      >
                        <Icon
                          name='add-outline'
                          type='ionicon'
                          size={30}
                          color='#fff'
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <Modal isVisible={isModalVisible}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {filter == 5 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => addAsMentor()}
              >
                <Text style={styles.text}>Add As Mentor</Text>
              </TouchableOpacity>
            ) : null}

            {filter == 6 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => addAsMentee()}
              >
                <Text style={styles.text}>Add As Mentee</Text>
              </TouchableOpacity>
            ) : null}

            {filter != 6 && filter != 5 ? (
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => addAsMentor()}
                >
                  <Text style={styles.text}>Add As Mentor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => addAsMentee()}
                >
                  <Text style={styles.text}>Add As Mentee</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={() => addInGroup()}
            >
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={isFilterVisible}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => FilterRequest('Academic')}
            >
              <Text style={styles.text}>Academic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => FilterRequest('Internship')}
            >
              <Text style={styles.text}>Internship</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => FilterRequest('Subject Registration')}
            >
              <Text style={styles.text}>Subject Registration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => FilterRequest('Club Activities')}
            >
              <Text style={styles.text}>Club Activities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => FilterRequest('Personal Projects')}
            >
              <Text style={styles.text}>Personal Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => toggleModalV2()}
            >
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      {isAddTrue ? (
        <View style={{ flex: 1 }}>
          {filter != 5 && filter != 6 && (
            <FAB
              placement='right'
              color='#E3562A'
              onPress={removeAll}
              icon={
                <Icon
                  reverse
                  name='remove-outline'
                  type='ionicon'
                  color='#E3562A'
                  size={35}
                  containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 11,
                  }}
                />
              }
            />
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {filter != 5 && filter != 6 && (
            <FAB
              placement='right'
              color='#E3562A'
              onPress={addAll}
              icon={
                <Icon
                  reverse
                  name='add-outline'
                  type='ionicon'
                  color='#E3562A'
                  size={35}
                  containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 11,
                  }}
                />
              }
            />
          )}
        </View>
      )}
      <Modal isVisible={isModalVisibleV2}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size='large' color='#E3562A' />
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
});

const mapStateToProps = (store) => ({
  requestForAMentor: store.userState.requestForAMentor,
  requestToBeAMentor: store.userState.requestToBeAMentor,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ViewRequestCreateRoom);
