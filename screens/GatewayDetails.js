import React,{Component} from 'react';
import { 
    Text, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ScrollView,Image,
    FlatList,
    PermissionsAndroid,
} from 'react-native';
import { Container, View, Left, Right, Button, Icon, Item, Input, Picker, Header,Body, Title, Toast} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

export default class GatewayDetails extends Component {
       
    render() {
      return (
        <Container style={{flex: 1,backgroundColor: '#fdfdfd'}}>
          <Header androidStatusBarColor="#2c3e50" style={{display:'none'}} style={{backgroundColor: '#396ba0'}}>
               <Left> 
                 <Button transparent onPress={()=> this.props.navigation.goBack()}>
                 <MaterialIcons name="arrow-back" size={25} color="white" />
                </Button> 
               </Left>
               <Body style={{marginLeft: 20,flex: 3}}>
                   <Title style={{color: 'white'}}>{this.props.route.params.title}</Title>
               </Body>
                
               </Header>

               <WebView
        source={{ uri: this.props.route.params.url }}
      />

      </Container>
    );
            }
};

