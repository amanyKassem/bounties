import React, { Component } from "react";
import {View, Text, Image, ImageBackground, TouchableOpacity} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Form} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';

class Subscription extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
        }
    }



    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <DoubleBounce size={20} />
                </View>
            );
        }
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('terms') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/terms.png')}/>)
    });

    render() {

        return (
            <Container>
                { this.renderLoader() }
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            { i18n.t('subscription') }
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        <View style={[styles.position_R, styles.bgFullWidth, styles.Width_80, styles.marginVertical_15, styles.SelfCenter]}>
                            <View style={[styles.overHidden]}>
                                <Animatable.View animation="fadeInRight" easing="ease-out" delay={500}>
                                    <Text style={[styles.textRegular, styles.bg_darkBlue , styles.text_White, styles.textCenter, styles.Width_100,  styles.textSize_16 , styles.paddingVertical_7]}>
                                        { i18n.t('subscriptionDetails') }
                                    </Text>
                                   <View style={[styles.bg_fyrozy]}>
                                       <Text style={[styles.textRegular , styles.text_White, styles.textCenter, styles.Width_100, styles.marginVertical_15]}>
                                           fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff
                                           fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff fffffff
                                       </Text>

                                       <TouchableOpacity
                                           style={[
                                               styles.bg_darkBlue,
                                               styles.width_150,
                                               styles.flexCenter,
                                               styles.marginVertical_15,
                                               styles.height_40
                                           ]}
                                           onPress={() => this.props.navigation.navigate('ChoosePayment' , {routeName:'subscription'})}>
                                           <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                               {i18n.t('subscription')}
                                           </Text>
                                       </TouchableOpacity>
                                   </View>
                                </Animatable.View>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang, terms }) => {
    return {
        lang        : lang.lang,
        loader      : terms.loader
    };
};
export default connect(mapStateToProps, {  })(Subscription);