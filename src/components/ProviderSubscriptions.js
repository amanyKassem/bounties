import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    FlatList,
    I18nManager,
    Animated
} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import COLORS from '../../src/consts/colors'
import { getSubscriptions} from '../actions'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {NavigationEvents} from "react-navigation";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ProviderSubscriptions extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
            starCount           : 3,
            activeType          : 0,
            isFav               : false,
            refreshed           : false,
            loader: true
        }
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('subscriptions') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/raise-hand.png')} resizeMode={'contain'}/>)
    });



    componentWillMount() {
        this.setState({loader: true});
        setTimeout(() => this.props.getSubscriptions( this.props.lang , this.props.user.token ), 2000)

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
    }


    _keyExtractor = (item, index) => item.id;

    renderItems = (item , index) => {
        console.log(item);
        return(
            <View style={[styles.position_R, styles.Width_95, {marginTop:20}, styles.marginHorizontal_10, styles.SelfCenter]}>
                <View style={[styles.lightOverlay, styles.Border]} />
                <View style={[styles.position_R, styles.Width_100, styles.overHidden, styles.bg_White,styles.bgFullWidth,styles.paddingHorizontal_7 , styles.paddingVertical_7
                    , { borderWidth: 1, borderColor : COLORS.lightWhite}]}>
                    <View style={[styles.directionColumn , {flex:1}]}>
                        <View style={[styles.directionRowSpace ]}>
                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{i18n.t('start_at')} : {item.item.start_at}</Text>
                        </View>
                        <View style={[styles.directionRowSpace]}>
                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{i18n.t('expire_date')} : {item.item.expire_date}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderNoData(){
        if (this.props.subscriptions && (this.props.subscriptions).length <= 0){
            return(
                <View style={[styles.directionColumnCenter , {height:'95%'}]}>
                    <Image source={require('../../assets/images/no-data.png')} resizeMode={'contain'} style={{ alignSelf: 'center', width: 200, height: 200 }} />
                </View>
            );
        }

        return <View />
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
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>{i18n.t('subscriptions')}</Title>
                    </Body>
                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        <NavigationEvents onWillFocus={() => this.onFocus()}/>
                        <View style={[styles.paddingHorizontal_10]}>
                            {
                                this.state.loader ?
                                    this._renderRows(this.loadingAnimated, 5, '5rows') :
                                    <View>
                                        { this.renderNoData() }
                                        {
                                            this.props.subscriptions?
                                                <FlatList
                                                    data={this.props.subscriptions}
                                                    renderItem={(item) => this.renderItems(item)}
                                                    numColumns={1}
                                                    keyExtractor={this._keyExtractor}
                                                />
                                                :<View/>
                                        }

                                    </View>
                            }
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}


const mapStateToProps = ({ lang , subscriptions , profile}) => {
    return {
        lang                    : lang.lang,
        user                    : profile.user,
        subscriptions           : subscriptions.subscriptions,
    };
};
export default connect(mapStateToProps, {getSubscriptions})(ProviderSubscriptions);
