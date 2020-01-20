import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";
import i18n from "../../locale/i18n";



export const getBankAcoounts = (lang , token) => {
    return (dispatch) => {
        bankAcoounts(lang, token, dispatch)
    }
};

export const deleteBankAcoounts = (lang , id, token) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'deleteBankAcoounts',
            method      : 'POST',
            data        : {lang , id},
            headers     : {Authorization: token}
        }).then(response => {

            bankAcoounts(lang , token , dispatch);

            Toast.show({
                text        : response.data.msg,
                type        : response.data.key === 1 ? "success" : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'cairo',
                    textAlign   : 'center'
                }
            });

        })
    }
};

const bankAcoounts = (lang , token , dispatch ) => {
    axios({
        url         : CONST.url + 'bankAcoounts',
        method      : 'POST',
        data        : {lang },
        headers     : {Authorization: token}
    }).then(response => {

        dispatch({type:'getBankAcoounts', payload: response.data});

    })
};


export const addBankAcoounts = (bank_name ,account_number, props, lang, token) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'addBankAcoounts',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang , bank_name , account_number}
        }).then(response => {

            dispatch({type: 'addBankAcoounts', payload: response.data});

            if (response.data.key === 1){
                props.navigation.navigate('bankAccounts');
            }

            Toast.show({
                text        	: response.data.msg,
                type			: response.data.key === 1 ? "success" : "danger",
                duration    	: 3000,
                textStyle   	: {
                    color       	: "white",
                    fontFamily  	: 'cairo',
                    textAlign   	: 'center'
                }
            });

        })

    }
};

export const editBankAcoounts = (id , bank_name ,account_number, props, lang, token) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'editBankAcoounts',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang , id , bank_name , account_number}
        }).then(response => {

            dispatch({type: 'addBankAcoounts', payload: response.data});

            if (response.data.key === 1){
                props.navigation.navigate('bankAccounts');
            }

            Toast.show({
                text        	: response.data.msg,
                type			: response.data.key === 1 ? "success" : "danger",
                duration    	: 3000,
                textStyle   	: {
                    color       	: "white",
                    fontFamily  	: 'cairo',
                    textAlign   	: 'center'
                }
            });

        })

    }
};