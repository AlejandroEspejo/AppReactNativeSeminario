import React, { Component } from "react";
import {View, Text, StyleSheet} from "react-native"; 
import {TextInput, Button, Avatar} from "react-native-paper";
import {StackNavigationProp} from "@react-navigation/stack";
import axios, { AxiosResponse } from "axios";
import AppContext from "../../context/AppContext";
import { Alert } from "react-native";
interface ItemUser{
    username?: string,
    email?: string,
    password?: string,
    repassword?: string
  }
interface Mystate {
    username: string,
    email: string,
    password: string,
    repassword: string,
    isload: boolean,
    pathImg?: string
}
interface MyProps {
    navigation: StackNavigationProp<any, any>
}
class UpdateUser extends Component<MyProps, Mystate> {
    static contextType = AppContext;
    constructor(props: any) {
        super(props);
        this.state = {
            isload: false,
            username: "", email: "", password: "", repassword:""
        }
    }
    componentDidMount() {
        var {changeUri} = this.context;
       this.setState(
            {
                username: this.context.itemuser.username,
                email: this.context.itemuser.email,
                
            }
        );
        changeUri(this.context.itemuser.uriavatar, false);
    }
    async checkandSendData() {
        
        var navigation:StackNavigationProp<any, any> = this.props.navigation;
        if (this.state.password != this.state.repassword) {
            return;
        }
        var dataSend = {};
        if (this.state.password == "") {
            dataSend = {
                username: this.state.username,
                email: this.state.email
            };
        } else {
            dataSend = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            };
        }
        
        var result: any = await axios.put<ItemUser, AxiosResponse<any>>("http://192.168.0.106:8000/api/users/" + this.context.itemuser._id, dataSend)
        .then((response) => {
            return response.data;
        });
        if (this.context.isLoadAvatar) {
            var data = new FormData();
            data.append("avatar", {
            name: "avatar.jpg", 
            uri: this.context.uriphoto, 
            type: "image/jpg"});
            console.log("http://192.168.0.106:8000/api/uploadportrait/" + this.context.itemuser._id)
            fetch("http://192.168.0.106:8000/api/uploadportrait/" + this.context.itemuser._id, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: data
            }).then((result) => {
                result.json();
            }).then((result: any) => {
                console.log(result);
                //Alert.alert("Message", result.serverResponse);
                navigation.pop();
            });
        }
        
    }
    onTakePicture(path: string) {
        //console.log(path);
        this.setState({
            pathImg: path,
            isload: true
        })
    }
    showAvatar() {
        if (this.context.uriphoto != "") {
            return <Avatar.Image size={150} source={{uri: this.context.uriphoto}} />
        } else {
            return <Avatar.Image size={150} source={require('../../../assets/img/batman.png')} />
            
        }
    }
  render() {
    return (
        <View style= {styles.container}>
            <TextInput style={styles.txtStyles}
            label="User Name"
            value={this.state.username}
            onChangeText={text => {  
                this.setState({
                    username: text
                })
            }}/>
            <TextInput style={styles.txtStyles}
            label="Email"
            value={this.state.email}
            onChangeText={text => {   
                this.setState({
                    email: text
                })
            }}/>
            <TextInput style={styles.txtStyles}
            label="Password"
            value={this.state.password}
            onChangeText={text => {   
                this.setState({
                    password: text
                })
            }}/>
            <TextInput style={styles.txtStyles}
            label="Re. Password"
            value={this.state.repassword}
            onChangeText={text => {   
                this.setState({
                    repassword: text
                })
            }}/>
            <Button style={styles.txtStyles} icon="camera" mode="contained" onPress={() => {
                //this.checkandSendData();
                this.props.navigation.push("TakePicture", {onTake: (params: string) => {
                    this.onTakePicture(params);
                }});
            }}>
                Tomar Foto
            </Button>
            <View style={styles.avatarView}>
                {this.showAvatar()}
            </View>
            <Button style={styles.txtStyles} icon="gnome" mode="contained" onPress={() => {
                this.checkandSendData();
            }}>
                Actualizar
            </Button>
        </View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    txtStyles: {
        marginTop: 10
    },
    avatarView: {
        alignItems: "center"
    }
}   
);
export default UpdateUser;