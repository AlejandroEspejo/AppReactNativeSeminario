import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import {Divider, FAB, List, RadioButton, Searchbar} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import OrdersResource, {IOrder} from '../../../resources/OrdersResource';
import {Col, Row, Grid} from 'react-native-paper-grid';
import ClientsResource from '../../../resources/ClientsResource';

interface IProps {
  onSelectOne(order: IOrder): void;
  onPressNewOrder(): void;
  reloadList(reloadList: Function): void;
}
interface IState {
  listOrder: Array<IOrder>;
  searchKeyWord: string;
  selectTypeOrder: string;
}
export default class ListOrders extends Component<IProps, IState> {
  static contextType = AppContext;
  OR: OrdersResource | null = null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      listOrder: [],
      searchKeyWord: '',
      selectTypeOrder: 'sin entrega',
    };
    this.props.reloadList(() => {
      this.getList(this.state.searchKeyWord);
    });
    this.OR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.OR = new OrdersResource(token);
    this.getList();
  }
  getList = async (kw?: string, typoOrder?: string | undefined) => {
    if (this.OR !== null) {
      var queryObject: any = {};
      if (kw) {
        const res: Array<string> | false = await new ClientsResource(
          this.context.userAuth.token,
        )
          .list({
            $or: [
              {
                regularclient: {
                  $eq: true,
                },
                first_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              },
              {
                regularclient: {
                  $eq: true,
                },
                last_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              },
            ],
          })
          .then(resp => resp.map(c => c._id))
          .catch(err => {
            console.log(err);
            return false;
          });
        if (res) {
          queryObject = {
            ...queryObject,
            client_id: {
              $in: res,
            },
          };
        }
      }
      if (!typoOrder) {
        if (this.state.selectTypeOrder !== 'todos') {
          queryObject = {
            ...queryObject,
            estado_pedido: {
              $eq: this.state.selectTypeOrder,
            },
          };
        }
      } else {
        if (typoOrder !== 'todos') {
          queryObject = {
            estado_pedido: {
              $eq: typoOrder,
            },
          };
        }
      }
      if (kw) {
        queryObject = {...queryObject};
      }
      this.OR.list(queryObject)
        .then((resp: Array<IOrder>) => {
          this.setState({
            listOrder: resp,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  onChangeSearchKeyword(change: string) {
    this.setState({searchKeyWord: change});
    this.getList(change, undefined);
  }
  listItem(item: IOrder) {
    return (
      <List.Item
        title={'orden de entrega'}
        onPress={() => {
          this.props.onSelectOne(item);
        }}
        right={() => (
          <React.Fragment>
            <Text>{`estado ${item.estado_pedido}`}</Text>
          </React.Fragment>
        )}
      />
    );
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <View style={styles.container}>
          <View>
            <Grid>
              <Row>
                <Col size={50}>
                  <Row>
                    <Col>
                      <Text>{'Ordenes'}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {this.state && (
                        <Searchbar
                          placeholder="Buscar"
                          value={this.state.searchKeyWord}
                          onChangeText={msn => {
                            this.onChangeSearchKeyword(msn);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col size={50}>
                  <RadioButton.Group
                    value={this.state.selectTypeOrder}
                    onValueChange={newVal => {
                      this.setState({
                        selectTypeOrder: newVal,
                      });
                      this.getList(this.state.searchKeyWord, newVal);
                    }}>
                    <RadioButton.Item value={'todos'} label={'Todos'} />
                    <RadioButton.Item
                      value={'sin entrega'}
                      label={'No entregados'}
                    />
                    <RadioButton.Item
                      value={'entregado'}
                      label={'Entregados'}
                    />
                  </RadioButton.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Divider />
                </Col>
              </Row>
              <Row>
                <Col>
                  <View>
                    <FlatList
                      data={this.state.listOrder}
                      renderItem={({item}) => this.listItem(item)}
                      keyExtractor={item => item._id}
                    />
                  </View>
                </Col>
              </Row>
            </Grid>
          </View>
          <FAB
            style={styles.fab}
            small={false}
            icon="plus"
            onPress={() => {
              this.props.onPressNewOrder();
            }}
          />
          <FAB
            style={styles.fab2}
            small={false}
            icon="repeat"
            onPress={() => {
              this.getList(this.state.searchKeyWord, undefined);
            }}
          />
        </View>
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
  fab2: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
  },
});
