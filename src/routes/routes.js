/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, DrawerItems} from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CallScreen from '../screens/CallScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';
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
import {Icon} from "native-base";
import styles from "../styles/Styles";


const CustomDrawer = (props) => (
    <SafeAreaView style={{flex: 1, color:'white'}}>
        <ImageBackground source={require('../assets/drawer_bg.png')} style={{width: '100%', height: '100%', isFlex : '1'}}  resizeMode={'cover'}>
        <View style={{height: 100, justifyContent:'center', alignItems: 'center'}}>
            <Image source = {require('../assets/user_icon.png')} style={{height:70, width: 70, borderRadius:35}}/>
        </View>
        <ScrollView>

            <DrawerItems {...props}  style={{backgroundColor:'white', color:'white'}}/>
        </ScrollView>
            <View >
                <TouchableHighlight style={styles.login_button} onPress={() => this.loginClicked()}>
                    <Text style={styles.login_button_text}>
Çıkış
                    </Text>
                </TouchableHighlight>
            </View>
            </ImageBackground>
    </SafeAreaView>
);


const AppStack = createDrawerNavigator(
    {
        Main: {
            screen: MainScreen,
            title: "dee",
            label: "asd"
        },
        Settings: {
            screen: SettingsScreen,
title:'Ayarlar'
        }
    },{
        contentComponent : CustomDrawer,
        contentOptions: {
            labelStyle: {color: '#8197c0', fontSize: 20, fontFamily:'Roboto' },
            activeTintColor: '#8197c0',
        }
    }
);

const RootStack = createSwitchNavigator(
    {
        Login: LoginScreen,
        App: AppStack,
        Call: CallScreen,
        IncomingCall: IncomingCallScreen
    },
    {
        initialRouteName: 'Login',
    }
);


export default RootStack;


