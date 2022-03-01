import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');
import { Icon } from 'react-native-elements';
import PointsList from '../../component/PointList';

const ContributionPoints = (props) => {
  const [awards, setAwards] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const title = props.route.params.title;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <View style={{ paddingHorizontal: 10 }}>
            <Icon
              name='trophy-outline'
              type='ionicon'
              size={35}
              color='#000'
              onPress={() => {
                props.navigation.navigate('AvailableAwards');
              }}
            />
          </View>

          <TouchableOpacity>
            <Icon
              name='podium-outline'
              type='ionicon'
              size={35}
              color='#000'
              onPress={() => {
                props.navigation.navigate('LeaderBoard');
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });

    const loadAwards = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          let awards = [];
          let awardList = snapshot.data().awards;
          for (let i = 0; i < awardList.length; i++) {
            awards.push({
              id: i.toString(),
              ...awardList[i],
            });
          }
          setAwards(awards);
        });

      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          setCurrentUserData(snapshot.data());
        });
      setIsLoading(false);
    };

    loadAwards();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size='large' color='orange' />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.title}>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={{ marginBottom: 5 }}>
          <Text style={styles.pointsText}>
            Total Points:{' '}
            {isLoading ? (
              <View style={styles.spinner}>
                <ActivityIndicator size='small' color='orange' />
              </View>
            ) : (
              <Text
                numberOfLines={2}
                style={{ fontSize: 18, fontWeight: 'bold' }}
              >
                {currentUserData.totalPoints}
              </Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.spinner}>
            <ActivityIndicator size='large' color='orange' />
          </View>
        ) : awards.length === 0 ? (
          <View style={styles.fallBack}>
            <Text style={styles.fallbackText}>No awards received yet</Text>
          </View>
        ) : (
          <FlatList
            data={awards}
            renderItem={(itemData) => (
              <PointsList
                points={itemData.item.pointsToBeAdded}
                title={itemData.item.title}
                description={itemData.item.description}
                time={itemData.item.creation}
              />
            )}
          />
        )}
      </View>
      {/* <View style={styles.points}>
                <Text style={styles.pointsText}>Total Points: {isLoading ? <View style={styles.spinner}>
                    <ActivityIndicator size="small" color="orange" />
                </View> : <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: "bold" }}>{currentUserData.totalPoints}</Text>}</Text>
            </View> */}

      {/* <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate("AvailableAwards") }}>
                <Text numberOfLines={2} style={styles.buttonText}>View All Available Awards</Text>
            </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#140F38',
  },
  title: {
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: '#694fad',
    paddingHorizontal: 15,
    paddingBottom: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    borderWidth: 10,
    borderColor: '#003565',
  },
  titleText: {
    fontFamily: 'Poppins',
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#E3562A',
    padding: 5,
    borderRadius: 20,
    width: 170,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  points: {
    paddingHorizontal: 10,
    marginBottom: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#694fad',
  },
  pointsText: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listContainer: {
    height: '70%',
    width: '95%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    backgroundColor: '#003565',
    marginHorizontal: 5,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fallbackText: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: 'white',
    padding: 30,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ContributionPoints);
