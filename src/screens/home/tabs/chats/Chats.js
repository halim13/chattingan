import React, {Component} from 'react';
import ListChat from './ListChat';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ActionButtons from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../../../../android/configs/firebase';
import fire from '../../../../../Firebase';
import {withNavigation} from 'react-navigation';

class Chats extends Component {
  constructor() {
    super();
    this.state = {
      chat: '',
      chats: [],
      items: [],
      isFetching: false,
      history: null,
    };
  }
  async getAllData() {
    this.setState({isFetching: true});
    let result = [];
    await firebase
      .database()
      .ref('/messages/' + firebase.auth().currentUser.uid)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(child => {
          if (child.key !== firebase.auth().currentUser.uid) {
            firebase
              .database()
              .ref('/users/')
              .once('value')
              .then(snapshots => {
                snapshots.forEach(childs => {
                  if (childs.key === child.key) {
                    result.push({
                      id: childs.key,
                      name: childs.val().name,
                      description: childs.val().description,
                      photo: childs.val().photo,
                    });
                  }
                });
                this.setState({isFetching: false, chats: result});
              });
          }
        });
      });
    const arr = [];
    this.state.history
      ? this.state.history.map(function(item, i) {
          arr.push(item.user);
        })
      : null;
    this.setState({isFetching: false, chats: result, items: arr});
  }

  componentDidMount() {
    fire.getChatHistory(this.setHistory);
  }

  componentWillUnmount() {
    this.setState({history: []});
  }

  setHistory = history => {
    this.setState({history});
    const arr = [];
    history
      ? history.map(function(item, i) {
          arr.push(item.user);
        })
      : null;
    this.setState({
      items: arr,
    });
    // console.log(history);
  };

  onRefresh() {
    fire.getChatHistory(this.setHistory);
    // this.setState({isFetching: true}, async () => {
    //   this.setState({isFetching: false});
    // });
  }
  listChats = () => {
    const {history} = this.state;
  };
  async getData() {
    this.setState({isFetching: true});
    await firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .once('value')
      .then(snapshot => {
        // console.log(snapshot);
      });
  }

  render() {
    const {items, isFetching, history} = this.state;
    console.log('History' + JSON.stringify(this.state.history));
    return (
      <>
        {/* {items.length === 0 && !isFetching && (
          <Text style={styles.friendText}>
            You dont have any messages, please add first.
          </Text>
        )} */}
        {isFetching && <ActivityIndicator size="large" style={styles.mt} />}
        {!isFetching && (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
              />
            }>
            <Container>
              <Content>
                <List>
                  {history &&
                    history.map((data, index) => {
                      const timestamp = data.timestamp;
                      const date = new Date(timestamp);
                      const hours = date.getHours();
                      const minutes = '0' + date.getMinutes();
                      const formatedDate = hours + '.' + minutes.substr(-2);
                      let name = data.user.name;
                      let id = data.user.cuid;
                      let avatar = data.user.avatar;
                      if (
                        data &&
                        data.user.cuid === firebase.auth().currentUser.uid
                      ) {
                        name = data.user.name;
                        id = data.user._id;
                        avatar = data.user.avatar;
                      }
                      return (
                        <ListItem avatar key={index}>
                          <Left>
                            {avatar ? (
                              <Thumbnail
                                source={{uri: avatar}}
                                style={{width: 50, height: 50}}
                              />
                            ) : (
                              <Thumbnail
                                source={{
                                  uri:
                                    'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                                }}
                                style={{width: 50, height: 50}}
                              />
                            )}
                          </Left>
                          <Body>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('Chat', {
                                  name: name,
                                  id: id,
                                  avatar: avatar,
                                  photo: avatar,
                                  names: name,
                                  photos: avatar,
                                })
                              }>
                              <>
                                <Text>{name}</Text>
                                <Text note numberOfLines={1}>
                                  {data.text}
                                </Text>
                              </>
                            </TouchableOpacity>
                          </Body>
                          <Right>
                            <Text note>{formatedDate}</Text>
                          </Right>
                        </ListItem>
                      );
                    })}
                </List>
              </Content>
            </Container>
          </ScrollView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  icon: {color: '#fff', fontSize: 30},
  friendText: {alignSelf: 'center', marginTop: 5, fontWeight: 'bold'},
});

export default withNavigation(Chats);
