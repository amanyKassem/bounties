import React, { Component } from "react";
import {View, Text, Image, ImageBackground, TouchableOpacity} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Form} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import {DoubleBounce} from "react-native-loader";
import { getAddProductTerms } from '../actions'
import * as Animatable from 'react-native-animatable';

class AddProductTerms extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
        }
    }


    componentWillMount() {
        this.props.getAddProductTerms( this.props.lang , this.props.auth.data.token )
    }



    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('terms') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/terms.png')}/>)
    });

    render() {

        return (
            <Container>
                {/*{ this.renderLoader() }*/}
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            { i18n.t('addProductTerms') }
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        <View style={[styles.position_R, styles.bgFullWidth, styles.Width_90, styles.marginVertical_15, styles.SelfCenter]}>
                            <View style={[styles.lightOverlay, styles.Border]}></View>
                            <View style={[styles.position_R, styles.Width_100, styles.overHidden, styles.bg_White, styles.Border,styles.bgFullWidth,]}>
                                <Animatable.View animation="fadeInDown" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                    <Image style={[styles.icoImage]} source={require('../../assets/images/logo.png')}/>
                                </Animatable.View>
                                <View style={[styles.overHidden]}>
                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500}>
                                        <Text style={[styles.textRegular , styles.text_fyrozy, styles.textCenter, styles.Width_100, styles.marginVertical_15  , styles.textSize_18]}>
                                            { i18n.t('termsForAddProduct') }
                                        </Text>
                                        <Text style={[styles.textRegular , styles.text_black, styles.textCenter, styles.Width_100, styles.marginVertical_15]}>
                                            { this.props.Terms }
                                        </Text>

                                        <TouchableOpacity
                                            style={[
                                                styles.bg_darkBlue,
                                                styles.width_150,
                                                styles.flexCenter,
                                                styles.marginVertical_15,
                                                styles.height_40
                                            ]}
                                            onPress={() => this.props.navigation.navigate(this.props.navigation.state.params && (this.props.navigation.state.params.routeName = 'homeProvider') ?'AddProduct':'subscription')}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                                {i18n.t('confirm')}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animatable.View>
                                </View>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang,profile, terms , auth}) => {
    return {
        lang        : lang.lang,
        ProductTerms       : terms.ProductTerms,
        user: profile.user,
        auth: auth.user,
    };
};
export default connect(mapStateToProps, { getAddProductTerms })(AddProductTerms);