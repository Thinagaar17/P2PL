import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const Ranking = (props) => {
    return (
        <View style={styles.screen}>
            <View style={styles.details}>
                <View style={styles.imageBox}>
                    <Image
                        style={styles.image}
                        source={{ uri: props.image }} />
                </View>
                <View style={styles.userInfo}>
                    <View style={{width:Dimensions.get('window').width < 400 ? "90%": "80%"}}>
                    <Text style={styles.userName}>{props.name}</Text>
                    </View>
                    <Text style={styles.userTitle}>{props.title}</Text>
                    <Text style={styles.userFaculty}>{props.faculty}</Text>
                </View>
            </View>
            <View style={styles.points}>
                <Text style={styles.pointsText}>{props.points}</Text>
                <Text style={styles.pointsText2}>points</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: "row",
        height: 120,
        margin:8,
        borderRadius:20,
        overflow:"hidden",
        backgroundColor: "#003565",
      
    },
    details: {
        flexDirection: "row",
        width: "80%",
        justifyContent: "flex-start",
        alignItems:"center",
        backgroundColor: "#003565"
    },
    imageBox: {
        width:"32%",
        marginHorizontal:5,
        
    },
    image: {
        width:90,
        height: 90,
        borderRadius:45,
        marginLeft:3
    },
    userInfo: {
        padding:Dimensions.get('window').width < 400 ? 5: 10,
        paddingLeft:5,
        width:"68%",
        // backgroundColor:"red"
    },
    userName: {
        fontFamily: "Poppins",
        fontSize: 18,
        fontWeight: "bold",
       
        color:"white",
        lineHeight:23
    },
    userTitle: {
        fontFamily: "Poppins",
        fontSize: 15,
        fontWeight: "700",
        color:"white"
    },
    userFaculty: {
        fontFamily: "Poppins",
        fontSize: 10,
        fontWeight: "300",
        color:"white"
    },
    points: {
        width: "20%",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#694fad"
        
    },
    pointsText:{
        fontFamily: "Poppins",
        fontSize: 22,
        fontWeight: "bold",
        color:"white"
    },
    pointsText2:{
        fontFamily: "Poppins",
        fontSize: 12,
        fontWeight: "bold",
        color:"white",
        
    }

});

export default Ranking;