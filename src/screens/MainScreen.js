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
    AsyncStorage, Image, ImageBackground, KeyboardAvoidingView
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
import {Col, Row, Grid} from "react-native-easy-grid";


export default class MainScreen extends React.Component {
    // static defaultNavigationOptions = ({ navigation }) => {
    //     const params = navigation.state.params || {};
    //
    //     return {
    //         headerLeft: (
    //             <TouchableOpacity onPress={params.backClicked}>
    //                 <Text style={styles.headerButton}>
    //                     Logout
    //                 </Text>
    //             </TouchableOpacity>
    //         ),
    //         headerRight: (
    //             <TouchableOpacity onPress={params.settingsClick}>
    //                 <Text style={styles.headerButton}>
    //                     Settings
    //                 </Text>
    //             </TouchableOpacity>
    //         ),
    //         title: LoginManager.getInstance().displayName,
    //     };
    // };

    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="home" type="MaterialIcons" style={{color: 'white'}}/>
        ), title: 'Ana Sayfa'
    };


    constructor(props) {
        super(props);
        this.number = '';
        this.state = {
            isModalOpen: false,
            modalText: '',
            isSuccess: props.navigation.getParam('isSuccess', 10),
        }
    }

    componentDidMount() {
        if (this.state.isSuccess == 1) {
            this.setState({isModalOpen: true, modalText: 'Ödemeniz Başarılı Bir Şekilde Alınmıştır'});
        }
        if (this.state.isSuccess == 0) {
            this.setState({isModalOpen: true, modalText: 'Ödeme Esnasında Bir Sorun Oluştu'});
        }
        if (this.state.isSuccess == 2) {
            this.setState({isModalOpen: true, modalText: 'Krediniz Bittiği İçin Görüşme Sonlandırılmıştır.'});
        }

        this.props.navigation.setParams({settingsClick: this._goToSettings, backClicked: this._goToLogin});
        LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);
    }

    componentWillUnmount() {
        LoginManager.getInstance().off('onConnectionClosed', this._connectionClosed);
    }

    _goToSettings = () => {
        this.props.navigation.navigate('Settings')
    };

    _goToLogin = () => {


        LoginManager.getInstance().logout();
        this.props.navigation.navigate("Login");
    };

    _connectionClosed = () => {
        this.props.navigation.navigate("Login");
    };

    async makeCall(isVideoCall) {
        console.log('MainScreen: make call: ' + this.number + ', isVideo:' + isVideoCall);
        try {
            if (Platform.OS === 'android') {
                let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                if (isVideoCall) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                }
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                if (recordAudioGranted) {
                    if (isVideoCall && !cameraGranted) {
                        console.warn('MainScreen: makeCall: camera permission is not granted');
                        return;
                    }
                } else {
                    console.warn('MainScreen: makeCall: record audio permission is not granted');
                    return;
                }
            }
            const callSettings = {
                video: {
                    sendVideo: isVideoCall,
                    receiveVideo: isVideoCall
                }
            };
            if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 10) {
                const useCallKitString = await AsyncStorage.getItem('useCallKit');
                callSettings.setupCallKit = JSON.parse(useCallKitString);
            }
            let call = await Voximplant.getInstance().call(this.number, callSettings);
            let callManager = CallManager.getInstance();
            callManager.addCall(call);
            if (callSettings.setupCallKit) {
                callManager.startOutgoingCallViaCallKit(isVideoCall, this.number);
            }
            this.props.navigation.navigate('Call', {
                callId: call.callId,
                isVideo: isVideoCall,
                isIncoming: false
            });
        } catch (e) {
            console.warn('MainScreen: makeCall failed: ' + e);
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar hidden={true}/>

                <ImageBackground source={require('../assets/main_background.png')}
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


                        {/*a*/}
                        {/*<TextInput*/}
                        {/*underlineColorAndroid='transparent'*/}
                        {/*style={[styles.forminput, styles.margin]}*/}
                        {/*onChangeText={(text) => { this.number = text }}*/}
                        {/*placeholder="Call to"*/}
                        {/*defaultValue={this.number}*/}
                        {/*autoCapitalize='none'*/}
                        {/*autoCorrect={false}*/}
                        {/*blurOnSubmit={true} />*/}
                        {/*<View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>*/}
                        {/*<CallButton icon_name='call' color={COLOR.ACCENT} buttonPressed={() => this.makeCall(false)} />*/}
                        {/*<CallButton icon_name='videocam' color={COLOR.ACCENT} buttonPressed={() => this.makeCall(true)} />*/}
                        {/*</View>*/}

                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={(e) => this.setState({isModalOpen: false, modalText: '', isSuccess: 10})}
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
            </SafeAreaView>
        );
    }
}
