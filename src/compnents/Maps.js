import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import firebase from './android/configs/firebase';

export default class Maps extends Component {
  componentDidMount() {
    const userId = '';
    const name = 'hasan';
    const email = 'hasanudinhalim@gmail.com';
    const imageUrl = 'google.com';

    firebase
      .database()
      .ref('users')
      .push({
        username: name,
        email: email,
        profile_picture: imageUrl,
      });
  }
  render() {
    return (
      <View style={styles.flex}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          style={styles.flex}
          initialRegion={{
            latitude: -6.2264123,
            longitude: 106.8542577,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            title="arkademy"
            coordinate={{
              latitude: -6.2264123,
              longitude: 106.8542577,
            }}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
