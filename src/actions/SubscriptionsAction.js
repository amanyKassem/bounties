import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";
import i18n from "../../locale/i18n";


export const getSubscriptions = (lang, token) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'Subscriptions',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang }
        }).then(response => {

            dispatch({type: 'getSubscriptions', payload: response.data});

        })

    }
};