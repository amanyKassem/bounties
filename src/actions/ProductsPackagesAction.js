import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";
import i18n from "../../locale/i18n";


export const getProductsPackages = (lang, token) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'productsPackages',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang}
        }).then(response => {

            dispatch({type: 'getProductsPackages', payload: response.data});

        })

    }
};
export const bookPackage = (lang, id , product_id , token , props) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'bookPackage',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang , id , product_id }
        }).then(response => {
            dispatch({type: 'getBookPackage', payload: response.data});
            if (response.data.key == 1){
                props.navigation.navigate('ConfirmPayment')
            }
            else if (response.data.key == 2) {
                Toast.show({
                    text: response.data.msg,
                    type: "danger",
                    duration: 3000,
                    textStyle: {
                        color: "white",
                        fontFamily: 'cairo',
                        textAlign: 'center',
                    }
                });
                props.navigation.navigate('subscriptionsPackages',{product_id : product_id})

            }
        })

    }
};