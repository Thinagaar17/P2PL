import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from "firebase";
require("firebase/firestore");



const FallBack = (props) => {

    const notificationId = props.route.params.notificationId;


    const deleteNotifications = () => {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("Notifications")
            .doc(notificationId)
            .delete();

        console.log("deletion done");
    }

    useEffect(() => {
        if (notificationId) {
            deleteNotifications();
        }
    }, [notificationId]);


    return (
        <View style={styles.screen}>
            <View style={{ height: "80%", justifyContent: "center", alignItems: "center" }}>
                <View style={styles.fallBack}>
                    <Text style={styles.fallbackText}>The discussion/ main comment has been deleted</Text>
                </View>
                <View>
                    <MaterialCommunityIcons name="delete-variant" size={100} color="red" />
                </View>
            </View>
            <View style={{ height: "20%", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={styles.ui} onPress={() => props.navigation.goBack()} >
                    <Text
                        style={{
                            color: "#fff",
                            fontFamily: "Poppins",
                            fontSize: 20,
                        }}
                    >
                        Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 5
    },
    fallBack: {
        width: "100%"
    },
    fallbackText: {
        textAlign: "center",
        fontFamily: "Poppins",
        color: "black",
        padding: 30,
        fontSize: 20,

    },
    ui: {
        width: Dimensions.get("window").width * 0.4,
        height: Dimensions.get("window").width * 0.1,
        backgroundColor: "#E3562A",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default FallBack;