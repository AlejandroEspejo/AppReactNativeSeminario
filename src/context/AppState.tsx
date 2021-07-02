import React, {useReducer} from 'react';
import AppReducer from './AppReducer';
import AppContext from './AppContext';
import {Types} from './ContantTypes';
// Es el conjunto de datos
const DataState = (props: any) => {
  const initialState = {
    searchbarVisible: false,
    uriphoto: '',
    itemuser: {},
    sesionToken: null,
  };
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const changeSearchBarVisible = (value: Boolean) => {
    dispatch({type: Types.SEARCHBARVISIBLE, payload: value});
  };
  const changeUri = (value: string) => {
    dispatch({type: Types.CHANGEURI, payload: value});
  };

  const setToken = (value: string) => {
    dispatch({type: Types.SETTOKEN, payload: value});
  };

  return (
    <AppContext.Provider
      value={{
        searchbarVisible: state.searchbarVisible,
        changeSearchBarVisible,
        uriphoto: state.uriphoto,
        changeUri,
        dispatch,
        setToken,
        itemuser: state.itemuser,
        token: state.sesionToken,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
export default DataState;
