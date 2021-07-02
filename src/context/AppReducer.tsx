import {Types} from "./ContantTypes";
export interface ActionType {
    type: string,
    payload: any
}
export default (state: any, action: ActionType) => {
    switch (action.type) {
        case Types.SETSERVERERRORMSN: {
            return {
                ...state,
                serverErrorMessages: action.payload
            }
        }
        case Types.SETAUTHUSER: {
            return {
                ...state,
                userAuth: action.payload
            }
        }
        case Types.LOADUSERS: {
            return {
                ...state,
                listusers: action.payload
            }
        }
        case Types.PHOTOLOADAVATAR: {
            return {
                ...state,
                isLoadAvatar: action.payload
            }
        }
        case Types.CHANGEITEMUSER: {
            return {
                ...state,
                itemuser: action.payload
            }
        }
        case Types.CHANGEURI: {
            return {
                ...state,
                uriphoto: action.payload
            }
        }
        case Types.SEARCHBARVISIBLE: {
            return {
                ...state,
                searchbarVisible: action.payload
            }
        }
        default: {
            return state;
        }
    }
}