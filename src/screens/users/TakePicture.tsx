import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {Button} from "react-native-paper";
import {StackNavigationProp} from "@react-navigation/stack";
import AppContext from "../../context/AppContext";
interface IParams {
    onTake: Function
}
interface IRoute{
    params: IParams
}
interface MyProps {
    navigation: StackNavigationProp<any, any>,
    route: IRoute
}
class TakePicture extends PureComponent<MyProps, any> {
   camera: any
  static contextType = AppContext;
  constructor(props: MyProps) {
      super(props)
  }
  async takePicture() {
    const {changeUri} = this.context;
    if (this.camera) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        //console.log(data.uri);
        console.log("Enter here " + data.uri);
        changeUri(data.uri, true);
        //this.props.route.params.onTake(data.uri);
        this.props.navigation.pop();
        //this.props.navigation.navigate("RegisterUsers");
      }
  }
  render() {
    return (
        <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <Button icon="camera" mode="contained" onPress={() => {
              this.takePicture();
          }}>
                Tomar Foto
            </Button>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });
export default TakePicture;