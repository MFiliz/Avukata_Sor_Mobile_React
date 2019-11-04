import React, {Component} from 'react';

import {
    AsyncStorage,
    View,
    Text,
    Button,
    StatusBar,
    SafeAreaView,
    FlatList,
    TouchableHighlight,
    ImageBackground, TouchableWithoutFeedback
} from 'react-native';
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import styles from "../styles/Styles";
import CustomRow from "../components/ListViewItem";
import ImagePicker from 'react-native-image-picker';

let _this;

// import styles from './styles';
const options =  {
    title: 'Avukata Sor',
    takePhotoButtonTitle: 'Kamera Kullan',
    chooseFromLibraryButtonTitle: 'Galeriden Seç'
};
export default class  extends Component {
    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
            <Icon name="event-note" type="MaterialIcons" style={{color: 'white'}}/>
        ),
        title: "Dosyalarım"
    };

    myfunc(){

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }  else {
                const source = { uri: response.uri };

                const data = new FormData();

                data.append('formFile', {
                    uri : response.uri,
                    type: response.type,
                    name: response.fileName
                });
                const config = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'token' : this.state.tken
                    },
                    body: data,
                };
                fetch("https://testavukatasorapi.azurewebsites.net/api/User/UploadDocument", config)
                    .then((checkStatusAndGetJSONResponse)=>{
                        console.log(checkStatusAndGetJSONResponse);
                        this.getData();
                    }).catch((err)=>{console.log(err)});

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                });
            }
        });
    }

    constructor() {
        super();
        this.state = {
            tken: '',
            un: '',
            filelist: [],
            avatarSource: null,
        };
    };

    componentDidMount() {
        this._loadInitialState().done();
        this.getData();

    };

    async getData() {
        const usernameValue = await AsyncStorage.getItem('token');
        const unn= await AsyncStorage.getItem('userName');
        //alert(unn);
        fetch('https://testavukatasorapi.azurewebsites.net/api/User/GetActiveDocuments/' + unn, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
                'token': usernameValue,
            }
        }).then(res => res.json())
            .then(response =>{ this.setState({filelist : response.entityData.userDocumentList});})
            .catch(error => console.error('Error:', error))

    }

    _loadInitialState = async () => {
        _this = this;
        (async () => {
            const usernameValue = await AsyncStorage.getItem('token');
            _this.setState({tken: usernameValue});


        })();

    };



    render() {

        return (
            <View>
                <ImageBackground source={require('../assets/flat_bg.png')}
                                 style={{width: '100%', height: '100%', isFlex: '1'}} resizeMode={'cover'}>
                    <StatusBar hidden={true}/>
                    <Header style={{
                        backgroundColor: 'transparent',
                        shadowColor: 'transparent',
                        shadowRadius: 0,
                        elevation: 0
                    }}>

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


                    <FlatList
                        data={this.state.filelist}
                        renderItem={({item, index}) =><CustomRow title={"Dosya " + parseInt(index + 1) } description={item.filePath} urr={this.props.navigation}/>}
                        keyExtractor={(item, index) => index}
                    />

                    <TouchableHighlight style={styles.login_button} onPress={() => this.myfunc()}>

                        <Text style={styles.login_button_text}>
                            Dosya Yükle
                        </Text>


                    </TouchableHighlight>
                </ImageBackground>
            </View>

        );

    }
}