/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {StyleSheet} from 'react-native';
import COLOR from "./Color";

export default StyleSheet.create({
    safearea: {
        flex: 1,
    },
    safearea2: {
        flex: 1,
        flexDirection: "column"
    },
    aligncenter: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    modalBackground: {
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20
    },
    innerContainer: {
        borderRadius: 10,
    },
    innerContainerTransparent: {
        backgroundColor: COLOR.WHITE,
        padding: 20
    },
    appheader: {
        resizeMode: 'contain',
        height: 60,
        alignSelf: 'center'
    },
    loginform: {
        paddingHorizontal: 20,
        marginTop: 250,
        alignItems: 'stretch'
    },
    loginbutton: {
        color: COLOR.BUTTON,
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
        textAlign: 'center'
    },
    forminput: {
        // padding: 5,
        // marginBottom: 10,
        color: COLOR.WHITE,
        height: 40,
        borderWidth: 0,
        // borderBottomColor: COLOR.ACCENT,
        // borderBottomWidth: 1,
        // borderRadius: 4,
    },
    useragent: {
        flex: 1,
        flexDirection: 'column',

    },
    useragent2: {
        flex: 3,

    },
    selfview: {
        position: 'absolute',
        right: 0,
        bottom: 10,
        width: 100,
        height: 120,
    },

    selfview2: {
        position: 'absolute',
        left: 0,
        bottom: 10,
        width: 100,
        height: 120,
    },
    remotevideo: {
        flex: 1,
    },
    videoPanel: {
        flex: 1,
        position: 'relative',

    },

    //conference
    videoPanelConf: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:"flex-start"

    },

    remotevideo2: {
        width: 300,
        height: 300,
        margin: 10
    },


    //end cond

    call_controls: {
        height: 70,
    },
    margin: {
        margin: 10
    },
    call_connecting_label: {
        fontSize: 18,
        alignSelf: 'center'
    },
    headerButton: {
        color: COLOR.WHITE,
        fontSize: 16,
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        textAlign: 'center'
    },
    incoming_call: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
        color: COLOR.WHITE
    },
    incoming_call1: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
        marginTop: 50,
        color: COLOR.WHITE
    },
    login_button: {

        backgroundColor: '#cc3333',
        borderRadius: 60,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 30,
        marginBottom: 30
    },

    confButton: {

        backgroundColor: '#cc3333',
        borderRadius: 60,
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    },

    btnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#F5FCFF',
        borderWidth: 1
    },


    login_button_text: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
        textAlign: 'center'

    },
    exit_button: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center'


    },
    exit_button_text: {
        color: '#8197c0',
        fontFamily: 'Roboto',

        fontSize: 20,
    },
    exit_button_icon: {},
    settings_button: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center'

    },
    settings_button_text: {
        color: '#8197c0',
        fontFamily: 'Roboto',

        fontSize: 20,
    },
    settings_button_icon: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'


    },
    container_nav: {
        color: 'red',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',


    },
    signup_button_text: {
        color: '#8197c0',
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 30,
    },
    signupform: {
        paddingHorizontal: 20,
        marginTop: 25,
        alignItems: 'stretch'
    },
    signup_button_page: {

        backgroundColor: '#cc3333',
        borderRadius: 60,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 15,
        marginBottom: 15
    },
    file_upload: {

        backgroundColor: '#cc3333',
        borderRadius: 60,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        width: '70%',
        alignSelf: 'center'

    },
    credit_insert_button: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10

    },


});
