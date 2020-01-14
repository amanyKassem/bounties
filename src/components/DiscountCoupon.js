import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground,KeyboardAvoidingView} from "react-native";
import {Container, Content, Form, Item, Input, Toast, Icon, Left, Button, Body, Title, Right, Header} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { activeCode, profile, userLogin } from "../actions";
import Spinner from "react-native-loading-spinner-overlay";
import activationCode from "../reducers/ActivationCodeReducer";
import {DoubleBounce} from "react-native-loader";
import COLORS from "../consts/colors";


class DiscountCoupon extends Component {
    constructor(props){
        super(props);
        this.state = {
            code		        : '',
            spinner             : false,
        }
    }

    componentWillMount() {

        const code  = this.props.navigation.state.params.code;
        alert(code);
        this.setState({ userId: null });

    }

    activeInput(type){

        if (type === 'code' || this.state.code !== ''){
            this.setState({ codeStatus: 1 })
        }

    }

    unActiveInput(type){

        if (type === 'code' && this.state.code === ''){
            this.setState({ codeStatus: 0 })
        }

    }


    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.code.length <= 0) {
            isError     = true;
            msg         = i18n.t('codeNot');
        }

        if (msg !== ''){
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000
            });
        }
        return isError;
    };


    renderSubmit() {
        // if (this.state.code == '') {
        //     return (
        //         <TouchableOpacity
        //             style={[
        //                 styles.bg_darkBlue,
        //                 styles.width_150,
        //                 styles.flexCenter,
        //                 styles.marginVertical_15,
        //                 styles.height_40,
        //                 {
        //                     backgroundColor: '#999'
        //                 }
        //             ]}>
        //             <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
        //                 {i18n.translate('continue')}
        //             </Text>
        //         </TouchableOpacity>
        //     );
        // }

        if (this.state.spinner){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' , marginBottom:20 }]}>
                    <DoubleBounce size={20} color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style={[
                    styles.bg_darkBlue,
                    styles.width_150,
                    styles.flexCenter,
                    styles.marginVertical_15,
                    styles.height_40
                ]}
                onPress={() => this.props.navigation.navigate('ChoosePayment' ,
                    {
                        routeName:'discountCoupon' ,
                        shipping_price          : this.props.navigation.state.params.shipping_price,
                        city_name               : this.props.navigation.state.params.city_name,
                        latitude                : this.props.navigation.state.params.latitude,
                        longitude               : this.props.navigation.state.params.longitude,
                        provider_id             : this.props.navigation.state.params.provider_id,
                        address                 : this.props.navigation.state.params.address,
                    })}>
                <Text style={[styles.textRegular , styles.textSize_14, styles.text_White]}>
                    {i18n.translate('continue')}
                </Text>
            </TouchableOpacity>
        );
    }



    onFocus(){
        this.componentWillMount();
    }

    render() {
        console.log('this.props.navigation.state.params.shipping_price' , this.props.navigation.state.params.shipping_price)

        return (

            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title
                            style={[styles.textRegular, styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            {i18n.t('discountCoupon')}
                        </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={require('../../assets/images/background.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth}>
                        <View style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.SelfCenter, styles.Width_100]}>
                            <Text
                                style={[styles.textRegular, styles.text_black, styles.textSize_16 , styles.SelfCenter , {marginTop:150}]}>
                                {i18n.t('enterCoupon')}
                            </Text>
                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                <Form style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                    <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter ]}>
                                        <Item floatingLabel style={[ styles.item, styles.position_R, styles.overHidden ]}>
                                            <Input
                                                placeholder             = {i18n.t('discountCoupon')}
                                                style                   = {[ styles.input , styles.height_50 , (this.state.codeStatus === 1 ? styles.Active : styles.noActive )]}
                                                onChangeText            = {(code) => this.setState({code})}
                                                onBlur                  = {() => this.unActiveInput('code')}
                                                onFocus                 = {() => this.activeInput('code')}
                                                keyboardType            = {'number-pad'}
                                            />
                                        </Item>
                                        <View style = {[ styles.position_A , styles.bg_White, styles.flexCenter, styles.iconInput,  (this.state.codeStatus === 1 ? styles.left_0 : styles.leftHidLeft )]}>
                                            <Icon style = {[styles.text_fyrozy, styles.textSize_22]} type="MaterialCommunityIcons" name='cellphone' />
                                        </View>
                                    </View>

                                    {
                                        this.renderSubmit()
                                    }

                                </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}


const mapStateToProps = ({ lang, profile, auth }) => {
    return {
        lang		: lang.lang,
        auth        : auth.user,
        user        : profile.user,
    };
};
export default connect(mapStateToProps, { })(DiscountCoupon);