/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from "react";
import {
    ScrollView,
    AsyncStorage,
    Platform,
    Text,
    ImageBackground,
    View,
    TextInput,
    Modal,
    TouchableHighlight, StyleSheet, Image, PermissionsAndroid,TouchableWithoutFeedback
} from "react-native";
import {SafeAreaView, StatusBar, FlatList} from "react-native";
import {SettingsSwitch} from 'react-native-settings-components';

import styles from "../styles/Styles";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import CallButton from "./MainScreen";
//import CustomRow from "../components/ListViewItem";
import {Voximplant} from "react-native-voximplant";
import CallManager from "../manager/CallManager";

export default class LawyerList extends React.Component {
    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="camera-alt" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Görüşmeye Başla"
    };

    constructor(props) {
        super(props);
        this.number = 'mdogankaya';
        this.state = {
            useCallKit: false,
            names: [
                {
                    title: 'Gürkan Çoban',
                    description: 'Özgeçmiş',
                    image_url: require('../assets/user_icon.png')
                },
                {
                    title: 'Deneme2',
                    description: 'deneme2 description',
                    image_url: require('../assets/user_icon.png')
                }
            ],
            balance: null,
            running: false,
            passingTime: null,
            parabalance: null,
            usertype: null,
            modalText: null,
            isModalOpen: false,
        };
    }

    componentDidMount() {
        this.getData();
        AsyncStorage.getItem('useCallKit')
            .then((value) => {
                this.setState({
                    useCallKit: JSON.parse(value)
                })
            });
    }

    async getData() {
        const tokenValue = await AsyncStorage.getItem('token');
        this.setState({tken: tokenValue});
        const usertypeVal = await AsyncStorage.getItem('userType');
        this.setState({usertype: usertypeVal});


        let balanceValue = await AsyncStorage.getItem('balance');
        this.setState({parabalance: parseInt(balanceValue)});
        let sonValue;
        sonValue = parseInt(parseInt(balanceValue) * 60);
        this.setState({balance: sonValue});


    }

    _closeModal() {
        this.setState({isModalOpen: false, modalText: ''});
        this.props.navigation.navigate("App");
    }



    async makeCall(isVideoCall) {

        if(parseInt(this.state.balance) > 0) {
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
        }else{
            this.setState({
                isModalOpen: true,
                modalText: 'Krediniz Yetersiz Olduğu İçin Arama Yapamazsınız',
                remoteVideoStreamId: null,
                localVideoStreamId: null,
            });
        }
    }

    showFiles(){
        this.props.navigation.navigate("FileScreen");
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

                            <View style={mystyles.container}>
                                <Image source={this.state.names[0].image_url} style={mystyles.photo}/>
                                <View style={mystyles.container_text}>
                                    <Text style={mystyles.title}>
                                        {this.state.names[0].title}
                                    </Text>
                                    <Text style={mystyles.description}>
                                        {this.state.names[0].description}
                                    </Text>
                                </View>
                                <View style={mystyles.container_icons}>
                                    <TouchableWithoutFeedback style={{flex:1, height:70}} onPress={() => this.showFiles()}>
                                    <Icon name="event-note" type="MaterialIcons"
                                          style={{color: '#8197c0', paddingRight: 10, fontSize: 35}}/>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback style={{flex:1, height:70}} onPress={() => this.makeCall(true)}>
                                    <Icon name="video-call" type="MaterialIcons"
                                          style={{color: '#8197c0', fontSize: 35}}/>
                                    </TouchableWithoutFeedback>
                                </View>

                            </View>

                    </View>

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
                </ImageBackground>
            </SafeAreaView>
        );

    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "7%"
                }}
            />
        );
    };

}


const mystyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        //borderRadius: 5,
        backgroundColor: 'transparent',
        elevation: 2,
    },
    title: {
        fontSize: 16,
        color: '#8197c0',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'flex-start',
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
        color: '#8197c0'
    },
    photo: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    container_icons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});