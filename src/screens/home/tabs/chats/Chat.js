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

export default class Chat extends Component {
  // static navigationOptions = ({navigation}) => ({
  //   title: (navigation.state.params || {}).name || 'Chat!',
  // });

  state = {
    messages: [],
  };

  componentDidMount() {
    Fire.get(message =>
      this.setState(previous => ({
        messages: GiftedChat.append(previous.messages, message),
      })),
    );
  }

  componentWillUnmount() {
    Fire.off();
  }

  get user() {
    const id = this.props.navigation.state.params.id;
    return {
      name: this.props.navigation.state.params.name,
      _id: id,
    };
  }

  render() {
    // const id = this.props.navigation.state.params.id;
    const name = this.props.navigation.state.params.name;
    const photo = this.props.navigation.state.params.photo;

    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.send}
        user={this.user}
      />
    );

    // if (Platform.OS === 'android') {
    //   return (
    //     <KeyboardAvoidingView
    //       style={{flex: 1}}
    //       behavior="padding"
    //       keyboardVerticalOffset={30}
    //       enabled>
    //       {chat}
    //     </KeyboardAvoidingView>
    //   );
    // }
    return (
      <SafeAreaView style={{flex: 1}}>
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
            <Thumbnail small source={{uri: `${photo}`}} />
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
  header: {backgroundColor: '#075E54', alignItems: 'center'},
  headerText: {fontSize: 20, marginLeft: 10, fontWeight: 'bold'},
  white: {color: 'white'},
  icon: {marginRight: 15, marginLeft: 5},
});
