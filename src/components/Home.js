import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, Linking, FlatList, Platform, ScrollView, Dimensions, I18nManager} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title,
    Right,
    Item,
    Input,
    Picker,
    CheckBox,
} from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import {sliderHome, categoryHome, searchHome, homeProvider, homeDelegate, getCities, filterProviders} from '../actions';
import i18n from "../../locale/i18n";
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import Spinner from "react-native-loading-spinner-overlay";
import {Notifications} from "expo";
import Masonry from 'react-native-masonry';
import Modal from "react-native-modal";

const isIOS = Platform.OS === 'ios';
const width = Dimensions.get('window').width;

class Home extends Component {
    constructor(props){
        super(props);

        this.state={
            categorySearch      : '',
            isFav               : 0,
            refreshed           : false,
            active              : true,
            loader              : true,
            status              : 1,
            spinner             : true,
            show_modal: false,
            country: null,
            isModalVisible: false,
        }
    }
    toggleModal = () => {
        this.setState({show_modal: !this.state.show_modal});
    };

    toggleModalInfo = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };

    onValueCountry(value) {
        this.setState({country: value});
    }

    onFilter() {
        const {country} = this.state;
        const data = {
            lang: this.props.lang,
            city_id: country,
        };

        this.props.filterProviders(data , this.props);

        this.setState({show_modal: !this.state.show_modal , loader:true});

        console.log('data filter', data);

    }

    componentWillMount() {

        this.props.getCities(this.props.lang);

        if (this.props.auth === null || this.props.auth.data.type === 'user') {
            this.props.sliderHome(this.props.lang);
            this.props.categoryHome(this.props.lang);
        } else if (this.props.auth.data.type === 'provider') {
            this.props.homeProvider(this.props.lang, null, this.props.auth.data.token);
        } else if (this.props.auth.data.type === 'delegate') {
            this.props.homeDelegate(this.props.lang, this.state.status, this.props.auth.data.token);
        }


        this.setState({ spinner: false });

    }

    componentDidMount() {
        Notifications.addListener(this.handleNotification);
    }

    onSubCategories ( id ){

        this.setState({active : id });
        this.props.homeProvider( this.props.lang , id ,this.props.user.token );

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('home') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/home.png')} resizeMode={'cover'}/>)
    });

    _keyExtractor = (item, index) => item.id;

    renderItems = (item) => {
        item.index >= 2 && item.index%2 === 0 ? console.log('this is id', item.item.id) : false;
        return(
            <TouchableOpacity
                onPress     = {() => this.props.navigation.navigate('products', { id : item.item.id , name : item.item.name  })}
                key         = { item.index }
                style       = {[styles.position_R, styles.Width_45, item.index%2 == 0 ? styles.height_150 : styles.height_250, { alignSelf: 'flex-start', top: item.index >= 2 && item.index%2 === 0 ? (item.index/2) * -105 : 0 , marginBottom: 15, width: '46.7%', marginHorizontal: 6 }]}>
                <View style={[styles.position_R, styles.Width_100, item.index%2 == 0 ? styles.height_150 : styles.height_250 , styles.Border, styles.overHidden]}>
                    <Animatable.View animation="zoomIn" easing="ease-out" delay={500}>
                        <View style={[styles.overHidden, styles.position_R]}>
                            <Image style={[styles.Width_100 ,  item.index%2 == 0 ? styles.height_150 : styles.height_250]} source={{ uri: item.item.image }}/>
                            <View style={[
                                styles.textRegular ,
                                styles.text_White ,
                                styles.textSize_14 ,
                                styles.textCenter ,
                                styles.position_A ,
                                styles.left_0 ,
                                styles.top_20 ,
                                styles.overlay_transBlue ,
                                styles.paddingHorizontal_5 ,
                                styles.paddingVertical_5 ,
                                styles.width_120,
                                styles.rowGroup,
                                styles.paddingHorizontal_15
                            ]}>
                                <Image style={styles.ionImage} source={{ uri: item.item.icon }}/>
                                <Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.textCenter ,]}>
                                    { item.item.name }
                                </Text>
                            </View>
                        </View>
                    </Animatable.View>
                </View>
            </TouchableOpacity>
        );
    };

    provider_keyExtractor = (item, index) => item.id;

    providerItems = (item , key) => {
        return(
            <TouchableOpacity
                style       = {[styles.position_R , styles.flex_45, styles.marginVertical_15, styles.height_200, styles.marginHorizontal_10]}
                key         = { key }
                onPress     = {() => this.props.navigation.navigate('product', { id : item.id })}
            >
                <View style={[styles.lightOverlay, styles.Border]} />
                <View style={[styles.bg_White, styles.Border]}>
                    <View style={[styles.rowGroup, styles.paddingHorizontal_5 , styles.paddingVertical_5]}>
                        <View style={[styles.flex_100, styles.position_R]}>
                            <Image
                                style           = {[styles.Width_100 , styles.height_100, styles.flexCenter]}
                                source          = {{ uri: item.thumbnail }}
                                resizeMode      = {'cover'}
                            />

                            {
                                (item.discount !== 0)
                                    ?
                                    <View style = {[styles.overlay_black, styles.text_White, styles.textRegular, styles.position_A, styles.top_15, styles.left_0,styles.paddingHorizontal_5, styles.width_50, styles.flexCenter]}>
                                        <Text style = {[styles.text_White, styles.textRegular, styles.textCenter]}>
                                            {item.discount} %
                                        </Text>
                                    </View>
                                    :
                                    <View/>
                            }
                        </View>
                    </View>
                    <View style={[styles.overHidden, styles.paddingHorizontal_10, styles.marginVertical_5]}>
                        <Text
                            style           = {[styles.text_gray, styles.textSize_14, styles.textRegular, styles.Width_100, styles.textLeft]}
                            numberOfLines   = { 1 } prop with
                            ellipsizeMode   = "head">
                            {item.name}
                        </Text>
                        <Text style={[styles.text_light_gray, styles.textSize_13, styles.textRegular, styles.Width_100, styles.textLeft]}>
                            {item.category} - {item.sub_category}
                        </Text>
                        <View style={[styles.rowGroup]}>
                            <Text style={[styles.text_fyrozy, styles.textSize_13, styles.textRegular,styles.textLeft, styles.borderText, styles.paddingHorizontal_5]}>
                                {item.discount_price} {i18n.t('RS')}
                            </Text>
                            <Text style={[styles.text_fyrozy, styles.textSize_13, styles.textRegular,styles.textLeft, styles.borderText, styles.paddingHorizontal_5, { textDecorationLine: 'line-through' }]}>
                                {item.price} {i18n.t('RS')}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    onSearch () {
        this.props.navigation.navigate('SearchHome', {
            categorySearch                  : this.state.categorySearch,
        });
    }

	renderNoData() {
		if (this.props.orders && (this.props.orders).length <= 0) {
			return (
				<View style={[styles.directionColumnCenter, {height: '85%'}]}>
					<Image source={require('../../assets/images/no-data.png')} resizeMode={'contain'}
						style={{alignSelf: 'center', width: 200, height: 200}}/>
				</View>
			);
		}

		return <View/>
	}

    onFocus(){
        this.componentWillMount();
    }


    handleNotification = (notification) => {
        if (notification && notification.origin !== 'received') {
            this.props.navigation.navigate('notifications');
        }
    };

    render() {
        const provider_info = this.props.provider;

        return (
            <Container>
                <Spinner visible = { this.state.spinner } />
				<NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    {/*<ImageBackground source={require('../../assets/images/bg_img.png')} style={{ height: 85, width: '100%', position: 'absolute' }} />*/}
                        <Left style={[styles.leftIcon]}>
                            <Button style={styles.Button} transparent onPress={() => { this.props.navigation.openDrawer()} }>
                                <Image style={[styles.ionImage]} source={require('../../assets/images/menu.png')}/>
                            </Button>
                        </Left>
                        <Body style={styles.bodyText}>
                            <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                                { i18n.t('home') }
                            </Title>
                        </Body>
                        {
                            this.props.user == null || this.props.user.type === 'user' ?
                                <Right style={styles.rightIcon}>
                                    <Image style={[styles.smallLogo]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                                    <Button  onPress={this.toggleModal} style={[styles.text_gray , {right:-7}]} transparent>
                                        <Image style={[styles.ionImage]} source={require('../../assets/images/filter.png')}/>
                                    </Button>
                                    <Button onPress={() => this.props.navigation.navigate(this.props.user?'notifications':'Login')} style={[styles.text_gray]} transparent>
                                        <Image style={[styles.ionImage]} source={require('../../assets/images/alarm.png')}/>
                                    </Button>
                                    <Button  onPress={() => this.props.navigation.navigate(this.props.user?'Basket':'Login')} style={[styles.bg_light_oran, styles.Radius_0, styles.iconHeader, styles.flexCenter]} transparent>
                                        <Image style={[styles.ionImage]} source={require('../../assets/images/basket.png')}/>
                                    </Button>
                                </Right>
                                :
                                <Right style={styles.rightIcon}>
                                    <Image style={[styles.smallLogo , styles.marginHorizontal_5]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                                    <Button  onPress={() => this.props.navigation.navigate(this.props.user?'notifications':'Login')} style={[styles.bg_light_oran, styles.Radius_0, styles.iconHeader, styles.flexCenter]} transparent>
                                        <Image style={[styles.ionImage]} source={require('../../assets/images/alarm.png')}/>
                                    </Button>
                                </Right>
                        }
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content  contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                        {
                            this.props.user == null || this.props.user.type !== 'delegate' ?
                                <Animatable.View animation="fadeInLeft" easing="ease-out" delay={500}>
                                    <View style={[styles.position_R, styles.Width_60, styles.SelfRight]}>
                                        <Item floatingLabel style={styles.item}>
                                            <Input
                                                placeholder={i18n.translate('searchProduct')}
                                                style={[styles.input, styles.height_40, styles.bg_light_oran , {right: -20}]}
                                                autoCapitalize='none'
                                                onChangeText={(categorySearch) => this.setState({categorySearch})}
                                            />
                                        </Item>
                                        <TouchableOpacity
                                            style={[styles.position_A, styles.iconSearch, styles.width_50, styles.height_40, styles.flexCenter,]}
                                            onPress={() => this.onSearch()}
                                        >
                                            <Image style={[styles.ionImage]} source={require('../../assets/images/search.png')}/>
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>
                                :
                                <View/>
                        }

                        {
                            this.props.user == null || this.props.user.type === 'user' ?
                                <View style={[styles.homeUser]}>

                                    <View style={styles.viewBlock}>

                                        <Swiper
                                            containerStyle      = {[styles.Width_95, styles.marginVertical_15, styles.swiper, styles.viewBlock]}
                                            autoplay            = {true}
                                            paginationStyle     = {[styles.paginationStyle]}
                                            dotStyle            = {[styles.bg_light_gray, {width: 13,height:3 , borderRadius:0}]}
                                            activeDotStyle      = {{ backgroundColor: COLORS.darkblue, width: 20,height:3 , borderRadius:0}}
                                            animated            = {true}
                                            loop                = {true}
                                            autoplayTimeout     = { 2 }
                                        >

                                            {
                                                this.props.slider.map((slid, i) => (
                                                    <View style={[styles.viewBlock]}>
                                                        <Image style={[styles.Width_95, styles.swiper]} source={{ uri : slid.image}}/>
                                                        <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[styles.blockContent, styles.Width_50]}>
                                                            <View style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                                <Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                                    {slid.name}
                                                                </Text>
                                                                <Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                                    {slid.description}
                                                                </Text>
                                                                <View key={i} >
                                                                    <Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                                        { i18n.t('here') }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </Animatable.View>
                                                    </View>
                                                ))
                                            }

                                        </Swiper>

                                    </View>

                                    <View>
                                        <FlatList
                                            data                    = {this.props.categories}
                                            renderItem              = {(item) => this.renderItems(item)}
                                            numColumns              = {2}
                                            keyExtractor            = {this._keyExtractor}
                                            extraData               = {this.props.categories}
                                            onEndReachedThreshold   = {isIOS ? .01 : 1}
                                        />
                                    </View>

                                </View>
                                :
                                <View/>
                        }

                        {
                            this.props.user != null && this.props.user.type === 'provider' && provider_info?
                                <View style={[styles.homeProvider]}>

                                    <View style={[styles.viewBlock, styles.bg_White , styles.borderGray, styles.Width_90, styles.position_R]}>
                                        <TouchableOpacity
                                            style       = {[styles.width_40 , styles.height_40 , styles.flexCenter, styles.overlay_black, styles.position_A, styles.top_10, styles.right_0]}
                                            onPress     = {() => this.props.navigation.navigate('EditShop', {data : provider_info})}
                                        >
                                            <Icon style={[styles.text_White, styles.textSize_18]} type="AntDesign" name='edit' />
                                        </TouchableOpacity>
                                        <Image style={[styles.Width_100, styles.swiper]} source={{uri:provider_info.avatar}} resizeMode={'cover'}/>
                                        <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[styles.blockContent , styles.Width_50]}>
                                            <View style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                <Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                    {provider_info.name}
                                                </Text>
                                                <View style={{width:70}}>
                                                    <StarRating
                                                        disabled        = {true}
                                                        maxStars        = {5}
                                                        rating          = {provider_info.rates}
                                                        fullStarColor   = {COLORS.blue}
                                                        starSize        = {13}
                                                        starStyle       = {styles.starStyle}
                                                    />
                                                </View>
                                                <Text style={[styles.textBold, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
                                                    {provider_info.details}
                                                </Text>
                                                <View style={[styles.locationView]}>
                                                    <Icon style={[styles.text_White , styles.textSize_12 ,{marginRight:5}]} type="Feather" name='map-pin' />
                                                    <Text style={[styles.textRegular, styles.text_White,styles.textSize_12, { alignSelf: 'flex-start', textAlign: 'right' }]}> {provider_info.address} </Text>
                                                </View>
                                            </View>
                                        </Animatable.View>
                                    </View>

                                    <TouchableOpacity onPress={() => this.toggleModalInfo()} style={[styles.directionRowC , styles.SelfCenter]}>
                                        <Image style={[{width:22 , marginRight:5}]} source={require('../../assets/images/booking.png')} resizeMode={'contain'}/>
                                        <Text style={[styles.textRegular, styles.text_darkblue,styles.textSize_14 ,styles.textDecoration]}>{ i18n.t('availTime') }</Text>
                                    </TouchableOpacity>

                                    <View style={styles.mainScroll}>
                                        <ScrollView style={[styles.Width_100, styles.paddingHorizontal_10]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                            {
                                                this.props.sub_categories.map((pro) => (

                                                    <View style={{flexDirection:'column' , justifyContent:'center' , alignItems:'center', alignSelf : 'center'}}>
                                                        <TouchableOpacity
                                                            onPress         = {() => this.onSubCategories(pro.id)}
                                                            style           = {[this.state.active === pro.id ? styles.activeTabs : styles.noActiveTabs]}>
                                                            <Image source   = {{ uri : pro.image }} style={[styles.scrollImg]} resizeMode={'contain'} />
                                                        </TouchableOpacity>
                                                        <Text style={[styles.textRegular, styles.textSize_11 , { color : this.state.active === pro.id ? COLORS.black : 'transparent' }]} >
                                                            {pro.name}
                                                        </Text>
                                                    </View>

                                                ))
                                            }

                                        </ScrollView>
                                    </View>

                                    <View style={[styles.marginVertical_5 , styles.paddingHorizontal_5]}>

                                        <FlatList
                                            data                    = {this.props.products}
                                            renderItem              = {({item}) => this.providerItems(item)}
                                            numColumns              = {2}
                                            keyExtractor            = {this.provider_keyExtractor}
                                            extraData               = {this.state.refreshed}
                                            onEndReachedThreshold   = {isIOS ? .01 : 1}
                                        />

                                    </View>

                                </View>
                                :
                                <View/>
                        }

                        {
                            this.props.user != null && this.props.user.type === 'delegate' ?
                                <View style={[styles.homeDelegat, styles.paddingVertical_10]}>
									{this.renderNoData()}
                                    {
                                        this.props.orders.map((order, i) => {
											const myOrders = this.props.user.type === 'provider' ? order.order_user : order.order_provider;
											return(
												<TouchableOpacity key={i}
													onPress={() => this.props.navigation.navigate( 'delegateOrderDetails' , { order_id: order.order_info.order_id })}
													style={[styles.position_R, styles.flexCenter, styles.Width_90, {marginTop: 20}]}>
													<View style={[styles.lightOverlay, styles.Border]} />
													<View
														style={[styles.rowGroup, styles.bg_White, styles.Border, styles.paddingVertical_10, styles.paddingHorizontal_10]}>
														<View style={[styles.icImg, styles.flex_30]}>
															<Image style={[styles.icImg]}
																source={{uri: myOrders.avatar}}/>
														</View>
														<View style={[styles.flex_70]}>
															<View style={[styles.rowGroup]}>
																<Text
																	style={[styles.textRegular, styles.text_black]}>{myOrders.name}</Text>
															</View>
															<View style={[styles.overHidden]}>
																<Text
																	style={[styles.textRegular, styles.text_gray, styles.Width_100, styles.textLeft]}>{order.order_info.category}</Text>
															</View>
															<View style={[styles.overHidden, styles.rowGroup]}>
																<Text
																	style={[styles.textRegular, styles.text_red,]}>{order.order_info.price} {i18n.t('RS')}</Text>
																<Text
																	style={[styles.textRegular, styles.text_gray,]}>{order.order_info.date}</Text>
															</View>
														</View>
														<TouchableOpacity
															style={[styles.width_40, styles.height_40, styles.flexCenter, styles.bg_light_oran, styles.borderLightOran, styles.marginVertical_5, styles.position_A, styles.top_5, styles.right_0]}>
															<Text
																style={[styles.textRegular, styles.text_red]}>{order.order_info.order_items}</Text>
														</TouchableOpacity>
													</View>
												</TouchableOpacity>
											)
                                        })
                                    }

                                </View>
                                :
                                <View/>
                        }
                    <Modal
                        onBackButtonPress={() => this.setState({show_modal: false})}
                        isVisible={this.state.show_modal}
                        style={styles.bgModelFilter}
                        hasBackdrop={false}
                        animationIn={'slideInRight'}
                        animationOut={'slideOutRight'}
                        animationInTiming={500}
                        animationOutTiming={500}
                        backdropTransitionInTiming={500}
                        backdropTransitionOutTiming={500}
                        swipeDirection="Right"
                    >
                        <View style={styles.contentModel}>
                            <View style={styles.model}>

                                <Animatable.View animation="fadeInRight" easing="ease-out" delay={500}>
                                    <View
                                        style={[styles.bg_darkBlue, styles.overHidden, styles.paddingVertical_10, styles.Width_70, styles.heightFull, styles.paddingVertical_20]}>
                                        <View style={[styles.overHidden, styles.heightFull, styles.bgFullWidth]}>

                                            <View
                                                style={[styles.marginVertical_15, styles.Width_100, styles.height_50, styles.rowGroup, styles.paddingHorizontal_20]}>
                                                <Text
                                                    style={[styles.textRegular, styles.text_White, styles.textSize_18]}>
                                                    {i18n.translate('serad')}
                                                </Text>
                                                <TouchableOpacity style={[styles.overHidden]}
                                                                  onPress={this.toggleModal}>
                                                    <Icon style={[styles.text_White, styles.textSize_20]}
                                                          type="AntDesign" name='close'/>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={[styles.centerColum, styles.Width_90, styles.bgFullWidth]}>

                                                <View
                                                    style={[styles.viewPiker, styles.flexCenter, styles.marginVertical_15, styles.Width_100, styles.bg_White]}>


                                                    <Item style={styles.itemPiker} regular>
                                                        <Picker
                                                            mode="dropdown"
                                                            style={styles.Picker}
                                                            placeholderStyle={[styles.textRegular, {
                                                                color: "#121212",
                                                                writingDirection: 'rtl',
                                                                width: '100%',
                                                                fontSize: 14
                                                            }]}
                                                            selectedValue={this.state.country}
                                                            onValueChange={this.onValueCountry.bind(this)}
                                                            textStyle={[styles.textRegular, {
                                                                color: "#121212",
                                                                writingDirection: 'rtl',
                                                                width: '100%',
                                                            }]}
                                                            placeholder={i18n.translate('city')}
                                                            itemTextStyle={[styles.textRegular, {
                                                                color: "#121212",
                                                                writingDirection: 'rtl',
                                                                width: '100%',
                                                            }]}
                                                        >

                                                            <Picker.Item style={[styles.Width_100]}
                                                                         label={i18n.t('city')} value={null}/>
                                                            {
                                                                this.props.citys ?
                                                                    this.props.citys.map((city, i) => (
                                                                        <Picker.Item style={styles.Width_100}
                                                                                     key={i} label={city.name}
                                                                                     value={city.id}/>
                                                                    ))
                                                                    :
                                                                    <View/>
                                                            }

                                                        </Picker>
                                                    </Item>
                                                    <Icon style={styles.iconPicker} type="AntDesign" name='down'/>
                                                </View>


                                            </View>

                                            <TouchableOpacity
                                                style={[styles.overHidden, styles.bg_fyrozy, styles.width_120, styles.flexCenter, styles.Radius_5, styles.height_40, styles.marginVertical_25]}
                                                onPress={() => this.onFilter()}>
                                                <Text
                                                    style={[styles.textRegular, styles.textSize_18, styles.text_White, styles.textCenter]}>
                                                    {i18n.t('search')}
                                                </Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </Animatable.View>
                            </View>
                        </View>
                    </Modal>

                    <Modal style={{}} isVisible={this.state.isModalVisible} onBackdropPress={() => this.toggleModalInfo()}>
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

                </Content>
                    </ImageBackground>
                {
                    this.props.user != null && this.props.user.type === 'provider' ?
                        <TouchableOpacity
                            style       = {[styles.rotatTouch ,styles.width_50 , styles.height_50 , styles.flexCenter, styles.bg_fyrozy, styles.position_A, styles.bottom_30]}
                            onPress     = {() => this.props.navigation.navigate('addProductTerms' , {routeName:'homeProvider'})}
                            // onPress     = {() => this.props.navigation.navigate('AddProduct')}
                            >
                            <Icon style={[styles.text_White, styles.textSize_22, styles.rotatIcon]} type="AntDesign" name='plus' />
                        </TouchableOpacity>
                        :
                        <View/>
                }
            </Container>

        );
    }
}

const mapStateToProps = ({ lang, home, categoryHome, homeProvider, profile , homeDelegate, auth , cities}) => {
    return {
        lang                : lang.lang,
        slider              : home.slider,
        categories          : categoryHome.categories,
        auth		        : auth.user,
        loader              : home.loader,
        products            : homeProvider.products,
        sub_categories      : homeProvider.subCategories,
        provider            : homeProvider.provider,
        user                : profile.user,
        orders              : homeDelegate.orders,
        citys: cities.cities,
    };
};
export default connect(mapStateToProps, { sliderHome, categoryHome, searchHome , homeProvider, homeDelegate , getCities ,
    filterProviders})(Home);
