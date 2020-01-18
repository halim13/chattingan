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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from '../../../android/configs/firebase';
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
        this.getLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getLocation = async () => {
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
  getAddress = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();

      var method = 'GET';
      var url =
        'http://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        latitude +
        ',' +
        longitude +
        '&sensor=true&key=AIzaSyD-PH3UKlivnM3yGIchxxlChfXIEbKOHXI';
      var async = true;

      request.open(method, url, async);
      request.onreadystatechange = () => {
        if (request.readyState == 4) {
          if (request.status == 200) {
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            resolve(address);
          } else {
            reject(request.status);
          }
        }
      };
      request.send();
    });
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
                    alert('cek');
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
