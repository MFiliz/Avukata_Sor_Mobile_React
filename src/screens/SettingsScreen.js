/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from "react";
import {ScrollView, AsyncStorage, Platform, View} from "react-native";
import {SafeAreaView, StatusBar} from "react-native";
import {SettingsSwitch} from 'react-native-settings-components';

import styles from "../styles/Styles";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import HeaderComponent from "../components/HeaderComponent";
import CallButton from "./CallScreen";

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        drawerIcon: ({tintColor }) => (
            <Icon name ="perm-identity" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Profilim"
    };

    constructor() {
        super();
        this.state = {
            useCallKit: false
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('useCallKit')
            .then((value) => {
                this.setState({
                    useCallKit: JSON.parse(value)
                })
            });
    }

    render() {
        return(
            <SafeAreaView style={styles.safearea}>
                <StatusBar hidden={true}/>
                <Header style={{backgroundColor: 'transparent', shadowColor: 'transparent', shadowRadius: 0, elevation:0}}>

                    <Left style={{alignItems: 'flex-start'}}>
                        <Icon name={'menu'} style={{alignSelf:'flex-start', color : 'white'}}  type="MaterialIcons" onPress={() => this.props.navigation.openDrawer()}/>
                    </Left>
                    <Body>
                    <Title style={{color : '#8197c0'}}>Avukata Sor</Title>
                    </Body>
                    <Right>

                    </Right>
                </Header>

            </SafeAreaView>
        );

    }

}