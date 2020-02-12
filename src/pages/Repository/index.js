import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repository: [],
  };

  componentDidMount() {
    const { navigation } = this.props;
    const repo = navigation.getParam('repository');
    console.tron.log(repo);

    this.setState({ repository: repo });

    console.tron.log(this.state.repository);
  }

  render() {
    const { repository } = this.state;
    return (
      <WebView
        // source={{ uri: repository.owner.html_url }}
        source={{ html: '<h1>Hello</h1>' }}
        style={{ flex: 1 }}
      />
    );
  }
}
