import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {List, Searchbar} from 'react-native-paper';
import ProductsResource, {IProduct} from '../../../resources/ProductsResource';
import {API_HOST} from '../../../utils/config';
import AppContext from '../../../context/AppContext';

export interface IProps {
  onSelectOne(product: IProduct): void;
  token: string;
}

export interface IState {
  listProducts: Array<IProduct>;
  searchKW: string;
}

export default class ListProducts extends Component<IProps, IState> {
  static contextType = AppContext;
  PR?: ProductsResource;
  constructor(props: IProps) {
    super(props);
    this.state = {
      listProducts: [],
      searchKW: '',
    };
  }
  componentDidMount() {
    this.PR = new ProductsResource(this.props.token);
    this.getList('');
    this.checkProducts();
  }
  getList(kw: string) {
    if (this.PR) {
      this.PR.list({
        nombre: {
          $regex: '.*' + kw + '.*',
          $options: 'i',
        },
      })
        .then((resp: Array<IProduct>) => {
          this.setState({
            listProducts: resp,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  createProducts() {
    var listP: Array<IProduct> = [
      {
        _id: '60e72c32579050001a76537e',
        nombre: 'Coca Cola 2L',
        precio: 10,
        cantidad: 500,
        uri_photo: '/api/getproductphoto/60e72c32579050001a76537e',
        path_photo: '/opt/app/productPhoto/cocacola2l.jpeg',
      },
      {
        _id: '60e34c37659050001a76537e',
        nombre: 'Coca Cola 3L',
        precio: 13,
        cantidad: 500,
        uri_photo: '/api/getproductphoto/60e34c37659050001a76537e',
        path_photo: '/opt/app/productPhoto/cocacola3l.jpeg',
      },
      {
        _id: '60e33c37658760001a87598e',
        nombre: 'vino',
        precio: 27,
        cantidad: 500,
        uri_photo: '/api/getproductphoto/60e33c37658760001a87598e',
        path_photo: '/opt/app/productPhoto/vino.jpeg',
      },
      {
        _id: '60e33c37654567001a87658e',
        nombre: 'casa real',
        precio: 25,
        cantidad: 500,
        uri_photo: '/api/getproductphoto/60e33c37654567001a87658e',
        path_photo: '/opt/app/productPhoto/casareal.jpeg',
      },
    ];
    listP.forEach(np => {
      if (this.PR) {
        this.PR.store(np)
          .then(() => {
            this.getList('');
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }
  checkProducts() {
    if (this.PR) {
      this.PR.list()
        .then(resp => {
          if (resp.length == 0) {
            this.createProducts();
          }
        })
        .catch(err => console.log(err));
    }
  }
  renderListItem = (item: IProduct) => {
    return (
      <List.Item
        title={item.nombre}
        description={`Disponibles: ${item.cantidad}`}
        right={() => (
          <Image
            style={styles.image}
            source={{uri: API_HOST + item.uri_photo}}
          />
        )}
        onPress={() => {
          this.props.onSelectOne(item);
        }}
      />
    );
  };
  render() {
    return (
      <View>
        <Searchbar
          value={this.state.searchKW}
          onChangeText={txt => {
            this.setState({
              searchKW: txt,
            });
            this.getList(txt);
          }}
        />
        <FlatList
          data={this.state.listProducts}
          renderItem={({item}) => this.renderListItem(item)}
          keyExtractor={item => item._id}
          style={styles.flatListContainer}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  flatListContainer: {
    height: 210,
  },
});
