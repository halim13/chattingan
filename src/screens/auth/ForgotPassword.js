import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Image} from 'react-native';
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackActions, NavigationActions} from 'react-navigation';
import firebase from '../../../android/configs/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import {validationService} from '../../public/validation/service';

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      inputs: {
        email: {
          type: 'email',
          value: '',
        },
      },
      emailError: '',
      error: false,
      email: '',
      errorMessage: null,
      loading: false,
    };
    this.onInputChange = validationService.onInputChange.bind(this);
    this.getFormValidation = validationService.getFormValidation.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }

  handlePasswordReset = async () => {
    await this.getFormValidation();
    const {email} = this.state.inputs;
    if (email.value) {
      this.setState({loading: true});
      try {
        await firebase.auth().sendPasswordResetEmail(this.state.email);
        this.setState({loading: false});
        console.warn('Password reset email sent successfully');
        this.props.navigation.navigate('Login');
      } catch (error) {
        this.setState({errorMessage: error.code, loading: false});
      }
    }
  };

  renderError(id) {
    const {inputs} = this.state;
    if (inputs[id].errorLabel) {
      return <Text style={styles.error}>{inputs[id].errorLabel}</Text>;
    }

    if (this.state.errorMessage === 'auth/user-not-found') {
      return <Text style={styles.error}>Email not registered!</Text>;
    }

    return null;
  }

  render() {
    const {loading} = this.state;
    return (
      <SafeAreaView style={[styles.flex]}>
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
              <Item floatingLabel style={styles.mb5}>
                <Icon active name="at" />
                <Label>Email</Label>
                <Input
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({email: value, errorMessage: null});
                    this.onInputChange({id: 'email', value});
                  }}
                  // onChangeText={email => this.setState({email})}
                  value={this.state.email}
                />
              </Item>
              {this.renderError('email')}
              <Button
                rounded
                style={[styles.fullWidth, styles.center, styles.button]}
                onPress={this.handlePasswordReset}>
                <Text style={styles.fontButton}>Forgot Password</Text>
              </Button>
              <View style={[styles.row, styles.center, styles.mb5]}>
                <Text>Have an account ?</Text>
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
  image: {
    marginTop: 30,
  },
  spinnerTextStyle: {
    color: '#fff',
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
