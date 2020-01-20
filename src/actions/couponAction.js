import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";

export const getCoupon = (lang , routeName , city_name , provider_id , latitude , longitude , coupon_number , notes , deliverd_time, address , token , props) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'coupon',
            method      : 'POST',
            data        : { lang , provider_id , coupon_number },
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getOrderStore', payload: response.data})
            if (response.data.key == 1){
                props.navigation.navigate('ChoosePayment' ,
                    {
                        routeName,
                        city_name ,
                        latitude,
                        longitude ,
                        provider_id,
                        deliverd_time,
                        notes ,
                        address,
                        coupon_number
                    })
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