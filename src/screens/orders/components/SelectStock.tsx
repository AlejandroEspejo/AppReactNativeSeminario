import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Divider, Modal, Portal} from 'react-native-paper';
import {IOrderProduct} from '../../../resources/OrdersResource';
import {IProduct} from '../../../resources/ProductsResource';
import ListProducts from '../../products/components/ListProducts';
import ListDetailProduct from './ListDetailproduct';
import {Col, Row, Grid} from 'react-native-paper-grid';

export interface IProps {
  onAddProducts(products: Array<IOrderProduct>): void;
  token: string;
}

export interface IState {
  listProducts: Array<IOrderProduct>;
  total: number;
  visible: boolean;
}

export default class SelectStock extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      listProducts: [],
      total: 0,
      visible: false,
    };
  }
  render() {
    return (
      <View>
        <Button
          mode="contained"
          onPress={() => {
            this.setState({
              visible: true,
            });
          }}>
          Seleccionar Stock
        </Button>
        <Portal>
          <Modal visible={this.state.visible}>
            <View style={styles.container}>
              <Grid>
                <Row>
                  <Col>
                    <View style={styles.containerProducts}>
                      <ListProducts
                        onSelectOne={(product: IProduct) => {
                          var couted: boolean = false;
                          var ml: Array<IOrderProduct> =
                            this.state.listProducts.map(op => {
                              if (product._id === op._id) {
                                couted = true;
                                return {...op, cant_compra: op.cant_compra + 1};
                              } else {
                                return op;
                              }
                            });
                          if (!couted) {
                            ml.push({
                              _id: product._id,
                              nombre: product.nombre,
                              cant_compra: 1,
                              precio: product.precio,
                              cant_stock: product.cantidad,
                            });
                          }
                          this.setState({
                            listProducts: ml,
                            total: ml.reduce(
                              (sum: number, op: IOrderProduct) => {
                                return sum + op.cant_compra * op.precio;
                              },
                              0,
                            ),
                          });
                        }}
                        token={this.props.token}
                      />
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Divider />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={styles.containerDetailproducts}>
                      <ListDetailProduct
                        listOrderProducts={this.state.listProducts}
                        onChangeList={list => {
                          this.setState({
                            listProducts: list,
                            total: list.reduce(
                              (sum: number, op: IOrderProduct) => {
                                return sum + op.cant_compra * op.precio;
                              },
                              0,
                            ),
                          });
                        }}
                      />
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={styles.containerCenter}>
                      <Button
                        mode="contained"
                        onPress={() => {
                          this.setState({
                            visible: false,
                          });
                          this.props.onAddProducts(this.state.listProducts);
                        }}>
                        {`Agregar bs ${this.state.total}`}
                      </Button>
                    </View>
                  </Col>
                </Row>
              </Grid>
            </View>
          </Modal>
        </Portal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  containerCenter: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerProducts: {
    height: 250,
    marginTop: 5,
    marginBottom: 5,
  },
  containerDetailproducts: {
    height: 240,
    marginBottom: 5,
  },
});
