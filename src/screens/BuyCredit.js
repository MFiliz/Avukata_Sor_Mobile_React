/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from "react";
import {ScrollView, AsyncStorage, Platform, Text, View} from "react-native";
import {SafeAreaView, StatusBar} from "react-native";
import {SettingsSwitch} from 'react-native-settings-components';

import styles from "../styles/Styles";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import {Header, Icon, Left, Right,Body, Title} from "native-base";

export default class BuyCredit extends React.Component {
    static navigationOptions = {
        drawerIcon: ({tintColor }) => (
            <Icon name ="add-shopping-cart" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Kredi Al"
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
                <View style={{flex: 1, backgroundColor :'gray'}}>

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
                    <Text>Kredi Alma Ekranı</Text>
                </View>
            </SafeAreaView>
        );

    }

}