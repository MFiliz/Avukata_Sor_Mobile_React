/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    PermissionsAndroid,
    Platform, ImageBackground
} from 'react-native';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import COLOR from '../styles/Color';
import styles from '../styles/Styles';
import VIForegroundService from "@voximplant/react-native-foreground-service";
const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected'
};
export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;


        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);

        this.state = {
            displayName: null
        }
    }

    componentDidMount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            this.call = null;
        }
    }

    async answerCall(withVideo) {
        try {
            if (Platform.OS === 'android') {
                let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                if (withVideo) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                }
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                if (recordAudioGranted) {
                    if (withVideo && !cameraGranted) {
                        console.warn('IncomingCallScreen: answerCall: camera permission is not granted');
                        return;
                    }
                } else {
                    console.warn('IncomingCallScreen: answerCall: record audio permission is not granted');
                    return;
                }
            }
        } catch (e) {
            console.warn('IncomingCallScreen: asnwerCall:' + e);
            return;
        }
        this.props.navigation.navigate('Call', {
            callId: this.call.callId,
            isVideo: withVideo,
            isIncoming: true,
            displayName: this.state.displayName
        });
    }

    declineCall() {
        this.call.decline();
    }

    _onCallDisconnected = (event) => {
        CallManager.getInstance().removeCall(event.call);
        this.callState = CALL_STATES.DISCONNECTED;
        if (Platform.OS === 'android' && Platform.Version >= 26 && this.callState === CALL_STATES.CONNECTED) {
            (async () => {
                await VIForegroundService.stopService();
            })();
        }
        this.props.navigation.navigate("App");
    };

    _onCallEndpointAdded = (event) => {
        console.log('IncomingCallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({displayName: event.endpoint.displayName});
    };

    render() {
        return (
            <SafeAreaView style={[styles.safearea, styles.aligncenter]}>
                <ImageBackground source={require('../assets/flat_bg.png')} style={{width: '100%', height: '100%', isFlex : '1'}}  resizeMode={'cover'}>
                <Text style={styles.incoming_call1}>Arayan Kişi</Text>
                <Text style={styles.incoming_call}>{this.state.displayName}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 120, marginTop:50 }}>
                    <CallButton icon_name='call' color={COLOR.WHITE} buttonPressed={() => this.answerCall(false)} />
                    <CallButton icon_name='videocam' color={COLOR.WHITE} buttonPressed={() => this.answerCall(true)} />
                    <CallButton icon_name='call-end' color={COLOR.RED} buttonPressed={() => this.declineCall()} />
                </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
