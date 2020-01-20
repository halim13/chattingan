import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Header,
  Text,
  Body,
  Left,
  Icon,
  Right,
  View,
  Button,
  List,
  ListItem,
  Input,
  Thumbnail,
} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat';
import Fire from '../../../../../Firebase';
import firebase from '../../../../../android/configs/firebase';

export default class Chat extends Component {
  // static navigationOptions = ({navigation}) => ({
  //   title: (navigation.state.params || {}).name || 'Chat!',
  // });

  state = {
    messages: [],
  };

  componentDidMount() {
    Fire.get(
      message =>
        this.setState(previous => ({
          messages: GiftedChat.append(previous.messages, message),
        })),
      this.props.navigation.state.params.id,
    );
  }

  componentWillUnmount() {
    Fire.off();
  }

  get user() {
    const id = this.props.navigation.state.params.id;
    const names = this.props.navigation.state.params.names;
    const photos = this.props.navigation.state.params.photos;
    return {
      avatar: photos,
      name: names,
      _id: Fire.uid,
      cuid: id,
    };
  }

  render() {
    const name = this.props.navigation.state.params.name;
    const photo = this.props.navigation.state.params.photo;
    const id = this.props.navigation.state.params.id;

    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.send}
        user={this.user}
        cuid={id}
      />
    );
    return (
      <SafeAreaView style={styles.flex}>
        <Header style={styles.header} androidStatusBarColor="#0E4C44">
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.pop();
              }}>
              <Icon name="arrow-back" style={[styles.white, styles.icon]} />
            </TouchableOpacity>
          </View>
          <View>
            {photo ? (
              <Thumbnail small source={{uri: `${photo}`}} />
            ) : (
              <Thumbnail
                small
                source={{
                  uri:
                    'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                }}
              />
            )}
          </View>
          <View>
            <Text style={[styles.headerText, styles.white]} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <Right />
        </Header>
        {chat}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: '#075E54', alignItems: 'center'},
  headerText: {fontSize: 20, marginLeft: 10, fontWeight: 'bold'},
  white: {color: 'white'},
  icon: {marginRight: 15, marginLeft: 5},
});
