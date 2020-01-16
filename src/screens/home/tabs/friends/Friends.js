import React, {Component} from 'react';
import ListFriend from './ListFriend';
import {Container} from 'native-base';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import ActionButtons from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ListAvatarExample extends Component {
  constructor() {
    super();
    this.state = {
      isFetching: false,
    };
  }
  onRefresh() {
    this.setState({isFetching: true}, async () => {
      // await this.props.fetch(
      //   this.props.pages.search,
      //   this.props.pages.sort,
      //   this.props.pages.order,
      //   1,
      //   this.props.pages.limit,
      // );
      this.setState({isFetching: false});
    });
  }
  render() {
    const data = [
      {
        id: '1',
        photo:
          'https://f0.pngfuel.com/png/683/60/man-profile-illustration-png-clip-art-thumbnail.png',
        name: 'Halim Hasanudin',
        description: 'Doing what you like will be like a star',
      },
      {
        id: '2',
        photo:
          'https://f0.pngfuel.com/png/683/60/man-profile-illustration-png-clip-art-thumbnail.png',
        name: 'Halim Hasanudin',
        description: 'Welcome to mobile legends bang bang',
      },
    ];
    return (
      <>
        <Container>
          <FlatList
            refreshControl={
              <RefreshControl
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
              />
            }
            data={data}
            renderItem={({item}) => <ListFriend item={item} />}
            keyExtractor={item => item.id.toString()}
          />
          <ActionButtons
            buttonColor="#25D366"
            renderIcon={active =>
              active ? (
                <MaterialCommunityIcons
                  name="account-plus"
                  style={styles.icon}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-plus"
                  style={styles.icon}
                />
              )
            }
          />
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  icon: {color: '#fff', fontSize: 30},
});
