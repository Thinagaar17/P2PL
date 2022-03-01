import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { timeDifference } from '../../utils';

const NotificationList = (props) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          style={{ flex: 1, marginTop: 5 }}
          onPress={props.onSelect}
        >
          <Text style={styles.title}>{props.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '90%' }}>
              <Text style={styles.faculty}>{props.description}</Text>
            </View>
            <View>
              <Text style={styles.title1}>
                {timeDifference(new Date(), props.creation.toDate())}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    //16
    borderRadius: Dimensions.get('window').width / 24.5,
    elevation: 5,
    backgroundColor: '#003565',
    borderWidth: 1,
    borderColor: '#fff',
    shadowOpacity: 0.3,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get('window').width * 0.95,
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
    fontFamily: "PoppinsSemiBold",
    paddingVertical: 0,
    lineHeight: 25,
  },
  title1: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
  },
});

export default NotificationList;
