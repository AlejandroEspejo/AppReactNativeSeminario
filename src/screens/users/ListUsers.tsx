import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  AppState,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import {Appbar, List, Avatar, FAB, Searchbar} from 'react-native-paper';
import AppContext from '../../context/AppContext';
import {Types} from '../../context/ContantTypes';
import {AppStateStatus} from 'react-native';
export interface IRoles {
  _id: string;
  name: string;
  urn: string;
  method: string;
}
export interface ItemUser {
  _id: string;
  username: string;
  email: string;
  registerdate: string;
  roles: Array<IRoles>;
  pathavatar?: string;
  uriavatar?: string;
}
interface ServerResponse {
  serverResponse: ItemUser;
}

interface MyState {
  dataUsers: Array<ItemUser>;
  completeList: Array<ItemUser>;
  searchKey: string;
  appState: AppStateStatus;
}
interface ItemData {
  item: ItemUser;
}
interface MyProps {
  navigation: StackNavigationProp<any, any>;
}
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
class ListUsers extends Component<MyProps, MyState> {
  static contextType = AppContext;
  constructor(props: any) {
    super(props);
    this.state = {
      dataUsers: [],
      searchKey: '',
      completeList: [],
      appState: AppState.currentState,
    };
  }
  async componentDidMount() {
    /*console.log(this.context);
    var result: Array<ItemUser> = await axios.get<ServerResponse>("http://192.168.100.223:8000/api/users").then((item) => {
      return item.data.serverResponse
    });*/
    var {loadMainListUsers} = this.context;
    await loadMainListUsers();
    var {listusers} = this.context;
    this.setState({
      dataUsers: listusers,
      completeList: listusers,
    });
    AppState.addEventListener('change', stateapp => {
      this.handleAppStateChange(stateapp);
    });
  }
  async handleAppStateChange(nextAppState: AppStateStatus) {
    console.log(nextAppState);
    if (
      nextAppState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('APP COME NEW ');
      /*this.setState({appState: nextAppState});
      console.log("ENTER")
      var {loadMainListUsers} = this.context;
      await loadMainListUsers();
      var {listusers} = this.context;
      this.setState({ 
        dataUsers: listusers,
        completeList: listusers,
      });*/
    }
  }
  listItem(item: ItemUser) {
    const {dispatch} = this.context;
    //var item : ItemUser = params.item
    if (item.uriavatar == null) {
      return (
        <List.Item
          title={item.username}
          description={item.email}
          onPress={() => {
            dispatch({type: Types.CHANGEITEMUSER, payload: item});
            this.props.navigation.navigate('DetailUsers');
          }}
          left={props => <List.Icon {...props} icon="incognito" />}
        />
      );
    } else {
      var uriImg: string = item.uriavatar;
      return (
        <List.Item
          title={item.username}
          description={item.email}
          onPress={() => {
            dispatch({type: Types.CHANGEITEMUSER, payload: item});
            this.props.navigation.navigate('DetailUsers');
          }}
          left={() => <Avatar.Image size={48} source={{uri: uriImg}} />}
        />
      );
    }
  }
  searchList(key: string) {
    this.setState({
      searchKey: key,
    });
    var result: Array<ItemUser> = this.state.completeList.filter(item => {
      var regx = new RegExp(key, 'i');
      if (item.username.match(regx) != null) {
        return true;
      }
      return false;
    });
    if (result.length == 0) {
      // Buscar dentro del servidor
      //Consumir una API. y poder revisar ese resltado en la base de datos
    } else {
      this.setState({
        dataUsers: result,
      });
    }
  }
  reloadContext() {
    console.log('ENTER CONTEXT');
    var {listusers} = this.context;
    this.setState({
      dataUsers: listusers,
      completeList: listusers,
    });
  }
  render() {
    var {searchbarVisible} = this.context;
    return (
      <View style={styles.container}>
        <View>
          {searchbarVisible && (
            <Searchbar
              placeholder="Buscar"
              value={this.state.searchKey}
              onChangeText={msn => {
                this.searchList(msn);
              }}
            />
          )}
        </View>
        <View>
          <FlatList
            data={this.state.dataUsers}
            renderItem={({item}) => this.listItem(item)}
            keyExtractor={item => item._id}
          />
        </View>
        <FAB
          style={styles.fab}
          small={false}
          icon="plus"
          onPress={() => {
            this.props.navigation.navigate('RegisterUsers', {
              reloadContext: () => {
                this.reloadContext();
              },
            });
          }}
        />
      </View>
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
export default ListUsers;
