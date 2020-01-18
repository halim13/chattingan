import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Maps from '../../screens/home/Maps';
import Profile from '../../screens/home/Profile';
import Chat from '../../screens/home/tabs/chats/Chat';
import Friend from '../../screens/home/tabs/friends/Friend';
import HomeScreen from '../../screens/home/Home';

const AppNavigator = createStackNavigator(
  {
    Chat: {
      screen: Chat,
      navigationOptions: {
        headerShown: false,
      },
    },
    Maps: {
      screen: Maps,
      navigationOptions: {
        headerShown: false,
      },
    },
    Friend: {
      screen: Friend,
      navigationOptions: {
        headerShown: false,
      },
    },
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
