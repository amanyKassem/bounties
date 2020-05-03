import React, { Component } from "react";
import {View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, FlatList, Platform, Animated,Dimensions, I18nManager} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right, Textarea} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {connect} from "react-redux";
import COLORS from '../../src/consts/colors';
import {NavigationEvents} from "react-navigation";
import StarRating from 'react-native-star-rating';
import { providerProduct , favorite , profile} from '../actions';
import ProductBlock from './ProductBlock'

import Modal from "react-native-modal";

const isIOS = Platform.OS === 'ios';

class Provider extends Component {
    constructor(props){
        super(props);
        this.state={
            status              : null,
            activeType          : 0,
            isFav               : 0,
            refreshed           : false,
            active              : true,
            loader              : true,
            isModalVisible: false,
        }
    }

    componentWillMount() {
        this.props.providerProduct( this.props.lang , this.props.navigation.state.params.id, (this.props.user) ? this.props.user.token  : null, null);
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };

    onSubCategories ( id ){
        this.setState({spinner: true, active : id });
        this.props.providerProduct( this.props.lang , this.props.navigation.state.params.id, (this.props.user) ? this.props.user.token  : null ,id);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ refreshed: !this.state.refreshed })
	}

	toggleFavorite (id){

        this.setState({ isFav: ! this.state.isFav, activeType : id });
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.favorite( this.props.lang, id  , token );

    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item , key) => {
        return(
            <ProductBlock item={item} key={key} fromFav={false} navigation={this.props.navigation} />
        );
    };

    onFocus(){
        this.componentWillMount();
    }

    render() {

        const provider_info = this.props.provider;

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
                        {this.props.navigation.state.params.name}
                    </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        {
                            provider_info?
                                <View style={[styles.viewBlock, styles.bg_White , styles.borderGray, styles.Width_90]}>
                                    <Image style={[styles.Width_90, styles.swiper]} source={{ uri : provider_info.avatar }} resizeMode={'cover'}/>
                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[styles.blockContent , {width:200}]}>
                                        <View style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                            <Text style={[styles.textBold, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                {provider_info.name}
                                            </Text>
                                            <View style={{width:70}}>
                                                <StarRating
                                                    disabled        = {true}
                                                    maxStars        = {5}
                                                    rating          = {provider_info.rates}
                                                    fullStarColor   = {COLORS.light_red}
                                                    starSize        = {13}
                                                    starStyle       = {styles.starStyle}
                                                />
                                            </View>
                                            <Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                {provider_info.details}
                                            </Text>

                                        </View>
                                    </Animatable.View>
                                </View>
                                :<View/>
                        }

                    <TouchableOpacity onPress={() => this.toggleModal()} style={[styles.directionRowC , styles.SelfCenter]}>
                        <Image style={[{width:22 , marginRight:5}]} source={require('../../assets/images/booking.png')} resizeMode={'contain'}/>
                        <Text style={[styles.textRegular, styles.text_darkblue,styles.textSize_14 ,styles.textDecoration]}>{ i18n.t('availTime') }</Text>
                    </TouchableOpacity>

                        <View style={styles.mainScroll}>
                            <ScrollView style={[styles.Width_100, styles.paddingHorizontal_10]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                {
                                    this.props.sub_categories ?
                                    this.props.sub_categories.map((pro) => (

                                        <View style={{flexDirection:'column' , justifyContent:'center' , alignItems:'center', alignSelf : 'center'}}>
                                            <TouchableOpacity
                                                onPress        = {() => this.onSubCategories(pro.id)}
                                                style          = { this.state.active === pro.id ? styles.activeTabs : styles.noActiveTabs }>
                                                <Image source={{ uri : pro.image }} style={[styles.scrollImg]} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                            <Text style={[styles.textRegular, styles.textSize_11 , { color : this.state.active === pro.id ? COLORS.darkblue : 'transparent' }]} >
                                                {pro.name}
                                            </Text>
                                        </View>

                                    )) :
                                        <View/>
                                }

                            </ScrollView>
                        </View>

                        <View style={[styles.marginVertical_5 , styles.paddingHorizontal_5]}>
                            {
                                this.props.products ?
                                    <FlatList
                                        data                    = {this.props.products}
                                        renderItem              = {({item}) => this.renderItems(item)}
                                        numColumns              = {2}
                                        keyExtractor            = {this._keyExtractor}
                                        extraData               = {this.state.refreshed}
                                        onEndReachedThreshold   = {isIOS ? .01 : 1}
                                    />
                                    :<View/>
                            }
                        </View>

                </Content>
                </ImageBackground>

                <Modal style={{}} isVisible={this.state.isModalVisible} onBackdropPress={() => this.toggleModal()}>
                    <View style={[styles.commentModal, {padding: 15}]}>
                        <View style={[styles.directionRowC , styles.SelfCenter]}>
                            <Image style={[{width:22 , marginRight:5}]} source={require('../../assets/images/green_calender.png')} resizeMode={'contain'}/>
                            <Text style={[styles.textRegular, styles.text_fyrozy,styles.textSize_14 ,styles.textDecoration]}>{ i18n.t('availTime') }</Text>
                        </View>

                        <View style={[styles.directionColumnCenter]}>
                            <Text style={[styles.textRegular, styles.text_darkblue,styles.textSize_14 , {marginBottom:10}]}>10 ص : 10 م يوميا ماعدا الجمعه والبسبت</Text>
                            <Text style={[styles.textRegular, styles.text_darkblue,styles.textSize_14 , {marginBottom:10}]}>{ i18n.t('deliverUSAa') }</Text>
                            <Text style={[styles.textRegular, styles.text_darkblue,styles.textSize_14 , {marginBottom:10}]}>{ i18n.t('deliver24') }</Text>
                        </View>

                    </View>
                </Modal>
            </Container>

        );
    }
}


const mapStateToProps = ({ lang , providerProducts , favorite , profile}) => {
    return {
        lang                : lang.lang,
        products            : providerProducts.products,
        sub_categories      : providerProducts.subCategories,
        provider            : providerProducts.provider,
        isRefreshed         : providerProducts.isRefreshed,
        setfavorite         : favorite.favorite,
        user                : profile.user,
    };
};
export default connect(mapStateToProps, { providerProduct , favorite , profile })(Provider);
