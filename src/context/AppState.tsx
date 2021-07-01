import React, {useReducer} from "react";
import AppReducer, {ActionType} from "./AppReducer";
import AppContext from "./AppContext";
import {Types} from "./ContantTypes";
import { AsyncStorage } from "react-native";
import {ItemUser} from "../screens/users/ListUsers"
import axios from "axios";
// Es el conjunto de datos
interface ServerResponse {
    serverResponse:Array<ItemUser>
  }
const DataState = (props: any) => {
    const initialState = {
        searchbarVisible: false,
        uriphoto: "",
        itemuser: {},
        isLoadAvatar: false,
        listusers: []
    }
    const [state, dispatch] = useReducer(AppReducer, initialState);
    const changeSearchBarVisible = (value: Boolean) => {
        dispatch({type: Types.SEARCHBARVISIBLE, payload: value});
    }
    const changeUri = (value: string, isInThePhone: Boolean) => {
        dispatch({type: Types.PHOTOLOADAVATAR, payload: isInThePhone});
        dispatch({type: Types.CHANGEURI, payload: value});
    }

    const loadMainListUsers = async() => {
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYzFhMzA2ZDdkNDEyMDA2M2VkZmU1ZCIsImVtYWlsIjoiZGl0bWFyQGdtYWlsLmNvbSIsImlhdCI6MTYyNDU2NjE4Nn0.oygPF1mZUifNyZfP3MX1i-T470c6V91wjtcvdwn-RWI"
        var result: Array<ItemUser> = await axios.get<ServerResponse>("http://192.168.0.106:8000/api/users", {
            headers: {
                "Authorization": token
            }
        }).then((item) => {
          return item.data.serverResponse
        });
        dispatch({type: Types.LOADUSERS, payload: result});
    }
    const setListusers = (list: Array<any>) => {
        dispatch({type: Types.LOADUSERS, payload: list});
    }
    
    return (
        <AppContext.Provider value={{
        searchbarVisible: state.searchbarVisible, 
        changeSearchBarVisible, 
        uriphoto: state.uriphoto, 
        changeUri,
        isLoadAvatar: state.isLoadAvatar,
        dispatch,
        loadMainListUsers,
        setListusers,
        listusers: state.listusers,
        itemuser: state.itemuser}}>
            {props.children}
        </AppContext.Provider>
    )
}
export default DataState;
