import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {Image, Text, View, StyleSheet, ScrollView, Linking} from 'react-native';
import {API_HOST} from '../../../utils/config';
import {Button, Switch} from 'react-native-paper';
import AppContex from '../../../context/AppContext';
import OrdersResource, {IOrder} from '../../../resources/OrdersResource';
import SchedulesResource, {
  ISchedule,
} from '../../../resources/SchedulesResource';
import {timeDiffCalc} from '../../../utils/DateTimeFunctions';

export interface IProps {
  client?: IClient;
  onEdit(client: IClient): void;
  notifyOnChangeClient(callback: Function): void;
}

export interface IState {
  client?: IClient;
  listOrders: Array<IOrder>;
  listSchedules: Array<ISchedule>;
}

export default class DetailClient extends Component<IProps, IState> {
  static contextType = AppContex;
  constructor(props: IProps) {
    super(props);
    this.state = {client: props.client, listOrders: [], listSchedules: []};
    this.props.notifyOnChangeClient(this.changeStateClientValue);
  }
  changeStateClientValue = (client: IClient) => {
    this.setState({
      client: client,
    });
  };
  componentDidMount() {
    if (this.props.client) {
      const {token} = this.context.userAuth;
      if (this.props.client.regularclient) {
        const OR = new OrdersResource(token);
        OR.list(
          {
            client_id: {
              $eq: this.props.client._id,
            },
          },
          {
            sort: {
              fecha_pedido: -1,
            },
            limit: 5,
          },
        )
          .then(resp => {
            this.setState({
              listOrders: resp,
            });
          })
          .catch(err => console.log(err));
      } else {
        const SR = new SchedulesResource(token);
        SR.list(
          {
            client_id: {
              $eq: this.props.client._id,
            },
            finished: {
              $eq: false,
            },
          },
          {
            sort: {
              registerdate: -1,
            },
            limit: 1,
          },
        )
          .then(resp => {
            this.setState({
              listSchedules: resp,
            });
          })
          .catch(err => console.log(err));
      }
    }
  }
  onClicEnRuta() {
    const CR = new ClientsResource(this.context.userAuth.token);
    if (this.state.client) {
      var newValue: boolean = !this.state.client.in_route;
      CR.update(this.state.client?._id, {
        in_route: newValue,
      })
        .then((client: IClient) => {
          this.setState({
            client: {
              ...client,
              in_route: newValue,
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  renderComplementElement = () => {
    if (this.props.client) {
      if (this.props.client.regularclient) {
        return (
          <View>
            <Text style={styles.txtStyles}>{'Ultimas ordenes:'}</Text>
            {this.state.listOrders.map(e => {
              return (
                <Row key={e._id}>
                  <Col>
                    <Text>{'orden de entrega'}</Text>
                  </Col>
                  <Col>
                    <View style={styles.viewContainerRight}>
                      <Text>{timeDiffCalc(e.fecha_pedido)}</Text>
                    </View>
                  </Col>
                </Row>
              );
            })}
          </View>
        );
      } else {
        return (
          <View>
            <Text style={styles.txtStyles}>
              {'Agendas de negociacion para este usuario:'}
            </Text>
            {this.state.listSchedules.map(e => {
              return (
                <Row key={e._id}>
                  <Col>
                    <Text>{`Reunion agendada para el ${e.date} a las ${e.time}`}</Text>
                  </Col>
                </Row>
              );
            })}
          </View>
        );
      }
    }
    return <Text>{'No Data'}</Text>;
  };
  render() {
    if (!this.state.client) {
      return <Text>{'No existe un cliente seleccionado'}</Text>;
    } else {
      return (
        <NavigationContainer independent={true}>
          <ScrollView>
            <Grid>
              <Row>
                <Col size={40}>
                  <View style={styles.viewContainterCenter}>
                    <Image
                      style={styles.image}
                      source={{uri: API_HOST + this.state.client.uri_photo}}
                    />
                  </View>
                </Col>
                <Col size={60}>
                  <Row>
                    <Col size={40}>
                      <Text>{'Contacto:'}</Text>
                    </Col>
                    <Col size={60}>
                      <Text>{this.state.client.telf}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size={40}>
                      <Text>{'Email:'}</Text>
                    </Col>
                    <Col size={60}>
                      <Text>{this.state.client.email}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.viewContainterCenter}>
                        <Button
                          icon="cellphone-basic"
                          mode="contained"
                          onPress={() => {
                            console.log('press Llamar');
                            if (this.state.client) {
                              Linking.openURL(`tel:${this.state.client.telf}`);
                            } else {
                              console.log('no tienen numero');
                            }
                          }}>
                          LLAMAR
                        </Button>
                      </View>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {!this.state.client.regularclient && (
                <Row>
                  <Col>
                    <Text>
                      {`Probabilidad de captar cliente:   ${this.state.client.probability_client}%`}
                    </Text>
                  </Col>
                </Row>
              )}
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
              <Row>
                <Col>
                  <Text>{'Dirección: '}</Text>
                  <View style={styles.mapContainer}>
                    <Text>{'MAPA'}</Text>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text>{'En Ruta'}</Text>
                </Col>
                <Col>
                  <View style={styles.viewContainerRight}>
                    <Switch
                      value={this.state.client.in_route}
                      onValueChange={() => {
                        this.onClicEnRuta();
                      }}
                    />
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ScrollView style={styles.childContainerStyle}>
                    {this.renderComplementElement()}
                  </ScrollView>
                </Col>
              </Row>
              <Row>
                <Col>
                  <View style={styles.viewContainterCenter}>
                    <Button
                      icon="file-document-edit"
                      mode="contained"
                      onPress={() => {
                        if (this.state.client) {
                          this.props.onEdit(this.state.client);
                        }
                      }}>
                      EDITAR
                    </Button>
                  </View>
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
