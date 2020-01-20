import React, {Component} from 'react';
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
} from 'native-base';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from '../../../android/configs/firebase';
import axios from 'axios';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class TabsAdvancedExample extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      loading: false,
      name: '',
      description: '',
      email: '',
      phone: '',
      photo: '',
      location: '',
      lat: '',
      lon: '',
      error: '',
    };
  }

  getUser = async () => {
    const {currentUser} = firebase.auth();
    const id = currentUser.uid;
    let name = '';
    let description = '';
    let phone = '';
    let photo = '';
    let email = '';
    let location = '';
    let lat = '';
    let lon = '';
    await firebase
      .database()
      .ref('/users/' + id)
      .once('value')
      .then(function(snapshot) {
        name = (snapshot.val() && snapshot.val().name) || '';
        photo = (snapshot.val() && snapshot.val().photo) || '';
        description = (snapshot.val() && snapshot.val().description) || '';
        phone = (snapshot.val() && snapshot.val().phone) || '';
        email = currentUser.email || '';
        location = (snapshot.val() && snapshot.val().location.city) || '';
        lat = (snapshot.val() && snapshot.val().location.lat) || '';
        lon = (snapshot.val() && snapshot.val().location.lon) || '';
      });
    // console.log(id);
    this.setState({
      currentUser,
      name,
      description,
      phone,
      email,
      location,
      photo,
      lat,
      lon,
    });
  };
  async componentDidMount() {
    await this.getUser();
    await this.requestMapsPermission();
    // this.getLocation();
  }

  async requestMapsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocations();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getLocations = async () => {
    this.setState({
      loading: true,
    });
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 150000,
    })
      .then(location => {
        // let locations = '';
        // console.log(location);
        // const loc = this.getAddress(location.latitude, location.longitude).then(res => { console.log(res)});
        return this.setState({
          lat: location.latitude,
          lon: location.longitude,
          loading: false,
        });
      })
      .catch(ex => {
        const {code, message} = ex;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          Alert.alert('Location cancelled by user or by another request');
        }
        if (code === 'UNAVAILABLE') {
          Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          Alert.alert('Authorization denied');
        }
        Alert.alert('error');
        this.setState({
          loading: false,
        });
      });
    this.setState({
      loading: false,
    });
  };
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permissions Revoked By User',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) {
      return;
    }
  };
  changeName = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      name,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      photo,
      email,
      locationEdit,
      latEdit,
      lonEdit,
    } = this.state;
    const id = currentUser.uid;
    if (nameEdit && nameEdit !== name) {
      await firebase
        .database()
        .ref('users/' + id)
        .set(
          {
            name: nameEdit,
            email,
            description: descriptionEdit,
            phone: phoneEdit,
            photo: photo,
            location: {city: locationEdit, lat: latEdit, lon: lonEdit},
          },
          function(error) {
            if (error) {
              status = false;
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              status = true;
            }
          },
        );
    } else {
      this.setState({nameEdit: name});
    }
    this.RBSheet.close();
    if (status) {
      this.setState({name: nameEdit});
    }
  };
  render() {
    const {
      loading,
      currentUser,
      name,
      description,
      phone,
      email,
      photo,
      location,
      lat,
      lon,
    } = this.state;
    let city;
    // axios
    //   .get(
    //     'https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lon + '&key=AIzaSyD-PH3UKlivnM3yGIchxxlChfXIEbKOHXI',
    //   )
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     console.log(
    //       'ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson),
    //     );
    //   });
    // const pos = {
    //   lat: 40.7809261,
    //   lng: -73.9637594,
    // };
    // Geocoder.geocodePosition(pos)
    //   .then(res => {
    //     alert(res[0].formattedAddress);
    //   })
    //   .catch(error => alert(error));
    // console.log(currentUser);
    const deviceWidth = Dimensions.get('window').width;
    return (
      <>
        <SafeAreaView style={styles.flex}>
          {loading && (
            <Spinner
              animation="fade"
              overlayColor="rgba(0, 0, 0, 0.55)"
              visible={loading}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
          )}
          {!loading && currentUser && (
            <Container>
              <Header style={styles.header} androidStatusBarColor="#0E4C44">
                <Left>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.pop();
                    }}>
                    <Icon name="arrow-back" style={[styles.white]} />
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={[styles.headerText, styles.white]}>
                    Location
                  </Text>
                </Body>
                <Right>
                  <Text style={[styles.white]} onPress={this.getLocation}>
                    Done
                  </Text>
                </Right>
              </Header>
              <View>
                <Text>Latitude : {lat}</Text>
                <Text>Longitude : {lon}</Text>
                <Text>Address : {city}</Text>
              </View>
              <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                style={styles.flex}
                initialRegion={{
                  latitude: Number(lat),
                  longitude: Number(lon),
                  latitudeDelta: 0.0002,
                  longitudeDelta: 0.007,
                }}>
                <Marker
                  title="arkademy"
                  coordinate={{
                    latitude: Number(lat),
                    longitude: Number(lon),
                  }}
                />
                <MaterialCommunityIcons
                  onPress={() => {
                    this.getLocation();
                  }}
                  name="target"
                  style={styles.icon}
                />
              </MapView>
            </Container>
          )}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  spinnerTextStyle: {
    color: '#fff',
  },
  center: {justifyContent: 'center'},
  grey: {color: 'grey', marginTop: 10},
  row: {flexDirection: 'row'},
  header: {backgroundColor: '#075E54'},
  headerText: {fontSize: 20},
  white: {color: '#fff'},
  iconLeft: {fontSize: 30, color: '#128C7E', marginTop: 15, marginRight: 20},
  iconRight: {fontSize: 25, color: '#888', marginTop: 20, marginLeft: 20},
  icons: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    position: 'absolute',
    // alignSelf: 'flex-end',
    right: 15,
    bottom: 15,
    color: '#fff',
    padding: 5,
    backgroundColor: '#075E54',
    borderRadius: 100,
  },
});
