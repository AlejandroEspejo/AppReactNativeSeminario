import React from "react";
import {View, Image, StyleSheet, ImageBackground, Alert} from "react-native";
import {TextInput, Button} from "react-native-paper";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AppContext from "../context/AppContext"
import { StackNavigationProp } from "@react-navigation/stack";
interface MyState {
      username: String,
      password: String,
      visible: boolean
}
interface MyProps {
    navigation: StackNavigationProp<any, any>
}
export interface IGoogleUser {
  photo: string
  email: string
  familyName?: string
  givenName: string
  name: string
  id: string
}
class Login extends React.Component<MyProps, MyState> {
  static contextType = AppContext;
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
      const { idToken, user } = await GoogleSignin.signIn();
      resolve(user);
    });
    
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '176320771168-71ggh5ibho0baqdgq0h53u9hs21q64ss.apps.googleusercontent.com',
    });
  }
  async loginGoogle() {
    var data: any = await this.onGoogleButtonPress();
    var userdata: IGoogleUser = data;
    console.log(userdata)
    var {loginGoogle, serverErrorMessages} = this.context;
    loginGoogle(userdata, (result: Boolean) => {
        if (result) {
            this.props.navigation.navigate("main");
        } else {
            Alert.alert("Error", serverErrorMessages);
        }
    });
    console.log(userdata);
  }
  render() {
    return <ImageBackground style={styles.body} source={require("../../assets/img/backgroud.png")}>
        <View style={styles.centerObjects}>
          <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
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
export default Login;