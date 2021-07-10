import React, {Component} from 'react';
import {Text, StyleSheet, FlatList, View} from 'react-native';
import {Searchbar, List, Button} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import {Col, Row, Grid} from 'react-native-paper-grid';
import DateTimePicker from '@react-native-community/datetimepicker';
// import MapView, {Marker} from 'react-native-maps';
import SchedulesResource, {
  ISchedule,
} from '../../../resources/SchedulesResource';
import {NavigationContainer} from '@react-navigation/native';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import {timeDiffCalc} from '../../../utils/DateTimeFunctions';

interface Mystate {
  newSchedule: ISchedule;
  searchKeyWord: string;
  clientsFind: Array<IClient>;
  scheduleForClientFind: Array<ISchedule>;
  meetingsAlreadyScheduled: Array<ISchedule>;
  showModal: boolean;
  typeModal: string;
}
interface MyProps {
  onSaveSchedule(schedule: ISchedule): void;
}
class FormSchedule extends Component<MyProps, Mystate> {
  static contextType = AppContext;
  SR: SchedulesResource | null = null;
  CR: ClientsResource | null = null;
  constructor(props: MyProps) {
    super(props);
    this.state = {
      newSchedule: {
        _id: 'undefined',
        client_id: 'undefined',
        client: {
          _id: '',
          first_name: '',
          last_name: '',
        },
        date: '',
        time: '',
        finished: false,
      },
      searchKeyWord: '',
      clientsFind: [],
      scheduleForClientFind: [],
      meetingsAlreadyScheduled: [],
      showModal: false,
      typeModal: 'date',
    };
    this.SR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.SR = new SchedulesResource(token);
    this.CR = new ClientsResource(token);
    this.findClient('');
  }
  findClient(kw: string | undefined) {
    if (this.CR) {
      this.CR.list(
        {
          $or: [
            {first_name: {$regex: '.*' + kw + '.*', $options: 'i'}},
            {first_name: {$regex: '.*' + kw + '.*', $options: 'i'}},
          ],
        },
        {limit: 1},
      )
        .then((response: Array<IClient>) => {
          this.setState({
            clientsFind: response,
            newSchedule: {
              ...this.state.newSchedule,
              client_id: response[0]
                ? response[0]._id
                : this.state.newSchedule.client._id,
              client: response[0] ? response[0] : this.state.newSchedule.client,
            },
          });
          this.findScheduleForClients(response[0]);
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.getLastMeetingsScheduled();
  }
  findScheduleForClients(client: IClient) {
    if (this.SR) {
      this.SR.list(
        {
          client_id: {
            $eq: client._id,
          },
          finished: {
            $eq: false,
          },
        },
        {
          sort: {
            registerdate: -1,
          },
        },
      )
        .then((resp: Array<ISchedule>) => {
          this.setState({
            newSchedule: resp[0]
              ? resp[0]
              : {
                  ...this.state.newSchedule,
                  date: '',
                  time: '',
                },
            scheduleForClientFind: resp,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  getLastMeetingsScheduled() {
    if (this.SR) {
      this.SR.list(
        {
          finished: {
            $eq: false,
          },
        },
        {
          sort: {
            registerdate: -1,
          },
          limit: 5,
        },
      )
        .then((resp: Array<ISchedule>) => {
          this.setState({
            meetingsAlreadyScheduled: resp,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  onChangeSearchKeyword(kw: string) {
    this.setState({
      searchKeyWord: kw,
    });
    this.findClient(kw);
    //refres client
  }
  checkData() {
    //validate data
    return true;
  }
  onPressAgendar() {
    if (this.SR && this.state.newSchedule.client._id) {
      if (this.state.newSchedule._id !== 'undefined') {
        this.SR.update(this.state.newSchedule._id, this.state.newSchedule)
          .then(() => {
            this.findClient(this.state.searchKeyWord);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.SR.store({
          client_id: this.state.newSchedule.client_id,
          client: this.state.newSchedule.client,
          date: this.state.newSchedule.date,
          time: this.state.newSchedule.time,
          finished: false,
        })
          .then(() => {
            this.setState({
              newSchedule: {
                _id: 'undefined',
                client_id: 'undefined',
                client: {
                  _id: '',
                  first_name: '',
                  last_name: '',
                },
                date: '',
                time: '',
                finished: false,
              },
            });
            this.findClient(this.state.searchKeyWord);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
  clientsListItem(item: IClient) {
    return (
      <Row key={item._id}>
        <Col size={60}>
          <Text
            style={
              styles.txtUserName
            }>{`${item.first_name} ${item.last_name}`}</Text>
        </Col>
        <Col size={40}>
          <React.Fragment>
            <Text>{`P. ${item.probability_client}%`}</Text>
            <Text>
              {this.state.scheduleForClientFind[0]
                ? 'en ' +
                  timeDiffCalc(
                    `${this.state.newSchedule.date}T${this.state.newSchedule.time}`,
                  )
                : 'No tiene!'}
            </Text>
          </React.Fragment>
        </Col>
      </Row>
    );
  }
  scheduleListItem(sch: ISchedule) {
    return (
      <List.Item
        title={`${sch.client.first_name} ${sch.client.last_name}   P. ${sch.client.probability_client}%`}
        right={() => (
          <React.Fragment>
            <Text>{`en ${timeDiffCalc(`${sch.date}T${sch.time}:00`)}`}</Text>
          </React.Fragment>
        )}
      />
    );
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <Grid>
          {this.state && (
            <Searchbar
              placeholder="Buscar"
              value={this.state.searchKeyWord}
              onChangeText={msn => {
                this.onChangeSearchKeyword(msn);
              }}
            />
          )}
          {this.state.clientsFind.map((client: IClient) => {
            return this.clientsListItem(client);
          })}
          {this.state.showModal && (
            <DateTimePicker
              value={
                this.state.typeModal === 'date'
                  ? this.state.newSchedule.date
                    ? new Date(this.state.newSchedule.date)
                    : new Date()
                  : new Date(
                      this.state.newSchedule.time
                        ? this.state.newSchedule.time
                        : new Date(),
                    )
              }
              mode={this.state.typeModal}
              is24Hour={true}
              display="default"
              onChange={(e: any, date: any) => {
                if (this.state.typeModal === 'date') {
                  this.setState({
                    newSchedule: {
                      ...this.state.newSchedule,
                      date: `${date.getFullYear()}-${
                        date.getMonth() + 1 < 10
                          ? '0' + (date.getMonth() + 1)
                          : date.getMonth() + 1
                      }-${
                        date.getDate() < 10
                          ? '0' + date.getDate()
                          : date.getDate()
                      }`,
                    },
                    typeModal: 'time',
                  });
                } else {
                  this.setState({
                    newSchedule: {
                      ...this.state.newSchedule,
                      time: `${
                        date.getHours() < 10
                          ? '0' + date.getHours()
                          : date.getHours()
                      }:${
                        date.getMinutes() < 10
                          ? '0' + date.getMinutes()
                          : date.getMinutes()
                      }`,
                    },
                    showModal: false,
                  });
                }
              }}
            />
          )}
          <Row style={styles.dateContent}>
            <Col size={80}>
              <Row>
                <Col size={30}>
                  <Text style={styles.txtUserName}>{'Fecha: '}</Text>
                </Col>
                <Col size={70}>
                  <Text>{this.state.newSchedule.date?.toString()}</Text>
                </Col>
              </Row>
              <Row>
                <Col size={30}>
                  <Text style={styles.txtUserName}>{'Hora: '}</Text>
                </Col>
                <Col size={70}>
                  <Text>{this.state.newSchedule.time}</Text>
                </Col>
              </Row>
            </Col>
            <Col size={20}>
              <View style={styles.containerMiddle}>
                <Button
                  mode="contained"
                  onPress={() => {
                    this.setState({
                      showModal: true,
                    });
                  }}>
                  SET
                </Button>
              </View>
            </Col>
          </Row>
          <View style={styles.meetingAlreadyScheduleContainer}>
            <Text>{'Reuniones Agendadas'}</Text>
            <FlatList
              data={this.state.meetingsAlreadyScheduled}
              renderItem={({item}) => this.scheduleListItem(item)}
              keyExtractor={item => item._id}
            />
          </View>
          <View style={styles.containerCenter}>
            <Button
              icon="content-save"
              mode="contained"
              onPress={() => {
                this.onPressAgendar();
              }}>
              AGENDAR
            </Button>
          </View>
        </Grid>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dateContent: {
    borderColor: '#777777',
    borderRadius: 5,
    borderWidth: 3,
  },
  containerMiddle: {
    height: 70,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  containerCenter: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  meetingAlreadyScheduleContainer: {
    height: 250,
  },
  txtUserName: {
    fontSize: 20,
  },
  txtStyles: {
    marginTop: 10,
    width: '100%',
  },
});
export default FormSchedule;
