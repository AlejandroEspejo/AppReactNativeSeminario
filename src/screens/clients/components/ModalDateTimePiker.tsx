import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
interface IProps {
  btnName: string;
  dvDate?: string;
  dvTime?: string;
  onChange(date: string, time: string): void;
}

interface IState {
  showModal: boolean;
  date: Date;
}

export default class ModalDateTimePiker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showModal: false,
      date:
        props.dvDate && props.dvTime
          ? new Date(`${props.dvDate}T${props.dvTime}:00`)
          : new Date(),
    };
  }
  render() {
    return (
      <View>
        <DateTimePickerModal
          isVisible={this.state.showModal}
          mode="datetime"
          date={this.state.date}
          onConfirm={date => {
            const stDate: string = `${date.getFullYear()}-${
              date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1
            }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
            const stTime: string = `${
              date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            }:${
              date.getMinutes() < 10
                ? '0' + date.getMinutes()
                : date.getMinutes()
            }`;
            this.props.onChange(stDate, stTime);
            this.setState({
              showModal: false,
            });
          }}
          onCancel={() => {
            this.setState({
              showModal: false,
            });
          }}
        />
        <Button
          mode="contained"
          onPress={() => {
            this.setState({
              showModal: true,
            });
          }}>
          {this.props.btnName}
        </Button>
      </View>
    );
  }
}
