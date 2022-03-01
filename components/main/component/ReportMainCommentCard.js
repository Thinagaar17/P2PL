import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { timeDifference } from '../../utils';
import ImageView from 'react-native-image-viewing';
import { WebView } from 'react-native-webview';
import ParsedText from 'react-native-parsed-text';
import * as Linking from 'expo-linking';

const ReportMainCommentCard = (props) => {
  const a = props.verify;
  const [data, setData] = useState(false);
  const [web, setWeb] = useState(false);

  const handleUrlPress = (url, matchIndex /*: number*/) => {
    Linking.openURL(url);
  };

  const handlePhonePress = (phone, matchIndex /*: number*/) => {
    Alert.alert(`${phone} has been pressed!`);
  };

  const handleNamePress = (name, matchIndex /*: number*/) => {
    Alert.alert(`Hello ${name}`);
  };

  const handleEmailPress = (email, matchIndex /*: number*/) => {
    Alert.alert(`send email to ${email}`);
  };

  const renderText = (matchingString, matches) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    console.log(24);
    return `^^${match[1]}^^`;
  };

  const images = [
    {
      uri: props.attachedImage,
    },
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Image
            style={{
              marginRight: 15,
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
            }}
            source={{
              uri: props.picture,
            }}
          />
          {props.componentStatus == 1 && (
            <View
              style={{
                marginRight: 10,
                paddingTop: 10,
              }}
            >
              {props.status == 1 ? (
                <View>
                  {props.verify ? (
                    <Icon
                      name='checkmark-circle'
                      type='ionicon'
                      size={25}
                      color='#140F38'
                      onPress={props.removeVerifyComment}
                    />
                  ) : (
                    <Icon
                      name='checkmark-circle-outline'
                      type='ionicon'
                      size={25}
                      color='#140F38'
                      onPress={props.verifyComment}
                    />
                  )}
                </View>
              ) : null}

              {props.status == 0 ? (
                <View>
                  {props.verify ? (
                    <Icon
                      name='checkmark-circle'
                      type='ionicon'
                      size={20}
                      color='#140F38'
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          )}
        </View>
        {props.firstUserId === props.secondUserId ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.mainBubble}
            onLongPress={props.xxx}
            delayLongPress={500}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.userName}>{props.postedBy} </Text>
              {props.creation === null ? (
                <Text style={(styles.userC, { marginRight: 10 })}>Now</Text>
              ) : (
                <Text style={(styles.userC, { marginRight: 10 })}>
                  {props.time}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <ParsedText
                style={styles.userC}
                parse={[
                  {
                    type: 'url',
                    style: styles.url,
                    onPress: handleUrlPress,
                  },
                  {
                    type: 'phone',
                    style: styles.phone,
                    onPress: handlePhonePress,
                  },
                  {
                    type: 'email',
                    style: styles.email,
                    onPress: handleEmailPress,
                  },
                  {
                    pattern: /\[(@[^:]+):([^\]]+)\]/i,
                    style: styles.username,
                    onPress: handleNamePress,
                    renderText: renderText,
                  },
                  { pattern: /#(\w+)/, style: styles.hashTag },
                ]}
                childrenProps={{ allowFontScaling: false }}
              >
                {props.comment}
              </ParsedText>
            </View>
            {props.attachedImage != null ? (
              <View style={styles.attachment}>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => setData(true)}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                    }}
                  >
                    Image
                  </Text>
                  <Icon
                    name='download-outline'
                    type='ionicon'
                    size={25}
                    color='#000'
                  />
                </TouchableOpacity>
              </View>
            ) : null}

            {props.attachedDocument != null ? (
              <View style={styles.attachment}>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => setWeb(true)}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                    }}
                  >
                    Doc
                  </Text>
                  <Icon
                    name='download-outline'
                    type='ionicon'
                    size={25}
                    color='#000'
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <View style={styles.mainBubble}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.userName}>{props.postedBy} </Text>
                {props.creation === null ? (
                  <Text style={(styles.userC, { marginRight: 10 })}>Now</Text>
                ) : (
                  <Text style={(styles.userC, { marginRight: 10 })}>
                    {props.time}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ParsedText
                  style={styles.userC}
                  parse={[
                    {
                      type: 'url',
                      style: styles.url,
                      onPress: handleUrlPress,
                    },
                    {
                      type: 'phone',
                      style: styles.phone,
                      onPress: handlePhonePress,
                    },
                    {
                      type: 'email',
                      style: styles.email,
                      onPress: handleEmailPress,
                    },
                    {
                      pattern: /\[(@[^:]+):([^\]]+)\]/i,
                      style: styles.username,
                      onPress: handleNamePress,
                      renderText: renderText,
                    },
                    { pattern: /#(\w+)/, style: styles.hashTag },
                  ]}
                  childrenProps={{ allowFontScaling: false }}
                >
                  {props.comment}
                </ParsedText>
              </View>
              {props.attachedImage != null ? (
                <View style={styles.attachment}>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setData(true)}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                      }}
                    >
                      Image
                    </Text>
                    <Icon
                      name='download-outline'
                      type='ionicon'
                      size={25}
                      color='#000'
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              {props.attachedDocument != null ? (
                <View style={styles.attachment}>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setWeb(true)}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                      }}
                    >
                      Doc
                    </Text>
                    <Icon
                      name='download-outline'
                      type='ionicon'
                      size={25}
                      color='#000'
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        )}
      </View>
      <ImageView
        images={images}
        imageIndex={0}
        visible={data}
        onRequestClose={() => setData(false)}
        swipeToCloseEnabled={true}
      />

      {web ? <WebView source={{ uri: props.attachedDocument }} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainBubble: {
    borderColor: '#E3562A',
    borderBottomWidth: 5,
    width: '85 %',
    padding: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    marginBottom: 5,
  },

  icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },

  attachment: {
    backgroundColor: '#808080',
    height: 45,
    marginRight: 5,
    borderColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    elevation: 2,
    marginVertical: 3,
  },

  attachedImage: {
    width: 50,
    height: 50,
  },

  userName: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: 17,
  },

  userC: {
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontSize: 15,
  },

  url: {
    color: 'red',
    textDecorationLine: 'underline',
  },

  email: {
    textDecorationLine: 'underline',
  },

  text: {
    color: 'black',
    fontSize: 15,
  },

  phone: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  name: {
    color: 'red',
  },

  username: {
    color: 'green',
    fontWeight: 'bold',
  },

  hashTag: {
    fontStyle: 'italic',
  },
});
export default ReportMainCommentCard;
