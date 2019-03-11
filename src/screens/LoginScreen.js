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
    ImageBackground,ScrollView, KeyboardAvoidingView, Button
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
            modalText: ''
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

    onConnectionFailed(reason) {
        this.setState({isModalOpen: true, modalText: 'Failed to connect, check internet settings'});
    }

    loginClicked() {
        LoginManager.getInstance().loginWithPassword(this.state.username + ".voximplant.com", this.password);
    }

    loginWithOneTimeKeyClicked() {
        LoginManager.getInstance().loginWithOneTimeKey(this.state.username + ".voximplant.com", this.password);
    }

    _focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    render() {
        return (

                <KeyboardAvoidingView  behavior="padding">
                    <StatusBar hidden={true} barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT}
                               backgroundColor={COLOR.PRIMARY_DARK}/>

                    <ImageBackground source={require('../assets/LoginBG.png')} style={{width: '100%', height: '100%', isFlex : '1'}}  resizeMode={'cover'}>
                    <View style={[styles.container]}>

                        <View>
                            <View style={styles.loginform}>
                                {/*<View style={{borderBottomWidth: 1, borderColor:'white'}}>*/}
                                    {/*<Icon name={'ios-home'} size={27} color={'white'}/>*/}
                                {/*<TextInput*/}
                                    {/*underlineColorAndroid='transparent'*/}
                                    {/*style={styles.forminput}*/}
                                    {/*placeholder="E-Mail"*/}
                                    {/*value={this.state.username}*/}
                                    {/*autoFocus={true}*/}
                                    {/*returnKeyType={"next"}*/}
                                    {/*autoCapitalize='none'*/}
                                    {/*autoCorrect={false}*/}
                                    {/*onSubmitEditing={() => this._focusNextField('password')}*/}
                                    {/*onChangeText={(text) => {*/}
                                        {/*this.setState({username: text})*/}
                                    {/*}}*/}
                                    {/*blurOnSubmit={false}/>*/}
                                {/*</View>*/}
                                <InputGroup borderType="underline" style={{marginBottom:25, marginTop:50}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color:'white'}}
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

                                <InputGroup borderType="underline" >
                                    <Icon name={'lock'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color:'white'}}
                                        placeholder="Şifre"
                                        secureTextEntry={true}
                                        ref='password'
                                        onChangeText={(text) => {
                                            this.password = text
                                        }}
                                        blurOnSubmit={true}/>
                                </InputGroup>




                              <TouchableHighlight style={styles.login_button} onPress={() => this.loginClicked()}>
                                  <Text style={styles.login_button_text}>
                                      GİRİŞ
                                  </Text>
                              </TouchableHighlight>
                                {/*<TouchableOpacity onPress={() => this.loginClicked()}*/}
                                                  {/*style={{width: 220, alignSelf: 'center'}}>*/}
                                    {/*<Text style={styles.loginbutton}>*/}
                                        {/*LOGIN*/}
                                    {/*</Text>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity onPress={() => this.loginWithOneTimeKeyClicked()}*/}
                                                  {/*style={{width: 220, alignSelf: 'center'}}>*/}
                                    {/*<Text style={styles.loginbutton}>*/}
                                        {/*LOGIN WITH ONE TIME KEY*/}
                                    {/*</Text>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
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