import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Button, List, TextInput} from 'react-native-paper';
import {IOrderProduct} from '../../../resources/OrdersResource';
import {Col, Row, Grid} from 'react-native-paper-grid';

export interface IProps {
  listOrderProducts: Array<IOrderProduct>;
  onChangeList(list: Array<IOrderProduct>): void;
}

export interface IState {
  indexSelect?: number;
  visibleCantModal: boolean;
  cantSelected: number;
}

export default class ListDetailProduct extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      visibleCantModal: false,
      cantSelected: 0,
    };
  }
  listDPItem = (item: IOrderProduct, index: number) => {
    return (
      <List.Item
        title={item.nombre}
        description={`${item.cant_stock} disponibles`}
        right={() => {
          return (
            <Text>{`-${item.cant_compra} + p.${
              item.precio * item.cant_compra
            } bs`}</Text>
          );
        }}
        onPress={() => {
          this.setState({
            indexSelect: index,
            cantSelected: item.cant_compra,
            visibleCantModal: true,
          });
        }}
      />
    );
  };
  render() {
    return (
      <View>
        <View style={styles.changeCantValue}>
          {this.state.visibleCantModal && (
            <Grid>
              <Row>
                <Col size={40}>
                  <Text>
                    {`${
                      this.props.listOrderProducts[this.state.indexSelect]
                        .nombre
                    }`}
                  </Text>
                </Col>
                <Col size={35}>
                  <TextInput
                    style={styles.txtInputStyle}
                    value={
                      (this.state.cantSelected
                        ? this.state.cantSelected
                        : '0') + ''
                    }
                    onChangeText={txt => {
                      var num = !txt ? '0' : txt;
                      const numVal: number = parseInt(num, 10);
                      if (this.state.indexSelect !== undefined) {
                        this.setState({
                          cantSelected:
                            numVal <=
                            this.props.listOrderProducts[this.state.indexSelect]
                              .cant_stock
                              ? numVal
                              : this.props.listOrderProducts[
                                  this.state.indexSelect
                                ].cant_stock,
                        });
                      }
                    }}
                    keyboardType="number-pad"
                  />
                </Col>
                <Col size={25}>
                  <View style={styles.centerContainer}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        this.props.onChangeList(
                          this.props.listOrderProducts.map((op, i) => {
                            if (i !== this.state.indexSelect) {
                              return op;
                            } else {
                              return {
                                ...op,
                                cant_compra: this.state.cantSelected,
                              };
                            }
                          }),
                        );
                        this.setState({
                          visibleCantModal: false,
                          indexSelect: undefined,
                        });
                      }}>
                      Ok
                    </Button>
                  </View>
                </Col>
              </Row>
            </Grid>
          )}
        </View>
        <FlatList
          style={styles.flatListContainer}
          data={this.props.listOrderProducts}
          renderItem={({item, index}) => this.listDPItem(item, index)}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    height: 300,
    backgroundColor: '#ffffff',
  },
  txtInputStyle: {
    fontSize: 12,
    height: 35,
  },
  rigthContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  changeCantValue: {
    height: 45,
  },
  flatListContainer: {
    height: 190,
  },
});
