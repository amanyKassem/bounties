import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, Platform, FlatList, Animated , Dimensions} from "react-native";
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
    Picker,
    CheckBox,
    Input,
} from 'native-base'
import styles from '../../assets/style'
import {DoubleBounce} from 'react-native-loader';
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import StarRating from 'react-native-star-rating';
import Modal from "react-native-modal";
import * as Animatable from 'react-native-animatable';
import {categoryProducts, getCities} from '../actions';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import COLORS from '../consts/colors'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const isIOS = Platform.OS === 'ios';

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            country: null,
            show_modal: false,
            checked: false,
            toggle: false,
            rating: '',
            categorySearch: '',
            latitude: '',
            longitude: '',
            city_name: '',
            loader: true,
            isFav: 0
        }
    }

    static navigationOptions = () => ({
        header: null,
        drawerLabel: (<Text style={styles.textLabel}>{i18n.t('home')}</Text>),
        drawerIcon: (<Icon style={styles.icon} type="SimpleLineIcons" name="home"/>)
    });

    toggleFavorite (){
        this.setState({ isFav: ! this.state.isFav });
    }

    componentWillMount() {

        this.setState({loader: true});
        // setTimeout(() => this.props.categoryProducts(this.props.lang, this.props.navigation.state.params.id), 2000);
        this.props.categoryProducts(this.props.lang, this.props.navigation.state.params.id);

        this.props.getCities(this.props.lang);

        if (this.props.navigation.getParam('latitude') || this.props.navigation.getParam('longitude')) {
            this.state.city_name = this.props.navigation.getParam('city_name');
            this.setState({latitude: this.props.navigation.getParam('latitude')});
            this.setState({longitude: this.props.navigation.getParam('longitude')});
        } else {
            this.setState({city_name: i18n.t('mapname')});
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
    }


    onValueCountry(value) {
        this.setState({country: value});
    }

    selectRating(id) {
        this.setState({
            rating: id,
        });
        this.state.rating = id;
    }

    toggleModal = () => {
        this.setState({show_modal: !this.state.show_modal});
    };

    onSearch () {
        this.props.navigation.navigate('SearchHome', {
            categorySearch                  : this.state.categorySearch,
            category_id                  : this.props.navigation.state.params.id,
        });
    }

    onFilter() {
        const {country, rating} = this.state;
        const data = {
            lang: this.props.lang,
            city_id: country,
            rate: rating,
        };

        // this.props.filterProviders(data);

        this.setState({show_modal: !this.state.show_modal , loader:true});

        console.log('data filter', data);

    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item, key) => {

        return (

            <View>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('product', {id: item.id, name: item.name})}
                    style={[styles.position_R, styles.flexCenter, styles.Width_90, styles.marginVertical_15]}
                    key={key}
                >
                    <View style={[styles.lightOverlay, styles.Border]} />
                    <View
                        style={[styles.rowGroup, styles.bg_White, styles.Border, styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                        <View style={[styles.flex_40 ,  {marginRight:10}]}>
                            <Image style={{width:'100%' , height:105}} source={{uri: item.thumbnail}} resizeMode={'cover'}/>
                        </View>
                        <View style={[styles.flex_55]}>
                            <View style={[styles.rowGroup]}>
                                <Text style={[styles.textRegular, styles.text_darkblue]}>
                                    {item.name}
                                </Text>
                                <TouchableOpacity onPress = {() => this.toggleFavorite()}>
                                    <Text>
                                        <Icon style={[styles.text_red, styles.textSize_18]} type="AntDesign" name={this.state.isFav ? 'heart' : 'hearto'} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.overHidden]}>
                                <View style={[styles.directionRowC]}>
                                    <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                        {i18n.t('monyproducer')}
                                    </Text>
                                    <Text style={[styles.text_fyrozy, styles.textSize_12, styles.textRegular,styles.textLeft, styles.borderText, styles.paddingHorizontal_5]}>
                                        {item.price} {i18n.t('RS')}
                                    </Text>
                                </View>
                                <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                    {i18n.t('city')} : {item.city}
                                </Text>
                                <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                    {i18n.t('deliveryprice')} : {item.shipping_price} {i18n.t('RS')}
                                </Text>
                                <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                    {i18n.t('deliverTime')} : {item.shipping_time}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };


    renderNoData() {
        if (this.props.categoryProduct && (this.props.categoryProduct).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter, {height: '95%'}]}>
                    <Image source={require('../../assets/images/no-data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return <View/>
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
                    style={{marginVertical: 7, alignSelf: 'center'}}
                    width={width - 20}
                    height={100}
                    colorShimmer={['#ffffff75', COLORS.light_blue, '#ffffff75']}
                />
            )
        }

        return (
            <View>
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
                            {this.props.navigation.state.params.name}
                        </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>

                        <View style={[styles.position_R, styles.Width_60, styles.SelfRight]}>
                            <Item floatingLabel style={styles.item}>
                                <Input
                                    placeholder={i18n.translate('searchProduct')}
                                    style={[styles.input, styles.height_40, styles.bg_light_gray]}
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

                        <View style={[styles.marginVertical_5, styles.overHidden]}>

                            {
                                this.state.loader ?
                                    this._renderRows(this.loadingAnimated, 5, '5rows') :
                                    <View>
                                        {this.renderNoData()}
                                        {
                                            this.props.categoryProduct ?
                                                <FlatList
                                                    data={this.props.categoryProduct}
                                                    renderItem={({item}) => this.renderItems(item)}
                                                    numColumns={1}
                                                    keyExtractor={this._keyExtractor}
                                                    // extraData               = {this.props.categoryProduct}
                                                    onEndReachedThreshold={isIOS ? .01 : 1}
                                                />
                                                :
                                                <View/>
                                        }
                                    </View>

                            }

                        </View>

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
                                            style={[styles.overlay_transBlue, styles.overHidden, styles.paddingVertical_10, styles.Width_70, styles.heightFull, styles.paddingVertical_20]}>
                                            <View style={[styles.overHidden, styles.heightFull, styles.bgFullWidth]}>

                                                <View
                                                    style={[styles.marginVertical_15, styles.Width_100, styles.height_50, styles.rowGroup, styles.paddingHorizontal_20]}>
                                                    <Text
                                                        style={[styles.textRegular, styles.text_black, styles.textSize_18]}>
                                                        {i18n.translate('serad')}
                                                    </Text>
                                                    <TouchableOpacity style={[styles.overHidden]}
                                                                      onPress={this.toggleModal}>
                                                        <Icon style={[styles.text_black, styles.textSize_16]}
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

                                                    <TouchableOpacity
                                                        style={[styles.marginVertical_10, styles.Width_100, styles.height_50, styles.rowGroup, styles.paddingHorizontal_10, styles.bg_White]}
                                                        onPress={() => this.setState({checked: !this.state.checked})}>
                                                        <Text style={[styles.textRegular, styles.text_black,]}>
                                                            {i18n.translate('sallary')}
                                                        </Text>
                                                        <View style={[styles.paddingHorizontal_10]}>
                                                            <TouchableOpacity style={[styles.marginVertical_10]}>
                                                                <CheckBox
                                                                    style={[styles.checkBox, styles.Border, styles.bg_gray]}
                                                                    color={styles.text_gray}
                                                                    selectedColor={styles.text_White}
                                                                    onPress={() => this.setState({checked: !this.state.checked})}
                                                                    checked={this.state.checked}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <View
                                                        style={[styles.marginVertical_10, styles.Width_100, styles.height_50, styles.rowGroup,]}>

                                                        <TouchableOpacity
                                                            style={[styles.marginVertical_10, styles.Width_100, styles.height_50, styles.rowGroup, styles.paddingHorizontal_10, styles.bg_White]}
                                                            onPress={() => this.selectRating(1)}>
                                                            <Text style={[styles.textRegular, styles.text_black,]}>
                                                                {i18n.translate('starrate')}
                                                            </Text>
                                                            <View style={[styles.paddingHorizontal_10]}>
                                                                <TouchableOpacity style={[styles.marginVertical_10]}>
                                                                    <CheckBox
                                                                        style={[styles.checkBox, styles.Border, styles.bg_gray]}
                                                                        color={styles.text_gray}
                                                                        selectedColor={styles.text_White}
                                                                        onPress={() => this.setState({rating: !this.state.rating})}
                                                                        checked={this.state.rating === 1}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={[styles.marginVertical_10, styles.Width_100, styles.height_50, styles.rowGroup, styles.paddingHorizontal_10, styles.bg_White]}
                                                            onPress={() => this.selectRating(2)}>
                                                            <Text style={[styles.textRegular, styles.text_black,]}>
                                                                {i18n.translate('oldrate')}
                                                            </Text>
                                                            <View style={[styles.paddingHorizontal_10]}>
                                                                <TouchableOpacity style={[styles.marginVertical_10]}>
                                                                    <CheckBox
                                                                        style={[styles.checkBox, styles.Border, styles.bg_gray]}
                                                                        color={styles.text_gray}
                                                                        selectedColor={styles.text_White}
                                                                        onPress={() => this.setState({rating: !this.state.rating})}
                                                                        checked={this.state.rating === 2}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </TouchableOpacity>

                                                    </View>

                                                    {/*<TouchableOpacity*/}
                                                    {/*    style       = {[styles.marginVertical_10, styles.Width_100, styles.height_50,styles.rowGroup,styles.paddingHorizontal_10, styles.bg_White]}*/}
                                                    {/*    onPress     = {() => this.setState({ toggle: !this.state.toggle })}>*/}
                                                    {/*    <Text style={[styles.textRegular , styles.text_black,]}>*/}
                                                    {/*        {i18n.translate('sallary')}*/}
                                                    {/*    </Text>*/}
                                                    {/*    <View style={[styles.paddingHorizontal_10]}>*/}
                                                    {/*        <TouchableOpacity style = {[]}>*/}
                                                    {/*            <Switch*/}
                                                    {/*                value                   = {this.state.toggle}*/}
                                                    {/*                onPress                 = {() => this.setState({ toggle: !this.state.toggle })}*/}
                                                    {/*            />*/}
                                                    {/*        </TouchableOpacity>*/}
                                                    {/*    </View>*/}
                                                    {/*</TouchableOpacity>*/}

                                                </View>

                                                <TouchableOpacity
                                                    style={[styles.overHidden, styles.bg_darkBlue, styles.width_120, styles.flexCenter, styles.Radius_5, styles.height_40, styles.marginVertical_25]}
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

                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({lang, categoryProducts, cities}) => {
    return {
        lang: lang.lang,
        categoryProduct: categoryProducts.categoryProducts,
        citys: cities.cities,
    };
};
export default connect(mapStateToProps, {
    categoryProducts,
    getCities
})(Products);
