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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from '../../../android/configs/firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class TabsAdvancedExample extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      loading: false,
      isUpload: false,
      modal: false,
      name: '',
      description: '',
      email: '',
      phone: '',
      photo: '',
      location: '',
      lat: '',
      lon: '',
      nameEdit: '',
      descriptionEdit: '',
      phoneEdit: '',
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
  changeDescription = async value => {
    let status = false;
    const {currentUser} = firebase.auth();
    const {
      description,
      nameEdit,
      descriptionEdit,
      phoneEdit,
      photo,
      locationEdit,
      latEdit,
      lonEdit,
      email,
    } = this.state;
    const id = currentUser.uid;
    if (descriptionEdit && descriptionEdit !== description) {
      await firebase
        .database()
        .ref('users/' + id)
        .set(
          {
            email,
            name: nameEdit,
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
      photo,
      locationEdit,
      latEdit,
      lonEdit,
      email,
    } = this.state;
    const id = currentUser.uid;
    if (phoneEdit && phoneEdit !== phone) {
      await firebase
        .database()
        .ref('users/' + id)
        .set(
          {
            email,
            name: nameEdit,
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
      this.setState({phoneEdit: phone});
    }
    this.RBSheetDescription.close();
    if (status) {
      this.setState({phone: phoneEdit});
    }
  };

  selectImage = async () => {
    ImagePicker.showImagePicker(
      {
        noData: true,
        mediaType: 'photo',
        allowsEditing: true,
      },
      response => {
        console.log('response = ', response);
        if (response.didCancel) {
          console.log('user cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker error: ', response.error);
        } else if (response.customButton) {
          console.log('user tapped custom button', response.customButton);
        } else {
          this.setState({
            photo: response.uri,
            filename: response.fileName,
            filesize: response.fileSize,
          });
          const fileSize = response.fileSize;
          const size = 1 * 1024 * 1024;
          if (fileSize >= size) {
            this.setState({
              // photo: `${config.BASE_URL}/companies/${this.props.company.logo}`,
            });
            Alert.alert('File Too big, choose image under 1MB');
          } else {
            const fileType = response.fileName.split('.')[1];
            this.setState({isUpload: true});
            this.uploadImage(response.uri, fileType)
              .then(url => {
                this.uploadPhoto();
                this.setState({photo: url, isUpload: false});
              })
              .catch(() => {
                this.setState({isUpload: false});
              });
          }
        }
      },
    );
  };
  uploadImage(uri, fileType, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;
      // let name = new Date().getTime();
      let name = firebase.auth().currentUser.uid;

      const imageRef = firebase
        .storage()
        .ref('photos')
        .child(`${name}.${fileType}`);

      fs.readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  uploadPhoto() {
    const id = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + id)
      .set({
        email: this.state.email,
        photo: this.state.photo,
        name: this.state.name,
        description: this.state.description,
        phone: this.state.phone,
        location: {
          city: this.state.location,
          lat: this.state.lat,
          lon: this.state.lon,
        },
      });
  }
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
      nameEdit,
      descriptionEdit,
      phoneEdit,
      emailEdit,
      locationEdit,
      isUpload,
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
                  {!isUpload && currentUser && photo !== '' && (
                    <ImageBackground
                      imageStyle={{borderRadius: 100}}
                      style={styles.thumbnail}
                      source={{
                        uri: `${photo}`,
                      }}>
                      <Button
                        style={styles.iconCamera}
                        onPress={this.selectImage}>
                        <Entypo name="camera" style={styles.camera} />
                      </Button>
                    </ImageBackground>
                  )}
                  {!isUpload && currentUser && photo === '' && (
                    <ImageBackground
                      imageStyle={{borderRadius: 100}}
                      style={styles.thumbnail}
                      source={{
                        uri:
                          'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png',
                      }}>
                      <Button
                        style={styles.iconCamera}
                        onPress={this.selectImage}>
                        <Entypo name="camera" style={styles.camera} />
                      </Button>
                    </ImageBackground>
                  )}
                  {isUpload && (
                    <View style={styles.thumbnails}>
                      <ActivityIndicator size="large" />
                    </View>
                  )}
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
                      <Text style={[styles.descriptionText]}>
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
                      <Text style={[styles.descriptionText]}>
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
                      <Text style={[styles.descriptionText]}>
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
                      <Text style={[styles.descriptionText]}>
                        {currentUser && location}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('Maps', currentUser);
                        }}>
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
                      <Text style={[styles.descriptionText]}>
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
                <Button
                  danger
                  style={styles.center}
                  onPress={() => {
                    Alert.alert(
                      'Delete Account',
                      'Are you sure ?',
                      [
                        {
                          text: 'No',
                          // onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => {
                            // let user = firebase.auth().currentUser;
                            // let credential;
                            // user
                            //   .reauthenticateWithCredential(credential)
                            //   .then(function() {
                            //     // User re-authenticated.
                            //     user.delete().then(
                            //       function() {
                            //         // User deleted.
                            //         console.warn('Successfully deleted user');
                            //         const resetAction = StackActions.reset({
                            //           index: 0,
                            //           actions: [
                            //             NavigationActions.navigate({
                            //               routeName: 'Login',
                            //             }),
                            //           ],
                            //         });
                            //         this.props.navigation.dispatch(resetAction);
                            //       },
                            //       function(error) {
                            //         // An error happened.
                            //         console.warn('Error deleting user:', error);
                            //       },
                            //     );
                            //   })
                            //   .catch(function(error) {
                            //     // An error happened.
                            //     console.warn(
                            //       'Error reauthenticated user:',
                            //       error,
                            //     );
                            //   });
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <Text>Delete Account</Text>
                </Button>
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
  center: {justifyContent: 'center'},
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
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 100,
    justifyContent: 'flex-end',
  },
  thumbnails: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 100,
    justifyContent: 'center',
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
