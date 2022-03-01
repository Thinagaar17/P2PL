import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";

const UploadFile = (props) => {
  return (
    <View style={{ justifyContent: "center", alignItems:"center", flex:1 }}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="No files selected"
          placeholderTextColor="#D3D3D3"
          multiline={true}
          editable={props.editable}
          value={props.docName}
          onChangeText={props.setNewDocName}
        />
        <Icon
          style={styles.searchIcon}
          name="add-outline"
          type="ionicon"
          size={30}
          color="#000"
          onPress={props.pickDocument}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "space-between"}}>
        <View style={{ paddingHorizontal: 20}}>
          <TouchableOpacity style={styles.blogout} onPress={props.uploadDoc}>
            <Text style={styles.Ltext}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20}}>
          <TouchableOpacity style={styles.blogout} onPress={props.toggleModal}>
            <Text style={styles.Ltext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E3562A",
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },

  blogout: {
    width: 140,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
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
});

export default UploadFile;
