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


export default class ConfScreen extends React.Component {
    static navigationOptions = {

        drawerLabel: () => null
    };


    constructor(props) {
        super(props);
    }

    render() {
        const urll = this.props.navigation.getParam('url');
        return (

            <SafeAreaView style={styles.safearea}>
                <StatusBar hidden={true}/>
                <Header
                    style={{backgroundColor: 'transparent', shadowColor: 'transparent', shadowRadius: 0, elevation: 0}}>

                    <Left style={{alignItems: 'flex-start'}}>
                        <Icon name={'menu'} style={{alignSelf: 'flex-start', color: 'white'}} type="MaterialIcons"
                              onPress={() => this.props.navigation.openDrawer()}/>
                    </Left>
                    <Body>
                    <Title style={{color: '#8197c0'}}>Avukata Sor</Title>
                    </Body>
                    <Right>

                    </Right>
                </Header>
            <Image source={{uri: urll}}
                                   style={{flex: 1}} />
            </SafeAreaView>
        );
    }
}