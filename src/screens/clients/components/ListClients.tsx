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
    this.CR = null;
  }
  componentDidUpdate() {
    this.getList();
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.CR = new ClientsResource(token);
    this.getList();
  }
  getList() {
    var initialState: IState = {
      listClient: [],
      searchKeyWord: '',
    };
    if (this.CR !== null) {
      this.CR.list()
        .then((resp: Array<IClient>) => {
          initialState.listClient = resp;
          this.setState(initialState);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  onChangeSearchKeyword(change: string) {
    this.setState({...this.state, searchKeyWord: change});
    // reload list
  }
  listItem(item: IClient) {
    return (
      <List.Item
        title={`${item.first_name} ${item.last_name}`}
        description={item.tipocliente}
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
});
