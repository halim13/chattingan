import React, {Component} from 'react';
import {Text, View} from 'react-native';
import firebase from '../../../android/configs/firebase';
import {Button} from 'native-base';
import {StackActions, NavigationActions} from 'react-navigation';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
    };
  }
  getUser = () => {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
  };
  UNSAFE_componentWillMount() {
    this.getUser();
  }
  // componentDidMount() {
  //   this.getUser();
  // }
  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (e) {
      console.warn(e);
    }
  };
  render() {
    const {currentUser} = this.state;
    return (
      <View>
        <Text> {currentUser && currentUser.email} </Text>
        <Button onPress={this.signOutUser}>
          <Text>Logout</Text>
        </Button>
      </View>
    );
  }
}
