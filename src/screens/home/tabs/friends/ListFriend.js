import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {ListItem, Thumbnail, Text, Left, Body} from 'native-base';
import {withNavigation} from 'react-navigation';
class Friends extends Component {
  render() {
    const {item} = this.props;
    const id = item.id;
    const name = item.name;
    const photo = item.photo;
    const description = item.description;
    return (
      <ListItem thumbnail>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            this.props.navigation.navigate('Friend', {
              id,
              name,
              photo,
              description,
            });
          }}
          onLongPress={() => {}}>
          <Left>
            {photo ? (
              <Thumbnail square source={{uri: `${photo}`}} />
            ) : (
              <Thumbnail
                square
                source={{
                  uri:
                    'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                }}
              />
            )}
          </Left>
          <Body>
            <Text>{name}</Text>
            <Text note numberOfLines={1}>
              {description}
            </Text>
          </Body>
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

export default withNavigation(Friends);
