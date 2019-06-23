'use strict';

import React from 'react';
import {CreditCardInput} from "react-native-credit-card-input";
import {
    Text,
    View,
    TouchableHighlight,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    AsyncStorage, Image, ImageBackground, ActivityIndicator, KeyboardAvoidingView
} from 'react-native';

import styles from '../styles/Styles';
import {Header, Left, Right, Icon, Body, Title} from "native-base";
import * as navigation from "react-navigation";

let _this;

export default class PayModal extends React.Component {
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
        if (_this.state.cardData != '') {
            if (_this.state.cardData.status.number == "valid" && _this.state.cardData.status.expiry == "valid" && _this.state.cardData.status.cvc == "valid") {

                _this.setState({isLoading: true});
                fetch('https://avukatasorapi.azurewebsites.net/api/Payment/Create', {
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
        } else {
            alert("Lütfen Kart Bilgilerini Kontrol Ediniz");
        }


    };

    UpdateBalance(response) {
        if (response.entityData.status == "SUCCESS") {
            fetch('https://avukatasorapi.azurewebsites.net/api/User/UpdateUserBalance', {
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
                .then(response => _this.UpdateUserInfo())
                .catch(error => console.error('Error:', error))
        } else {
            //
            alert('Bir Sorun Oluştu');
        }
    }

    UpdateUserInfo() {
        fetch('https://avukatasorapi.azurewebsites.net/api/User/GetUserInfo', {
            headers: {
                'token': global.token
            }
        }).then(res => res.json())
            .then(response => this.goToHomePage(response))
            .catch(error => console.error('Error:', error))
    }

    goToHomePage(response) {

        global.minutes = response.entityData.minutes.toString();
        this.props.updateState(response.entityData.minutes);
    }

    getProduct = () => {
        fetch('https://avukatasorapi.azurewebsites.net/api/Product/GetActiveProductList', {
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


            <View>

                    <View style={{textAlign: 'center'}}>
                        <Text style={{
                            textAlign: 'center', // <-- the magic
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginBottom: 10,
                            color: '#000000'
                        }}>Test Ürünü - 250 TL </Text>
                    </View>
                    <View>
                        <CreditCardInput onChange={this._onChange}
                                         labels={{number: "KART NUMARASI", expiry: "SKT", cvc: "CVC/CCV"}}
                                         labelStyle={{color: '#000000'}} inputStyle={{color: '#000000'}}

                        />
                    </View>


                    <View style={this.state.isLoading == false ? null : {display: "none"}}>

                        <View style={{flexDirection: "row", marginTop: 20}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={{alignSelf: 'stretch', backgroundColor: '#cc3333'}}
                                                  onPress={() => this.props.closeModal()}>
                                    <Text style={{
                                        alignSelf: 'center',
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '600',
                                        paddingTop: 10,
                                        paddingBottom: 10
                                    }}>VAZGEÇ</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{borderLeftWidth: 1, borderLeftColor: 'white'}}/>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={{alignSelf: 'stretch', backgroundColor: '#cc3333'}}
                                                  onPress={() => this.buyCredit()}>
                                    <Text style={{
                                        alignSelf: 'center',
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '600',
                                        paddingTop: 10,
                                        paddingBottom: 10
                                    }}>TAMAM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*<TouchableHighlight style={styles.login_button} onPress={() => this.buyCredit()}>*/}

                        {/*    <Text style={styles.login_button_text}>*/}
                        {/*        TAMAM*/}
                        {/*    </Text>*/}


                        {/*</TouchableHighlight>*/}
                        {/*<TouchableHighlight style={styles.login_button} onPress={() => this.buyCredit()}>*/}

                        {/*    <Text style={styles.login_button_text}>*/}
                        {/*        İPTAL*/}
                        {/*    </Text>*/}


                        {/*</TouchableHighlight>*/}
                    </View>

            </View>


        );
    }
}