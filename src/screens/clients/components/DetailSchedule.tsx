import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {Image, Text, View, StyleSheet, ScrollView, Linking} from 'react-native';
import {Appbar, Button, Modal, Portal, RadioButton} from 'react-native-paper';
import AppContex from '../../../context/AppContext';
import {ISchedule} from '../../../resources/SchedulesResource';
import {timeDiffCalc} from '../../../utils/DateTimeFunctions';
import {API_HOST} from '../../../utils/config';
import ModalDateTimePiker from './ModalDateTimePiker';
import SchedulesResource from '../../../resources/SchedulesResource';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';

export interface IProps {
  schedule?: ISchedule;
  onEdit(schedule: ISchedule): void;
  notifyOnChangeSchedule(callback: Function): void;
}

export interface IState {
  schedule?: ISchedule;
  showModalResult: boolean;
  showModalReprogram: boolean;
  typeModalReprogram: string;
}
export default class DetailSchedule extends Component<IProps, IState> {
  static contextType = AppContex;
  SR: SchedulesResource | undefined;
  CR: ClientsResource | undefined;
  constructor(props: IProps) {
    super(props);
    this.state = {
      schedule: props.schedule,
      showModalReprogram: false,
      showModalResult: false,
      typeModalReprogram: 'date',
    };
    if (this.state.schedule) {
      this.state.schedule.reason = 'Precios';
    }
    this.props.notifyOnChangeSchedule(this.changeStateScheduleValue);
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.SR = new SchedulesResource(token);
    this.CR = new ClientsResource(token);
  }
  changeStateScheduleValue = (schedule: ISchedule) => {
    this.setState({
      schedule: schedule,
    });
  };
  onReprogramMeetSchedule() {
    if (this.SR && this.state.schedule) {
      this.SR.update(this.state.schedule._id, this.state.schedule)
        .then(resp => {
          console.log('meet schedule reprogramed', resp);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  onSaveChanges() {
    if (this.SR && this.state.schedule) {
      this.SR.update(this.state.schedule._id, {
        ...this.state.schedule,
        finished: true,
      })
        .then(resp => {
          console.log('meet schedule reprogramed', resp);
          if (this.state.schedule) {
            this.props.onEdit(this.state.schedule);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  changeClientFromPotentialToRegular() {
    if (this.state.schedule && this.CR) {
      this.CR.update(this.state.schedule.client._id, {
        regularclient: true,
      })
        .then((client: IClient) => {
          console.log('client converted', client);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  render() {
    if (!this.state.schedule) {
      return <Text>{'No existe una reunión seleccionada'}</Text>;
    } else {
      return (
        <NavigationContainer independent={true}>
          <ScrollView>
            <Grid>
              <Row>
                <Col>
                  <Text>{`Reunión ${timeDiffCalc(
                    `${this.state.schedule.date}T${this.state.schedule.time}:00`,
                  )}`}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text
                    style={
                      styles.nameTxt
                    }>{`${this.state.schedule.client.first_name} ${this.state.schedule.client.last_name}`}</Text>
                </Col>
              </Row>
              <Row>
                <Col size={60}>
                  <Row>
                    <Col>
                      <Text>{'Reunión programada para el:'}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Text>{`${this.state.schedule.date} ${this.state.schedule.time}`}</Text>
                    </Col>
                  </Row>
                </Col>
                <Col size={40}>
                  <View style={styles.repoContainerStyles}>
                    <ModalDateTimePiker
                      btnName="Reprogramar"
                      dvDate={this.state.schedule.date}
                      dvTime={this.state.schedule.time}
                      onChange={(date: string, time: string) => {
                        if (this.state.schedule) {
                          this.setState({
                            schedule: {
                              ...this.state.schedule,
                              date: date,
                              time: time,
                            },
                          });
                          this.onReprogramMeetSchedule();
                        }
                      }}
                    />
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text>{'Dirección: '}</Text>
                  <View style={styles.mapContainer}>
                    <Text>{'MAP'}</Text>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col size={40}>
                  <View style={styles.avatarView}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: `${API_HOST}${this.state.schedule.client.uri_photo}`,
                      }}
                    />
                  </View>
                </Col>
                <Col size={60}>
                  <View style={styles.repoContainerStyles}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        if (this.state.schedule?.client.telf) {
                          Linking.openURL(
                            `tel:${this.state.schedule.client.telf}`,
                          );
                        }
                      }}>
                      Llamar
                    </Button>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text>{'Resiltado de la reunión'}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <View style={styles.resultMeet}>
                    <RadioButton.Group
                      onValueChange={(newValue: string) => {
                        if (this.state.schedule) {
                          this.setState({
                            schedule: {
                              ...this.state.schedule,
                              result: newValue === 'true' ? true : false,
                            },
                          });
                          if (newValue === 'false') {
                            this.setState({
                              showModalResult: true,
                            });
                          }
                        }
                      }}
                      value={this.state.schedule.result + ''}>
                      <Row nopad>
                        <Col size={10}>
                          <RadioButton value="true" />
                        </Col>
                        <Col size={90}>
                          <Text style={styles.txtStyles}>Exito</Text>
                        </Col>
                      </Row>
                      <Row nopad>
                        <Col size={10}>
                          <RadioButton value="false" />
                        </Col>
                        <Col size={90}>
                          <Text style={styles.txtStyles}>Sin éxito</Text>
                        </Col>
                      </Row>
                    </RadioButton.Group>
                  </View>
                </Col>
              </Row>
              <Row>
                <Col>
                  <View style={styles.viewContainterCenter}>
                    <Button
                      style={{width: 200, height: 40}}
                      mode="contained"
                      onPress={() => {
                        this.onSaveChanges();
                      }}>
                      GUARDAR
                    </Button>
                  </View>
                </Col>
              </Row>
            </Grid>
          </ScrollView>
          <View>
            <Portal>
              <Modal visible={this.state.showModalResult}>
                <View style={styles.modalContainer}>
                  <Appbar.Header>
                    <Appbar.Content title="Motivos" />
                  </Appbar.Header>
                  <Grid>
                    <Row>
                      <Col>
                        <RadioButton.Group
                          onValueChange={value => {
                            if (this.state.schedule) {
                              this.setState({
                                schedule: {
                                  ...this.state.schedule,
                                  reason: value,
                                },
                              });
                            }
                          }}
                          value={
                            this.state.schedule.reason
                              ? this.state.schedule.reason
                              : 'Precios'
                          }>
                          <RadioButton.Item label="Precios" value="Precios" />
                          <RadioButton.Item
                            label="No se encontraba para la negociación"
                            value="No se encontraba para la negociación"
                          />
                          <RadioButton.Item label="Otro" value="Otro" />
                        </RadioButton.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          mode="contained"
                          onPress={() => {
                            this.setState({
                              showModalResult: false,
                            });
                          }}>
                          Cancelar
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          mode="contained"
                          onPress={() => {
                            this.setState({
                              //guardar motivo seleccionado
                              showModalResult: false,
                            });
                          }}>
                          Aceptar
                        </Button>
                      </Col>
                    </Row>
                  </Grid>
                </View>
              </Modal>
            </Portal>
          </View>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
  },
  nameTxt: {
    marginTop: 10,
    fontSize: 25,
  },
  txtStyles: {
    marginTop: 8,
    width: '100%',
  },
  avatarView: {
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    height: 290,
  },
  mapContainer: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 150,
  },
  repoContainerStyles: {
    height: 60,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  resultMeet: {
    borderColor: '#aaaaaa',
    borderWidth: 2,
    borderRadius: 5,
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
