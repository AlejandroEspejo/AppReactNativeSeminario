import React, {Component} from 'react';
import AppContext from '../../context/AppContext';
import {NavigationContainer} from '@react-navigation/native';
import RegularClients from './RegularClients';
import PotentialClients from './PotentialClients';
import BusinessSchedule from './BusinessSchedule';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
export default class Clients extends Component<any, any> {
  test: any;
  static contextType = AppContext;
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <Tab.Navigator lazy>
          <Tab.Screen name="Clientes Regulres" component={RegularClients} />
          <Tab.Screen
            name="Clientes Potenciales"
            component={PotentialClients}
          />
          <Tab.Screen name="Agenda Negociación" component={BusinessSchedule} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
