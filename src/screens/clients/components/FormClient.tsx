import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Image} from 'react-native';
import {TextInput, Button, Switch, RadioButton} from 'react-native-paper';
import AppContext from '../../../context/AppContext';
import Slider from 'react-native-sliders';
import {Col, Row, Grid} from 'react-native-paper-grid';
// import MapView, {Marker} from 'react-native-maps';
import ClientsResource, {
  IClient,
  INewClient,
} from '../../../resources/ClientsResource';
import TakePhoto from './TakePhoto';
import {NavigationContainer} from '@react-navigation/native';
import {API_HOST} from '../../../utils/config';

interface Mystate {
  newClient: INewClient;
  isload: boolean;
  pathImg?: string;
}
interface MyProps {
  onSaveClient(client: IClient): void;
  clientId?: string;
  values?: IClient;
  isRegularClient?: boolean;
}
class FormClient extends Component<MyProps, Mystate> {
  static contextType = AppContext;
  CR: ClientsResource | null = null;
  constructor(props: MyProps) {
    super(props);
    this.state = {
      isload: false,
      newClient: props.values
        ? props.values
        : {
            first_name: '',
            last_name: '',
            regularclient: props.isRegularClient ? true : false,
          },
    };
    this.CR = null;
  }
  componentDidMount() {
    const {token} = this.context.userAuth;
    this.CR = new ClientsResource(token);
  }
  sendClientPhoto(client: IClient) {
    if (this.CR && this.state.isload) {
      const pathPhoto: string = this.state.pathImg ? this.state.pathImg : '';
      this.CR.sendClientPhoto(client._id, pathPhoto)
        .then(() => {
          console.log('photo saved');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  onPressSaveClient() {
    if (this.checkData() && this.CR) {
      if (!this.props.clientId) {
        this.CR.store(this.state.newClient)
          .then((response: IClient) => {
            console.log('before send photo: ', this.state);
            this.sendClientPhoto(response);
            this.props.onSaveClient(response);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.CR.update(this.props.clientId, this.state.newClient)
          .then((response: IClient) => {
            this.sendClientPhoto({...response, ...this.state.newClient});
            this.props.onSaveClient({...response, ...this.state.newClient});
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
  checkData() {
    //validate data
    return true;
  }
  showAvatar() {
    if (this.state.pathImg) {
      return (
        <Image style={styles.imageStyle} source={{uri: this.state.pathImg}} />
      );
    } else {
      if (this.state.newClient.uri_photo) {
        <Image
          style={styles.imageStyle}
          source={{uri: `${API_HOST}${this.state.newClient.uri_photo}`}}
        />;
      } else {
        return (
          <Image
            style={styles.imageStyle}
            source={require('../../../../assets/img/batman.png')}
          />
        );
      }
    }
  }
  render() {
    return (
      <NavigationContainer independent={true}>
        <ScrollView style={styles.container}>
          <TextInput
            style={styles.txtStyles}
            label="Nombres"
            value={this.state.newClient.first_name}
            onChangeText={text => {
              this.setState({
                newClient: {...this.state.newClient, first_name: text},
              });
            }}
          />
          <TextInput
            style={styles.txtStyles}
            label="Apellidos"
            value={this.state.newClient.last_name}
            onChangeText={text => {
              this.setState({
                newClient: {...this.state.newClient, last_name: text},
              });
            }}
          />
          <TextInput
            style={styles.txtStyles}
            label="Cel. / Telf."
            value={this.state.newClient.telf}
            onChangeText={text => {
              this.setState({
                newClient: {...this.state.newClient, telf: text},
              });
            }}
          />
          <TextInput
            style={styles.txtStyles}
            label="Email"
            value={this.state.newClient.email}
            onChangeText={text => {
              this.setState({
                newClient: {...this.state.newClient, email: text},
              });
            }}
          />
          <Grid>
            <Row>
              <Col size={50}>
                <Text style={{paddingTop: 30, paddingBottom: 20}}>
                  {'Foto de la tienda o cliente'}
                </Text>
                <TakePhoto
                  onTakePhoto={(uri: string) => {
                    this.setState({
                      pathImg: uri,
                      isload: true,
                    });
                  }}
                />
              </Col>
              <Col size={50}>
                <View style={styles.avatarView}>{this.showAvatar()}</View>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>{'En Ruta'}</Text>
              </Col>
              <Col>
                <Switch
                  value={this.state.newClient.in_route}
                  onValueChange={val => {
                    this.setState({
                      newClient: {...this.state.newClient, in_route: val},
                    });
                  }}
                />
              </Col>
            </Row>
            {!this.state.newClient.regularclient && (
              <Row>
                <Col size={70}>
                  <Text>{'Probabilidad de Negociación'}</Text>
                </Col>
                <Col size={30}>
                  <Text>{`${
                    this.state.newClient.probability_client
                      ? this.state.newClient.probability_client
                      : 0
                  }%`}</Text>
                </Col>
              </Row>
            )}
            {!this.state.newClient.regularclient && (
              <Row>
                <Col>
                  <Slider
                    value={
                      this.state.newClient.probability_client
                        ? this.state.newClient.probability_client
                        : 0
                    }
                    minimumValue={0}
                    maximumValue={100}
                    minimumTrackTintColor={'#00ff00'}
                    thumbTouchSize={{width: 40, height: 40}}
                    step={1}
                    onValueChange={(newVal: number[]) => {
                      this.setState({
                        newClient: {
                          ...this.state.newClient,
                          probability_client: newVal[0],
                        },
                      });
                    }}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Text>{'Dirección'}</Text>
                {/* configure Maps
              <MapView
                initialRegion={{
                  latitude: -19.582507,
                  longitude: -65.757287,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  coordinate={{latitude: -19.582507, longitude: -65.757287}}
                  title={'lugar seleccionado'}
                />
              </MapView> */}
              </Col>
            </Row>
            <Row>
              <Col>
                <TextInput
                  style={styles.txtStyles}
                  label="Zona"
                  value={this.state.newClient.zona}
                  onChangeText={text => {
                    this.setState({
                      newClient: {...this.state.newClient, zona: text},
                    });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextInput
                  style={styles.txtStyles}
                  label="Calle"
                  value={this.state.newClient.calle}
                  onChangeText={text => {
                    this.setState({
                      newClient: {...this.state.newClient, calle: text},
                    });
                  }}
                />
              </Col>
            </Row>
            <Row nopad>
              <Col nopad>
                <Text>{'Tipo de Cliente'}</Text>
                <RadioButton.Group
                  onValueChange={(newValue: string) => {
                    this.setState({
                      newClient: {
                        ...this.state.newClient,
                        tipocliente: newValue,
                      },
                    });
                  }}
                  value={
                    this.state.newClient.tipocliente
                      ? this.state.newClient.tipocliente
                      : 'off'
                  }>
                  <Row nopad>
                    <Col size={10}>
                      <RadioButton value="Mayorista" />
                    </Col>
                    <Col size={90}>
                      <Text>MAYORISTA</Text>
                    </Col>
                  </Row>
                  <Row nopad>
                    <Col size={10}>
                      <RadioButton value="Supermercado" />
                    </Col>
                    <Col size={90}>
                      <Text>SUPERMERCADO</Text>
                    </Col>
                  </Row>
                  <Row nopad>
                    <Col size={10}>
                      <RadioButton value="off" />
                    </Col>
                    <Col size={90}>
                      <Text>OFF</Text>
                    </Col>
                  </Row>
                </RadioButton.Group>
              </Col>
            </Row>
            <Row>
              <Col size={100}>
                <Button
                  style={styles.txtStyles}
                  icon="gnome"
                  mode="contained"
                  onPress={() => {
                    this.onPressSaveClient();
                  }}>
                  Guardar
                </Button>
              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  txtStyles: {
    marginTop: 10,
    width: '100%',
  },
  avatarView: {
    alignItems: 'center',
  },
  imageStyle: {width: 150, height: 150},
});
export default FormClient;
