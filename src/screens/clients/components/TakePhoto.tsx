import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button, Modal, Portal} from 'react-native-paper';
interface MyProps {
  onTakePhoto(uri: string): void;
}
interface IState {
  modalVisible: boolean;
}
export default class TakePhoto extends PureComponent<MyProps, IState> {
  camera: any;
  constructor(props: MyProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  async takePicture() {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        modalVisible: false,
      });
      this.props.onTakePhoto(data.uri);
    }
  }
  render() {
    return (
      <View>
        <Portal>
          <Modal
            visible={this.state.modalVisible}
            contentContainerStyle={styles.container}>
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
              onGoogleVisionBarcodesDetected={({barcodes}) => {
                console.log(barcodes);
              }}
            />
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Button
                icon="camera"
                mode="contained"
                onPress={() => {
                  this.takePicture();
                }}>
                Tomar Foto
              </Button>
            </View>
          </Modal>
        </Portal>
        <Button
          icon="camera"
          mode="contained"
          onPress={() => {
            this.setState({
              modalVisible: true,
            });
          }}>
          Tomar Foto
        </Button>
      </View>
    );
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
