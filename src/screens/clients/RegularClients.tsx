import {NavigationContainer} from '@react-navigation/native';
//import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Text} from 'react-native';
//var Stack = createStackNavigator();
export default class RegularClients extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <Text>Regular client</Text>
      </NavigationContainer>
    );
  }
}
