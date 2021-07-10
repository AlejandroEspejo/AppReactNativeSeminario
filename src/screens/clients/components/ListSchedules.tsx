import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import {FAB, List, Searchbar} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import SchedulesResource, {
  ISchedule,
} from '../../../resources/SchedulesResource';
import {timeDiffCalc} from '../../../utils/DateTimeFunctions';
interface IProps {
  onSelectOne(Schedule: ISchedule): void;
  onPressNewSchedule(): void;
  reloadList(reloadList: Function): void;
}
interface IState {
  listSchedules: Array<ISchedule>;
  searchKeyWord: string;
}
export default class ListSchedules extends Component<IProps, IState> {
  static contextType = AppContext;
  SR: SchedulesResource | null = null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      listSchedules: [],
      searchKeyWord: '',
    };
    this.props.reloadList(() => {
      this.getList(this.state.searchKeyWord);
    });
    this.SR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.SR = new SchedulesResource(token);
    this.getList();
  }
  getList = (kw?: string) => {
    var initialState: any = {
      listSchedules: [],
    };
    if (this.SR !== null) {
      var queryObject: any = {};
      if (kw) {
        queryObject = {
          $or: [
            {
              client: {
                first_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              },
            },
            {
              client: {
                last_name: {$regex: '.*' + kw + '.*', $options: 'i'},
              },
            },
          ],
        };
      }
      this.SR.list(queryObject)
        .then((resp: Array<ISchedule>) => {
          initialState.listSchedules = resp;
          this.setState(initialState);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  onChangeSearchKeyword(change: string) {
    this.setState({searchKeyWord: change});
    this.getList(change);
  }
  listItem(item: ISchedule) {
    return (
      <View style={styles.itemStyle}>
        <List.Item
          title={`${item.client.first_name} ${item.client.last_name}    P. ${item.client.probability_client}%`}
          onPress={() => {
            this.props.onSelectOne(item);
          }}
          right={() => (
            <React.Fragment>
              <Text>{`Dentro de ${timeDiffCalc(
                `${item.date}T${item.time}:00`,
              )}`}</Text>
            </React.Fragment>
          )}
        />
      </View>
    );
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <View style={styles.container}>
          <View>
            {this.state && (
              <Searchbar
                placeholder="Buscar"
                value={this.state.searchKeyWord}
                onChangeText={msn => {
                  this.onChangeSearchKeyword(msn);
                }}
              />
            )}
          </View>
          <View>
            <FlatList
              data={this.state.listSchedules}
              renderItem={({item}) => this.listItem(item)}
              keyExtractor={item => item._id}
            />
          </View>
          <FAB
            style={styles.fab}
            small={false}
            icon="plus"
            onPress={() => {
              this.props.onPressNewSchedule();
            }}
          />
          <FAB
            style={styles.fab2}
            small={false}
            icon="repeat"
            onPress={() => {
              this.getList(this.state.searchKeyWord);
            }}
          />
        </View>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab2: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
  },
  itemStyle: {
    borderColor: '#aaaaaa',
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
  },
});
