import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {
  Button,
  Switch,
  RadioButton,
  Searchbar,
  Divider,
  Portal,
  Modal,
} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import {Col, Row, Grid} from 'react-native-paper-grid';
import OrdersResource, {
  IOrder,
  INewOrder,
  IOrderProduct,
} from '../../../resources/OrdersResource';
import {NavigationContainer} from '@react-navigation/native';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import ModalSinPedido from './ModalSinPedido';
import SelectStock from './SelectStock';
import ProductsResource from '../../../resources/ProductsResource';

interface Mystate {
  newOrder: INewOrder;
  isload: boolean;
  searchKW: string;
  selectClient?: IClient;
  showSendRecibo: boolean;
  responseOrder?: IOrder;
}
interface MyProps {
  onSaveOrder(order: IOrder): void;
  orderId?: string;
  values?: IOrder;
}
class FormClient extends Component<MyProps, Mystate> {
  static contextType = AppContext;
  OR: OrdersResource | null = null;
  CR: ClientsResource | null = null;
  PR?: ProductsResource;
  constructor(props: MyProps) {
    super(props);
    this.state = {
      isload: false,
      newOrder: props.values
        ? props.values
        : {
            client_id: '',
            user_id: '',
            products: [],
            estado_pago: false,
            metodo_pago: 'Efectivo',
            estado_pedido: 'sin entrega',
            fecha_pedido: new Date(),
          },
      searchKW: '',
      showSendRecibo: false,
    };
    this.OR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.OR = new OrdersResource(token);
    this.CR = new ClientsResource(token);
    this.PR = new ProductsResource(token);
  }
  onPressSaveOrder() {
    if (this.checkData() && this.OR) {
      this.OR.store(this.state.newOrder)
        .then((response: IOrder) => {
          this.props.onSaveOrder(response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  checkData() {
    //validate data
    return true;
  }
  findClient(kw: string) {
    this.setState({
      newOrder: {...this.state.newOrder, user_id: this.context.userAuth._id},
    });
    if (this.CR) {
      this.CR.list(
        {
          $or: [
            {
              first_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              regularclient: {$eq: true},
            },
            {
              last_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              regularclient: {$eq: true},
            },
          ],
        },
        {limit: 1},
      )
        .then((response: Array<IClient>) => {
          this.setState({
            selectClient: response[0],
            newOrder: {
              ...this.state.newOrder,
              client_id: response[0]
                ? response[0]._id
                : this.state.newOrder.client_id,
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  crearPedido() {
    if (this.OR && this.state.selectClient) {
      this.OR.store(this.state.newOrder)
        .then(resp => {
          this.setState({
            responseOrder: resp,
          });
          this.updateProducts();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  updateProducts() {
    if (this.state.newOrder.products) {
      this.state.newOrder.products.forEach(p => {
        if (this.PR) {
          this.PR.update(p._id, {cantidad: p.cant_stock - p.cant_compra})
            .then(r => r)
            .catch(err => console.log(err));
        }
      });
    }
    this.setState({
      showSendRecibo: true,
    });
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <ScrollView style={styles.container}>
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
                  value={this.state.newOrder.estado_pago}
                  onValueChange={val => {
                    this.setState({
                      newOrder: {...this.state.newOrder, estado_pago: val},
                    });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Searchbar
                  placeholder="Buscar Cliente"
                  value={this.state.searchKW}
                  onChangeText={newVal => {
                    this.setState({
                      searchKW: newVal,
                    });
                    this.findClient(newVal);
                  }}
                />
              </Col>
            </Row>
            {this.state.selectClient && (
              <Row>
                <Col>
                  <View style={styles.containerCenter}>
                    <Text
                      style={
                        styles.txtName
                      }>{`${this.state.selectClient.first_name} ${this.state.selectClient.last_name}`}</Text>
                  </View>
                </Col>
              </Row>
            )}
            <Text style={styles.txtName}>{'Productos:'}</Text>
            <Row>
              <Col>
                <SelectStock
                  onAddProducts={(list: Array<IOrderProduct>) => {
                    this.setState({
                      newOrder: {
                        ...this.state.newOrder,
                        products: list,
                        total_pedido: list.reduce(
                          (sum: number, p: IOrderProduct) => {
                            return sum + p.precio * p.cant_compra;
                          },
                          0,
                        ),
                      },
                    });
                  }}
                  token={this.context.userAuth.token}
                />
              </Col>
            </Row>
            <Row>
              <Col size={40}>
                <Text style={styles.txtStyles}>{'Método de Pago:'}</Text>
              </Col>
              <Col size={60}>
                <View style={styles.containerMetodoPago}>
                  <RadioButton.Group
                    value={
                      this.state.newOrder.metodo_pago
                        ? this.state.newOrder.metodo_pago
                        : 'Efectivo'
                    }
                    onValueChange={newVal => {
                      this.setState({
                        newOrder: {...this.state.newOrder, metodo_pago: newVal},
                      });
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

            <View style={styles.containerTotal}>
              {this.state.newOrder.total_pedido && (
                <React.Fragment>
                  <Text style={styles.txtStyles}>{'Valor'}</Text>
                  <Row>
                    <Col size={60}></Col>
                    <Col size={40}>
                      <Text style={styles.txtStyles}>
                        {this.state.newOrder.total_pedido + ' bs.'}
                      </Text>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col size={40}></Col>
                    <Col size={60}>
                      <Text style={styles.txtStyles}>
                        {'valor Total ' +
                          this.state.newOrder.total_pedido +
                          ' bs.'}
                      </Text>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </View>
            <Row>
              <Col>
                <ModalSinPedido
                  client={this.state.selectClient}
                  onRegister={motivo => {
                    this.setState({
                      newOrder: {
                        ...this.state.newOrder,
                        motivo_no_pedido: motivo,
                        estado_pedido: 'no pedido',
                        products: [],
                      },
                    });
                    this.onPressSaveOrder();
                  }}
                />
              </Col>
              <Col>
                <Button
                  mode="contained"
                  onPress={() => {
                    this.crearPedido();
                  }}>
                  Crear Pedido
                </Button>
              </Col>
            </Row>
          </Grid>
        </ScrollView>
        <Portal>
          <Modal visible={this.state.showSendRecibo}>
            {this.state.selectClient && this.state.newOrder.products && (
              <View style={styles.sendReciboContainer}>
                <Text>{'Generar Recibo'}</Text>
                <Text>{`${this.state.selectClient.first_name} ${this.state.selectClient.last_name}`}</Text>
                <View style={styles.containerCenter}>
                  <Text>{this.state.newOrder.fecha_pedido?.toString()}</Text>
                </View>
                <Text>{'Detalle'}</Text>
                <Grid>
                  {this.state.newOrder.products.map(p => {
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
                </Grid>
                <Divider />
                <Grid>
                  <Row>
                    <Col>
                      <Text>{'Total'}</Text>
                    </Col>
                    <Col>
                      <View style={styles.containerRight}>
                        <Text>{'' + this.state.newOrder.total_pedido}</Text>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerCenter}>
                        <Button mode="contained">Mandar al WathsApp</Button>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerCenter}>
                        <Button mode="contained">Mandar al Correo</Button>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerCenter}>
                        <Button
                          mode="contained"
                          onPress={() => {
                            if (this.state.responseOrder) {
                              this.props.onSaveOrder(this.state.responseOrder);
                            }
                          }}>
                          Continuar
                        </Button>
                      </View>
                    </Col>
                  </Row>
                </Grid>
              </View>
            )}
          </Modal>
        </Portal>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  containerCenter: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerRight: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerTotal: {
    height: 130,
  },
  containerMetodoPago: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderColor: '#aaaaaa',
    borderWidth: 3,
    borderRadius: 5,
  },
  sendReciboContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  txtName: {
    fontSize: 24,
  },
  txtStyles: {
    marginTop: 10,
    width: '100%',
    fontSize: 18,
  },
  avatarView: {
    alignItems: 'center',
  },
  imageStyle: {width: 150, height: 150},
});
export default FormClient;
