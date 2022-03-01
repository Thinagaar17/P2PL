import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView  } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')

function EditComment(props) {

    const [comment, setComment] = useState('');


    useEffect(() => {
        
            firebase.firestore()
                .collection("Comment")
                .doc(props.route.params.cid)
                .get()
                .then((snapshot) => {
                    setComment(snapshot.data().comment)
                })

    }, [])

    const Save = () => {
          firebase.firestore()
            .collection('Comment')
            .doc(props.route.params.cid)
            .update({
                comment,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then(()=> {
                props.navigation.goBack()
                console.log("save")
            })
    }

    
    return ( 
        <View>
            <View style={styles.form}>
                <View style={styles.formControl}>
                <Text style={styles.label}>Comment</Text>
                <TextInput
                    style={styles.input}
                    value={comment}
                    onChangeText={comment => setComment(comment)}
                />
                </View>
            </View>
            <View style={{justifyContent:"center", alignItems:"center"}}>
                <TouchableOpacity style={styles.logout} onPress={() => Save()}>
                    <Text style={styles.Ltext}>
                    Save Changes
                    </Text>
            </TouchableOpacity>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
        fontFamily: 'Poppins',
        fontSize: 20,
        marginVertical: 8
  },
    input: {
      fontFamily: 'Poppins',
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
    },
    
    logout: {
        width: 160,
        height: 40,
        backgroundColor: "#E3562A",
        borderColor: "#E3562A",
        borderRadius: 16,
        marginTop: 20,
        justifyContent: "center",
        alignItems:"center",
        
    },

    Ltext: {
        color: "#fff",
        textAlign: "center",
        fontFamily: 'Poppins',
        fontWeight: ('700'),
        fontSize: 15,
        justifyContent: "space-between",

    },
});

export default EditComment