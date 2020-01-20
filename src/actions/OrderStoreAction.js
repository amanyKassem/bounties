import axios from "axios";
import CONST from "../consts";

export const getOrderStore = (lang , provider_id , payment_type , lat , lng , coupon_number , notes , deliverd_time, address , token , props) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'orders/store',
            method      : 'POST',
            data        : { lang , provider_id , payment_type , lat , lng , coupon_number , notes , deliverd_time, address },
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getOrderStore', payload: response.data})
            if (response.data.key == 1){
                props.navigation.navigate('ConfirmPayment')
            }
        })

    }
};