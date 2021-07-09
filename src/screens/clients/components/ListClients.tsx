import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View, FlatList, StyleSheet, Image} from 'react-native';
import {Checkbox, FAB, List, Searchbar} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import ClientsResource, {IClient} from '../../../resources/ClientsResource';
import {API_HOST} from '../../../utils/config';
interface IProps {
  onSelectOne(client: IClient): void;
  onPressNewClient(): void;
  type: 'regular' | 'potential';
  reloadList(reloadList: Function): void;
}
interface IState {
  listClient: Array<IClient>;
  searchKeyWord: string;
}
export default class ListClients extends Component<IProps, IState> {
  static contextType = AppContext;
  CR: ClientsResource | null = null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      listClient: [],
      searchKeyWord: '',
    };
    this.props.reloadList(() => {
      this.getList(this.state.searchKeyWord);
    });
    this.CR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.CR = new ClientsResource(token);
    this.getList();
  }
  getList = (kw?: string) => {
    console.log('init query');
    var initialState: any = {
      listClient: [],
    };
    if (this.CR !== null) {
      var queryObject: any = {
        regularclient: {$eq: this.props.type === 'regular' ? true : false},
      };
      if (kw) {
        queryObject = {
          $or: [
            {
              regularclient: {
                $eq: this.props.type === 'regular' ? true : false,
              },
              first_name: {$regex: '.*' + kw + '.*', $options: 'i'},
            },
            {
              regularclient: {
                $eq: this.props.type === 'regular' ? true : false,
              },
              last_name: {$regex: '.*' + kw + '.*', $options: 'i'},
            },
          ],
        };
      }
      this.CR.list(queryObject)
        .then((resp: Array<IClient>) => {
          initialState.listClient = resp;
          console.log('response: ', resp);
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
  listItem(item: IClient) {
    return (
      <List.Item
        title={`${item.first_name} ${item.last_name}`}
        description={
          this.props.type === 'regular'
            ? item.tipocliente
            : `Probabilidad de captar el cliente ${item.probability_client}%`
        }
        onPress={() => {
          this.props.onSelectOne(item);
        }}
        left={props => {
          if (item.uri_photo) {
            return (
              <Image
                style={{width: 48, height: 48}}
                source={{
                  uri: API_HOST + item.uri_photo,
                }}
              />
            );
          } else {
            return <List.Icon {...props} icon={'incognito'} />;
          }
        }}
        right={() => (
          <React.Fragment>
            <Checkbox status={item.in_route ? 'checked' : 'unchecked'} />
            <Text>{'en Ruta'}</Text>
          </React.Fragment>
        )}
      />
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
              data={this.state.listClient}
              renderItem={({item}) => this.listItem(item)}
              keyExtractor={item => item._id}
            />
          </View>
          <FAB
            style={styles.fab}
            small={false}
            icon="plus"
            onPress={() => {
              this.props.onPressNewClient();
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
});
