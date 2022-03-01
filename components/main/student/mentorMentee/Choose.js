import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { xxx } from "../../../utils";

export default function Choose(props) {
  const [isModalVisible, setModalVisible] = useState(true);



  return (
    <Modal isVisible={isModalVisible}>
      <View style={styles.container}>
        <View style={{ justifyContent: "center", marginBottom: 5 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate("RequestForMentor")}
          >
            <Text style={styles.text}>Request For A Mentor</Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", marginBottom: 5 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate("RequestToBeMentor")}
          >
            <Text style={styles.text}>Request To Be A Mentor</Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.goBack()}
          >
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  img: {
    width: 147,
    height: 184,
  },
});
