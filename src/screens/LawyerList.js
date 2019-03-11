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
    TouchableHighlight
} from "react-native";
import {SafeAreaView, StatusBar,FlatList} from "react-native";
import {SettingsSwitch} from 'react-native-settings-components';

import styles from "../styles/Styles";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import CallButton from "./MainScreen";
import CustomRow from "../components/ListViewItem";

export default class LawyerList extends React.Component {
    static navigationOptions = {
        drawerIcon: ({tintColor }) => (
            <Icon name ="camera-alt" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Görüşmeye Başla"
    };

    constructor() {
        super();
        this.state = {
            useCallKit: false,
            names: [
                {
                    title: 'Gürkan Çoban',
                    description: 'Özgeçmiş',
                    image_url:require('../assets/user_icon.png')
                },
                {
                    title: 'Deneme2',
                    description: 'deneme2 description',
                    image_url:require('../assets/user_icon.png')
                }
            ]
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
                <StatusBar hidden={true} />


                <ImageBackground source={require('../assets/flat_bg.png')} style={{width: '100%', height: '100%', isFlex : '1'}}  resizeMode={'cover'}>
                    <View style={styles.useragent}>

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
                        <FlatList
                            data={this.state.names}
                            renderItem={({ item }) => <CustomRow
                                title={item.title}
                                description={item.description}
                                image_url={item.image_url}/>}

                            ItemSeparatorComponent = {this.renderSeparator}
                        />
                    </View>
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