import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView  } from 'react-native'
import firebase from 'firebase'
import { connect } from 'react-redux'
require("firebase/firestore")
require("firebase/firebase-storage")

function PostComment(props) {

    const { currentUser } = props;
    const postedBy = currentUser.name
    const userId = firebase.auth().currentUser.uid
    const [comment, setComments] = useState("")
    const [isModalVisible, setModalVisible] = useState(false);
    const discussionId = props.route.params.did
    const UploadComment = () => {
        firebase.firestore()
            .collection('Comment')
            .add({
                userId,
                postedBy,
                discussionId,
                comment,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                likeBy:[],
                numOfLike:0
            }).then((function () {

                props.navigation.popToTop()
                console.log("Done")
     
            }))
    }


    
    const Cancel = () => {
        props.navigation.goBack()
    }

    return (
        <View style={styles.container}>
            
            <View style={{paddingTop:10}}>
                <TextInput
                    style = {styles.input}
                    placeholder="Add comments here"
                    placeholderTextColor="#000"
                    multiline={true}
                    onChangeText={(comment)=> setComments(comment)}
                />
            </View>
           
           
            <View style={{flexDirection:"row", justifyContent: "center"}}>
                <View style={{padding:10}}>
                    <TouchableOpacity style={styles.blogout} onPress={()=>UploadComment()}>
                        <Text style={styles.Ltext}>
                            Add Comment
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{padding:10}}>
                    <TouchableOpacity style={styles.blogout} onPress={()=>Cancel()}>
                        <Text style={styles.Ltext}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
             
        </View>
    ) 
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 20
    },

    title: {
        fontSize: 30,
        fontFamily: 'Poppins',
        //paddingRight:190
    },


    desc: {
        fontSize: 14,
        justifyContent: "center",
        alignItems:"center"
    },

    descT: {
        fontSize: 20,
        fontFamily: 'Poppins',
    },

    comT: {
        fontFamily: 'Poppins',
        fontWeight: "700",
        fontSize: 18
    },

    userT: {
        fontFamily: 'Poppins',
        fontWeight: "700",
        fontSize: 15
    },

    userC: {
        fontFamily: 'Poppins',
        paddingLeft: 10,
        fontSize: 15,
        paddingRight: 100
    },

       blogout: {
        width: 160,
        height: 40,
        backgroundColor: "#E3562A",
        borderColor: "#E3562A",
        borderRadius: 16,
        marginTop: 20
    },

    Ltext: {
        color: "#fff",
        textAlign: "center",
        fontFamily: 'Poppins',
        fontWeight: ('700'),
        fontSize: 15,
        justifyContent: "space-between",
        paddingTop: 8
    },

    input: {
        
        height: 60,
        borderColor: '#E3562A',
        borderWidth: 1,
        backgroundColor: '#FFF',
        width: 340,
        borderRadius: 12,
        padding: 10,
        fontFamily: 'Poppins',
    },

 

});


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})
export default connect(mapStateToProps, null)(PostComment);
