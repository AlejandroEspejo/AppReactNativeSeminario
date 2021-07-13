import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import OrdersResource, {
  IOrder,
  IUpdateOrder,
} from '../../../resources/OrdersResource';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {Text, StyleSheet, ScrollView, View} from 'react-native';
import AppContex from '../../../context/AppContext';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import {Switch} from 'react-native-gesture-handler';
import {Button, Divider, RadioButton} from 'react-native-paper';
import ProductsResource from '../../../resources/ProductsResource';

export interface IProps {
  order?: IOrder;
  onEdit(order: IOrder): void;
  notifyOnChangeOrder(callback: Function): void;
}

export interface IState {
  order?: IOrder;
  client?: IClient;
}
export default class DetailOrder extends Component<IProps, IState> {
  static contextType = AppContex;
  CR?: ClientsResource;
  OR?: OrdersResource;
  constructor(props: IProps) {
    super(props);
    this.state = {order: props.order};
    this.props.notifyOnChangeOrder(this.changeStateOrderValue);
  }
  changeStateOrderValue = (order: IOrder) => {
    this.setState({
      order: order,
    });
  };
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.CR = new ClientsResource(token);
    this.OR = new OrdersResource(token);
    this.getClient();
  }
  saveOrder(newVal: IUpdateOrder) {
    if (this.state.order && this.OR) {
      this.OR.update(this.state.order._id, newVal)
        .then(resp => resp)
        .catch(err => console.log(err));
    }
  }
  getClient() {
    if (this.CR && this.state.order) {
      this.CR.get(this.state.order.client_id)
        .then(resp => {
          this.setState({
            client: resp,
          });
        })
        .catch(err => console.log(err));
    }
  }
  updateDeleteProducts() {
    const PR = new ProductsResource(this.context.userAuth.token);
    if (this.state.order) {
      if (this.state.order.products) {
        this.state.order.products.forEach(p => {
          PR.get(p._id)
            .then(pr => {
              PR.update(p._id, {cantidad: pr.cantidad + p.cant_compra})
                .then(r => r)
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        });
      }
      this.props.onEdit(this.state.order);
    }
  }
  render() {
    if (!this.state.order) {
      return <Text>{'No existe un ordere seleccionado'}</Text>;
    } else {
      return (
        <NavigationContainer independent={true}>
          <ScrollView>
            <Grid>
              <Row>
                <Col size={70}>
                  <Text>{`Hoy ${new Date().getDate()} del ${
                    new Date().getMonth() + 1
                  }`}</Text>
                </Col>
                <Col size={30}>
                  <Text>{'Ordenar Pedido'}</Text>
                </Col>
              </Row>
              <Row>
                <Col size={70}>
                  <Text>{'Pagado o a Deuda'}</Text>
                </Col>
                <Col size={30}>
                  <Switch
                    value={this.state.order.estado_pago}
                    onValueChange={val => {
                      if (this.state.order) {
                        this.setState(
                          {
                            order: {...this.state.order, estado_pago: val},
                          },
                          () => {
                            this.saveOrder({estado_pago: val});
                          },
                        );
                      }
                    }}
                  />
                </Col>
              </Row>
              {this.state.client && (
                <Row>
                  <Col>
                    <View style={styles.viewContainterCenter}>
                      <Text
                        style={
                          styles.nameTxt
                        }>{`${this.state.client.first_name} ${this.state.client.last_name}`}</Text>
                    </View>
                  </Col>
                </Row>
              )}
              <Text>{'Detalle'}</Text>
              {this.state.order &&
                this.state.order.products &&
                this.state.order.products.map(p => {
                  return (
                    <Row key={p._id}>
                      <Col size={25}>
                        <Text>{p.nombre}</Text>
                      </Col>
                      <Col size={15}>
                        <Text>{p.cant_compra}</Text>
                      </Col>
                      <Col size={15}>
                        <Text>{'x'}</Text>
                      </Col>
                      <Col size={15}>
                        <Text>{p.precio}</Text>
                      </Col>
                      <Col size={15}>
                        <Text>{'='}</Text>
                      </Col>
                      <Col size={15}>
                        <Text>{`${p.cant_compra * p.precio}`}</Text>
                      </Col>
                    </Row>
                  );
                })}
              <Row>
                <Col>
                  <Divider />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text>{'Total'}</Text>
                </Col>
                <Col>
                  <View style={styles.viewContainerRight}>
                    <Text>{'' + this.state.order.total_pedido}</Text>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col size={40}>
                  <Text style={styles.txtStyles}>{'Método de Pago:'}</Text>
                </Col>
                <Col size={60}>
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 3,
                      borderColor: '#aaaaaa',
                    }}>
                    <RadioButton.Group
                      value={
                        this.state.order.metodo_pago
                          ? this.state.order.metodo_pago
                          : 'Efectivo'
                      }
                      onValueChange={newVal => {
                        if (this.state.order) {
                          this.setState({
                            order: {
                              ...this.state.order,
                              metodo_pago: newVal,
                            },
                          });
                          this.saveOrder({
                            metodo_pago: newVal,
                          });
                        }
                      }}>
                      <RadioButton.Item value={'Efectivo'} label={'Efectivo'} />
                      <RadioButton.Item
                        value={'Cuenta Bancaria'}
                        label={'Cuenta Bancaria'}
                      />
                    </RadioButton.Group>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col size={40}>
                  <Text style={styles.txtStyles}>{'Estado del Pedido:'}</Text>
                </Col>
                <Col size={60}>
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 3,
                      borderColor: '#aaaaaa',
                    }}>
                    <RadioButton.Group
                      value={
                        this.state.order.estado_pedido
                          ? this.state.order.estado_pedido
                          : 'Efectivo'
                      }
                      onValueChange={newVal => {
                        if (this.state.order) {
                          this.setState({
                            order: {
                              ...this.state.order,
                              estado_pedido: newVal,
                            },
                          });
                          this.saveOrder({
                            estado_pedido: newVal,
                          });
                        }
                      }}>
                      <RadioButton.Item
                        value={'sin entrega'}
                        label={'Sin entregar'}
                      />
                      <RadioButton.Item
                        value={'entregado'}
                        label={'Entregado'}
                      />
                    </RadioButton.Group>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    mode="contained"
                    onPress={() => {
                      this.saveOrder({
                        estado_pago: true,
                        estado_pedido: 'entregado',
                      });
                      if (this.state.order) {
                        this.props.onEdit(this.state.order);
                      }
                    }}>
                    Entregar
                  </Button>
                </Col>
                <Col>
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (this.state.order && this.OR) {
                        this.OR.destroy(this.state.order._id)
                          .then(resp => resp)
                          .catch(err => console.log(err));
                        this.updateDeleteProducts();
                        this.props.onEdit(this.state.order);
                      }
                    }}>
                    Eliminar Pedido
                  </Button>
                </Col>
              </Row>
            </Grid>
          </ScrollView>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: '80%',
    height: 140,
  },
  nameTxt: {
    marginTop: 10,
    fontSize: 25,
  },
  txtStyles: {
    marginTop: 10,
    width: '100%',
  },
  avatarView: {
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 150,
  },
  childContainerStyle: {
    width: '100%',
    height: 150,
  },
  viewContainerRight: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewContainterCenter: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
