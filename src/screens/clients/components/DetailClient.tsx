import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {Image, Text, View, StyleSheet, ScrollView, Linking} from 'react-native';
import {API_HOST} from '../../../utils/config';
import {Button, Switch} from 'react-native-paper';
import AppContex from '../../../context/AppContext';

export interface IProps {
  client?: IClient;
  onEdit(client: IClient): void;
  ChildrenComponent(client: IClient): Element;
  notifyOnChangeClient(callback: Function): void;
}

export interface IState {
  client?: IClient;
}
export default class DetailClient extends Component<IProps, IState> {
  static contextType = AppContex;
  constructor(props: IProps) {
    super(props);
    this.state = {client: props.client};
    this.props.notifyOnChangeClient(this.changeStateClientValue);
  }
  changeStateClientValue = (client: IClient) => {
    this.setState({
      client: client,
    });
  };
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
  onClicConvertToRegularClient() {
    const CR = new ClientsResource(this.context.userAuth.token);
    if (this.state.client) {
      var newValue: boolean = !this.state.client.regularclient;
      CR.update(this.state.client?._id, {
        regularclient: newValue,
      })
        .then((client: IClient) => {
          this.setState({
            client: {
              ...client,
              regularclient: newValue,
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
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
                    {this.props.ChildrenComponent(this.state.client)}
                  </ScrollView>
                </Col>
              </Row>
              {!this.state.client.regularclient && (
                <Row>
                  <Col>
                    <View style={styles.viewContainterCenter}>
                      <Button
                        icon="repeat"
                        mode="contained"
                        onPress={() => {
                          this.onClicConvertToRegularClient();
                        }}>
                        CONVERTIR A CLIENTE REGULAR
                      </Button>
                    </View>
                  </Col>
                </Row>
              )}
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
