import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
    loadingList: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async () => {
    this.setState({ loadingList: true });

    const { page, stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const nextPage = page + 1;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: nextPage,
      },
    });

    this.setState({
      stars: response.data !== '' && [...stars, ...response.data],
      page: nextPage,
      loadingList: false,
    });
  };

  renderFooter = () => {
    const { loadingList } = this.state;

    return loadingList && <ActivityIndicator color="#999" size={50} />;
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container backgroundColor="#fff">
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#999" marginTop={100} size={50} />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </Container>
    );
  }
}
