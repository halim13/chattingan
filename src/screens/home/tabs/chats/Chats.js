import React, {Component} from 'react';
import ListChat from './ListChat';
import {Container} from 'native-base';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        message: 'Doing what you like will be like a star',
        time: '13:43',
        notification: 9,
      },
      {
        id: '2',
        photo:
          'https://f0.pngfuel.com/png/683/60/man-profile-illustration-png-clip-art-thumbnail.png',
        name: 'Halim Hasanudin',
        message: 'Welcome to mobile legends bang bang',
        time: '13:43',
        notification: null,
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
            renderItem={({item}) => <ListChat item={item} />}
            keyExtractor={item => item.id.toString()}
          />
          <ActionButton
            buttonColor="#25D366"
            renderIcon={active =>
              active ? (
                <MaterialIcons name="chat" style={styles.icon} />
              ) : (
                <MaterialIcons name="chat" style={styles.icon} />
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
