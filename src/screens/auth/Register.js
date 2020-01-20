import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import {
  Text,
  Button,
  Container,
  Content,
  Item,
  Input,
  Label,
  Icon,
  View,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {StackActions, NavigationActions} from 'react-navigation';
import firebase from '../../../android/configs/firebase';
import {validationService} from '../../public/validation/service';
import GetLocation from 'react-native-get-location';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        name: {
          type: 'name',
          value: '',
        },
        email: {
          type: 'email',
          value: '',
        },
        password: {
          type: 'password',
          value: '',
        },
        passwordConfirm: {
          type: 'password3',
          value: '',
        },
      },
      allowMap: false,
      emailError: '',
      passwordError: '',
      nameError: '',
      passwordConfirmError: '',
      error: false,
      name: '',
      email: '',
      password: '',
      lat: '',
      lon: '',
      city: '',
      passwordConfirm: '',
      showPass: true,
      iconPass: 'eye',
      showPassConfirm: true,
      iconPassConfirm: 'eye',
      errorMessage: null,
      loading: false,
    };
    this.onInputChange = validationService.onInputChange.bind(this);
    this.getFormValidation = validationService.getFormValidation.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentDidMount() {
    this.requestMapsPermission();
  }

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
  handleSignUp = async () => {
    await this.getFormValidation();
    const {inputs, lat, allowMap} = this.state;
    if (
      inputs.email.value &&
      inputs.password.value &&
      inputs.name.value &&
      inputs.password.value.length >= 6 &&
      inputs.passwordConfirm.value === inputs.password.value &&
      allowMap
    ) {
      this.setState({loading: true});
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password,
          );
        const id = firebase.auth().currentUser.uid;
        const email = firebase.auth().currentUser.email;
        const {name, lon, city} = this.state;
        firebase
          .database()
          .ref('users/' + id)
          .set({
            name,
            email,
            photo: '',
            about: '',
            phone: '',
            location: {
              city: city,
              lat: lat,
              lon: lon,
            },
          });
        this.setState({loading: false});
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Login'})],
        });
        this.props.navigation.dispatch(resetAction);
        firebase.auth().signOut();
      } catch (error) {
        this.setState({
          errorMessage: error.code,
          loading: false,
        });
      }
    } else {
      this.requestMapsPermission();
    }
  };

  togglePass = () => {
    const {showPass} = this.state;
    this.setState({
      iconPass: !showPass ? 'eye' : 'eye-off',
      showPass: !showPass,
    });
  };

  togglePassConfirm = () => {
    const {showPassConfirm} = this.state;
    this.setState({
      iconPassConfirm: !showPassConfirm ? 'eye' : 'eye-off',
      showPassConfirm: !showPassConfirm,
    });
  };

  renderError(id) {
    this.renderErrorPass();
    const {inputs, errorMessage} = this.state;
    if (inputs[id].errorLabel) {
      return <Text style={styles.error}>{inputs[id].errorLabel}</Text>;
    } else if (
      errorMessage === 'auth/email-already-in-use' &&
      id === 'passwordConfirm'
    ) {
      return Alert.alert('Failed Register', 'Email already exist!');
    }
    return null;
  }
  renderErrorPass() {
    const {password, passwordConfirm} = this.state.inputs;
    if (passwordConfirm.value) {
      if (password.value !== passwordConfirm.value) {
        return <Text style={styles.error}>Password do not match</Text>;
      }
    }
  }

  render() {
    const {
      showPass,
      iconPass,
      showPassConfirm,
      iconPassConfirm,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={[styles.flex]}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
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
          <Content>
            <View style={[styles.width, styles.center]}>
              <Image
                style={[styles.center, styles.image]}
                source={require('../../public/images/logo.png')}
              />
              {/* {this.state.errorMessage && (
                <Text style={styles.error}>{this.state.errorMessage}</Text>
              )} */}
              <Item floatingLabel style={styles.mb5}>
                <Icon active name="person" />
                <Label>Your name</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="next"
                  getRef={input => {
                    this.nameRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.emailRef._root.focus();
                  }}
                  onChangeText={value => {
                    this.setState({name: value, errorMessage: null});
                    this.onInputChange({id: 'name', value});
                  }}
                  value={this.state.name}
                />
              </Item>
              {this.renderError('name')}
              <Item floatingLabel style={styles.mb5}>
                <Icon active name="at" />
                <Label>Email</Label>
                <Input
                  returnKeyType="next"
                  getRef={input => {
                    this.emailRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordRef._root.focus();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({email: value, errorMessage: null});
                    this.onInputChange({id: 'email', value});
                  }}
                  value={this.state.email}
                />
              </Item>
              {this.renderError('email')}
              <Item floatingLabel style={styles.mb5}>
                <Icon active name="key" />
                <Label>Password</Label>
                <Input
                  returnKeyType="next"
                  getRef={input => {
                    this.passwordRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordConfirmRef._root.focus();
                  }}
                  secureTextEntry={showPass}
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({password: value, errorMessage: null});
                    this.onInputChange({id: 'password', value});
                  }}
                  value={this.state.password}
                />
                <Icon active name={iconPass} onPress={this.togglePass} />
              </Item>
              {this.renderError('password')}
              <Item floatingLabel style={styles.mb5}>
                <Icon active name="key" />
                <Label>Password Confirmation</Label>
                <Input
                  returnKeyType="go"
                  getRef={input => {
                    this.passwordConfirmRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.handleSignUp();
                  }}
                  secureTextEntry={showPassConfirm}
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({passwordConfirm: value, errorMessage: null});
                    this.onInputChange({
                      id: 'passwordConfirm',
                      value,
                    });
                  }}
                  value={this.state.passwordConfirm}
                />
                <Icon
                  active
                  name={iconPassConfirm}
                  onPress={this.togglePassConfirm}
                />
              </Item>
              {this.renderError('passwordConfirm')}
              {this.renderErrorPass()}
              <Button
                rounded
                style={[styles.fullWidth, styles.center, styles.button]}
                onPress={this.handleSignUp}>
                <Text style={styles.fontButton}>Register</Text>
              </Button>
              <View style={[styles.row, styles.center, styles.mb5]}>
                <Text>Already have an account ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({routeName: 'Login'}),
                      ],
                    });
                    this.props.navigation.dispatch(resetAction);
                  }}>
                  <Text style={styles.registerText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#fff',
  },
  image: {
    marginTop: 30,
  },
  error: {color: 'red'},
  centerPosition: {
    position: 'absolute',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  registerText: {
    color: '#075E54',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  width: {
    width: '90%',
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#128C7E',
    marginBottom: 50,
  },
  fontButton: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  mb5: {
    marginBottom: 10,
  },
});
