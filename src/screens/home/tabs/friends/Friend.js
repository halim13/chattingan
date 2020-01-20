import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header, Left, Body, Right, Button} from 'native-base';
import firebase from '../../../../../android/configs/firebase';
import LinearGradient from 'react-native-linear-gradient';

export default class Friend extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      name: '',
      about: '',
      photo: '',
      phone: '',
      email: '',
      location: '',
      status: null,
      lat: '',
      lon: '',
      names: '',
      photos: '',
      loading: false,
    };
    this.getData = this.getData.bind(this);
  }
  async deleteData() {
    let updates = {};
    const id = this.props.navigation.state.params.id;
    const uid = firebase.auth().currentUser.uid;
    updates['/friends/' + uid + '/' + id] = null;
    await firebase
      .database()
      .ref()
      .update(updates);
    this.props.navigation.navigate('HomeScreen');
  }
  getData = async () => {
    const id = this.props.navigation.state.params.id;
    this.setState({loading: true});
    let name = '';
    let names = '';
    let photos = '';
    let description = '';
    let phone = '';
    let photo = '';
    let email = '';
    let location = '';
    let lat = '';
    let lon = '';
    let status = '';
    await firebase
      .database()
      .ref('/users/' + id)
      .once('value')
      .then(snapshots => {
        // console.log(snapshots);
        name = (snapshots.val() && snapshots.val().name) || '';
        description = (snapshots.val() && snapshots.val().description) || '';
        phone = (snapshots.val() && snapshots.val().phone) || '';
        photo = (snapshots.val() && snapshots.val().photo) || '';
        email = (snapshots.val() && snapshots.val().email) || '';
        status = (snapshots.val() && snapshots.val().status) || '';
        location = (snapshots.val() && snapshots.val().location.city) || '';
        lat = (snapshots.val() && snapshots.val().location.lat) || '';
        lon = (snapshots.val() && snapshots.val().location.lon) || '';
        // this.setState({loading: false, friend: result});
      });
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .once('value')
      .then(snapshots => {
        // console.log(snapshots);
        names = (snapshots.val() && snapshots.val().name) || '';
        photos = (snapshots.val() && snapshots.val().photo) || '';
      });
    this.setState({
      id,
      name,
      description,
      photo,
      phone,
      email,
      location,
      lat,
      lon,
      status,
      names,
      photos,
      loading: false,
    });
  };
  // componentDidMount() {
  //   this.getData();
  // }
  async UNSAFE_componentWillMount() {
    await this.getData();
  }
  render() {
    // const id = this.props.navigation.state.params.id;
    const {
      id,
      name,
      email,
      phone,
      description,
      photo,
      location,
      status,
      names,
      photos,
    } = this.state;
    return (
      <ScrollView>
        <Header style={styles.header} androidStatusBarColor="#0E4C44">
          <Left>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.pop();
              }}>
              <Icon name="arrow-back" style={[styles.white, styles.icon]} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={[styles.headerText, styles.white]}>{name}</Text>
          </Body>
          <Right />
        </Header>
        <View style={styles.containerImage}>
          <ImageBackground
            style={[styles.thumbnail, styles.flex]}
            source={
              photo
                ? {
                    uri: `${photo}`,
                  }
                : {
                    uri:
                      'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                  }
            }>
            <View style={[styles.flex, styles.flexRow, styles.bottom]}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                style={[styles.flex, styles.flexRow, styles.linear]}>
                <View style={styles.left}>
                  <Text style={[styles.name, styles.white]}>{name}</Text>
                </View>
                <View style={[styles.right, styles.flexRow]}>
                  <MaterialCommunityIcons
                    name="circle"
                    style={[
                      styles.iconOnline,
                      status ? styles.greens : styles.grey,
                    ]}
                  />
                  <Text style={[styles.online, styles.white]}>
                    {!status ? 'Offline' : 'Online'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.card}>
          <View style={styles.number}>
            <View style={styles.ph}>
              <Text style={styles.green}>Phone</Text>
              <Text style={styles.text}>{phone}</Text>
            </View>
            <View style={styles.flexRow}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    id,
                    name,
                    photo,
                    names,
                    photos,
                  });
                }}>
                <Icon name="chat" color="#075e54" size={23} style={styles.p5} />
              </TouchableOpacity>

              {/* <Icon name="call" color="#075e54" size={23} style={styles.p5} />
              <Icon
                name="videocam"
                color="#075e54"
                size={23}
                style={styles.p5}
              /> */}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.green}>Email</Text>
            <Text style={styles.text}>{email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.green}>Description</Text>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.number}>
            <View style={styles.ph}>
              <Text style={styles.green}>Location</Text>
              <Text style={styles.text}>{location}</Text>
            </View>
            <View style={styles.flexRow}>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="map-marker"
                  color="#075e54"
                  size={23}
                  style={styles.p5}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.flex}>
            <Button
              style={styles.delete}
              danger
              onPress={() => {
                Alert.alert(
                  'Warning',
                  'Are you sure want to delete your friend ?',
                  [
                    {
                      text: 'No',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => this.deleteData(),
                    },
                  ],
                  {cancelable: false},
                );
              }}>
              <Text style={[styles.textDelete, styles.white]}>
                Delete Friend
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  containerImage: {height: 300},
  icon: {
    fontSize: 20,
    paddingHorizontal: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  delete: {justifyContent: 'center'},
  textDelete: {fontSize: 18, fontWeight: 'bold'},
  linear: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    height: 70,
  },
  greens: {color: '#075e54'},
  grey: {color: '#bfc7c0'},
  red: {color: '#d32e25'},
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  online: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  iconOnline: {
    marginRight: 5,
  },
  ph: {paddingHorizontal: 5},
  bottom: {
    // height: 100,
    // opacity: 0.2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
  },
  right: {alignItems: 'center'},
  // left: {justifyContent: 'flex-end'},
  p5: {padding: 5},
  header: {backgroundColor: '#075E54'},
  headerText: {fontSize: 20},
  descriptionText: {fontSize: 16},
  white: {color: '#fff'},
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 270,
    padding: 20,
  },
  thumbnails: {
    height: 150,
    marginTop: 30,
  },
  card: {
    marginTop: 10,
  },
  flexRow: {flexDirection: 'row'},
  row: {
    height: 50,
    padding: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  encrypt: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  number: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  subText: {
    fontSize: 8,
    color: '#555',
  },
  green: {
    color: '#075e54',
    fontSize: 10,
  },
});
