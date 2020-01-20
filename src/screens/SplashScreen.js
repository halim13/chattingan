import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import firebase from '../../android/configs/firebase';

export default class SplashScreen extends Component {
  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      // console.warn(user);
      this.setState({hasFetched: false});
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({routeName: user ? 'Home' : 'Login'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      // this.props.navigation.navigate(user ? 'Home' : 'Login');
    });
  };
  UNSAFE_componentWillMount() {
    this.checkLogin();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="grey" barStyle="dark-content" />

        <Image
          style={[styles.center, styles.image]}
          source={require('../public/images/logo.png')}
        />
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
