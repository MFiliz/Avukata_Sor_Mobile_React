import {Body, Header, Icon, Left, Right, Title} from "native-base";
import React,{Component} from "react";


export default class HeaderComponent extends Component {

    handleButtonPressed() {
        this.props.buttonPressed();
    }

    render() {
        return (

            <Header style={{backgroundColor: 'transparent', shadowColor: 'transparent', shadowRadius: 0, elevation:0}}>

                <Left style={{alignItems: 'flex-start'}}>
                    <Icon name={'menu'} style={{alignSelf:'flex-start', color : 'white'}}  type="MaterialIcons" OnPress={() => this.handleButtonPressed()}/>
                </Left>
                <Body>
                <Title style={{color : '#8197c0'}}>Avukata Sor</Title>
                </Body>
                <Right>

                </Right>
            </Header>
        );
    }
}



