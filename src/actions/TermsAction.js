import axios from "axios";
import CONST from "../consts";


export const getTerms = lang => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'app-terms',
            method      : 'POST',
            data        : { lang },
        }).then(response => {
            dispatch({type: 'getTerms', payload: response.data});
        });
    }
};
export const getAddProductTerms = (lang,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'addProductTerms',
            method      : 'POST',
            data        : { lang },
            headers     : { Authorization: token },
        }).then(response => {
            dispatch({type: 'getAddProductTerms', payload: response.data});
        });
    }
};
