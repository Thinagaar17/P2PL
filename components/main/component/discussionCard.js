import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";


const discussinCard = props => {
  return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={{ flex: 1 }}
						onPress={props.onSelect}
          >
            <Text numberOfLines={2} style={styles.title}>
              {props.title}
            </Text>
            <Text style={styles.faculty}>{props.faculty}</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    //16
    borderRadius: Dimensions.get("window").width / 24.5,
    elevation: 5,
    backgroundColor: "#003565",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get("window").width * 0.95,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    lineHeight: 30,
  },
});

export default discussinCard;
