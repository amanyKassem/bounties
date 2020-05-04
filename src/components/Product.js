import React, {Component} from "react";
import {
	View,
	Text,
	Image,
	ImageBackground,
	Share,
	TouchableOpacity,
	FlatList,
	I18nManager,
	ScrollView,
	ActivityIndicator,
	Animated
} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right, Textarea, Switch, Toast} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {connect} from "react-redux";
import COLORS from '../../src/consts/colors'
import Swiper from 'react-native-swiper';
import StarRating from 'react-native-star-rating';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';

import {NavigationEvents} from "react-navigation";
import {productDetails, favorite, addCart, addComment, deletProduct , bookPackage} from '../actions';

class Product extends Component {
	constructor(props) {
		super(props);
 		this.state = {
			desc: '',
			starCount: '',
			value: 1,
			value2: 1,
			status: false,
            isImageViewVisible: false,
			isFav: this.props.user  &&this.props.user.type == 'user' && this.props.products && this.props.products.is_fav == 1 ? true : false,
			isHidden: true,
			fading: false,
			isModalVisible: false,
			bounceValue: new Animated.Value(400),  //This is the initial position of the subview
			isSubmitted: false,
			SwitchOnValueHolder:false,
		}
	}

	componentWillMount() {
		this.props.productDetails(this.props.lang, this.props.navigation.state.params.id, this.props.user ? this.props.user.token : null);
	}

	specialOrders = (value , package_id) =>{
		this.setState({SwitchOnValueHolder: value });

		if(value){
			if(package_id){

				return this.props.bookPackage(this.props.lang, package_id , this.props.navigation.state.params.id , this.props.user? this.props.user.token :null , this.props ,this.props.navigation.state.params.id )
			}
			this.props.navigation.navigate('subscriptionsPackages' , {product_id:this.props.navigation.state.params.id})
		}
	};

