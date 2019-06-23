/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    AsyncStorage,
    ImageBackground, ScrollView, KeyboardAvoidingView, Button, ActivityIndicator, Keyboard
} from 'react-native';
import {Container, InputGroup, Input, Content} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginManager from '../manager/LoginManager';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import styles from '../styles/Styles';

let _this;

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.state = {
            username: '',
            isModalOpen: false,
            modalText: '',
            anim: false,
        }
    }

    componentDidMount() {
        _this = this;
        (async () => {
            const usernameValue = await AsyncStorage.getItem('usernameValue');
            _this.setState({username: usernameValue});
        })();
        LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
        LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
        LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    }

    onLoginFailed(errorCode) {
        switch (errorCode) {
            case 401:
                this.setState({isModalOpen: true, modalText: 'Invalid password'});
                break;
            case 403:
                this.setState({isModalOpen: true, modalText: 'Account frozen'});
                break;
            case 404:
                this.setState({isModalOpen: true, modalText: 'Invalid username'});
                break;
            case 701:
                this.setState({isModalOpen: true, modalText: 'Token expired'});
                break;
            default:
            case 500:
                this.setState({isModalOpen: true, modalText: 'Internal error'});
        }
    }

    onLoggedIn(displayName) {
        (async () => {
            await AsyncStorage.setItem('usernameValue', this.state.username);
        })();
        this.props.navigation.navigate('App');
    }

    loginWebApp() {
        fetch('https://avukatasorapi.azurewebsites.net/api/User/Login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: this.state.username,
                Password: this.password,
            })
        }).then(res => res.json())
            .then(response => this.setLoginCredentials(response))
            .catch(error => console.error('Error:', error))
    }

    setLoginCredentials(response) {
        if (response.entityData != null) {
            (async () => {
                await AsyncStorage.setItem('userId', response.entityData.userId);
                await AsyncStorage.setItem('name', response.entityData.name);
                await AsyncStorage.setItem('surname', response.entityData.surname);
                await AsyncStorage.setItem('phone', response.entityData.phone);
                await AsyncStorage.setItem('userName', response.entityData.userName);
                await AsyncStorage.setItem('email', response.entityData.email);
                await AsyncStorage.setItem('voxImplantUserId', response.entityData.voxImplantUserId.toString());
                await AsyncStorage.setItem('token', response.entityData.token);
                await AsyncStorage.setItem('userType', response.entityData.userType.toString());
                await AsyncStorage.setItem('passwordHash', response.entityData.passwordHash);
                await AsyncStorage.setItem('balance', response.entityData.minutes.toString());
                global.token = response.entityData.token;
                global.minutes=  response.entityData.minutes.toString();
            })();
            LoginManager.getInstance().loginWithPassword(response.entityData.userName + "@avukatasortest.mdogankaya.voximplant.com", response.entityData.passwordHash)
        } else {
            this.setState({anim: false});
        }
    }

    onConnectionFailed(reason) {
        this.setState({isModalOpen: true, modalText: 'Failed to connect, check internet settings'});
    }

    loginClicked() {
        Keyboard.dismiss();
        this.setState({anim: true});
        this.loginWebApp();
        // LoginManager.getInstance().loginWithPassword(this.state.username + ".voximplant.com", this.password);
    }

    loginWithOneTimeKeyClicked() {
        LoginManager.getInstance().loginWithOneTimeKey(this.state.username + ".voximplant.com", this.password);
    }

    _focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    _signUp(){
        this.props.navigation.navigate('CreateUser');
    }

    render() {
        return (

            <KeyboardAvoidingView behavior="padding">
                <StatusBar hidden={true} barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT}
                           backgroundColor={COLOR.PRIMARY_DARK}/>

                <ImageBackground source={require('../assets/LoginBG.png')}
                                 style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
                    <View style={[styles.container]}>

                        <View>
                            <View style={styles.loginform}>


                                <InputGroup borderType="underline" style={{marginBottom: 25, marginTop: 50}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="E-Mail"
                                        value={this.state.username}
                                        autoFocus={true}
                                        returnKeyType={"next"}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        onSubmitEditing={() => this._focusNextField('password')}
                                        onChangeText={(text) => {
                                            this.setState({username: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>

                                <InputGroup borderType="underline">
                                    <Icon name={'lock'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Şifre"
                                        secureTextEntry={true}
                                        ref='password'
                                        onChangeText={(text) => {
                                            this.password = text
                                        }}
                                        blurOnSubmit={true}/>
                                </InputGroup>



                                <ActivityIndicator size="large" color="#cc3333" animating={this.state.anim}/>
                                <TouchableHighlight style={styles.login_button} onPress={() => this.loginClicked()}>

                                        <Text style={styles.login_button_text}>
                                            GİRİŞ
                                        </Text>


                                </TouchableHighlight>


                            </View>
                            <Text style={styles.signup_button_text} onPress={() => this._signUp()}>KAYIT OL</Text>
                        </View>

                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={(e) => this.setState({isModalOpen: false})}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View
                                        style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <Text>{this.state.modalText}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>
                    </View>
                </ImageBackground>

            </KeyboardAvoidingView>

        );
    }
}