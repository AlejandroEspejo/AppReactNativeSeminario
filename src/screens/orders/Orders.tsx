import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform} from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Appbar} from 'react-native-paper';
import ListOrders from './components/ListOrders';
import {IOrder} from '../../resources/OrdersResource';
import FormOrder from './components/FormOrder';
import DetailOrder from './components/DetailOrder';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
var Stack = createStackNavigator();
interface IProps {}
interface IState {
  selectOrder?: IOrder;
  loadList?: Function;
  onChangeDetailOrderValue?: Function;
}
export default class Orders extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  onSelectOrder(order: IOrder) {
    this.setState({
      selectOrder: order,
    });
  }
  changeState(state: IState) {
    this.setState(state);
  }
  onChangeDetailtOrderValue() {
    if (this.state.onChangeDetailOrderValue) {
      this.state.onChangeDetailOrderValue(this.state.selectOrder);
    }
  }
  renderListOrder = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <ListOrders
        onSelectOne={(order: IOrder) => {
          this.onSelectOrder(order);
          navigation.navigate('detailOrder');
        }}
        onPressNewOrder={() => {
          navigation.navigate('formOrder');
        }}
        reloadList={(reloadList: Function) => {
          this.setState({
            loadList: reloadList,
          });
        }}
      />
    );
  };
  renderFormOrder = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <FormOrder
        onSaveOrder={order => {
          if (this.state.loadList) {
            this.state.loadList();
          }
          if (this.state.selectOrder) {
            this.setState({
              selectOrder: order,
            });
            this.onChangeDetailtOrderValue();
          }
          navigation.pop();
        }}
        values={this.state.selectOrder}
        orderId={
          this.state.selectOrder ? this.state.selectOrder._id : undefined
        }
      />
    );
  };
  renderDetailOrder = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <DetailOrder
        order={this.state.selectOrder}
        onEdit={() => {
          //to edit client
          if (this.state.loadList) {
            this.state.loadList();
          }
          navigation.navigate('list');
        }}
        notifyOnChangeOrder={callback => {
          this.changeState({onChangeDetailOrderValue: callback});
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
            component={this.renderListOrder}
            options={() => ({
              header: () => (
                <Appbar.Header>
                  <Appbar.Content
                    title="Gestor de Pedidos"
                    subtitle={'administracion de pedidos'}
                  />
                  <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen
            name="formOrder"
            component={this.renderFormOrder}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title={
                      this.state.selectOrder ? 'Editar Pedido' : 'Crear Pedido'
                    }
                    subtitle={
                      this.state.selectOrder
                        ? 'Modifique sus datos'
                        : 'Introduzca sus datos'
                    }
                  />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen
            name="detailOrder"
            component={this.renderDetailOrder}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      if (this.state.loadList) {
                        this.state.loadList();
                      }
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Detalle Pedido"
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