	checkStatus(){
		if(this.state.status && this.state.SwitchOnValueHolder === false){
			Toast.show({
				text: 'تم استهلاك باقه التثبيت بالكامل',
				type: "danger",
				duration: 3000,
				textStyle: {
					color: "white",
					fontFamily: 'cairo',
					textAlign: 'center',
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({isSubmitted: false , SwitchOnValueHolder: nextProps.products.packeage_info.is_packaged });
		if(nextProps.key === 2){
			this.setState({status:true});
		}
		if(this.state.status && nextProps.key === 2){
			this.setState({SwitchOnValueHolder: false});
		}

	}

	renderAddToCart(){
		if (this.state.isSubmitted){
			return(
				<View style={[{ justifyContent: 'center', alignItems: 'center' , width:'45%', paddingHorizontal: 15, paddingVertical: 7,}]}>
					<ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
				</View>
			)
		}

		return (

            (this.props.user)
                ?
			<TouchableOpacity style={[styles.cartBtn]}
				onPress={() => this.addToCart(this.props.products.id)}>
				<Text
					style={[styles.textRegular, styles.text_White, styles.textSize_14, styles.textLeft]}>{i18n.t('addToCart')}</Text>
			</TouchableOpacity>
				:null
		);
	}

	addToCart(id) {
		this.setState({ isSubmitted: true });
		const token = this.props.user ? this.props.user.token : null;
		this.props.addCart(this.props.lang, id, token, this.state.value , this.props);
	}

	toggleModal = () => {
		this.setState({isModalVisible: !this.state.isModalVisible});
	};

	deletProduct() {
		this.props.deletProduct(this.props.lang, this.props.navigation.state.params.id, this.props.user.token, this.props);
	}

	_toggleSubview() {
		var toValue = 400;

		if (this.state.isHidden) {
			toValue = 0;
		}

		Animated.spring(
			this.state.bounceValue,
			{
				toValue: toValue,
				velocity: 3,
				tension: 2,
				friction: 8,
			}
		).start();

		// isHidden = !isHidden;

		this.setState({isHidden: !this.state.isHidden});

	}

	onShare = async () => {
		try {
			const result = await Share.share({
				message:
					'Chifz App',
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
		}
	};

	increment() {
		this.setState({value: this.state.value + 1})
	}

	decrement() {
		if (this.state.value > 1)
			this.setState({value: this.state.value - 1})
	}

	increment2() {
		if (this.state.value2 < 5)
			this.setState({value2: this.state.value2 + 1})
	}

	decrement2() {
		if (this.state.value2 > 1)
			this.setState({value2: this.state.value2 - 1})
	}

	toggleFavorite(id) {
		this.setState({isFav: !this.state.isFav});
		const token = this.props.user ? this.props.user.token : null;
		this.props.favorite(this.props.lang, id, token);
	}

	editProdect() {
		this.props.navigation.navigate('updateProduct', {data: this.props.products , product_id: this.props.navigation.state.params.id});
	}

	addComment(id) {

		if (this.state.desc === '') {

			this.setState({fading: true});

		} else {

			const token = this.props.user ? this.props.user.token : null;
			this.props.addComment(this.props.lang, id, token, this.state.desc, this.state.value2);
			this.setState({
				isModalVisible: !this.state.isModalVisible,
				desc: '',
				value2: 1,
			});

			this.props.productDetails(this.props.lang, this.props.navigation.state.params.id);

		}

	}


	_keyExtractor = (item, index) => item.id;

	renderItems = (item) => {
		return (
			<View style={[styles.notiBlock, styles.paddingHorizontal_10]}>
				<Image source={{uri: item.avatar}} style={styles.restImg}/>
				<View style={[styles.directionColumn, {flex: 1}]}>
					<View style={[styles.directionRowSpace]}>
						<Text
							style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.textLeft, {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>
							{item.user}
						</Text>
						<StarRating
							disabled={true}
							maxStars={5}
							rating={item.rate}
							fullStarColor={COLORS.fyrozy}
							starSize={15}
							starStyle={styles.starStyle}
						/>
					</View>
					<View style={[styles.directionRowSpace]}>
						<Text
							style={[styles.textRegular, styles.text_black, styles.textSize_12, styles.textLeft, {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>
							{item.comment}
						</Text>
						<Text
							style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.textLeft, {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>
							{item.time}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	onFocus() {
		this.componentWillMount();
	}
	render() {
		return (
			<Container>

				<NavigationEvents onWillFocus={() => this.onFocus()}/>

				<Header style={styles.headerView}>
					<Left style={styles.leftIcon}>
						<Button style={styles.Button} transparent
							onPress={() => this.props.navigation.goBack()}>
							<Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>
						</Button>
					</Left>
					<Body style={styles.bodyText}>
					{
						this.props.products ?
							<Title style={[styles.textRegular, styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
								{this.props.products.name}
							</Title>:
							<View/>
					}
					</Body>
					<Right style={styles.rightIcon}>

						<Right style={styles.rightIcon}>
							<Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
						</Right>
						<Button style={[styles.bg_light_oran, styles.Radius_0, styles.iconHeader, styles.flexCenter]}
							transparent onPress={() => this.onShare()}>
							<Image style={[styles.ionImage]} source={require('../../assets/images/share.png')}/>
						</Button>
					</Right>
				</Header>
				<ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
				<Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
					<NavigationEvents onWillFocus={() => this.onFocus()}/>
						{
							this.props.products ?
								<View>
									<View style={styles.viewBlock}>
										<Swiper
											containerStyle={[styles.Width_95, styles.marginVertical_15, styles.swiper, styles.viewBlock]}
											autoplay={true}
											paginationStyle={{
												alignSelf: "flex-end",
												paddingHorizontal: 30,
												position: 'absolute',
												transform: [{rotate: '90deg'}],
												right: -330,
												zIndex: 999
											}}
											dotStyle={{backgroundColor: '#fff'}}
											activeDotStyle={{backgroundColor: '#F00', width: 20,}}
											animated={true}
											loop={true}
											autoplayTimeout={2}
										>
											{
												this.props.images ?
													this.props.images.map((img) => (

														<View style={[styles.viewBlock]}>
                                                            <TouchableOpacity  onPress={() => { this.setState({ isImageViewVisible: true })}}>
															<Image style={[styles.Width_95, styles.swiper]}
																source={{uri: img.image}} resizeMode={'cover'}/>
															</TouchableOpacity>
															{

																this.props.user == null || this.props.user.type === 'user' ?
																	<Animatable.View animation="fadeInRight"
																		easing="ease-out" delay={500}
																		style={[styles.blockContent]}>

																		{
                                                                            (this.props.user)
                                                                                ?
                                                                                <View
                                                                                    style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                                                    <TouchableOpacity
                                                                                        onPress={() => this.toggleFavorite(this.props.products.id)}>
                                                                                        {
                                                                                            this.state.isFav ?
                                                                                                <Icon
                                                                                                    style={[styles.text_red, styles.textSize_20]}
                                                                                                    type="AntDesign"
                                                                                                    name='heart'/>
                                                                                                :
                                                                                                <Icon
                                                                                                    style={[styles.text_red, styles.textSize_20]}
                                                                                                    type="AntDesign"
                                                                                                    name='hearto'/>
                                                                                        }
                                                                                    </TouchableOpacity>
                                                                                </View>

																				:null
                                                                        }

																	</Animatable.View>
																	:
																	<View/>

															}

															{
																this.props.user == null || this.props.user.type === 'user' ?
																	<Animatable.View animation="fadeInRight"
																		easing="ease-out" delay={500}
																		style={[styles.blockContent , {top:65}]}>
																		<View
																			style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
																			<Text style={[styles.textRegular, styles.text_White]}>{this.props.products.discount} %</Text>
																		</View>
																	</Animatable.View>
																	:
																	<View/>
															}
															{
																this.props.user == null || this.props.user.type === 'user' ?
																	<TouchableOpacity
																		onPress={() => this.props.navigation.navigate('provider', {id: this.props.products.provider_id , name:this.props.products.provider_name})}
																					 style={[styles.blockContent, styles.Width_50 , {bottom:5 , top:'auto' , paddingHorizontal:5} , styles.directionRowC]}>
																		<Image style={[styles.provImg]} source={require('../../assets/images/bg_shope.png')}/>
																		<View style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
																			<Text style={[styles.textRegular, styles.text_White, styles.Width_100 ,styles.textSize_12, styles.textLeft , {marginBottom:5}]} numberOfLines = { 1 } prop with ellipsizeMode = "head">
																				{this.props.products.provider_name}
																			</Text>
																			<View style={{width: 70}}>
																				<StarRating
																					disabled={true}
																					maxStars={5}
																					rating={this.props.products.rates}
																					fullStarColor={COLORS.fyrozy}
																					starSize={15}
																					starStyle={styles.starStyle}
																				/>
																			</View>
																		</View>
																	</TouchableOpacity>
																	:
																	<View/>
															}
															{
																this.props.user == null || this.props.user.type === 'provider' ?
																	<Animatable.View animation="fadeInRight"
																		easing="ease-out" delay={500}
																		style={[styles.blockContent, styles.top_5, styles.marginVertical_10]}>
																		{
																			(this.props.user)
																			?
                                                                                <View
                                                                                    style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                                                    <TouchableOpacity
                                                                                        onPress={() => this.editProdect()}>
                                                                                        <Icon
                                                                                            style={[styles.text_White, styles.textSize_20]}
                                                                                            type="AntDesign" name='edit'/>
                                                                                    </TouchableOpacity>
                                                                                </View>
																				:null
																		}
																	</Animatable.View>
																	:
																	<View/>
															}
															{
																this.props.user == null || this.props.user.type === 'provider' ?
																	<Animatable.View animation="fadeInRight"
																		easing="ease-out" delay={500}
																		style={[styles.blockContent, styles.top_35, styles.marginVertical_25]}>
                                                                        {
                                                                            (this.props.user)
                                                                                ?
                                                                                <View
                                                                                    style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                                                    <TouchableOpacity
                                                                                        onPress={() => this.deletProduct()}>
                                                                                        <Icon
                                                                                            style={[styles.text_White, styles.textSize_20]}
                                                                                            type="AntDesign"
                                                                                            name='close'/>
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                                :
                                                                                null
                                                                        }
																	</Animatable.View>
																	:
																	<View/>
															}
														</View>

													)) :
													<View/>
											}

										</Swiper>
									</View>

									<View
										style={[styles.Width_90 , styles.marginVertical_15, styles.marginHorizontal_10, styles.SelfCenter , {marginBottom:150}]}>
										<View style={[styles.lightOverlay, styles.Border]}/>
										<View
											style={[styles.Width_100, styles.overHidden, styles.bg_White, styles.Border, styles.bgFullWidth, styles.paddingHorizontal_7, styles.paddingVertical_7]}>
											<View style={[styles.overHidden]}>
												<View style={[styles.rowGroup]}>
													<Text
														style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft,]}
														numberOfLines={1} prop with ellipsizeMode="head">
														{this.props.products.name}
													</Text>
													{
														this.props.user == null || this.props.user.type === 'provider' ?
															<View style={{width: 70}}>
																<StarRating
																	disabled={true}
																	maxStars={5}
																	rating={this.props.products.rates}
																	fullStarColor={COLORS.fyrozy}
																	starSize={15}
																	starStyle={styles.starStyle}
																/>
															</View>
															:
															<View/>
													}
												</View>
												<Text
													style={[styles.textRegular, styles.text_bold_gray, styles.Width_100, styles.textSize_12, styles.textLeft]}
													numberOfLines={1} prop with ellipsizeMode="head">
													{this.props.products.category} - {this.props.products.sub_category}
												</Text>

												{
													this.props.user == null || this.props.user.type === 'user' ?
														<View style={[styles.directionRowC, styles.marginVertical_10]}>
															<Text
																style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.writing, {
																	alignSelf: 'flex-start',
																	marginRight: 5
																}]}
																numberOfLines={1} prop with ellipsizeMode="head">
																{i18n.t('productQuantity')}
															</Text>
															<Text
																style={[styles.textRegular, styles.text_fyrozy, styles.width_60, styles.height_20, styles.borderLightOran, styles.textCenter, {lineHeight: 22}]}>
																3
															</Text>
														</View>
														:
														<View/>
												}
												<View style={[styles.directionColumn]}>
														<Text
															style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.writing , {alignSelf:'flex-start'}]}
															numberOfLines={1} prop with ellipsizeMode="head">
															{i18n.t('productSpec')}
														</Text>
														<Text
															style={[styles.textRegular, styles.text_bold_gray, styles.textSize_12 , styles.writing , {alignSelf:'flex-start'}]}>
															{this.props.products.description}
														</Text>
												</View>
												<View style={[styles.rowGroup, styles.marginVertical_15]}>
													<View style={[styles.rowGroup]}>
														<Text
															style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.textLeft]}>
															{i18n.t('time')}
														</Text>

														<Text style={[styles.textRegular, styles.text_fyrozy, styles.textSize_14, styles.textLeft, {
															borderRightWidth: 2,
															borderRightColor: COLORS.darkblue,
															paddingRight: 5,
															marginLeft: 5,
															textDecorationLine: this.props.products.discount > 0 ? 'none' : 'none'
														}]}>
															{this.props.products.time  }</Text>
													</View>
												</View>


												<View style={[styles.rowGroup, styles.marginVertical_15]}>
													<View style={[styles.rowGroup]}>
														<Text
															style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.textLeft]}>
															{i18n.t('productPrice')}
														</Text>

														{
                                                            this.props.products.discount > 0
															?
                                                                <Text style={[styles.textRegular, styles.text_fyrozy, styles.textSize_14, styles.textLeft, {
                                                                    borderRightWidth: 2,
                                                                    borderRightColor: COLORS.darkblue,
                                                                    paddingRight: 5,
                                                                    marginLeft: 5
                                                                }]}>

                                                                    {this.props.products.discount_price * this.state.value } {i18n.t('RS')}</Text>

																:null
                                                        }


														<Text style={[styles.textRegular, styles.text_fyrozy, styles.textSize_14, styles.textLeft, {
															borderRightWidth: 2,
															borderRightColor: COLORS.darkblue,
															paddingRight: 5,
															marginLeft: 5,
															textDecorationLine: this.props.products.discount > 0 ? 'line-through' : 'none'
														}]}>
															{this.props.products.price * this.state.value } {i18n.t('RS')}</Text>
													</View>
												</View>
												{
													this.props.user == null || this.props.user.type === 'provider' ?
														<View style={[styles.rowGroup]}>

															{
																this.props.user ?

                                                                    <View style={[styles.rowGroup,{marginVertical : 20}]}>
                                                                        <Text
                                                                            style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14, styles.textLeft]}>
                                                                            {i18n.t('specialProducts')}
                                                                        </Text>


                                                                        <TouchableOpacity onPress={() => this.checkStatus()}>
                                                                            <Switch
                                                                                onValueChange={() => this.specialOrders(!this.state.SwitchOnValueHolder , this.props.products.packeage_info.package_id)}
                                                                                value={this.state.SwitchOnValueHolder}
                                                                                thumbColor={'#fff'}
                                                                                trackColor={{false: COLORS.gray, true: COLORS.fyrozy}}
                                                                                style={[styles.marginHorizontal_15]}
                                                                                disabled={this.state.SwitchOnValueHolder || this.state.status}
                                                                            />
                                                                        </TouchableOpacity>

                                                                    </View>
																:null
                                                            }

														</View>
														:<View/>
												}
												{
													this.props.user == null || this.props.user.type === 'user' ?
														<View style={{ alignSelf: 'center' }}>
															{this.renderAddToCart()}
														</View> : <View/>
												}
											</View>
										</View>
									</View>
								</View>
								:
								<View/>
						}

				</Content>
				</ImageBackground>

				<Animated.View style={[styles.subView, styles.Width_90, {transform: [{translateY: this.state.bounceValue}]}, { alignSelf : 'center', }]}>
					<View style={[styles.lightOverlay, styles.Border]}/>

					<TouchableOpacity onPress={() => { this._toggleSubview() }} style={[styles.bg_White, styles.Border, styles.Width_100]}>
						<View style={[styles.rowGroup,]}>

							<TouchableOpacity onPress={() => { this._toggleSubview() }} style={[ styles.Width_100, styles.height_40, { flexDirection: 'row', justifyContent: 'space-between' }]}>
								{
									this.props.products ?
										<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft, styles.marginVertical_10, styles.paddingHorizontal_10]}>
											{i18n.t('comments')} <Text style={[styles.textRegular, styles.text_bold_gray, styles.textSize_14]}>
												( {this.props.products.comments_count} )
											</Text>
										</Text> : <View />
								}

								<View style={[styles.height_40, styles.width_40, styles.Radius_30, styles.bg_orange, { top: -10, zIndex: 99, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: '44%' }]}>
									<Icon type={'AntDesign'} name={this.state.isHidden ? 'up' : 'down'} style={[styles.text_White, styles.textSize_16 ]}/>
								</View>

								{
									this.props.user &&  this.props.user.type == 'user' ?
										<TouchableOpacity onPress={() => this.toggleModal()} style={[styles.rowGroup]}>
											<Text style={[styles.textRegular, styles.text_fyrozy, styles.textSize_14, {marginRight: 5}]}>
												{i18n.t('addComment')}
											</Text>
											<View style={[styles.touchPlus]}>
												<Icon type={'Entypo'} name={'plus'}
													style={[styles.plus, styles.textSize_16]}/>
											</View>
										</TouchableOpacity>
										:
										<Text style={[styles.textRegular, styles.text_fyrozy, styles.textSize_14, styles.textLeft , styles.marginHorizontal_5]}>
											{i18n.t('viewComments')}</Text>
								}
							</TouchableOpacity>
						</View>
						{
							this.props.comments.length !== 0 ?
								<ScrollView showsHorizontalScrollIndicator={false}>
									<TouchableOpacity onPress={() => { this._toggleSubview() }}>
										{
											this.props.comments ?
												<FlatList
													data={this.props.comments}
													renderItem={({item}) => this.renderItems(item)}
													numColumns={1}
													keyExtractor={this._keyExtractor}
												/>
												:<View/>
										}

									</TouchableOpacity>
								</ScrollView>
								:
								<View />
						}
					</TouchableOpacity>
				</Animated.View>

				<Modal style={{}}                      isVisible={this.state.isModalVisible}
                       avoidKeyboard                   = { true }
                       onBackdropPress={() 			   => this.toggleModal()}>
					<View style={[styles.commentModal, {padding: 15}]}>
						<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft]}>
							{i18n.t('comment')}
						</Text>
						<View style={[styles.directionRow]}>
							<View style={[styles.Width_93, {marginTop: 20 , marginRight:10}]}>

								<View style={[styles.Width_100 ]}>
									<View style={[styles.lightOverlay, styles.Border]}/>
									<Textarea
										placeholder={i18n.t('comment')}
										placeholderTextColor={COLORS.bold_gray}
										autoCapitalize='none'
										value={this.state.desc}
										onChangeText={(desc) => this.setState({desc})}
										style={[styles.textarea, styles.textRegular, styles.Width_100, styles.overHidden, styles.bg_White, styles.Border, styles.paddingHorizontal_7, styles.paddingVertical_7]}
									/>
								</View>
								{
									this.state.fading === true ?
										<Text
											style={[styles.textRegular, styles.textCenter, styles.Width_100, styles.text_red, styles.marginVertical_10]}>
											{i18n.t('addcomm')}
										</Text>
										:
										<View/>
								}
							</View>

							<View style={styles.counterParent}>
								<TouchableOpacity onPress={() => this.increment2()} style={styles.touchPlus}>
									<Icon type={'Entypo'} name={'plus'} style={styles.plus}/>
								</TouchableOpacity>
								<View style={[styles.directionColumn, styles.countText, {height: 45}]}>
									<Text
										style={[styles.text_fyrozy, styles.textRegular, styles.textSize_14]}>{this.state.value2}</Text>
									<Icon style={[styles.text_fyrozy, styles.textSize_14]} type="AntDesign"
										name='star'/>
								</View>
								<TouchableOpacity onPress={() => this.decrement2()} style={styles.touchMinus}>
									<Icon type={'Entypo'} name={'minus'} style={styles.minus}/>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity onPress={() => this.addComment(this.props.products.id)}
							style={[styles.cartBtn, styles.SelfCenter, {marginTop: 20}]}>
							<Text
								style={[styles.textRegular, styles.text_White, styles.textSize_14, styles.textLeft]}>{i18n.t('addComment')}</Text>
						</TouchableOpacity>
					</View>
				</Modal>

                <Modal onBackdropPress={() => this.setState({ isImageViewVisible: false })} avoidKeyboard={ false} visible={this.state.isImageViewVisible} transparent={true} enableImageZoom={true}  enableSwipeDown={true} >
                    <ImageViewer style={{backgroundColor:'transparent'}}  imageUrls={this.props.images}/>
                    <TouchableOpacity  style={{ position:'absolute' , top : 30 , right : 20}} onPress={() => this.setState({isImageViewVisible: false})}>
                        <Icon name="close" style={{fontSize:30,color : 'white'   }}/>
                    </TouchableOpacity>
                </Modal>
			</Container>

		);
	}
}

const mapStateToProps = ({lang, productsDetail, addComment, profile , bookPackage}) => {
	return {
		lang: lang.lang,
		products: productsDetail.products,
		images: productsDetail.images,
		comments: productsDetail.comments,
		addComments: addComment.comment,
		user: profile.user,
		status: bookPackage.status,
		key: bookPackage.key,
	};
};
export default connect(mapStateToProps, {productDetails, favorite, addCart, addComment, deletProduct, bookPackage})(Product);
