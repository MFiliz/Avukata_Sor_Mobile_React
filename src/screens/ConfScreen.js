/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {CreditCardInput, LiteCreditCardInput} from "react-native-credit-card-input";
import {
    Text,
    View,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    PermissionsAndroid,
    Platform,
    AsyncStorage, Image, ImageBackground, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';

import CallButton from '../components/CallButton';
import LoginManager from '../manager/LoginManager';
import CallManager from '../manager/CallManager';

import {Voximplant} from 'react-native-voximplant';
import COLOR from '../styles/Color';
import COLOR_SCHEME from '../styles/ColorScheme';
import styles from '../styles/Styles';
import {Header, InputGroup, Left, Right, Icon, Body, Title} from "native-base";
import * as navigation from "react-navigation";

let _this;

export default class ConfScreen extends React.Component {
    static navigationOptions = {

        drawerIcon: ({tintColor}) => (
            <Icon name="event-note" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Kredi Yükle"
    };


    constructor() {
        super();
        this.state = {
            tken: '',
            cardData: '',
            productData: '',
            isLoading: false
        };
    };

    buyCredit = () => {

        if (_this.state.cardData.status.number == "valid" && _this.state.cardData.status.expiry == "valid" && _this.state.cardData.status.cvc == "valid") {

            _this.setState({isLoading: true});
            fetch('https://testavukatasorapi.azurewebsites.net/api/Payment/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': this.state.tken
                },
                body: JSON.stringify({
                    productId: '92001CD0-1B8B-452E-AF74-08D699B1545F',
                    cardNumber: _this.state.cardData.values.number,
                    cardExpireMonth: _this.state.cardData.values.expiry.split('/')[0],
                    cardExpireYear: '20' + _this.state.cardData.values.expiry.split('/')[1],
                    cardCvvNumber: _this.state.cardData.values.cvc
                })
            }).then(res => res.json())
                .then(response => _this.UpdateBalance(response))
                .catch(error => console.error('Error:', error))
        } else {
            alert("Lütfen Kart Bilgilerini Kontrol Ediniz");
        }


    };

    UpdateBalance(response) {
        if (response.entityData.status == "SUCCESS") {
            fetch('https://testavukatasorapi.azurewebsites.net/api/User/UpdateUserBalance', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': this.state.tken
                },
                body: JSON.stringify({
                    minutes: 20
                })
            }).then(res => res.json())
                .then(response => _this.UpdateUserInfo() )
                .catch(error => console.error('Error:', error))
        } else {
            //
            alert('Bir Sorun Oluştu');
        }
    }

    UpdateUserInfo() {
        fetch('https://testavukatasorapi.azurewebsites.net/api/User/GetUserInfo', {
            headers: {
                'token': global.token
            }
        }).then(res => res.json())
            .then(response =>this.goToHomePage(response) )
            .catch(error => console.error('Error:', error))
    }
    goToHomePage(response){

        global.minutes = response.entityData.minutes.toString();
        this.props.navigation.navigate('Main',{isSuccess: 1});
    }

    getProduct = () => {
        fetch('https://testavukatasorapi.azurewebsites.net/api/Product/GetActiveProductList', {
            headers: {
                'token': global.token
            }
        }).then(res => res.json())
            .then(response => _this.setState({productData: response}))
            .catch(error => console.error('Error:', error))
    }

    _loadInitialState = async () => {
        _this = this;
        (async () => {
            const usernameValue = await AsyncStorage.getItem('token');
            _this.setState({tken: usernameValue});


        })();

    };

    componentDidMount() {
        this._loadInitialState().done();
        //this.getProduct();

    };

    _onChange = (formData) => {
        _this.setState({
            cardData: formData
        });
    }

    render() {
        return (

            <SafeAreaView style={styles.safearea}>
                <StatusBar hidden={true}/>


                <ImageBackground source={require('../assets/flat_bg.png')}
                                 style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
                    <View style={styles.useragent}>

                        <Header style={{
                            backgroundColor: 'transparent',
                            shadowColor: 'transparent',
                            shadowRadius: 0,
                            elevation: 0
                        }}>

                            <Left style={{alignItems: 'flex-start'}}>
                                <Icon name={'menu'} style={{alignSelf: 'flex-start', color: 'white'}}
                                      type="MaterialIcons" onPress={() => this.props.navigation.openDrawer()}/>
                            </Left>
                            <Body>
                                <Title style={{color: '#8197c0'}}>Avukata Sor</Title>
                            </Body>
                            <Right>

                            </Right>
                        </Header>

                        <View style={{textAlign: 'center'}}>
                            <Text style={{
                                textAlign: 'center', // <-- the magic
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginBottom: 10,
                                color: '#FFFFFF'
                            }}>Test Ürünü - 250 TL </Text>
                        </View>
                        <View>
                            <CreditCardInput onChange={this._onChange}
                                             labels={{number: "KART NUMARASI", expiry: "SKT", cvc: "CVC/CCV"}}
                                             labelStyle={{color: '#ffffff'}} inputStyle={{color: '#ffffff'}}/>
                        </View>

                            <ActivityIndicator size="large" color="#cc3333" animating={this.state.isLoading}/>

                        <View style={this.state.isLoading == false ? null : { display: "none" }}>
                            <TouchableHighlight style={styles.login_button} onPress={() => this.buyCredit()}>

                                <Text style={styles.login_button_text}>
                                    TAMAM
                                </Text>


                            </TouchableHighlight>
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>


        );
    }
}