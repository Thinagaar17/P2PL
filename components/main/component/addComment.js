import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Images from 'react-native-scalable-image';
const addComment = (props) => {
  return (
    <View style={{ justifyContent: 'center' }}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder='Add comments here'
          placeholderTextColor='#000'
          multiline={true}
          //onChangeText={(newComment) => setNewComment(newComment)}
          onChangeText={props.setNewComment}
        />
        <Icon
          style={styles.searchIcon}
          name='attach-outline'
          type='ionicon'
          size={30}
          color='#000'
          // onPress={() => {
          //   pickDocument();
          // }}
          onPress={props.pickDocument}
        />
        <Icon
          style={styles.searchIcon}
          name='image-outline'
          type='ionicon'
          size={30}
          color='#000'
          // onPress={() => {
          //   pickImage();
          // }}
          onPress={props.pickImage}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'space-between',
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
            onPress={props.UploadComment}
          >
            {props.loading ? (
              <ActivityIndicator size='large' color='#140F38' />
            ) : (
              <Text style={styles.Ltext}>Add Comment</Text>
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
            //onPress={toggleModal}
            onPress={props.toggleModal}
          >
            <Text style={styles.Ltext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop:10 }}>
        {props.image && (
          <Images
            width={Dimensions.get('window').width} // height will be calculated automatically
            source={{ uri: props.image }}
          />
        )}
      </View>

      <View>
        {props.Doc && (
          <View style={styles.attachment}>
            <TouchableOpacity style={styles.icon}>
              <Text
                style={{
                  fontFamily: 'Poppins',
                }}
              >
                Attached Document
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#E3562A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },

  attachment: {
    backgroundColor: '#808080',
    height: 45,
    margin: 20,
    borderColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 2,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },

  icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },

  blogout: {
    width: 140,
    height: 40,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
});

export default addComment;
