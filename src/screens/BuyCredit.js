/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from "react";
import {AsyncStorage, WebView} from 'react-native';
import {Header, Icon, Left, Right,Body, Title} from "native-base";
let _this;
export default class BuyCredit extends React.Component {
    static navigationOptions = {
        drawerIcon: ({tintColor }) => (
            <Icon name ="add-shopping-cart" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Kredi Al"
    };

    componentDidMount() {
        this._loadInitialState().done();
    }

    handleNavigationStateChange = navState => {
        console.log(navState);
        if(JSON.stringify(navState).includes('PAYMENT_AUTHORIZED')){
            this.props.navigation.navigate('Main',{isSuccess: 1});

        }
        if(JSON.stringify(navState).includes('CARD_NOTAUTHORIZED') || JSON.stringify(navState).includes('INVALID')){
            this.props.navigation.navigate('Main',{isSuccess: 0});
        }
    };

    constructor(props) {
        super(props);
        this.hash ='';
        this.state = {
            tken:'',
            paymentSuccess: false
        };
    }

    _loadInitialState = async () => {
        _this = this;
        (async () => {
            const usernameValue = await AsyncStorage.getItem('token');
            _this.setState({tken: usernameValue});

        })();

    };






    render() {
        const injectedJs = `window.postMessage(window.location.href);`;

        return(
            <WebView
                source={{ uri: 'https://avukatasortest.azurewebsites.net/account/productsmobile?token=' + this.state.tken }}
                bounces={true}
                style={[
                    {
                        flex: 1
                    },
                ]}
                injectedJavaScript={injectedJs}
                startInLoadingState
                scalesPageToFit
                javaScriptEnabledAndroid={true}
                javaScriptEnabled={true}
                onNavigationStateChange={this.handleNavigationStateChange}
                onMessage={event => {
                    alert('MESSAGE >>>>' + event.nativeEvent.data);
                }}
                onLoadStart={() => {
                    console.log("LOAD START ");
                }}
                onLoadEnd={() => {
                    console.log('LOAD END');
                }}
                onError={err => {
                    console.log('ERROR ');
                    console.log(err);
                }}
            />
        );

    }

}