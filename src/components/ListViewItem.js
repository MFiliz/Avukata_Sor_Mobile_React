import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {Body, Header, Icon, Left, Right, Title} from "native-base";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft:16,
        marginRight:16,
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
        justifyContent: 'center',
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
    container_icons:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-end'
    }
});

const CustomRow = ({ title, description, image_url }) => (
    <View style={styles.container}>
        <Image source={image_url } style={styles.photo} />
        <View style={styles.container_text}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.description}>
                {description}
            </Text>
        </View>
        <View style={styles.container_icons}>
            <Icon name ="event-note" type="MaterialIcons" style={{color: '#8197c0', paddingRight: 10,fontSize: 35}}/>
            <Icon name ="video-call" type="MaterialIcons" style={{color: '#8197c0', fontSize: 35}}/>
        </View>

    </View>
);

export default CustomRow;