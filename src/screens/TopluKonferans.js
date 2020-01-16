'use strict';

import React from "react";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
    ImageBackground,
    StyleSheet,
    FlatList, Modal, SafeAreaView, StatusBar, TouchableOpacity, Dimensions
} from "react-native";
import {Voximplant} from 'react-native-voximplant';
import styles from "../styles/Styles";
import CallManager from "../manager/CallManager";
import VIForegroundService from "@voximplant/react-native-foreground-service";
import CallButton from "../components/CallButton";
import COLOR from "../styles/Color";
import {Col, Row, Grid} from "react-native-easy-grid";

const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected'
};

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class TopluKonferans extends React.Component {

    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="camera-alt" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Konferans"
    };


    constructor(props) {

        super(props);
        this.endDeger = 0;
        this.conf = null;
        this.remoteList = [];
        this.callState = CALL_STATES.DISCONNECTED;
        this.state = {
            log: 'Olacak',
            sayi: 0,

            remoteVideoStreamId1: null,
            remoteVideoStreamId2: null,
            remoteVideoStreamId3: null,
            localVideoStreamId: null,
            isVideoSent: true,
            isAudioMuted: false
        };


    };

    componentWillUnmount() {
        //console.log('CallScreen: componentWillUnmount ' + this.call.callId);
        if (this.conf) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.conf.off(eventName, this[callbackName].bind(this));
                }
            });
        }
        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().off(eventName, this[callbackName].bind(this));
            }
        });
    }

    discon(deger) {
        this.endDeger = deger;
        this.conf.hangup();
        console.log("Disconnected");
    }

    artir() {
        let sayii = this.state.sayi;
        sayii = sayii + 1;
        this.setState({sayi: sayii});
    }

    azalt() {
        let sayii = this.state.sayi;
        sayii = sayii - 1;
        this.setState({sayi: sayii});
    }

    async sendVideo(doSend) {
        // console.log("CallScreen[" + this.callId + "] sendVideo: " + doSend);
        try {
            if (doSend && Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    //console.warn('CallScreen[' + this.callId + '] sendVideo: failed due to camera permission is not granted');
                    return;
                }
            }
            await this.conf.sendVideo(doSend);
            this.setState({isVideoSent: doSend});
        } catch (e) {
            console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    muteAudio() {
        // console.log("CallScreen[" + this.callId + "] muteAudio: " + !this.state.isAudioMuted);
        const isMuted = this.state.isAudioMuted;
        this.conf.sendAudio(isMuted);
        this.setState({isAudioMuted: !isMuted});
    }

    async makeConfCall() {
        if (Platform.OS === 'android') {
            let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
            if (true) {
                permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
            }
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
            const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
            if (recordAudioGranted) {
                if (true && !cameraGranted) {
                    console.warn('MainScreen: makeCall: camera permission is not granted');
                    return;
                }
            } else {
                console.warn('MainScreen: makeCall: record audio permission is not granted');
                return;
            }
        }


        //let call = await Voximplant.getInstance().callConference('123456', callSettings);
        this.conf = await Voximplant.getInstance().callConference('myconf', {
            video: {
                sendVideo: true,
                receiveVideo: true
            }
        });

        if (this.conf) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.conf.on(eventName, this[callbackName].bind(this));
                }
            });
        }
        // this.conf.on(Voximplant.CallEvents.Connected, (e) => this._onCallConnected(e));
        // this.conf.on(Voximplant.CallEvents.Disconnected, (e) => this._onCallDisconnected(e));
        // this.conf.on(Voximplant.CallEvents.Failed, (e) => this._onCallFailed(e));
        // this.conf.on(Voximplant.CallEvents.EndpointAdded, (e) => this._onEndpointAdded(e));
        // this.conf.on(Voximplant.CallEvents.LocalVideoStreamAdded, (e) => this._onLocalMediaAdded(e));
        //this.setState({log: 'conf oldu'});
    };


    _onCallConnected(e) {
        //this.callState = CALL_STATES.CONNECTED;
        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onCallConnected");
        //console.log(e);
        console.log("------------------------------------------------------------------------------------------------------");
    };

    _onCallDisconnected(e) {
        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onCallDisconnected");
        //console.log(e);
        console.log("------------------------------------------------------------------------------------------------------");

        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
        });
        CallManager.getInstance().removeCall(this.conf);
        this.callState = CALL_STATES.DISCONNECTED;
        if (Platform.OS === 'android' && Platform.Version >= 26 && this.callState === CALL_STATES.CONNECTED) {
            (async () => {
                await VIForegroundService.stopService();
            })();
        }
        console.log("End Değer_onCallDisconnected: " + this.endDeger);
        if (this.endDeger == 1) {
            this.props.navigation.navigate('Main', {isSuccess: 2});
        } else {
            this.props.navigation.navigate("Main");
        }
    };

    _onCallFailed(e) {
        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onCallFailed");
        //console.log(e);
        console.log("------------------------------------------------------------------------------------------------------");
    };

    _onCallEndpointAdded(e) {
        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onEndpointAdded");
        //console.log(e.endpoint);
        this.conf.getEndpoints().map((it) => {

            if (it.userName != null) {
                console.log("username boş değil: " + it);
                this._setupEndpointListeners(it, true);
            }
        });


        console.log("------------------------------------------------------------------------------------------------------");
    };

    _onEndpointRemoved(e) {

        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_OnEndpointRemoved");
        //console.log(e.endpoint);
        this._setupEndpointListeners(e.endpoint, false);
        console.log("------------------------------------------------------------------------------------------------------");
    }


    _onCallLocalVideoStreamAdded(e) {
        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onLocalMediaAdded");
        console.log(e.videoStream.id);
        console.log("------------------------------------------------------------------------------------------------------");
        this.setState({localVideoStreamId: e.videoStream.id});
    }


    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName].bind(this));
            }
        });
    }

    _onEndpointRemoteVideoStreamAdded = (event) => {

        console.log("------------------------------------------------------------------------------------------------------");
        console.log("_onRemoteMediaAdded");


        if (event.videoStream.id.length == 36) {
            let sayii = this.state.sayi;
            sayii = sayii + 1;
            this.setState({sayi: sayii});
            const remoteVideoStreamIdPre = `remoteVideoStreamId${this.state.sayi}`;
            this.setState({[remoteVideoStreamIdPre]: event.videoStream.id});
            console.log(`video Stream ID = ${remoteVideoStreamIdPre} = ` + event.videoStream.id);

        }
    };

    _onEndpointRemoteVideoStreamRemoved = (event) => {

        console.log("--------------------------------------------------------------------------------------------");
        console.log("_OnRemoteVideoStreamRemoved");
        console.log(event.videoStream.id);
        console.log("--------------------------------------------------------------------------------------------");
    };


    render() {
        return (


            <SafeAreaView style={styles.safearea2}>
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

                    <View style={styles.safearea2}>
                        <View style={styles.btnContainer}>

                            <TouchableHighlight style={styles.confButton} onPress={() => this.makeConfCall()}>

                                <Text style={styles.login_button_text}>
                                    CONF
                                </Text>

                            </TouchableHighlight>

                            <TouchableHighlight style={styles.confButton} onPress={() => this.discon(0)}>

                                <Text style={styles.login_button_text}>
                                    Bitir
                                </Text>

                            </TouchableHighlight>

                            <TouchableHighlight style={styles.confButton} onPress={() => this.artir()}>

                                <Text style={styles.login_button_text}>
                                    ARTIR
                                </Text>

                            </TouchableHighlight>

                            <TouchableHighlight style={styles.confButton} onPress={() => this.azalt()}>

                                <Text style={styles.login_button_text}>
                                    AZALT
                                </Text>

                            </TouchableHighlight>

                            {/*<ErrorBoundary>*/}
                        </View>
                        <View style={styles.useragent2}>
                            <View style={styles.videoPanel}>

                                <Grid>
                                    <Row>
                                        {this.state.sayi > 1 ? (
                                            <Col>
                                                <Voximplant.VideoView style={styless.remotevideo3}
                                                                      videoStreamId={this.state.remoteVideoStreamId2}
                                                                      scaleType={Voximplant.RenderScaleType.SCALE_FILL}/>
                                            </Col>) : null
                                        }
                                        <Col>
                                            <Voximplant.VideoView style={styless.remotevideo3}
                                                                  videoStreamId={this.state.remoteVideoStreamId1}
                                                                  scaleType={Voximplant.RenderScaleType.SCALE_FILL}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {this.state.sayi > 2 ? (

                                            <Col>
                                                <Voximplant.VideoView style={styless.remotevideo3}
                                                                      videoStreamId={this.state.remoteVideoStreamId3}
                                                                      scaleType={Voximplant.RenderScaleType.SCALE_FILL}/>
                                            </Col>

                                        ) : null}

                                        <Col>

                                            <Voximplant.VideoView style={styless.remotevideo3}
                                                                  videoStreamId={this.state.localVideoStreamId}
                                                                  scaleType={Voximplant.RenderScaleType.SCALE_FILL}/>
                                        </Col>
                                    </Row>
                                </Grid>

                                {/*<View style={styless.videoPanelConf}>*/}

                                {/*    <Voximplant.VideoView style={styless.remotevideo2}*/}
                                {/*                          videoStreamId={this.state.remoteVideoStreamId}*/}
                                {/*                          scaleType={Voximplant.RenderScaleType.SCALE_FIT}/>*/}

                                {/*    <Voximplant.VideoView style={styless.remotevideo2}*/}
                                {/*                          videoStreamId={this.state.remoteVideoStreamId}*/}
                                {/*                          scaleType={Voximplant.RenderScaleType.SCALE_FIT}/>*/}

                                {/*    <Voximplant.VideoView style={styless.remotevideo2}*/}
                                {/*                          videoStreamId={this.state.remoteVideoStreamId}*/}
                                {/*                          scaleType={Voximplant.RenderScaleType.SCALE_FILL}/>*/}

                                {/*</View>*/}
                            </View>
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
                                    {/*<CallButton icon_name={this.state.audioDeviceIcon} color={COLOR.ACCENT}*/}
                                    {/*            buttonPressed={() => this.switchAudioDevice()}/>*/}
                                    {this.state.isVideoSent ? (
                                        <CallButton icon_name='videocam-off' color={COLOR.ACCENT}
                                                    buttonPressed={() => this.sendVideo(false)}/>
                                    ) : (
                                        <CallButton icon_name='video-call' color={COLOR.ACCENT}
                                                    buttonPressed={() => this.sendVideo(true)}/>
                                    )}
                                    <CallButton icon_name='call-end' color={COLOR.RED}
                                                buttonPressed={() => this.discon(0)}/>

                                </View>
                            </View>
                        </View>
                        {/*</ErrorBoundary>*/}

                    </View>

                </ImageBackground>
            </SafeAreaView>


        );

    };
}


var styless = StyleSheet.create({
    containers: {
        flex: 1,
        flexDirection: 'column',
    },
    halfs: {
        flex: 2, // veya .5
        backgroundColor: '#FF44CC',
    },
    quarters: {
        flex: 1, // veya .25
        backgroundColor: '#CCC',
    },
    videoPanelConf: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    remotevideo2: {
        width: (width / 2) - 50,
        height: ((height - 250) / 2) - 10,
        margin: 10
    },
    remotevideo3: {
        flex: 1
    },
});
