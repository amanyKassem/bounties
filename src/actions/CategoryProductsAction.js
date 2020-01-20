import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import i18n from "../../locale/i18n";

export const categoryProducts = ( lang , category_id , token ) => {

    return (dispatch) => {
        axios({
            url         : CONST.url + 'products/category',
            method      : 'POST',
            data        : { lang , category_id },
            headers     : { Authorization: token },
        }).then(response => {

            dispatch({type: 'categoryProducts', payload: response.data});

            console.log('data here ==', response.data);

            if(response.data.data.length === 0){
                Toast.show({
                    text        : i18n.t('noprod'),
                    type        : "danger",
                    duration    : 3000,
                    textStyle   : {
                        color           : "white",
                        fontFamily      : 'cairo',
                        textAlign       : 'center'
                    }
                });
            }

        });
    }

};


