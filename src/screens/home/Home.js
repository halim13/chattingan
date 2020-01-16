import firebase from '../../../android/configs/firebase';
import {StackActions, NavigationActions} from 'react-navigation';

// export default class Home extends Component {
//   render() {
//     const {currentUser} = this.state;
//     return (
//       <SafeAreaView>
//         <View>
//           <Text> {currentUser && currentUser.email} </Text>
//           <Button onPress={this.signOutUser}>
//             <Text>Logout</Text>
//           </Button>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

import React, {Component} from 'react';
import {
  Container,
  Header,
  Tab,
  Tabs,
  TabHeading,
  Text,
  Body,
  Right,
  Icon,
} from 'native-base';
import {SafeAreaView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Chats from './tabs/chats/Chats';
import Friends from './tabs/friends/Friends';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Spinner from 'react-native-loading-spinner-overlay';

export default class TabsAdvancedExample extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      loading: false,
    };
  }
  getUser = () => {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
  };
  componentDidMount() {
    this.getUser();
  }
  signOutUser = async () => {
    this.setState({loading: true});
    try {
      await firebase.auth().signOut();
      this.setState({loading: false});
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (e) {
      this.setState({loading: false});
      console.warn(e);
    }
  };
  render() {
    const {loading} = this.state;
    return (
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
          <Header hasTabs style={styles.header}>
            <Body>
              <Text style={[styles.headerText, styles.white]}>Aya naon ?</Text>
            </Body>
            <Right>
              <TouchableOpacity>
                <Icon name="search" style={[styles.white, styles.icon]} />
              </TouchableOpacity>
              <Menu>
                <MenuTrigger>
                  <Entypo
                    name="dots-three-vertical"
                    style={[styles.white, styles.icons]}
                  />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => {}} style={styles.menu}>
                    <Text>Profile</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => {
                      Alert.alert(
                        'Sign out',
                        'Are you sure?',
                        [
                          {
                            text: 'No',
                            onPress: () => {},
                            style: 'cancel',
                          },
                          {
                            text: 'Yes',
                            onPress: () => {
                              this.signOutUser();
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                    style={styles.menu}>
                    <Text style={styles.red}>Logout</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </Right>
          </Header>
          <Tabs style={styles.header}>
            <Tab
              heading={
                <TabHeading style={styles.header}>
                  <Text style={styles.white}>Chat</Text>
                </TabHeading>
              }>
              <Chats />
            </Tab>
            <Tab
              heading={
                <TabHeading style={styles.header}>
                  <Text style={styles.white}>Friend List</Text>
                </TabHeading>
              }>
              <Friends />
            </Tab>
          </Tabs>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  spinnerTextStyle: {
    color: '#fff',
  },
  menu: {padding: 15},
  red: {color: 'red'},
  header: {backgroundColor: '#075E54'},
  headerText: {fontSize: 20},
  white: {color: '#fff'},
  icon: {fontSize: 25},
  icons: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
});
