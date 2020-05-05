//http://bounties-sa.com/backend/payment_request

import React, { Component } from "react";
import {View, Text, Image, StyleSheet, ActivityIndicator, } from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import {WebView} from "react-native-webview";
import { getAboutApp } from '../actions'
import CONST from "../consts";
import COLORS from "../consts/colors";

class WebViewUser extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
        }
    }


    componentWillMount() {
        this.props.getAboutApp( this.props.lang )
        console.log(CONST.url + 'order_payment_request/'
            + this.props.navigation.state.params.total + '/' +
            this.props.navigation.state.params.provider_id  + '/' +
            this.props.navigation.state.params.lat  + '/' +
            this.props.navigation.state.params.lng  + '/' +
            this.props.navigation.state.params.coupon_number  + '/' +
            this.props.navigation.state.params.notes  + '/' +
            this.props.navigation.state.params.deliverd_time)
    }

    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('payment_way') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/about_app.png')}/>)
    });
    render() {
        return (
            <Container>
                { this.renderLoader() }
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                    <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                        { i18n.t('payment_way') }
                    </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <View style={style.container}>
                    <WebView
                        source= {{uri: CONST.url + 'order_payment_request/'
                                + this.props.navigation.state.params.total + '/' +
                                  this.props.navigation.state.params.user_id  + '/' +
                                  this.props.navigation.state.params.provider_id  + '/' +
                                  this.props.navigation.state.params.lat  + '/' +
                                  this.props.navigation.state.params.lng  + '/' +
                                  this.props.navigation.state.params.coupon_number  + '/' +
                                  this.props.navigation.state.params.notes  + '/' +
                                  this.props.navigation.state.params.deliverd_time
                        }}
                        style= {style.loginWebView}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}

                    />


                </View>
            </Container>

        );
    }
}
const style = StyleSheet.create({
    container: {
        height:'90%',
        width:'100%',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    loginWebView: {
        flex   : 1 ,
        width  : '100%'
    }});
const mapStateToProps = ({ lang, aboutApp }) => {
    return {
        lang        : lang.lang,
        aboutApp    : aboutApp.aboutApp,
        loader      : aboutApp.loader
    };
};
export default connect(mapStateToProps, { getAboutApp })(WebViewUser);