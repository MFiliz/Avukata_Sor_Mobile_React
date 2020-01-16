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
    Platform,
    SafeAreaView,
    StatusBar,
    FlatList,
    PermissionsAndroid, ImageBackground, AsyncStorage, Button
} from 'react-native';

import PayModal from '../components/PayModal';
import {Voximplant} from 'react-native-voximplant';
import CallButton from '../components/CallButton';
import {Keypad} from '../components/Keypad';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import CallManager from '../manager/CallManager';
import styles from '../styles/Styles';
import VIForegroundService from "@voximplant/react-native-foreground-service";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import CountDown from 'react-native-countdown-component';

const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected'
};

export default class CallScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.isIncoming = params ? params.isIncoming : false;
        this.callState = CALL_STATES.DISCONNECTED;
        this.gecenzaman = 0;
        this.endDeger = 0;
        this.displayname = params ? params.displayName : null;
        this.state = {
            isAudioMuted: false,
            isVideoSent: this.isVideoCall,
            isKeypadVisible: false,
            isModalOpen: false,
            modalText: '',
            localVideoStreamId: null,
            remoteVideoStreamId: null,
            audioDeviceSelectionVisible: false,
            audioDevices: [],
            audioDeviceIcon: 'hearing',
            tken: '',
            running: false,
            passingTime: null,
            usertype: null,
            paymentModal : false,
            minutes: 0

        };

        this.call = CallManager.getInstance().getCallById(this.callId);

        console.log("CallScreen: ctr: callid: " + this.callId + ", isVideoCall: " + this.isVideoCall
            + ", isIncoming:  " + this.isIncoming + ", callState: " + this.callState );
    }

    async getData() {
        const tokenValue = await AsyncStorage.getItem('token');
        this.setState({tken: tokenValue});
        const usertypeVal = await AsyncStorage.getItem('userType');
        this.setState({usertype: usertypeVal});


        let balanceValue = global.minutes;
        this.setState({minutes: parseInt(balanceValue)});
        //alert(this.state.minutes);

        if (balanceValue == 0) {
            this.setState({
                isModalOpen: true,
                modalText: 'Krediniz Yetersiz Olduğu İçin Arama Yapamazsınız',
                remoteVideoStreamId: null,
                localVideoStreamId: null,
            });
        }


    }

    calculateCallTime() {

        this.gecenzaman += 1;
        //alert(this.gecenzaman);
        if ((this.gecenzaman % 60) == 0) {
            this.sendBalance();

        }
        ;
    }


    sendBalance() {


        let guncellenecek = parseInt(this.state.minutes) - 1;
        console.log("state.min: " + this.state.minutes);
        console.log("güncellenecek: " + guncellenecek);

        this.setState({minutes: guncellenecek});
        AsyncStorage.setItem('balance', guncellenecek.toString());
        global.minutes = guncellenecek.toString();
        console.log("gloval: " + global.minutes);
        if (guncellenecek == 3) {
            alert("Krediniz Azalıyor.")

        }


        fetch('https://testavukatasorapi.azurewebsites.net/api/User/UpdateUserBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json',
                'token': this.state.tken,
            },
            body: JSON.stringify({
                minutes: -1
            })
        }).then(res => res.json())
            .then(response => {

            })
            .catch(error => console.error('Error:', error))
        if (guncellenecek == 0) {
            this.endCall(1);
        }
    }


    componentDidMount() {
        this.getData();
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
            if (this.isIncoming) {
                this.call.getEndpoints().forEach(endpoint => {
                    this._setupEndpointListeners(endpoint, true);
                });
            }
        }
        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().on(eventName, this[callbackName]);
            }
        });

        if (this.isIncoming) {
            const callSettings = {
                video: {
                    sendVideo: this.isVideoCall,
                    receiveVideo: this.isVideoCall
                }
            };
            this.call.answer(callSettings);
        }
        this.callState = CALL_STATES.CONNECTING;
    }

    componentWillUnmount() {
        console.log('CallScreen: componentWillUnmount ' + this.call.callId);
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
        }
        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().off(eventName, this[callbackName]);
            }
        });
    }

    muteAudio() {
        console.log("CallScreen[" + this.callId + "] muteAudio: " + !this.state.isAudioMuted);
        const isMuted = this.state.isAudioMuted;
        this.call.sendAudio(isMuted);
        this.setState({isAudioMuted: !isMuted});
    }

    async sendVideo(doSend) {
        console.log("CallScreen[" + this.callId + "] sendVideo: " + doSend);
        try {
            if (doSend && Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('CallScreen[' + this.callId + '] sendVideo: failed due to camera permission is not granted');
                    return;
                }
            }
            await this.call.sendVideo(doSend);
            this.setState({isVideoSent: doSend});
        } catch (e) {
            console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    async hold(doHold) {
        console.log('CallScreen[' + this.callId + '] hold: ' + doHold);
        try {
            await this.call.hold(doHold);
        } catch (e) {
            console.warn('Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message);
        }
    }

    async receiveVideo() {
        console.log('CallScreen[' + this.callId + '] receiveVideo');
        try {
            await this.call.receiveVideo();
        } catch (e) {
            console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
        }
    }

    endCall(deger) {
        this.endDeger = deger;
        console.log("CallScreen[" + this.callId + "] endCall");
        this.call.getEndpoints().forEach(endpoint => {
            this._setupEndpointListeners(endpoint, false);
        });
        this.call.hangup();
    }

    switchKeypad() {
        let isVisible = this.state.isKeypadVisible;
        this.setState({isKeypadVisible: false});
    }

    async switchAudioDevice() {
        console.log('CallScreen[' + this.callId + '] switchAudioDevice');
        let devices = await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
        this.setState({audioDevices: devices, audioDeviceSelectionVisible: true});
    }

    selectAudioDevice(device) {
        console.log('CallScreen[' + this.callId + '] selectAudioDevice: ' + device);
        Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(device);
        this.setState({audioDeviceSelectionVisible: false});
    }

    _keypadPressed(value) {
        console.log("CallScreen[" + this.callId + "] _keypadPressed(: " + value);
        this.call.sendTone(value);
    }

    _closeModal() {
        this.setState({isModalOpen: false, modalText: ''});
        this.props.navigation.navigate("App");
    }

    _onCallFailed = (event) => {
        this.callState = CALL_STATES.DISCONNECTED;
        CallManager.getInstance().removeCall(this.call);
        this.setState({
            isModalOpen: true,
            modalText: 'Call failed: ' + event.reason,
            remoteVideoStreamId: null,
            localVideoStreamId: null,
        });
    };

    _onCallDisconnected = (event) => {
        console.log('CallScreen: _onCallDisconnected: ' + event.call.callId);
        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
        });
        CallManager.getInstance().removeCall(this.call);
        this.callState = CALL_STATES.DISCONNECTED;
        if (Platform.OS === 'android' && Platform.Version >= 26 && this.callState === CALL_STATES.CONNECTED) {
            (async () => {
                await VIForegroundService.stopService();
            })();
        }
        if (this.endDeger == 1) {
            this.props.navigation.navigate('Main', {isSuccess: 2});
        } else {
            this.props.navigation.navigate("Main");
        }
    };

    _onCallConnected = (event) => {
        console.log('CallScreen: _onCallConnected: ' + this.call.callId);
        if (this.state.usertype == '2') {
            this.setState({running: true});
        }

        // this.call.sendMessage('Test message');
        // this.call.sendInfo('rn/info', 'test info');
        this.callState = CALL_STATES.CONNECTED;
        if (Platform.OS === 'android' && Platform.Version >= 26) {
            const channelConfig = {
                id: 'ForegroundServiceChannel',
                name: 'In progress calls',
                description: 'Notify the call is in progress',
                enableVibration: false
            };
            const notificationConfig = {
                channelId: 'ForegroundServiceChannel',
                id: 3456,
                title: 'Voximplant',
                text: 'Call in progress',
                icon: 'ic_vox_notification'
            };
            (async () => {
                await VIForegroundService.createNotificationChannel(channelConfig);
                await VIForegroundService.startService(notificationConfig);
            })();
        }
    };

    _onCallLocalVideoStreamAdded = (event) => {
        console.log('CallScreen: _onCallLocalVideoStreamAdded: ' + this.call.callId + ', video stream id: ' + event.videoStream.id);
        this.setState({localVideoStreamId: event.videoStream.id});
    };

    _onCallLocalVideoStreamRemoved = (event) => {
        console.log('CallScreen: _onCallLocalVideoStreamRemoved: ' + this.call.callId);
        this.setState({localVideoStreamId: null});
    };

    _onCallEndpointAdded = (event) => {
        console.log('CallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, true);
    };

    _onEndpointRemoteVideoStreamAdded = (event) => {
        console.log('CallScreen: _onEndpointRemoteVideoStreamAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({remoteVideoStreamId: event.videoStream.id});
        console.log("------------------------------------------------------------------------------");
        console.log(event);
        console.log("------------------------------------------------------------------------------");
        this.setState({displayname: event.displayName});
    };

    _onEndpointRemoteVideoStreamRemoved = (event) => {
        console.log('CallScreen: _onEndpointRemoteVideoStreamRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({remoteVideoStreamId: null});
    };

    _onEndpointRemoved = (event) => {
        console.log('CallScreen: _onEndpointRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, false);
    };

    _onEndpointInfoUpdated = (event) => {
        console.log('CallScreen: _onEndpointInfoUpdated: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
    };

    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
            }
        });
    }

    _onAudioDeviceChanged = (event) => {
        console.log('CallScreen: _onAudioDeviceChanged:' + event.currentDevice);
        switch (event.currentDevice) {
            case Voximplant.Hardware.AudioDevice.BLUETOOTH:
                this.setState({audioDeviceIcon: 'bluetooth-audio'});
                break;
            case Voximplant.Hardware.AudioDevice.SPEAKER:
                this.setState({audioDeviceIcon: 'volume-up'});
                break;
            case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
                this.setState({audioDeviceIcon: 'headset'});
                break;
            case Voximplant.Hardware.AudioDevice.EARPIECE:
            default:
                this.setState({audioDeviceIcon: 'hearing'});
                break;
        }
    };

    _onAudioDeviceListChanged = (event) => {
        (async () => {
            let device = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
            console.log(device);
        })();
        this.setState({audioDevices: event.newDeviceList});
    };

    flatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                    marginTop: 10,
                    marginBottom: 10
                }}
            />
        );
    };

    updateState = (minute) => {
        this.setState({
            paymentModal: !this.state.paymentModal
        });

        this.setState({minutes: parseInt(minute)});
        this.gecenzaman = 0;
    }
    justClosePayModal = () => {
        this.setState({
            paymentModal: !this.state.paymentModal
        });

        this.setState({minutes: parseInt(global.minutes)});

    }
    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <ImageBackground source={require('../assets/flat_bg.png')}
                                 style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
                    <StatusBar hidden={true}/>
                    <Header style={{
                        backgroundColor: 'transparent',
                        shadowColor: 'transparent',
                        shadowRadius: 0,
                        elevation: 0
                    }}>

                        <Left style={{alignItems: 'flex-start'}}>
                            <Icon name={'arrow-back'} style={{alignSelf: 'flex-start', color: 'white'}}
                                  type="MaterialIcons" onPress={() => this.props.navigation.navigate('Main')}/>
                        </Left>
                        <Body>
                        <Title style={{color: '#8197c0'}}>Avukata Sor</Title>
                        </Body>
                        <Right>

                        </Right>
                    </Header>
                    <View style={{flexDirection: 'column', justifyContent: 'center', paddingBottom: 20}}>
                        <Text style={{fontSize: 25, color: 'white', textAlign: 'center'}}>{this.displayname}</Text>
                        <Text style={{fontSize: 15, color: 'white', textAlign: 'center'}}></Text>
                        <CountDown
                            until={parseInt(parseInt(this.state.minutes) * 60)}
                            onChange={() => this.calculateCallTime()}
                            size={25}
                            showSeparator
                            timeToShow={['H' ,'M', 'S']}
                            timeLabels={{h:null, m: null, s: null}}
                            timeLabelStyle={{color: '#8197c0'}}
                            digitStyle={{backgroundColor: 'transparent'}}
                            digitTxtStyle={{color: '#8197c0'}}
                            separatorStyle={{color: '#8197c0'}}
                            running={this.state.running}
                        />
                        <TouchableOpacity style={{backgroundColor: '#cc3333'}} onPress={() => this.updateState()} >
                            <View>
                                <Text style={styles.credit_insert_button}>KREDİ YÜKLE</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<Button color="#cc3333" onPress={() => this.updateState()}*/}
                        {/*        title="KREDİ YÜKLE"/>*/}
                    </View>
                    <View style={styles.useragent}>
                        <View style={styles.videoPanel}>
                            <Voximplant.VideoView style={styles.remotevideo}
                                                  videoStreamId={this.state.remoteVideoStreamId}
                                                  scaleType={Voximplant.RenderScaleType.SCALE_FIT}/>
                            {this.state.isVideoSent ? (
                                <Voximplant.VideoView style={styles.selfview}
                                                      videoStreamId={this.state.localVideoStreamId}
                                                      scaleType={Voximplant.RenderScaleType.SCALE_FIT}
                                                      showOnTop={true}/>
                            ) : (
                                null
                            )}
                        </View>

                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.call_connecting_label}>{this.state.callState}</Text>
                        </View>

                        {this.state.isKeypadVisible ? (
                            <Keypad keyPressed={(e) => this._keypadPressed(e)}/>
                        ) : (
                            null
                        )}

                        <View style={styles.call_controls}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                backgroundColor: 'transparent'
                            }}>
                                {this.state.isAudioMuted ? (
                                    <CallButton icon_name='mic' color={COLOR.ACCENT}
                                                buttonPressed={() => this.muteAudio()}/>
                                ) : (
                                    <CallButton icon_name='mic-off' color={COLOR.ACCENT}
                                                buttonPressed={() => this.muteAudio()}/>
                                )}
                                {/*<CallButton icon_name='dialpad' color={COLOR.ACCENT}*/}
                                {/*buttonPressed={() => this.switchKeypad()}/>*/}
                                <CallButton icon_name={this.state.audioDeviceIcon} color={COLOR.ACCENT}
                                            buttonPressed={() => this.switchAudioDevice()}/>
                                {this.state.isVideoSent ? (
                                    <CallButton icon_name='videocam-off' color={COLOR.ACCENT}
                                                buttonPressed={() => this.sendVideo(false)}/>
                                ) : (
                                    <CallButton icon_name='video-call' color={COLOR.ACCENT}
                                                buttonPressed={() => this.sendVideo(true)}/>
                                )}
                                <CallButton icon_name='call-end' color={COLOR.RED}
                                            buttonPressed={() => this.endCall(0)}/>

                            </View>
                        </View>

                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.audioDeviceSelectionVisible}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({audioDeviceSelectionVisible: false})
                                }}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <FlatList
                                            data={this.state.audioDevices}
                                            keyExtractor={(item, index) => item}
                                            ItemSeparatorComponent={this.flatListItemSeparator}
                                            renderItem={({item}) => <Text onPress={() => {
                                                this.selectAudioDevice(item)
                                            }}> {item} </Text>}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>


                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={(e) => this._closeModal()}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View
                                        style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <Text>{this.state.modalText}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>

                        <Modal
                            animationType='fade'
                            transparent={false}
                            visible={this.state.paymentModal}
                            //onRequestClose={() => this.paymentModalClose()}
                        >
                            <TouchableHighlight
                                //onPress={(e) => this._closeModal()}
                                style={styles.container}>
                                <View>
                                   <PayModal updateState = {this.updateState} closeModal = {this.justClosePayModal}/>
                                </View>
                            </TouchableHighlight>
                        </Modal>

                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
