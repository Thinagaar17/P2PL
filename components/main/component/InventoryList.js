import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { WebView } from 'react-native-webview';

const InventoryList = (props) => {
  const [web, setWeb] = useState(false);

  return (
    <View>
      <View style={styles.list}>
        <View style={styles.doc}>
          <Text numberOfLines={2} style={styles.docText}>
            {props.docTitle}
          </Text>
        </View>
        <View style={styles.download}>
          <View style={{ paddingHorizontal: 5}}>
            <TouchableOpacity>
              <Icon
                name='download-outline'
                type='ionicon'
                size={30}
                color='#ffff'
                onPress={() => setWeb(true)}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            <TouchableOpacity>
              <Icon
                name='trash-outline'
                type='ionicon'
                size={30}
                color='#ffff'
                onPress={props.delete}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Icon
              name='share-social-outline'
              type='ionicon'
              size={30}
              color='#ffff'
              onPress={props.share}
            />
          </TouchableOpacity>
        </View>
      </View>
      {web ? <WebView source={{ uri: props.link }} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    borderRadius: Dimensions.get('window').width / 24.5,
    elevation: 5,
    backgroundColor: '#003565',
    margin: 5,
    padding: 15,
    width: Dimensions.get('window').width * 0.95,
  },
  doc: {
    width: '60%',
    justifyContent: 'center',
  },
  docText: {
    fontFamily: 'Poppins',
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  download: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default InventoryList;
