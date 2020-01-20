import axios from "axios";
import CONST from "../consts";


export const getLoginPackage = (lang,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'loginPackage',
            method      : 'POST',
            data        : { lang },
            headers     : { Authorization: token },
        }).then(response => {
            dispatch({type: 'getLoginPackage', payload: response.data});
        });
    }
};
export const bookLoginPackage = (lang, id , user_id , props , token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'bookLoginPackage',
            method      : 'POST',
            data        : { lang , id , user_id},
            headers     : { Authorization: token },
        }).then(response => {
            dispatch({type: 'bookLoginPackage', payload: response.data});
            if (response.data.key == 1){
                props.navigation.navigate('drawerNavigator')
            }
        });
    }
};
