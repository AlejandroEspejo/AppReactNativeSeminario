import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert, FlatList} from 'react-native';
import AppContext from '../../context/AppContext';
import {IRoles, ItemUser} from './ListUsers';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  Searchbar,
  List,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import {Types} from '../../context/ContantTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {API_URL} from '../../utils/config';
interface MyState {
  systemroles: Array<IRoles>;
}
interface ServerResponse {
  serverResponse: Array<IRoles>;
}
interface ServerResponsePutRoles {
  serverResponse: ItemUser;
}
interface MyProps {
  navigation: StackNavigationProp<any, any>;
}
class DetailUsers extends Component<MyProps, MyState> {
  static contextType = AppContext;
  constructor(props: any) {
    super(props);
    this.state = {
      systemroles: [],
    };
  }
  async componentDidMount() {
    var result: Array<IRoles> = await axios
      .get<ServerResponse>(API_URL + '/roles')
      .then(item => {
        return item.data.serverResponse;
      });
    this.setState({
      systemroles: result,
    });
  }
  renderRoles(itemuser: ItemUser) {
    const {dispatch} = this.context;
    if (itemuser.roles.length == 0) {
      return (
        <View>
          <Text>El usuario {itemuser.username} , no tiene roles asignados</Text>
        </View>
      );
    }
    return (
      <View style={styles.chipContainer}>
        {itemuser.roles.map(item => {
          return (
            <Chip
              key={item._id}
              icon="information"
              onPress={async () => {
                var result: ItemUser = await axios
                  .put<ServerResponsePutRoles>(
                    API_URL + '/removerol/' + this.context.itemuser._id,
                    {idRol: item._id},
                  )
                  .then(item => {
                    return item.data.serverResponse;
                  });
                dispatch({type: Types.CHANGEITEMUSER, payload: result});
              }}>
              {item.name} {item.method}
            </Chip>
          );
        })}
      </View>
    );
  }
  async onClickListItme(item: IRoles) {
    const {dispatch} = this.context;
    var result: ItemUser = await axios
      .put<ServerResponsePutRoles>(
        API_URL + '/addrol/' + this.context.itemuser._id,
        {idRol: item._id},
      )
      .then(item => {
        return item.data.serverResponse;
      });
    dispatch({type: Types.CHANGEITEMUSER, payload: result});
  }
  render() {
    var itemuser: ItemUser = this.context.itemuser;
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View>
            <Card>
              <Card.Cover source={{uri: itemuser.uriavatar}} />
              <Card.Content>
                <Title>{itemuser.username}</Title>
                <Paragraph>El nombre de usuario es{itemuser.email} </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button
                  icon="account-edit"
                  onPress={() => {
                    this.props.navigation.push('UpdateUser');
                  }}>
                  Edit
                </Button>
                <Button
                  icon="delete"
                  onPress={() => {
                    Alert.alert(
                      'Borrar usuario',
                      'Desea Borrar Al usuario ' + itemuser.username,
                      [
                        {
                          text: 'Confirmar',
                          onPress: async () => {
                            var result = await axios.delete(
                              API_URL + '/users/' + this.context.itemuser._id,
                            );
                            var {loadMainListUsers} = this.context;
                            loadMainListUsers();
                            this.props.navigation.pop();
                          },
                        },
                        {text: 'Cancelar', onPress: () => {}},
                      ],
                    );
                  }}>
                  Borrar
                </Button>
              </Card.Actions>
            </Card>
          </View>
          <View style={styles.cardViewContainer}>
            <Card>
              <Card.Content>
                <Title>Roles</Title>
                {this.renderRoles(itemuser)}
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardViewContainer}>
            <Card>
              <Card.Content>
                <Title>Roles del Sistema</Title>
                <View>
                  <Searchbar
                    placeholder="Search"
                    onChangeText={() => {}}
                    value=""
                  />
                </View>
                <View>
                  {this.state.systemroles.map(item => {
                    return (
                      <List.Item
                        key={item._id}
                        title={item.name}
                        description={item.method}
                        onPress={() => {
                          this.onClickListItme(item);
                        }}
                        left={props => <List.Icon {...props} icon="folder" />}
                      />
                    );
                  })}
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  cardViewContainer: {
    marginTop: 10,
  },
  chipContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
export default DetailUsers;
