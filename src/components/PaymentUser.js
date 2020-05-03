import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, ActivityIndicator, I18nManager} from "react-native";
import {Container, Content, Header, Button, Left, Icon, Body, Title, Right} from 'native-base'
import styles from '../../assets/style'
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {getOrderStore , bookPackage , bookLoginPackage} from '../actions'

class PaymentUser extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentWillMount() {
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
    onFocus(){
        this.componentWillMount();
    }
    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                    <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                        { i18n.t('pay') }
                    </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                    <Content  contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                        <View style={[styles.rowGroup , styles.paddingHorizontal_10, styles.marginVertical_10]}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('WebViewUser' , {
                                routeName               : this.props.navigation.state.params.routeName,
                                provider_id             : this.props.navigation.state.params.provider_id,
                                shipping_price          : this.props.navigation.state.params.shipping_price,
                                address                 : this.props.navigation.state.params.address,
                                lat                     : this.props.navigation.state.params.latitude,
                                lng                     : this.props.navigation.state.params.longitude,
                                deliverd_time           :( this.props.navigation.state.params.deliverd_time)  ?  this.props.navigation.state.params.deliverd_time : null,
                                notes                   : (this.props.navigation.state.params.notes) ? this.props.navigation.state.params.notes : null,
                                coupon_number           : (this.props.navigation.state.params.coupon_number) ? this.props.navigation.state.params.coupon_number : null,
                                product_id              : this.props.navigation.state.params.product_id,
                                id                      : this.props.navigation.state.params.id,
                                user_id                 : this.props.user.id,
                                total                   : this.props.navigation.state.params.total,
                                packageId               : this.props.navigation.state.params.packageId,
                                payment_type            : 0,
                            })} style={[styles.bg_White , styles.Border, styles.Width_100, styles.flexCenter, styles.Radius_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/electronicPay.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#0568b2'}, styles.marginHorizontal_5]}>{i18n.translate('electronicPay')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.rowGroup , styles.paddingHorizontal_10, styles.marginVertical_10]}>
                            <TouchableOpacity onPress={() => {this.store()}} style={[styles.bg_White , styles.Border, styles.Width_100, styles.flexCenter, styles.Radius_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/cash.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#0568b2'}, styles.marginHorizontal_5]}>{i18n.translate('cashPay')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }

    store(){
        this.props.getOrderStore(
            this.props.lang,
            this.props.navigation.state.params.provider_id ,
            1 ,
            this.props.navigation.state.params.latitude ,
            this.props.navigation.state.params.longitude ,
            this.props.navigation.state.params.coupon_number ,
            this.props.navigation.state.params.notes ,
            this.props.navigation.state.params.deliverd_time ,
            this.props.navigation.state.params.address ,
            this.props.user.token,
            this.props,
            this.props.navigation.state.params.total
        )
    }
}

const mapStateToProps = ({ lang,profile }) => {
    return {
        lang        : lang.lang,
        user        : profile.user,
    };
};
export default connect(mapStateToProps, { getOrderStore , bookPackage , bookLoginPackage})(PaymentUser);