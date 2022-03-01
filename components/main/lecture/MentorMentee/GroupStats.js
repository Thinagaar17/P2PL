import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import firebase from 'firebase';

export default function GroupStats(props) {
  const [groupData, setGroupData] = useState([]);
  const [date, setDate] = useState([0]);
  const [interaction, setInteraction] = useState([0]);
  const [
    totalNumberOfAttachedDocument,
    setTotalNumberOfAttachedDocumenInteraction,
  ] = useState(0);
  const [totalNumberOfAttachedImage, setTotalNumberOfAttachedImage] =
    useState(0);
  const [totalNumberOfLike, setTotalNumberOfLike] = useState(0);
  const [totalNumberOfReplyComment, setTotalNumberOfReplyComment] = useState(0);
  const [totalNumberofComment, setTotalNumberofComment] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const roomId = props.route.params.did;

  useEffect(() => {
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(roomId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setGroupData(snapshot.data());
          setDate(snapshot.data().date);
          setInteraction(snapshot.data().interaction);
          setTotalNumberOfAttachedDocumenInteraction(snapshot.data().totalNumberOfAttachedDocument)
          setTotalNumberOfAttachedImage(snapshot.data().totalNumberOfAttachedImage)
          setTotalNumberOfLike(snapshot.data().totalNumberOfLike)
          setTotalNumberOfReplyComment(snapshot.data().totalNumberOfReplyComment)
          setTotalNumberofComment(snapshot.data().totalNumberofComment)
        } else {
          console.log('does not exist');
        }
      });
  }, []);

  //Line graph
  const data = {
    labels: date,
    datasets: [
      {
        data: interaction,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Number of Interactions'], // optional
  };
  const chartConfig = {
    backgroundColor: '#140F38',
    backgroundGradientFrom: '#140F38',
    backgroundGradientTo: '#140F38',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };
  // chartConfigs
  const chartConfigs = {
    backgroundColor: '#140F38',
    backgroundGradientFrom: '#140F38',
    backgroundGradientTo: '#140F38',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(20, 15, 56, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(20, 15, 56, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  //pie chart

  const datas = [
    {
      name: 'Like',
      population: totalNumberOfLike,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Comment',
      population: totalNumberofComment,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'R Comment',
      population: totalNumberOfReplyComment,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Attached Doc',
      population: totalNumberOfAttachedDocument,
      color: '#ffffff',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Attached Img',
      population: totalNumberOfAttachedImage,
      color: 'rgb(0, 0, 255)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />
      </View>

      <View style={{ backgroundColor: '#140F38', paddingHorizontal: 10 }}>
        <PieChart
          data={datas}
          width={screenWidth}
          height={220}
          chartConfig={chartConfigs}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          bgColor={'#140F38'}
          //center={[10, 50]}
          //absolute
        />
      </View>
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
});
