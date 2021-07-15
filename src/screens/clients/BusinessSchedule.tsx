import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Appbar, Text} from 'react-native-paper';
import ListSchedules from './components/ListSchedules';
import {ISchedule} from '../../resources/SchedulesResource';
import FormSchedule from './components/FormSchedule';
import DetailSchedule from './components/DetailSchedule';
var Stack = createStackNavigator();

interface IState {
  selectSchedule?: ISchedule;
  loadList?: Function;
  onChangeDetailScheduleValue?: Function;
}
export default class BusinessSchedule extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  onselectSchedule(schedule: ISchedule | undefined) {
    this.setState({
      selectSchedule: schedule,
    });
  }
  changeState(state: IState) {
    this.setState(state);
  }
  onChangeDetailScheduleValue() {
    if (this.state.onChangeDetailScheduleValue) {
      this.state.onChangeDetailScheduleValue(this.state.selectSchedule);
    }
  }
  renderListSchedule = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <ListSchedules
        onSelectOne={(schedule: ISchedule) => {
          this.onselectSchedule(schedule);
          navigation.navigate('DetailSchedule');
        }}
        onPressNewSchedule={() => {
          navigation.navigate('CreateSchedule');
        }}
        reloadList={(reloadList: Function) => {
          this.setState({
            loadList: reloadList,
          });
        }}
      />
    );
  };
  renderCreateSchedule = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <FormSchedule
        onSaveSchedule={schedule => {
          if (this.state.loadList) {
            this.state.loadList();
          }
          if (this.state.selectSchedule) {
            this.setState({
              selectSchedule: schedule,
            });
            this.onChangeDetailScheduleValue();
          }
          navigation.pop();
        }}
      />
    );
  };
  renderDetailSchedule = (props: any) => {
    const navigation: StackNavigationProp<any, any> = props.navigation;
    return (
      <DetailSchedule
        schedule={this.state.selectSchedule}
        onEdit={(schedule: ISchedule) => {
          //to edit schedule
          this.onselectSchedule(schedule);
          if (this.state.loadList) {
            this.state.loadList();
          }
          navigation.navigate('list');
        }}
        notifyOnChangeSchedule={callback => {
          this.changeState({onChangeDetailScheduleValue: callback});
        }}
      />
    );
  };
  render() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="list"
            component={this.renderListSchedule}
            options={() => {
              return {
                header: () => null,
              };
            }}
          />
          <Stack.Screen
            name="CreateSchedule"
            component={this.renderCreateSchedule}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      this.onselectSchedule(undefined);
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title={'Agenda de negociacion'}
                    subtitle={'busque un cliente'}
                  />
                </Appbar.Header>
              ),
            })}
          />
          <Stack.Screen
            name="DetailSchedule"
            component={this.renderDetailSchedule}
            options={() => ({
              header: navigate => (
                <Appbar.Header>
                  <Appbar.BackAction
                    onPress={() => {
                      this.onselectSchedule(undefined);
                      if (this.state.loadList) {
                        this.state.loadList();
                      }
                      navigate.navigation.pop();
                    }}
                  />
                  <Appbar.Content
                    title="Detalle Agenda"
                    subtitle={'informacion'}
                  />
                </Appbar.Header>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
