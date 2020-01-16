/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, DrawerItems} from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CallScreen from '../screens/CallScreen';
import LawyerList from "../screens/LawyerList";
import IncomingCallScreen from '../screens/IncomingCallScreen';
import ConfScreen from '../screens/ConfScreen';
import FileScreen from '../screens/FilesScreen';
import Konferans from '../screens/TopluKonferans';
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Button,
    TouchableHighlight, Text
} from 'react-native';
import COLOR from '../styles/Color';
import React from "react";
import {Icon, InputGroup} from "native-base";
import styles from "../styles/Styles";
import LoginManager from '../manager/LoginManager';
import * as navigation from "react-navigation";
import BuyCredit from "../screens/BuyCredit";
import CreateUser from "../screens/CreateUser";


const CustomDrawer = (props) => (
    <SafeAreaView style={{flex: 1, color: 'white'}}>
        <ImageBackground source={require('../assets/drawer_bg.png')}
                         style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
            <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../assets/user_icon.png')} style={{height: 70, width: 70, borderRadius: 35}}/>
            </View>
            <ScrollView>

                <DrawerItems {...props} style={{backgroundColor: 'white', color: 'white'}}/>
            </ScrollView>
            <View style={{alignItems:'center', justifyContent:'center',}}>
                <Text style={styles.settings_button_text}>
                    Bakiyeniz: { global.minutes} DK
                </Text>
            </View>
            <View style={styles.container_nav}>
                <TouchableHighlight style={styles.settings_button} onPress={() => _goToSettings(props)}>
                    <View style={{alignItems:'center', justifyContent:'center',}}>
                        <Icon name={'settings'} size={25} style={{color:'#8197c0'}} type="MaterialIcons"/>
                        <Text style={styles.settings_button_text}>
                            Ayarlar
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.exit_button} onPress={() => _goToLogin(props)}>
                    <View style={{alignItems:'center', justifyContent:'center',}}>
                        <Icon name={'exit-to-app'} size={25} style={{color:'#8197c0'}} type="MaterialIcons"/>
                        <Text style={styles.exit_button_text}>
                            Çıkış
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        </ImageBackground>
    </SafeAreaView>
);


const AppStack = createDrawerNavigator(
    {
        Main: {
            screen: MainScreen,
        },
        LawyerList: {
          screen:LawyerList
        },
        BuyCredit: {
            screen: BuyCredit
        },
        Settings: {
            screen: SettingsScreen,
        },
        FileScreen: {
            screen: FileScreen,
        },
        ConfScreen: {
            screen: ConfScreen
        },
        Konferans: {
            screen: Konferans
        }


    }, {
        contentComponent: CustomDrawer,
        contentOptions: {
            labelStyle: {color: '#8197c0', fontSize: 20, fontFamily: 'Roboto'},
            activeTintColor: '#8197c0',
        }
    }
);

const RootStack = createSwitchNavigator(
    {
        Login: LoginScreen,
        App: AppStack,
        Call: CallScreen,
        IncomingCall: IncomingCallScreen,
        CreateUser: CreateUser,

    },
    {
        initialRouteName: 'Login',
    }
);

function _goToLogin (props) {


    LoginManager.getInstance().logout();
    props.navigation.navigate("Login");
};

function _goToSettings(props){
    props.navigation.navigate("Settings");

};
export default RootStack;


