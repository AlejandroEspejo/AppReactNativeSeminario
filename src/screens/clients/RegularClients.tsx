import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Appbar, Text} from 'react-native-paper';
import ListClients from './components/ListClients';
import {IClient} from '../../resources/ClientsResource';
import CreatePotentialClient from './components/FormClient';
import DetailClient from './components/DetailClient';
var Stack = createStackNavigator();
interface IState {
  selectClient?: IClient;
  loadList?: Function;
  onChangeDetailClientValue?: Function;
}
export default class RegularClients extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  onSelectClient(client: IClient | undefined) {
    this.setState({
      selectClient: client,
    });
  }
  changeState(state: IState) {
    this.setState(state);
  }
  onChangeDetailtClientValue() {
    if (this.state.onChangeDetailClientValue) {
      this.state.onChangeDetailClientValue(this.state.selectClient);
    }
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
        type="regular"
      />
    );
  };
  renderCreateClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <CreatePotentialClient
        onSaveClient={client => {
          if (this.state.loadList) {
            this.state.loadList();
          }
          if (this.state.selectClient) {
            this.setState({
              selectClient: client,
            });
            this.onChangeDetailtClientValue();
          }
          navigation.pop();
        }}
        values={this.state.selectClient}
        clientId={
          this.state.selectClient ? this.state.selectClient._id : undefined
        }
        isRegularClient={true}
      />
    );
  };
  renderDetailClient = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <DetailClient
        client={this.state.selectClient}
        onEdit={(client: IClient) => {
          //to edit client
          this.onSelectClient(client);
          navigation.navigate('createClient');
        }}
        notifyOnChangeClient={callback => {
          this.changeState({onChangeDetailClientValue: callback});
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
                      this.onSelectClient(undefined);
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title={
                      this.state.selectClient
                        ? 'Editar Cliente Potencial'
                        : 'Crear Cliente potencial'
                    }
                    subtitle={
                      this.state.selectClient
                        ? 'modifique sus datos'
                        : 'introduzca sus datos'
                    }
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
                      if (this.state.loadList) {
                        this.state.loadList();
                      }
                      this.onSelectClient(undefined);
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
