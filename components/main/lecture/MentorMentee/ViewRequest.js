import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import DiscussinCard from '../../component/discussionCard';

function ViewRequest(props) {
  const { requestForAMentor, requestToBeAMentor, currentUser } = props;
  const [index, setIndex] = React.useState(0);
  const [menteeArray, setMenteeArray] = useState([]);
  const [mentorArray, setMentorArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='filter-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                toggleModal();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [index]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('RequestForMentor')
        .get()
        .then((snapshot) => {
          let rfam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const menteeArray = [...rfam].filter(
            (el) => el.faculty === currentUser.faculty
          ); // CHANGES
          setMenteeArray(menteeArray);
        });
      firebase
        .firestore()
        .collection('RequestToBeMentor')
        .get()
        .then((snapshot) => {
          let rtbam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const mentorArray = [...rtbam].filter(
            (el) => el.faculty === currentUser.faculty
          ); // CHANGES
          setMentorArray(mentorArray);
        });
    }, [])
  );

  useEffect(() => {
    universalRequest();
  }, []);

  const universalRequest = () => {
    firebase
      .firestore()
      .collection('RequestForMentor')
      .get()
      .then((snapshot) => {
        let rfam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const menteeArray = [...rfam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES
        setMenteeArray(menteeArray);
      });
    firebase
      .firestore()
      .collection('RequestToBeMentor')
      .get()
      .then((snapshot) => {
        let rtbam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const mentorArray = [...rtbam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES
        setMentorArray(mentorArray);
      });
  };

  const toggleModal = () => {
    universalRequest();
    setIsModalVisible(!isModalVisible);
  };

  const FilterRequest = (query) => {
    firebase
      .firestore()
      .collection('RequestForMentor')
      .get()
      .then((snapshot) => {
        let rfam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const menteeArray = [...rfam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES

        let filterRequest = [];
        for (var i = 0; i < menteeArray.length; i++) {
          for (var j = 0; j < menteeArray[i].problems.length; j++) {
            if (menteeArray[i].problems[j] === query) {
              filterRequest.push(menteeArray[i]);
            }
          }
        }
        setMenteeArray(filterRequest);
        setIsModalVisible(!isModalVisible);
      });

    firebase
      .firestore()
      .collection('RequestToBeMentor')
      .get()
      .then((snapshot) => {
        let rtbam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const mentorArray = [...rtbam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES

        let filterRequest = [];
        for (var i = 0; i < mentorArray.length; i++) {
          for (var j = 0; j < mentorArray[i].problems.length; j++) {
            if (mentorArray[i].problems[j] === query) {
              filterRequest.push(mentorArray[i]);
            }
          }
        }
        setMentorArray(filterRequest);
        setIsModalVisible(!isModalVisible);
      });
  };

  const renderItem = ({ item }) => <Item title={item.title} />;
  return (
    <>
      <Tab value={index} onChange={setIndex}>
        <Tab.Item title='Request for a mentor' />
        <Tab.Item title='Request to be a mentor' />
      </Tab>

      <TabView value={index} onChange={setIndex}>
        <TabView.Item style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <FlatList
              horizontal={false}
              extraData={menteeArray}
              data={menteeArray}
              keyExtractor={(requestForAMentor) => requestForAMentor.id}
              renderItem={
                ({ item }) => (
                  // item.favBy.includes(userId) ? (
                  <DiscussinCard
                    title={item.name}
                    faculty={item.description}
                    onSelect={() =>
                      props.navigation.navigate('ViewDetailMentee', {
                        did: item.id,
                      })
                    }
                  />
                )
                //  ) : null
              }
            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <FlatList
              horizontal={false}
              extraData={mentorArray}
              data={mentorArray}
              keyExtractor={(requestToBeAMentor) => requestToBeAMentor.id}
              renderItem={
                ({ item }) => (
                  // item.favBy.includes(userId) ? (
                  <DiscussinCard
                    title={item.name}
                    faculty={item.description}
                    onSelect={() =>
                      props.navigation.navigate('ViewDetailMentor', {
                        did: item.id,
                      })
                    }
                  />
                )
                //  ) : null
              }
            />
          </View>
        </TabView.Item>
      </TabView>
      <Modal isVisible={isModalVisible}>
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

          <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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
  requestForAMentor: store.userState.requestForAMentor,
  requestToBeAMentor: store.userState.requestToBeAMentor,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ViewRequest);
