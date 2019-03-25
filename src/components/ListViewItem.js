import React from 'react';
import {View, Text, StyleSheet, Image, TouchableHighlight} from 'react-native';
import {Body, Header, Icon, Left, Right, Title} from "native-base";

let counter = 1;
export default class CustomRow extends React.Component {
    constructor(props){
        super(props);

    }
    navme = (urr) => {
       this.props.urr.navigate('ConfScreen',{url : 'https://avukatasorapi.azurewebsites.net' +  urr})
    };


    render() {
        return (
            <View style={styles.container}>

                <Icon name="folder-open" type="MaterialIcons" style={styles.photo}/>
                <View style={styles.container_text}>
                    <Text style={styles.title}>
                        {this.props.title}
                    </Text>
                    <Text style={styles.description}>
                        {this.props.description}
                    </Text>
                </View>
                <View style={styles.container_icons}>
                    <TouchableHighlight onPress={() => this.navme(this.props.description)}>
                        <Icon name="arrow-forward" type="MaterialIcons" style={{color: '#8197c0', fontSize: 35}}/>
                    </TouchableHighlight>
                </View>

            </View>
        );
    }
}








const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 50,
        color: '#8197c0'
    },
    container_icons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});


// const CustomRow = ({title, description, image_url, props}) => (
//
//     <View style={styles.container}>
//
//         <Icon name="folder-open" type="MaterialIcons" style={styles.photo}/>
//         <View style={styles.container_text}>
//             <Text style={styles.title}>
//                 {title}
//             </Text>
//             <Text style={styles.description}>
//                 {description}
//             </Text>
//         </View>
//         <View style={styles.container_icons}>
//             <TouchableHighlight onPress={() => routew({description}, {props})}>
//                 <Icon name="arrow-forward" type="MaterialIcons" style={{color: '#8197c0', fontSize: 35}}/>
//             </TouchableHighlight>
//         </View>
//
//     </View>
// );

//export default CustomRow;