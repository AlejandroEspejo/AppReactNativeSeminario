import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Appbar, Text} from 'react-native-paper';
import ListClients from './components/ListClients';
import {IClient} from '../../resources/ClientsResource';
import CreatePotentialClient from './components/CreatePotentialClient';
import DetailClient from './components/DetailClient';
var Stack = createStackNavigator();
interface IState {
  selectClient?: IClient;
  loadList?: Function;
}
export default class PotentialClients extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  async onSelectClient(client: IClient) {
    this.setState({
      selectClient: client,
    });
  }
  changeState(state: IState) {
    this.setState(state);
  }
  renderListClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <ListClients
        onSelectOne={(client: IClient) => {
          this.onSelectClient(client);
          navigation.navigate('detailClient');
        }}
        onPressNewClient={() => {
          navigation.navigate('createClient');
        }}
        reloadList={(reloadList: Function) => {
          this.setState({
            loadList: reloadList,
          });
        }}
      />
    );
  };
  renderCreateClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <CreatePotentialClient
        onSaveClient={() => {
          if (this.state.loadList) {
            this.state.loadList();
          }
          navigation.pop();
        }}
      />
    );
  };
  renderDetailClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <DetailClient
        client={this.state.selectClient}
        onEdit={(client: IClient) => {
          console.log('on Edit Client; ', client);
          //to edit client
          navigation.pop();
        }}
        ChildrenComponent={(client: IClient | undefined) => {
          console.log(client);
          return <Text>{'Children component'}</Text>;
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
          <Stack.Screen
            name="detailClient"
            component={this.renderDetailClient}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Detalle Cliente potencial"
                    subtitle={'informacion'}
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
