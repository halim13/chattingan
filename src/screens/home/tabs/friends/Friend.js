import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class Friend extends Component {
  render() {
    const id = this.props.navigation.state.params.id;
    return (
      <View>
        <Text> {id} </Text>
      </View>
    );
  }
}