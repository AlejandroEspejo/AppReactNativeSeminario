import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, Text, Modal, Portal, RadioButton} from 'react-native-paper';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {IClient} from '../../../resources/ClientsResource';
import {API_HOST} from '../../../utils/config';
export interface IProps {
  client?: IClient;
  onRegister(motivo: string): void;
}
export interface IState {
  motivo: string;
  visible: boolean;
}

export default class ModalSinPedido extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      motivo: 'No tiene efectivo para compra',
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
          Sin Pedido
        </Button>
        <Portal>
          <Modal visible={this.state.visible}>
            {this.props.client && (
              <View style={styles.containerSinPedido}>
                <Grid>
                  <Row>
                    <Col size={40}>
                      <Image
                        style={styles.imageStyle}
                        source={{uri: API_HOST + this.props.client.uri_photo}}
                      />
                    </Col>
                    <Col size={60}>
                      <Text
                        style={
                          styles.txtStyles
                        }>{`Contacto: ${this.props.client.telf}`}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerCenter}>
                        <Text style={styles.txtName}>
                          {`${this.props.client.first_name} ${this.props.client.last_name}`}
                        </Text>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerCenter}>
                        <Text style={styles.txtStyles}>
                          {'Motivos por que no realizo un pedido'}
                        </Text>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <View style={styles.containerMotivo}>
                        <RadioButton.Group
                          value={this.state.motivo}
                          onValueChange={newVal => {
                            this.setState({
                              motivo: newVal,
                            });
                          }}>
                          <RadioButton.Item
                            value={'Tiene Stock'}
                            label={'Tiene Stock'}
                          />
                          <RadioButton.Item
                            value={'No tiene efectivo para compra'}
                            label={'No tiene efectivo para compra'}
                          />
                          <RadioButton.Item value={'Otro'} label={'Otro'} />
                        </RadioButton.Group>
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        mode="contained"
                        onPress={() => {
                          this.props.onRegister(this.state.motivo);
                        }}>
                        Registrar
                      </Button>
                    </Col>
                  </Row>
                </Grid>
              </View>
            )}
            {!this.props.client && (
              <View style={styles.containerNoClient}>
                <View style={styles.containerCenter}>
                  <Text style={styles.txtStyles}>
                    {'Seleccione un cliente!!!'}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => {
                    this.setState({
                      visible: false,
                    });
                  }}>
                  Cancelar
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageStyle: {width: 130, height: 130},
  txtName: {
    fontSize: 24,
  },
  txtStyles: {
    marginTop: 10,
    fontSize: 18,
  },
  containerMotivo: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#aaaaaa',
    borderWidth: 3,
    borderRadius: 5,
  },
  containerCenter: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerNoClient: {
    backgroundColor: '#ffffff',
    height: 100,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  containerSinPedido: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    margin: 10,
    padding: 10,
    height: 500,
  },
});
