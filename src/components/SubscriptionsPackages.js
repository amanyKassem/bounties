import React, { Component } from "react";
import {View, Text, Image, ImageBackground, TouchableOpacity, Animated, FlatList, Dimensions, I18nManager} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Form} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import {DoubleBounce} from "react-native-loader";
import COLORS from '../../src/consts/colors'
import * as Animatable from 'react-native-animatable';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getProductsPackages} from '../actions'
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import {NavigationEvents} from "react-navigation";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class SubscriptionsPackages extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
            activeSlide              : 0,
            loader: true
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        setTimeout(() => this.props.getProductsPackages( this.props.lang , this.props.user.token ), 2000)

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
    }

     _renderItem ({item, index} , navigation) {
        return (
            <View >
                <Text style={[styles.textRegular, styles.bg_darkBlue , styles.text_White, styles.textCenter, styles.Width_100,  styles.textSize_16 , styles.paddingVertical_7]}>
                    {item.name}
                </Text>
                <View style={[styles.bg_fyrozy , {paddingTop:20 , paddingBottom:25}]}>
                    <Text style={[styles.textRegular , styles.text_White, styles.textCenter, styles.Width_100, styles.marginVertical_5]}>
                        {i18n.t('packagePeriod')} : {item.time}
                    </Text>
                    <Text style={[styles.textRegular , styles.text_White, styles.textCenter, styles.Width_100, styles.marginVertical_5]}>
                        {i18n.t('numOfSpecialProd')} : {item.products_number}
                    </Text>
                    <Text style={[styles.textRegular , styles.text_White, styles.textCenter, styles.Width_100, styles.marginVertical_5]}>
                        {i18n.t('subPrice')} : {item.price} { i18n.t('RS') }
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.bg_darkBlue,
                            styles.width_150,
                            styles.flexCenter,
                            styles.height_40,
                            {marginTop:50}
                        ]}
                        onPress={() => navigation.navigate('ChoosePayment' , {routeName:'subscriptionsPackages' , product_id:this.props.navigation.state.params.product_id , id:item.id})}>
                        <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                            {i18n.t('subscription')}
                        </Text>
                    </TouchableOpacity>
                </View></View>
        )
    }

    get pagination () {
        const { activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={this.props.productsPackages.length}
                activeDotIndex={activeSlide}
                containerStyle={{ backgroundColor: 'transparent' }}
                dotStyle={{
                    width: 25,
                    height: 4,
                    borderRadius: 0,
                    marginHorizontal: -6,
                    backgroundColor: COLORS.darkblue
                }}
                inactiveDotStyle={{
                    width: 20,
                    height: 7,
                    borderRadius: 0,
                    marginHorizontal: -22,
                    backgroundColor: COLORS.gray
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    componentDidMount() {
        this.runPlaceHolder();
    }

    runPlaceHolder() {
        if (Array.isArray(this.loadingAnimated) && this.loadingAnimated.length > 0) {
            Animated.parallel(
                this.loadingAnimated.map(animate => {
                    if (animate && animate.getAnimated) {
                        return animate.getAnimated();
                    }
                    return null;
                }),
                {
                    stopTogether: false,
                }
            ).start(() => {
                this.runPlaceHolder();
            })
        }
    }

    _renderRows(loadingAnimated, numberRow, uniqueKey) {
        let shimmerRows = [];
        for (let index = 0; index < numberRow; index++) {
            shimmerRows.push(
                <ShimmerPlaceHolder
                    key={`loading-${index}-${uniqueKey}`}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={{marginVertical:7, alignSelf: 'center'}}
                    width={width - 20}
                    height={100}
                    colorShimmer={['#ffffff75', COLORS.light_blue, '#ffffff75']}
                />
            )
        }

        return (
            <View >
                {shimmerRows}
            </View>
        )
    }

    onFocus() {
        this.componentWillMount();
    }

    render() {
        this.loadingAnimated = [];
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
                            { i18n.t('subscriptionsPackages') }
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                        <NavigationEvents onWillFocus={() => this.onFocus()}/>
                        <View style={[styles.position_R, styles.bgFullWidth, styles.Width_100, styles.marginVertical_15, styles.SelfCenter]}>
                            <View style={[styles.overHidden]}>


                                {
                                    this.state.loader ?
                                        this._renderRows(this.loadingAnimated, 5, '5rows') :
                                        <View>
                                            {
                                                this.props.productsPackages?
                                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={{justifyContent:'center' , alignItems:"center"}}>
                                                        <Carousel
                                                            data={this.props.productsPackages}
                                                            renderItem={(item) => this._renderItem(item ,this.props.navigation)}
                                                            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                                                            sliderWidth={300}
                                                            itemWidth={250}
                                                        />
                                                        { this.pagination }
                                                    </Animatable.View>
                                                    :<View/>
                                            }

                                        </View>
                                }


                            </View>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}



const mapStateToProps = ({ lang , productsPackages , profile}) => {
    return {
        lang                    : lang.lang,
        user                    : profile.user,
        productsPackages      : productsPackages.productsPackages
    };
};
export default connect(mapStateToProps, { getProductsPackages })(SubscriptionsPackages);