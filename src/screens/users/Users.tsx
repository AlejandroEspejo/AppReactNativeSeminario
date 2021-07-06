import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, Platform} from 'react-native';
import {Appbar} from 'react-native-paper';
import ListUsers from './ListUsers';
import RegisterUsers from './RegisterUsers';
import DetailUsers from './DetailUsers';
import UpdateUser from './UpdateUser';
import TakePicture from './TakePicture';
import AppContext from '../../context/AppContext';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
var Stack = createStackNavigator();
class Users extends Component<any, any> {
  test: any;
  static contextType = AppContext;
  constructor(props: any) {
    super(props);
    this.state = {
      dataUsers: [],
    };
  }
  render() {
    const {searchbarVisible, changeSearchBarVisible} = this.context;
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="list"
            component={ListUsers}
            options={() => ({
              header: () => (
                <Appbar.Header>
                  <Appbar.Content
                    title="Gestor de Usuarios"
                    subtitle={'Sistema de Roles'}
                  />
                  <Appbar.Action
                    icon="magnify"
                    onPress={() => {
                      changeSearchBarVisible(!searchbarVisible);
                    }}
                  />
                  <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen
            name="RegisterUsers"
            component={RegisterUsers}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                      //this.props.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Gestor de Usuarios"
                    subtitle={'Sistema de Roles'}
                  />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen
            name="DetailUsers"
            component={DetailUsers}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                      //this.props.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Datos de Usuario"
                    subtitle={'Sistema de roles'}
                  />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen name="TakePicture" component={TakePicture} />
          <Stack.Screen
            name="UpdateUser"
            component={UpdateUser}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                      //this.props.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Datos de Usuario"
                    subtitle={'Sistema de roles'}
                  />
                </Appbar.Header>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default Users;
