import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Clients from "./users/Clients";
import Order from "./Order";
import Reports from "./Reports";
import Icons from "react-native-vector-icons/AntDesign";
import MyColors from "../color/MyColors"

const Tab = createBottomTabNavigator();
class MainApp extends Component {
  render() {
    return (
        <NavigationContainer independent={true}>
          <Tab.Navigator
          screenOptions={({route}) => ({
            
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              switch (route.name) {
                case 'Usuarios': {
                  if (focused) {
                    return <Icons name="smile-circle" size={23} color={MyColors.secondary} />;
                  } else {
                    return <Icons name="smile-circle" size={23} color={MyColors.thirth} />;
                  }
                }
                case 'Pedidos': {
                  if (focused) {
                    return <Icons name="export" size={23} color={MyColors.secondary}/>;
                  } else {
                    return <Icons name="export" size={23} color={MyColors.thirth} />;
                  }
                }
                case 'Reportes': {
                  if (focused) {
                    return (
                      <Icons name="table" size={23} color={MyColors.secondary} />
                    );
                  } else {
                    return (
                      <Icons name="table" size={23} color={MyColors.thirth} />
                    );
                  }
                }
              }
            },
          })}
          >
            <Tab.Screen name="Usuarios" component={Clients} />
            <Tab.Screen name="Pedidos" component={Order} />
            <Tab.Screen name="Reportes" component={Reports} />
          </Tab.Navigator>
        </NavigationContainer>
      )
  }
}
export default MainApp;