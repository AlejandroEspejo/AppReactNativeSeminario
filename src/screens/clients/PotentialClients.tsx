import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Appbar} from 'react-native-paper';
import ListClients from './components/ListClients';
import {IClient} from '../../resources/ClientsResource';
import CreatePotentialClient from './components/CreatePotentialClient';
var Stack = createStackNavigator();
interface IState {}
export default class PotentialClients extends Component<any, IState> {
  constructor(props: any) {
    super(props);
  }
  async onSelectClient(client: IClient) {
    console.log('client ', client);
  }
  changeState(state: IState) {
    this.setState(state);
  }
  renderListClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <ListClients
        onSelectOne={this.onSelectClient}
        onPressNewClient={() => {
          navigation.navigate('createClient');
        }}
      />
    );
  };
  renderCreateClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <CreatePotentialClient
        onSaveClient={() => {
          navigation.pop();
        }}
      />
    );
  };
  render() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="list"
            component={this.renderListClient}
            options={() => {
              return {
                header: () => null,
              };
            }}
          />
          <Stack.Screen
            name="createClient"
            component={this.renderCreateClient}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Crear usuario Potencial"
                    subtitle={'introduzca sus datos'}
                  />
                </Appbar.Header>
              ),
            })}
          />
          {/* <Stack.Screen
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
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
