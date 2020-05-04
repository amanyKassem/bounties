import React, { Component } from "react";
import {Image, Text} from "react-native";
import i18n from '../../locale/i18n'
import styles from "../../assets/style";

class ShareApp extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    static navigationOptions = () => ({
        header          : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('shareApp') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/connections.png')} resizeMode={'contain'}/>)
        });

    render() {
        return false
    }
}

export default ShareApp;
