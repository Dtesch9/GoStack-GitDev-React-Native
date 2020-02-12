import React, { Component } from 'react';
import { Text } from 'react-native';

export default class Repository extends Component {
  display = () => {
    const { navigation } = this.props;

    console.tron.log(navigation);
  };

  static navigationOptions = {
    title: Repository,
  };

  render() {
    return <Text>olá</Text>;
  }
}
