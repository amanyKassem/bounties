import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    AsyncStorage,
    KeyboardAvoidingView,
    Dimensions,
    I18nManager
} from "react-native";
import {Container, Content, Form, Item, Input, Button, Toast, Icon,} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';
import {chooseLang, profile, userLogin} from '../actions'


const IS_IPHONE_X 	= (height === 812 || height === 896) && Platform.OS === 'ios';
const height = Dimensions.get('window').height;

class SelectUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
        }
    }
    render() {
        return (

            <Container>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/background.png') : require('../../assets/images/bg_img.png')}
                                 style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth}>
                        <View
                            style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.SelfCenter, styles.Width_100]}>
                            <Animatable.View animation="fadeInDown" easing="ease-out" delay={500}
                                             style={[styles.flexCenter]}>
                                <View style={[styles.overHidden]}>
                                    <Image style={[styles.icoImage]} source={require('../../assets/images/logo.png')}/>
                                </View>
                            </Animatable.View>

                            <View style={[styles.directionRowSpace , styles.paddingHorizontal_70 , styles.marginBottom_50]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.touchWrap}>
                                    <View style={[styles.userTouch]}>
                                        <Image style={[styles.pickUser]} source={require('../../assets/images/login.png')}/>
                                    </View>
                                    <Text style={[styles.textRegular, styles.textSize_12, styles.marginVertical_5, styles.text_darkblue , {textAlign:'center'}]}>
                                        {i18n.translate('login')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('drawerNavigator')} style={styles.touchWrap}>
                                    <View style={[styles.userTouch]}>
                                        <Image style={[styles.pickUser]} source={require('../../assets/images/white_home.png')}/>
                                    </View>
                                    <Text style={[styles.textRegular, styles.textSize_12, styles.marginVertical_5, styles.text_darkblue , {textAlign:'center'}]}>
                                        {i18n.translate('guest')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.directionRowSpace , styles.paddingHorizontal_70]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register' , {chooseUser:'user'})} style={styles.touchWrap}>
                                    <View style={[styles.userTouch]}>
                                        <Image style={[styles.pickUser]} source={require('../../assets/images/add_user.png')}/>
                                    </View>
                                    <Text style={[styles.textRegular, styles.textSize_12, styles.marginVertical_5, styles.text_darkblue , {textAlign:'center'}]}>
                                        {i18n.translate('registerUser')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register' , {chooseUser:'provider'})} style={styles.touchWrap}>
                                    <View style={[styles.userTouch]}>
                                        <Image style={[styles.pickUser]} source={require('../../assets/images/add_family.png')}/>
                                    </View>
                                    <Text style={[styles.textRegular, styles.textSize_12, styles.marginVertical_5, styles.text_darkblue , {textAlign:'center'}]}>
                                        {i18n.translate('registerProvider')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}


const mapStateToProps = ({auth, profile, lang}) => {
    return {
        loading: auth.loading,
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};
export default connect(mapStateToProps, {userLogin, profile})(SelectUser);
