import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import {Text} from 'react-native';

export default class BusinessSchedule extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <Text>Agenda Negocio</Text>
      </NavigationContainer>
    );
  }
}
