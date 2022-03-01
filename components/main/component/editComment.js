import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";

const editComment = (props) => {
  return (
    <View style={{ justifyContent: "center" }}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          //value={editComment}
          value={props.editComment}
          placeholderTextColor="#000"
          multiline={true}
          //onChangeText={(editComment) => setEditComment(editComment)}
          onChangeText={props.setEditComment}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "space-between",
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={styles.blogout}
            //onPress={() => UploadComment()}
            onPress={props.uploadUpdatedComment}
          >
            {props.loading ? (
              <ActivityIndicator size="large" color="#140F38" />
            ) : (
              <Text style={styles.Ltext}>Update Comment</Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={styles.blogout}
            onPress={props.toggleEditComment}
          >
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

export default editComment;
