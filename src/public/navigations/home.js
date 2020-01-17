import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../../screens/auth/Login';
import ForgotPasswordScreen from '../../screens/auth/ForgotPassword';
import RegisterScreen from '../../screens/auth/Register';
import SplashScreen from '../../screens/SplashScreen';
import HomeScreen from './homeStack';

const AppNavigator = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'SplashScreen',
    // defaultNavigationOptions: {
    //   headerStyle: {
    //     backgroundColor: '#008b6e',
    //   },
    //   headerTintColor: '#fff',
    //   headerTitleStyle: {
    //     fontWeight: 'bold',
    //   },
    // },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
