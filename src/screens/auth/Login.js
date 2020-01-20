import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Image, Alert, StatusBar, TouchableOpacity} from 'react-native';
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
import {StackActions, NavigationActions} from 'react-navigation';
import firebase from '../../../android/configs/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import {validationService} from '../../public/validation/service';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      inputs: {
        email: {
          type: 'email',
          value: '',
        },
        password: {
          type: 'password2',
          value: '',
        },
      },
      emailError: '',
      passwordError: '',
      error: false,
      email: '',
      password: '',
      showPass: true,
      iconPass: 'eye',
      errorMessage: null,
      loading: false,
    };
    this.onInputChange = validationService.onInputChange.bind(this);
    this.getFormValidation = validationService.getFormValidation.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }
  togglePass = () => {
    const {showPass} = this.state;
    this.setState({
      iconPass: !showPass ? 'eye' : 'eye-off',
      showPass: !showPass,
    });
  };
  handleSignIn = async () => {
    await this.getFormValidation();
    const {inputs} = this.state;
    if (inputs.email.value && inputs.password.value) {
      const {email, password} = this.state;
      this.setState({loading: true});
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        this.setState({loading: false});
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})],
        });
        this.props.navigation.dispatch(resetAction);
      } catch (error) {
        this.setState({errorMessage: error.code, loading: false});
      }
    }
  };
  resetInputs = () => {
    this.setState({
      inputs: {email: '', password: ''},
      email: null,
      password: null,
      errorMessage: null,
    });
  };

  renderError(id) {
    const {inputs, errorMessage} = this.state;
    if (inputs[id].errorLabel) {
      return <Text style={styles.error}>{inputs[id].errorLabel}</Text>;
    } else if (
      errorMessage === 'auth/user-not-found' ||
      errorMessage === 'auth/wrong-password'
    ) {
      return Alert.alert('Failed Login', 'Email/Password not match!');
    }
    return null;
  }

  render() {
    const {showPass, iconPass, loading} = this.state;
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
                <Icon active name="at" />
                <Label>Email</Label>
                <Input
                  onChangeText={value => {
                    this.setState({email: value, errorMessage: null});
                    this.onInputChange({id: 'email', value});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  getRef={input => {
                    this.emailRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordRef._root.focus();
                  }}
                  // onChangeText={email => this.setState({email})}
                  value={this.state.email}
                />
              </Item>
              {this.state.errorMessage !== 'auth/user-not-found' &&
                this.state.errorMessage !== 'auth/wrong-password' &&
                this.renderError('email')}
              <Item
                getRef={input => {
                  this.passwordItemRef = input;
                }}
                floatingLabel
                style={styles.mb5}>
                <Icon active name="key" />
                <Label>Password</Label>
                <Input
                  getRef={input => {
                    this.passwordRef = input;
                  }}
                  onSubmitEditing={() => {
                    this.handleSignIn();
                  }}
                  returnKeyType="go"
                  secureTextEntry={showPass}
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({password: value, errorMessage: null});
                    this.onInputChange({id: 'password', value});
                  }}
                  // onChangeText={password => this.setState({password})}
                  value={this.state.password}
                />
                <Icon active name={iconPass} onPress={this.togglePass} />
              </Item>
              {this.state.errorMessage !== 'auth/user-not-found' &&
                this.state.errorMessage !== 'auth/wrong-password' &&
                this.renderError('password')}
              {this.state.errorMessage !== null && this.renderError('password')}
              <View style={[styles.row, styles.right]}>
                <TouchableOpacity
                  onPress={() => {
                    this.passwordRef._root.clear();
                    this.resetInputs();
                    this.props.navigation.navigate('ForgotPassword');
                  }}>
                  <Text style={styles.registerText}>Forgot Password ?</Text>
                </TouchableOpacity>
              </View>
              <Button
                rounded
                style={[styles.fullWidth, styles.center, styles.button]}
                onPress={this.handleSignIn}>
                <Text style={styles.fontButton}>Login</Text>
              </Button>
              <View style={[styles.row, styles.center, styles.mb5]}>
                <Text>Don't have an account ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({routeName: 'Register'}),
                      ],
                    });
                    this.props.navigation.dispatch(resetAction);
                  }}>
                  <Text style={styles.registerText}>Register</Text>
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
  right: {
    justifyContent: 'flex-end',
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
