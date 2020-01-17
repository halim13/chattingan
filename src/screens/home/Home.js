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
  Item,
  Input,
} from 'native-base';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
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
import firebase from '../../../android/configs/firebase';
import {StackActions, NavigationActions} from 'react-navigation';
import {YellowBox} from 'react-native';
import _ from 'lodash';

export default class TabsAdvancedExample extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      loading: false,
      search: false,
    };
  }
  getUser = () => {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
  };
  toggleSearch = () => {
    const {search} = this.state;
    this.setState({search: !search});
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
    const {loading, search} = this.state;
    YellowBox.ignoreWarnings(['componentWillReceiveProps']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('componentWillReceiveProps') <= -1) {
        _console.warn(message);
      }
    };
    return (
      <>
        <SafeAreaView style={styles.flex}>
          {/* <StatusBar hidden={false} color="#128c7e" /> */}
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
            {search && (
              <>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                <Item style={styles.item}>
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      this.toggleSearch();
                    }}>
                    <Icon name="arrow-back" style={styles.backIcon} />
                  </TouchableOpacity>

                  <Input
                    autoFocus={this.state.search ? true : false}
                    autoCapitalize="none"
                    getRef={input => {
                      this.searchRef = input;
                    }}
                    placeholder="Search..."
                    returnKeyType="search"
                    onChangeText={text => {
                      // this.search(text);
                    }}
                  />
                </Item>
              </>
            )}
            {!search && (
              <Header
                hasTabs
                style={styles.header}
                androidStatusBarColor="#0E4C44">
                <Body>
                  <Text style={[styles.headerText, styles.white]}>
                    Aya naon ?
                  </Text>
                </Body>
                <Right>
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleSearch();
                    }}>
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
                        <Text>Friends Locations</Text>
                      </MenuOption>
                      <MenuOption
                        onSelect={() => {
                          this.props.navigation.navigate('Profile');
                        }}
                        style={styles.menu}>
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
            )}
            <Tabs>
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
      </>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  spinnerTextStyle: {
    color: '#fff',
  },
  backIcon: {color: '#075E54', fontSize: 30},
  item: {height: 56},
  arrowButton: {paddingHorizontal: 10},
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
