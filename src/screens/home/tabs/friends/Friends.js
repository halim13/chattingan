import React, {Component} from 'react';
import ListFriend from './ListFriend';
import {Container, Input} from 'native-base';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import ActionButtons from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../../../../../android/configs/firebase';
import RBSheet from 'react-native-raw-bottom-sheet';

export default class Friends extends Component {
  constructor() {
    super();
    this.state = {
      friend: '',
      friends: [],
      isFetching: false,
    };
  }
  async getAllData() {
    this.setState({isFetching: true});
    let result = [];
    await firebase
      .database()
      .ref('/friends/' + firebase.auth().currentUser.uid)
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
                this.setState({isFetching: false, friends: result});
              });
          }
        });
      });
    this.setState({isFetching: false, friends: result});
  }
  componentDidMount() {
    this.getAllData();
  }
  async onRefresh() {
    await this.getAllData();
  }
  addFriend = async () => {
    this.setState({isFetching: true});
    const id = firebase.auth().currentUser.uid;
    const email = firebase.auth().currentUser.email;
    const {friend} = this.state;

    await firebase
      .database()
      .ref('/users/')
      .once('value')
      .then(async snapshot => {
        let status = 0;
        let idFriend = '';
        snapshot.forEach(child => {
          if (child.val().email === friend) {
            if (friend === email) {
              status = 1;
            } else {
              idFriend = child.key;
              status = 2;
            }
          }
        });
        if (status === 0) {
          Alert.alert('Email not found');
        } else if (status === 1) {
          Alert.alert('You use this email');
        } else if (status === 2) {
          await firebase
            .database()
            .ref('/friends/' + id)
            .once('value')
            .then(async snapshots => {
              let statusFriend = false;
              snapshots.forEach(child => {
                if (child.val().email === friend) {
                  statusFriend = true;
                }
              });
              if (statusFriend) {
                Alert.alert('You has been friend with ' + friend);
              } else {
                // Alert.alert(idFriend);
                await firebase
                  .database()
                  .ref('friends/' + id + '/' + idFriend)
                  .set({
                    email: friend,
                  });
                this.onRefresh();
              }
            });
        }
      });
    this.setState({isFetching: false, friend: ''});
  };
  render() {
    const {isFetching, friends} = this.state;
    const deviceWidth = Dimensions.get('window').width;
    return (
      <>
        <Container>
          {/* {friends.length === 0 && !isFetching && (
            <Text style={styles.friendText}>
              You dont have a friend, please add first.
            </Text>
          )} */}
          {isFetching && <ActivityIndicator size="large" style={styles.mt} />}
          {!isFetching && (
            <>
              <FlatList
                refreshControl={
                  <RefreshControl
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                  />
                }
                data={friends}
                renderItem={({item}) => <ListFriend item={item} />}
                keyExtractor={item => item.id.toString()}
              />
              <ActionButtons
                buttonColor="#25D366"
                onPress={() => {
                  this.RBSheetFriend.open();
                }}
                renderIcon={active =>
                  active ? (
                    <MaterialCommunityIcons
                      name="account-plus"
                      style={styles.icon}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-plus"
                      style={styles.icon}
                    />
                  )
                }
              />
              <RBSheet
                ref={ref => {
                  this.RBSheetFriend = ref;
                }}
                height={150}
                duration={150}
                customStyles={{
                  container: {
                    padding: 20,
                    justifyContent: 'center',
                  },
                }}>
                <Text>Enter your friend email</Text>
                <View style={styles.flex}>
                  <TextInput
                    onChangeText={value => {
                      this.setState({friend: value});
                    }}
                    onSubmitEditing={value => {}}
                    value={this.state.friend}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Type here..."
                    style={{
                      width: deviceWidth - 40,
                      borderBottomWidth: 2,
                      borderBottomColor: '#075E54',
                    }}
                  />
                  <View style={[styles.row, styles.positionRight]}>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={() => {
                        this.RBSheetFriend.close();
                      }}>
                      <Text style={styles.textButtonModal}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={this.addFriend}>
                      <Text style={styles.textButtonModal}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </RBSheet>
            </>
          )}
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  icon: {color: '#fff', fontSize: 30},
  mt: {marginTop: 20},
  friendText: {alignSelf: 'center', marginTop: 5, fontWeight: 'bold'},
  row: {flexDirection: 'row'},
  positionRight: {justifyContent: 'flex-end'},
  buttonModal: {
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 10,
    padding: 3,
  },
  textButtonModal: {
    color: '#075E54',
    fontWeight: 'bold',
  },
});
