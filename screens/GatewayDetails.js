import React,{Component} from 'react';
import { AppState,
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
  constructor() {
    super();
    this.state = {
  appState: AppState.currentState,
    }
  }
  componentDidMount(){
    this.appStateSubscription = AppState.addEventListener(
      "change",
      nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
        }else{
          console.log("Exitnow");
          firestore().collection('users').doc(auth().currentUser.uid).update({    cityLong: 'none',
          cityLat:'none',
                      selectedCountry: '',
                      selectedCity:'none',})
        }
        this.setState({ appState: nextAppState });
      }
    );
  }

  componentWillUnmount(){
    this.appStateSubscription.remove();
  }

    render() {
      return (
        <Container style={{flex: 1,backgroundColor: '#fdfdfd'}}>
          <Header androidStatusBarColor="#ee4e4e" style={{display:'none'}} style={{backgroundColor: '#ee4e4e'}}>
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

