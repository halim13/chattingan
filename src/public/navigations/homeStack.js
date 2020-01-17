import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Profile from '../../screens/home/Profile';
import HomeScreen from '../../screens/home/Home';

const AppNavigator = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerShown: false,
      },
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'HomeScreen',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
