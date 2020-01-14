import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground  , FlatList, Platform} from "react-native";
import { Icon } from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import i18n from "../../locale/i18n";
import { favorite } from '../actions';


class RowProduct extends Component {
    constructor(props){
        super(props);

        this.state={
            count : 0,
            isFav: this.props.fromFav
        }
    }

    toggleFavorite (id){
        this.setState({ isFav: ! this.state.isFav });
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.favorite( this.props.lang, id  , token );
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ isFav: nextProps.item.is_fav == 1 ? true : false });
    }

    render() {

        console.log(this.state.isFav, this.props.item.id, this.props.item.is_fav);

        return (
            <TouchableOpacity
                style={[styles.position_R, styles.flexCenter, styles.Width_90, styles.marginVertical_15]}
                onPress     = {() => this.props.navigation.navigate('product', { id : this.props.item.id })}
            >
                <View style={[styles.lightOverlay, styles.Border]} />
                <View style={[styles.rowGroup, styles.bg_White, styles.Border, styles.paddingVertical_10, styles.paddingHorizontal_10]}>

                    <View style={[styles.flex_40 , {marginRight:10}]}>
                        <Image style={{width:'100%' , height:105}} source={{uri:  this.props.item.thumbnail}} resizeMode={'cover'}/>
                        <Text style={[styles.overlay_transBlue, styles.text_White, styles.textRegular, styles.position_A, styles.top_5, styles.left_0, styles.paddingHorizontal_5]}>
                            { this.props.item.discount } %
                        </Text>
                    </View>
                    <View style={[styles.flex_55]}>
                        <View style={[styles.rowGroup]}>
                            <Text style={[styles.textRegular, styles.text_darkblue]}>
                                { this.props.item.name }
                            </Text>
                            <TouchableOpacity onPress = {() => this.toggleFavorite(this.props.item.id)}>
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
                                    {this.props.item.price} {i18n.t('RS')}
                                </Text>
                            </View>
                            <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                {i18n.t('city')} : {this.props.item.city}
                            </Text>
                            <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                {i18n.t('deliveryprice')} : {this.props.item.shipping_price} {i18n.t('RS')}
                            </Text>
                            <Text style={[styles.text_gray, styles.textSize_12, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                {i18n.t('deliverTime')} : {this.props.item.shipping_time}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const mapStateToProps = ({ lang, profile }) => {
    return {
        lang        : lang.lang,
        user		: profile.user,
    };
};
export default connect(mapStateToProps, { favorite })(RowProduct);
