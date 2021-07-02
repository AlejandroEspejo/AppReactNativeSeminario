import React from "react";
import {View, Image, StyleSheet, ImageBackground} from "react-native";
import {TextInput, Button} from "react-native-paper";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from "./src/firebase"
interface MyState {
      username: String,
      password: String,
      visible: boolean
}
class App extends React.Component<any, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
      visible: true
    }
  }
  onGoogleButtonPress() {
    // Get the users ID token
    return new Promise(async (resolve, reject) => {
      console.log("Login");
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = firebase.getApp().auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      console.log("Check!");
      var result = firebase.getApp().auth().signInWithCredential(googleCredential);
      resolve(result);
    });
    
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '176320771168-71ggh5ibho0baqdgq0h53u9hs21q64ss.apps.googleusercontent.com',
    });
  }
  async loginGoogle() {
    var data = await this.onGoogleButtonPress();
    console.log(data);
  }
  render() {
    return <ImageBackground style={styles.body} source={require("./assets/img/backgroud.png")}>
        <View style={styles.centerObjects}>
          <Image style={styles.logo} source={require("./assets/img/logo.png")}/>
        </View>
        <View style={styles.containerTextfield}>
          <TextInput
            label="Username"
            
            onChangeText={(text) => {
              this.setState({
                username: text
              })
            }}
          />
          <TextInput style={styles.marginTop}
            label="Password"
            secureTextEntry={this.state.visible}
            right={<TextInput.Icon name="eye" onPress={() => {
              this.setState({
                visible: !this.state.visible
              })
            }}/>}
            onChangeText={(text) => {
              this.setState({
                password: text
              })
            }}
          />
          <Button style={styles.marginTop}  mode="contained">
            Login
          </Button>
          <Button icon="google" style={styles.marginTop}  mode="contained" onPress={() => {
            this.loginGoogle();
          }}>
            Login With Google
          </Button>
        </View>
    </ImageBackground>
  }
}
const styles = StyleSheet.create({
  body: {
    flex:1
  },
  logo: {
    width: "60%",
    height: "60%"
  },
  containerTextfield: {
    padding: 10,
  },
  centerObjects: {
    alignItems: "center"
  },
  marginTop: {
    marginTop: 10
  }
});
export default App;