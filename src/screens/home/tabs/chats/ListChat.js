import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ListItem, Left, Body, Right, Thumbnail, Text, View} from 'native-base';
import {withNavigation} from 'react-navigation';
class ListChat extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {item} = this.props;
    // console.log(item);
    const id = item.id;
    const notification = item.notification;
    const name = item.name;
    const photo = item.avatar;
    const names = item.name;
    const photos = item.avatar;
    const message = item.message;
    const time = item.time;
    return (
      <ListItem avatar style={styles.listItem}>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            this.props.navigation.navigate('Chat', {
              id,
              name,
              photo,
              names,
              photos,
            });
          }}
          onLongPress={() => {}}>
          <Left>
            <Thumbnail
              source={
                photo
                  ? {
                      uri: `${photo}`,
                    }
                  : {
                      uri:
                        'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                    }
              }
            />
          </Left>
          <Body>
            <Text>{name}</Text>
            <Text note style={styles.textMargin} numberOfLines={1}>
              {message}
            </Text>
          </Body>
          <Right style={styles.right}>
            <Text note style={styles.time}>
              {time}
            </Text>
            {notification && (
              <View style={styles.notification}>
                <Text style={styles.textNotification}>{notification}</Text>
              </View>
            )}
          </Right>
        </TouchableOpacity>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  notification: {
    marginTop: 5,
    backgroundColor: '#25D366',
    minWidth: 20,
    minHeight: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  touch: {flex: 1, flexDirection: 'row'},
  listItem: {paddingVertical: 3},
  textMargin: {marginBottom: 5},
  borderBottom: {borderBottomColor: '#000'},
  time: {fontSize: 12},
  right: {justifyContent: 'center', alignItems: 'center'},
  textNotification: {fontSize: 12, color: '#fff', alignSelf: 'center'},
});
export default withNavigation(ListChat);
