import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
import Ranking from '../../component/Ranking';

const LeaderBoard = (props) => {
  const [studentsList, setStudentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .orderBy('totalPoints', 'desc')
        .get()
        .then((snapshot) => {
          let list = snapshot.docs.map((doc) => {
            let id;
            let name;
            let title;
            let totalPoints;
            let faculty;
            let image;
            if (doc.data().status == 0) {
              id = doc.id;
              name = doc.data().name;
              title = doc.data().title;
              totalPoints = doc.data().totalPoints;
              faculty = doc.data().faculty;
              image = doc.data().image;
            }
            return { id, name, title, totalPoints, faculty, image };
          });

          setStudentsList(list);
          console.log(studentsList);
        });
      setIsLoading(false);
    };
    loadList();
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
      <View style={{ marginVertical: 20 }}>
        <FlatList
          data={studentsList}
          renderItem={(itemData) => (
            <Ranking
              image={itemData.item.image}
              name={itemData.item.name}
              title={itemData.item.title}
              faculty={itemData.item.faculty}
              points={itemData.item.totalPoints}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#140F38',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default LeaderBoard;
