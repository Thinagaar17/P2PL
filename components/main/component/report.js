import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const report = props => {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={props.sendReport}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.titlex}>{props.Option}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titlex: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#140F38",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },
});

export default report;