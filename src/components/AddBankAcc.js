import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title,
    Item,
    Input,
    Picker,
    CheckBox,
    Form, Right
} from 'native-base'
import styles from '../../assets/style'
import {DoubleBounce} from 'react-native-loader';
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import * as Animatable from "react-native-animatable";
import {getOrderStore} from '../actions'
import COLORS from "../consts/colors";

class AddBankAcc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bankName: '',
            bankNum: '',
            finishDate: '',
            confirmCode: '',
            bankNameStatus: 0,
            bankNumStatus: 0,
            finishDateStatus: 0,
            confirmCodeStatus: 0,
            isSubmitted: false,
        }
    }


    renderAddAcc(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <DoubleBounce size={20} color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
                style={[styles.bg_darkBlue,
                    styles.width_150,
                    styles.flexCenter,
                    styles.marginVertical_15,
                    styles.height_40]}>
                <Text
                    style={[styles.textRegular, styles.text_White, styles.textSize_14, styles.textLeft]}>{i18n.t('confirm')}</Text>
            </TouchableOpacity>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});

    }


    activeInput(type) {
        if (type === 'bankName' || this.state.bankName !== '') {
            this.setState({bankNameStatus: 1})
        }

        if (type === 'bankNum' || this.state.bankNum !== '') {
            this.setState({bankNumStatus: 1})
        }

    }

    unActiveInput(type) {
        if (type === 'bankName' && this.state.bankName === '') {
            this.setState({bankNameStatus: 0})
        }

        if (type === 'bankNum' && this.state.bankNum === '') {
            this.setState({bankNumStatus: 0})
        }

    }


    componentWillMount() {
    }


    renderLoader() {
        if (this.props.loader) {
            return (
                <View style={[styles.loading, styles.flexCenter]}>
                    <DoubleBounce size={20}/>
                </View>
            );
        }
    }

    onFocus() {
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title
                            style={[styles.textRegular, styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            {i18n.t('bankAccount')}
                        </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form
                                style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>


                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.t('bankName')}
                                            style={[styles.input, styles.height_50, (this.state.bankNameStatus === 1 ? styles.Active : styles.noActive) , {paddingRight : 20,paddingLeft : 20}]}
                                            onChangeText={(bankName) => this.setState({bankName})}
                                            onBlur={() => this.unActiveInput('bankName')}
                                            onFocus={() => this.activeInput('bankName')}
                                        />
                                    </Item>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('idNum')}
                                            style={[styles.input, styles.height_50, (this.state.bankNumStatus === 1 ? styles.Active : styles.noActive) , {paddingRight : 20,paddingLeft : 20}]}
                                            keyboardType={'number-pad'}
                                            onChangeText={(bankNum) => this.setState({bankNum})}
                                            onBlur={() => this.unActiveInput('bankNum')}
                                            onFocus={() => this.activeInput('bankNum')}
                                        />
                                    </Item>
                                </View>

                                {
                                    this.renderAddAcc()
                                }

                            </Form>
                        </KeyboardAvoidingView>

                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({lang , profile}) => {
    return {
        lang: lang.lang,
        user: profile.user,
    };
};
export default connect(mapStateToProps, {getOrderStore})(AddBankAcc);