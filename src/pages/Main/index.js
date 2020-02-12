import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  CloseButton,
} from './styles';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    error: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    try {
      const { users, newUser } = this.state;

      this.setState({ loading: true });

      users.forEach(user => {
        if (user.login === newUser) {
          throw new Error('Usuário duplicado');
        }
      });

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  };

  handleDelete = async user => {
    const { users } = this.state;

    this.setState({ users: users.filter(u => u !== user) });
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  static navigationOptions = {
    title: 'Usuários',
  };

  render() {
    const { users, newUser, loading, error } = this.state;

    return (
      <Container backgroundColor="#fff">
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            error={error}
          />

          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        {!users.length && loading ? (
          <ActivityIndicator color="#999" marginTop={100} size={50} />
        ) : (
          <List
            data={users}
            keyExtractor={user => user.login}
            renderItem={({ item }) => (
              <User>
                <CloseButton onPress={() => this.handleDelete(item)}>
                  <Icon name="cancel" size={20} color="#7159c1" />
                </CloseButton>
                <Avatar source={{ uri: item.avatar }} />
                <Name>{item.name}</Name>
                <Bio>{item.bio}</Bio>

                <ProfileButton onPress={() => this.handleNavigate(item)}>
                  <ProfileButtonText>Ver perfil</ProfileButtonText>
                </ProfileButton>
              </User>
            )}
          />
        )}
      </Container>
    );
  }
}
