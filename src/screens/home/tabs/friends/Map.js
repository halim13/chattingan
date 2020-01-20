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
} from 'native-base';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
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
      city: '',
      historyMessages: '',
      lat: '',
      lon: '',
      error: '',
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: null,
        longitudeDelta: null,
      },
    };
  }

  changeLocation = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      name,
      description,
      phone,
      photo,
      email,
      city,
      lat,
      lon,
      historyMessages,
    } = this.state;
    const id = currentUser.uid;
    await firebase
      .database()
      .ref('users/' + id)
      .set(
        {
          name,
          historyMessages,
          email,
          description,
          phone,
          photo,
          location: {city, lat, lon},
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
    if (status) {
      Alert.alert('Succes', 'Your location has been updated');
    } else {
      Alert.alert('Failed', 'your location not updated');
    }
  };
  async requestMapsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocations();
        this.setState({allowMap: true});
      } else {
        console.log('Location permission denied');
        this.setState({allowMap: false});
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
        return this.setState({
          lat: location.latitude,
          lon: location.longitude,
          region: {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0002,
            longitudeDelta: 0.007,
          },
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
    console.log(this.state.region);
  };
  getUser = async () => {
    const {currentUser} = firebase.auth();
    const id = currentUser.uid;
    let name = '';
    let description = '';
    let phone = '';
    let photo = '';
    let email = '';
    let city = '';
    let lat = '';
    let historyMessages = '';
    let lon = '';
    await firebase
      .database()
      .ref('/users/' + id)
      .once('value')
      .then(function(snapshot) {
        name = (snapshot.val() && snapshot.val().name) || '';
        historyMessages =
          (snapshot.val() && snapshot.val().historyMessages) || '';
        photo = (snapshot.val() && snapshot.val().photo) || '';
        description = (snapshot.val() && snapshot.val().description) || '';
        phone = (snapshot.val() && snapshot.val().phone) || '';
        email = currentUser.email || '';
        city = (snapshot.val() && snapshot.val().location.city) || '';
        lat = (snapshot.val() && snapshot.val().location.lat) || '';
        lon = (snapshot.val() && snapshot.val().location.lon) || '';
      });
    // console.log(id);
    this.setState({
      currentUser,
      name,
      description,
      phone,
      historyMessages,
      email,
      city,
      photo,
      lat,
      lon,
      region: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0002,
        longitudeDelta: 0.007,
      },
    });
  };
  async componentDidMount() {
    await this.getUser();
    // await this.requestMapsPermission();
  }

  render() {
    const {loading, currentUser, city, lat, lon, historyMessages} = this.state;
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
                  <TouchableOpacity
                    onPress={() => {
                      this.changeLocation();
                    }}>
                    <Text style={[styles.white]} onPress={this.getLocation}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </Right>
              </Header>
              {/* <View style={{position: 'absolute'}}>
                <Text>Latitude : {lat}</Text>
                <Text>Longitude : {lon}</Text>
                <Text>Address : {city}</Text>
              </View> */}
              <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                style={styles.flex}
                initialRegion={this.state.region}>
                <Marker
                  title="arkademy"
                  coordinate={{
                    latitude: Number(lat),
                    longitude: Number(lon),
                  }}
                />
                <MaterialCommunityIcons
                  onPress={async () => {
                    // this.getLocation();
                    await this.requestMapsPermission();
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
