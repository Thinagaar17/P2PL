import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PointsList from '../../component/PointList';

const AvailableAwards = (props) => {
  const awards = [
    {
      id: '0',
      title: 'First Comment',
      description: 'Post a comment on any discussion created to receive this',
      pointsToBeAdded: 1,
    },
    {
      id: '1',
      title: 'Somebody Likes You',
      description:
        'Somebody out there liked one of your comments. Keep posting for more',
      pointsToBeAdded: 2,
    },
    {
      id: '2',
      title: 'Keep Coming Back',
      description: '30 comments posted! You must like it here!',
      pointsToBeAdded: 5,
    },
    {
      id: '3',
      title: 'I Like it A Lot',
      description: 'Your comments have been liked 25 times',
      pointsToBeAdded: 7,
    },
    {
      id: '4',
      title: "Can't Stop",
      description:
        "You've posted 100 comments. I hope this took you more than a day",
      pointsToBeAdded: 10,
    },
    {
      id: '5',
      title: 'Seriously Likeable',
      description: 'Your comments have been liked 50 times',
      pointsToBeAdded: 10,
    },
    {
      id: '6',
      title: 'Attracter',
      description: 'One of your main comments has obtained 20 replies ',
      pointsToBeAdded: 10,
    },
    {
      id: '7',
      title: 'Contribution Fanatic',
      description: '300 comments. Impressive',
      pointsToBeAdded: 15,
    },
    {
      id: '8',
      title: 'Helpful',
      description: 'One of your comments has attracted 25 likes',
      pointsToBeAdded: 15,
    },
    {
      id: '9',
      title: 'Interesting Topic',
      description: 'One of your posted disucssions has attracted 30 comments',
      pointsToBeAdded: 15,
    },
    {
      id: '10',
      title: 'Super Magnet',
      description: 'One of your main comments has obtained 50 replies ',
      pointsToBeAdded: 20,
    },
    {
      id: '11',
      title: 'Super Helpful',
      description: 'One of your comments has attracted 50 likes',
      pointsToBeAdded: 25,
    },
    {
      id: '12',
      title: 'Engaging Topic',
      description: 'One of your posted disucssions has attracted 60 comments',
      pointsToBeAdded: 25,
    },
  ];
  return (
    <View style={styles.screen}>
      <FlatList
        data={awards}
        renderItem={(itemData) => (
          <PointsList
            points={itemData.item.pointsToBeAdded}
            title={itemData.item.title}
            description={itemData.item.description}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default AvailableAwards;
