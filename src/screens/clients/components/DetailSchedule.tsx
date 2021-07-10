import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import {Col, Row, Grid} from 'react-native-paper-grid';
import {Image, Text, View, StyleSheet, ScrollView} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import AppContex from '../../../context/AppContext';
import {ISchedule} from '../../../resources/SchedulesResource';

export interface IProps {
  schedule?: ISchedule;
  onEdit(schedule: ISchedule): void;
  notifyOnChangeSchedule(callback: Function): void;
}

export interface IState {
  schedule?: ISchedule;
}
export default class DetailSchedule extends Component<IProps, IState> {
  static contextType = AppContex;
  constructor(props: IProps) {
    super(props);
    this.state = {schedule: props.schedule};
    this.props.notifyOnChangeSchedule(this.changeStateScheduleValue);
  }
  changeStateScheduleValue = (schedule: ISchedule) => {
    this.setState({
      schedule: schedule,
    });
  };
  render() {
    if (!this.state.schedule) {
      return <Text>{'No existe un cliente seleccionado'}</Text>;
    } else {
      return (
        <NavigationContainer independent={true}>
          <ScrollView>
            <Grid>
              <Row>
                <Col>
                  <Text>{'View detalle Schedule'}</Text>
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
