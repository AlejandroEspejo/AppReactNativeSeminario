import React from 'react';
import AppContext from './src/context/AppContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screens/Login';
import MainApp from './src/screens/MainApp';
import DataState from './src/context/AppState';
import {View} from 'react-native';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);
var Stack = createStackNavigator();
class App extends React.Component {
  static contextType = AppContext;
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <DataState>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen
              name="main"
              component={MainApp}
              options={() => ({header: navigate => <View></View>})}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DataState>
    );
  }
}

export default App;
