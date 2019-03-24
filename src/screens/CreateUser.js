/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
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
    AsyncStorage, Image, ImageBackground, KeyboardAvoidingView, ActivityIndicator, ScrollView
} from 'react-native';


import COLOR from '../styles/Color';

import styles from '../styles/Styles';
import {Header, InputGroup, Left, Right, Icon, Body, Title, Input} from "native-base";
import COLOR_SCHEME from "../styles/ColorScheme";


export default class CreateUser extends React.Component {


    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="home" type="MaterialIcons" style={{color: 'white'}}/>
        ), title: ''
    };

    constructor(props) {
        super(props);
        this.password = '';
        this.repassword = '';
        this.state = {
            username: '',
            email: '',
            name: '',
            surname: '',
            phone: '',
            isModalOpen: false,
            modalText: '',
            anim: false,
        }
    }


    _goToLogin = () => {
        this.props.navigation.navigate("Login");
    };


    signUP = () => {
        if (this.state.username == null || this.state.email == null || !this.state.email.includes('@' || this.state.name == null || this.state.surname == null || this.state.phone.length < 10 || this.password.length < 6 || this.password != this.repassword)) {
            this.setState({isModalOpen: true, modalText: 'Lütfen Tüm bilgileri Eksiksiz Giriniz.'})
        } else {
            this.setState({anim: true});
            fetch('https://avukatasorapi.azurewebsites.net/api/User/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    surname: this.state.surname,
                    phoneNumber: this.state.phone,
                    email: this.state.email,
                    userName: this.state.username,
                    password: this.password
                })
            }).then(res => res.json())
                .then(response => this.handleResponse(response))
                .catch(error => console.error('Error:', error))
        }
    };

    handleResponse(response) {
        if (response.responseCode != 0) {
            this.setState({anim: false});
            this.setState({isModalOpen: true, modalText:response.responseMessage })
        }else{
            this.setState({anim: false});
            this.setState({isModalOpen: true, modalText:'Başarılı' })
        }
    }

    render() {

        return (

            <View style={{flex: 1}} automaticallyAdjustContentInsets={false}>

                <StatusBar hidden={true} barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT}
                           backgroundColor={COLOR.PRIMARY_DARK}/>

                <ImageBackground source={require('../assets/flat_bg.png')}
                                 style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
                    <Header style={{
                        backgroundColor: 'transparent',
                        shadowColor: 'transparent',
                        shadowRadius: 0,
                        elevation: 0
                    }}>

                        <Left style={{alignItems: 'flex-start'}}>
                            <Icon name={'arrow-back'} style={{alignSelf: 'flex-start', color: 'white'}} type="MaterialIcons" onPress={() => this.props.navigation.navigate('Login')}/>
                        </Left>
                        <Body>

                        </Body>
                        <Right>

                        </Right>
                    </Header>

                    <View style={[styles.container]}>

                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{fontSize: 25, color: '#8197c0', textAlign: 'center'}}>AVUKATA SOR</Text>
                            <Text style={{fontSize: 15, color: '#8197c0', textAlign: 'center'}}>Kullanıcı Kayıt</Text>
                        </View>
                        <View>
                            <View style={styles.signupform}>

                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Kullanıcı Adı"
                                        placeholderTextColor="#8197c0"
                                        value={this.state.username}
                                        autoFocus={true}

                                        autoCapitalize='none'
                                        autoCorrect={false}

                                        onChangeText={(text) => {
                                            this.setState({username: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>
                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="E-Mail"
                                        placeholderTextColor="#8197c0"
                                        value={this.state.email}


                                        autoCapitalize='none'
                                        autoCorrect={false}

                                        onChangeText={(text) => {
                                            this.setState({email: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>
                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="İsim"
                                        placeholderTextColor="#8197c0"
                                        value={this.state.name}


                                        autoCapitalize='none'
                                        autoCorrect={false}

                                        onChangeText={(text) => {
                                            this.setState({name: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>
                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Soy İsim"
                                        placeholderTextColor="#8197c0"
                                        value={this.state.surname}

                                        autoCapitalize='none'
                                        autoCorrect={false}

                                        onChangeText={(text) => {
                                            this.setState({surname: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>
                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'perm-identity'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Telefon"
                                        keyboardType='numeric'
                                        placeholderTextColor="#8197c0"
                                        value={this.state.phone}

                                        autoCapitalize='none'
                                        autoCorrect={false}

                                        onChangeText={(text) => {
                                            this.setState({phone: text})
                                        }}
                                        blurOnSubmit={false}/>
                                </InputGroup>

                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'lock'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Şifre"
                                        placeholderTextColor="#8197c0"
                                        secureTextEntry={true}
                                        ref='password'
                                        onChangeText={(text) => {
                                            this.password = text
                                        }}
                                        blurOnSubmit={true}/>
                                </InputGroup>
                                <InputGroup borderType="underline" style={{marginBottom: 10}}>
                                    <Icon name={'lock'} size={27} color={'white'} type="MaterialIcons"/>
                                    <Input
                                        underlineColorAndroid='transparent'
                                        style={{color: 'white'}}
                                        placeholder="Şifre (Tekrar)"
                                        placeholderTextColor="#8197c0"
                                        secureTextEntry={true}
                                        ref='repassword'
                                        onChangeText={(text) => {
                                            this.repassword = text
                                        }}
                                        blurOnSubmit={true}/>
                                </InputGroup>


                                <ActivityIndicator size="large" color="#cc3333" animating={this.state.anim}/>
                                <TouchableHighlight style={styles.signup_button_page} onPress={() => this.signUP()}>

                                    <Text style={styles.login_button_text}>
                                        Kayıt Ol
                                    </Text>


                                </TouchableHighlight>


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


            </View>

        );
    }
}