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
  Content,
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
} from 'react-native';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from '../../../android/configs/firebase';
import {StackActions, NavigationActions} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';

export default class TabsAdvancedExample extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      loading: false,
      modal: false,
      name: '',
      description: '',
      phone: '',
      photo: '',
      location: '',
      lat: '',
      lon: '',
      nameEdit: '',
      descriptionEdit: '',
      phoneEdit: '',
      photoEdit: '',
      locationEdit: '',
      latEdit: '',
      lonEdit: '',
    };
  }
  setModalVisible(visible) {
    const {modal} = this.state;
    this.setState({modal: !modal});
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
      nameEdit: name,
      descriptionEdit: description,
      phoneEdit: phone,
      emailEdit: email,
      locationEdit: location,
      latEdit: lat,
      lonEdit: lon,
      photoEdit: photo,
    });
  };
  componentDidMount() {
    this.getUser();
  }
  changeName = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      name,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      photoEdit,
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
            description: descriptionEdit,
            phone: phoneEdit,
            photo: photoEdit,
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
              // console.warn('success update name');
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
  changeDescription = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      description,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      photoEdit,
      locationEdit,
      latEdit,
      lonEdit,
    } = this.state;
    const id = currentUser.uid;
    if (descriptionEdit && descriptionEdit !== description) {
      await firebase
        .database()
        .ref('users/' + id)
        .set(
          {
            name: nameEdit,
            description: descriptionEdit,
            phone: phoneEdit,
            photo: photoEdit,
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
              // console.warn('success update name');
            }
          },
        );
    } else {
      this.setState({descriptionEdit: description});
    }
    this.RBSheetDescription.close();
    if (status) {
      this.setState({description: descriptionEdit});
    }
  };
  changePhone = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      phone,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      photoEdit,
      locationEdit,
      latEdit,
      lonEdit,
    } = this.state;
    const id = currentUser.uid;
    if (phoneEdit && phoneEdit !== phone) {
      await firebase
        .database()
        .ref('users/' + id)
        .set(
          {
            name: nameEdit,
            description: descriptionEdit,
            phone: phoneEdit,
            photo: photoEdit,
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
              // console.warn('success update name');
            }
          },
        );
    } else {
      this.setState({phoneEdit: phone});
    }
    this.RBSheetDescription.close();
    if (status) {
      this.setState({phone: phoneEdit});
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
      location,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      emailEdit,
      locationEdit,
    } = this.state;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight =
      Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : require('react-native-extra-dimensions-android').get(
            'REAL_WINDOW_HEIGHT',
          );
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
          <Container>
            <ScrollView>
              <Header style={styles.header} androidStatusBarColor="#0E4C44">
                <Left>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.pop();
                    }}>
                    <Icon
                      name="arrow-back"
                      style={[styles.white, styles.icon]}
                    />
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={[styles.headerText, styles.white]}>Profile</Text>
                </Body>
                <Right />
              </Header>
              <View>
                <View style={styles.thumbnail}>
                  <ImageBackground
                    imageStyle={{borderRadius: 100}}
                    style={styles.thumbnail}
                    source={{
                      uri:
                        'https://f0.pngfuel.com/png/683/60/man-profile-illustration-png-clip-art-thumbnail.png',
                    }}>
                    <Button style={styles.iconCamera}>
                      <Entypo name="camera" style={styles.camera} />
                    </Button>
                  </ImageBackground>
                </View>
                <List>
                  <ListItem>
                    <View>
                      <Icon name="person" style={[styles.iconLeft]} />
                    </View>
                    <View style={[styles.flex]}>
                      <Text style={[styles.descriptionText, styles.grey]}>
                        Name
                      </Text>
                      <Text style={[styles.descriptionText]} numberOfLines={1}>
                        {currentUser && name}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.RBSheet.open();
                        }}>
                        <MaterialIcons name="edit" style={[styles.iconRight]} />
                      </TouchableOpacity>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View>
                      <MaterialIcons name="info" style={[styles.iconLeft]} />
                    </View>
                    <View style={[styles.flex]}>
                      <Text style={[styles.descriptionText, styles.grey]}>
                        Description
                      </Text>
                      <Text style={[styles.descriptionText]} numberOfLines={1}>
                        {currentUser && description}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.RBSheetDescription.open();
                        }}>
                        <MaterialIcons name="edit" style={[styles.iconRight]} />
                      </TouchableOpacity>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View>
                      <MaterialIcons name="phone" style={[styles.iconLeft]} />
                    </View>
                    <View style={[styles.flex]}>
                      <Text style={[styles.descriptionText, styles.grey]}>
                        Phone
                      </Text>
                      <Text style={[styles.descriptionText]} numberOfLines={1}>
                        {currentUser && phone}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.RBSheetPhone.open();
                        }}>
                        <MaterialIcons name="edit" style={[styles.iconRight]} />
                      </TouchableOpacity>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View>
                      <MaterialIcons name="map" style={[styles.iconLeft]} />
                    </View>
                    <View style={[styles.flex]}>
                      <Text style={[styles.descriptionText, styles.grey]}>
                        Location
                      </Text>
                      <Text style={[styles.descriptionText]} numberOfLines={1}>
                        {currentUser && location}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity>
                        <MaterialIcons name="edit" style={[styles.iconRight]} />
                      </TouchableOpacity>
                    </View>
                  </ListItem>
                  <ListItem style={styles.noBorderbottom}>
                    <View>
                      <Icon name="at" style={[styles.iconLeft]} />
                    </View>
                    <View style={[styles.flex]}>
                      <Text style={[styles.descriptionText, styles.grey]}>
                        Email
                      </Text>
                      <Text style={[styles.descriptionText]} numberOfLines={1}>
                        {currentUser && currentUser.email}
                      </Text>
                    </View>
                    <View>
                      {/* <TouchableOpacity
                        onPress={() => {
                          this.RBSheetEmail.open();
                        }}>
                        <MaterialIcons name="edit" style={[styles.iconRight]} />
                      </TouchableOpacity> */}
                    </View>
                  </ListItem>
                </List>
                {/* name */}
                <RBSheet
                  ref={ref => {
                    this.RBSheet = ref;
                  }}
                  height={150}
                  duration={150}
                  customStyles={{
                    container: {
                      padding: 20,
                      justifyContent: 'center',
                    },
                  }}>
                  <Text>Enter Your Name</Text>
                  <View style={styles.flex}>
                    <Input
                      onChangeText={value => {
                        this.setState({nameEdit: value});
                      }}
                      onSubmitEditing={value => {}}
                      value={nameEdit}
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
                          this.RBSheet.close();
                        }}>
                        <Text style={styles.textButtonModal}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonModal}
                        onPress={this.changeName}>
                        <Text style={styles.textButtonModal}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
                {/* description */}
                <RBSheet
                  ref={ref => {
                    this.RBSheetDescription = ref;
                  }}
                  height={150}
                  duration={150}
                  customStyles={{
                    container: {
                      padding: 20,
                      justifyContent: 'center',
                    },
                  }}>
                  <Text>Enter Your Description</Text>
                  <View style={styles.flex}>
                    <Input
                      onChangeText={value => {
                        this.setState({descriptionEdit: value});
                      }}
                      onSubmitEditing={value => {}}
                      value={descriptionEdit}
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
                          this.RBSheetDescription.close();
                        }}>
                        <Text style={styles.textButtonModal}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonModal}
                        onPress={this.changeDescription}>
                        <Text style={styles.textButtonModal}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
                {/* email */}
                <RBSheet
                  ref={ref => {
                    this.RBSheetEmail = ref;
                  }}
                  height={150}
                  duration={150}
                  customStyles={{
                    container: {
                      padding: 20,
                      justifyContent: 'center',
                    },
                  }}>
                  <Text>Enter Your Email</Text>
                  <View style={styles.flex}>
                    <Input
                      onChangeText={value => {
                        this.setState({emailEdit: value});
                      }}
                      onSubmitEditing={value => {}}
                      value={emailEdit}
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
                          this.RBSheetEmail.close();
                        }}>
                        <Text style={styles.textButtonModal}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonModal}
                        // onPress={this.changeName()}
                      >
                        <Text style={styles.textButtonModal}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
                {/* phone */}
                <RBSheet
                  ref={ref => {
                    this.RBSheetPhone = ref;
                  }}
                  height={150}
                  duration={150}
                  customStyles={{
                    container: {
                      padding: 20,
                      justifyContent: 'center',
                    },
                  }}>
                  <Text>Enter Your Phone</Text>
                  <View style={styles.flex}>
                    <Input
                      onChangeText={value => {
                        this.setState({phoneEdit: value});
                      }}
                      onSubmitEditing={value => {}}
                      keyboardType="number-pad"
                      value={phoneEdit}
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
                          this.RBSheetPhone.close();
                        }}>
                        <Text style={styles.textButtonModal}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonModal}
                        onPress={() => {
                          this.changePhone();
                          this.RBSheetPhone.close();
                        }}>
                        <Text style={styles.textButtonModal}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
              </View>
            </ScrollView>
          </Container>
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
  noBorderbottom: {borderBottomWidth: 0},
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
  positionRight: {justifyContent: 'flex-end'},
  lineBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  thumbnail: {
    width: 179,
    height: 179,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 100,
    justifyContent: 'flex-end',
  },
  list: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  iconCamera: {
    color: 'white',
    backgroundColor: '#075E54',
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
    fontSize: 27,
    borderRadius: 100,
    padding: 11,
  },
  camera: {
    color: 'white',
    fontSize: 27,
  },
  grey: {color: 'grey', marginTop: 10},
  row: {flexDirection: 'row'},
  header: {backgroundColor: '#075E54'},
  headerText: {fontSize: 20},
  descriptionText: {fontSize: 16},
  white: {color: '#fff'},
  iconLeft: {fontSize: 30, color: '#128C7E', marginTop: 15, marginRight: 20},
  iconRight: {fontSize: 25, color: '#888', marginTop: 20, marginLeft: 20},
  icons: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
});
