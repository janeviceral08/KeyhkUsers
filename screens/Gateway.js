import React, { Component } from 'react';
import {StyleSheet,View, ScrollView, Alert, Image} from 'react-native'
import { Container, Header, Button, ListItem, Text, Icon, Left, Body, Right, Switch, Thumbnail  } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import CustomHeader from './Header';
import auth from '@react-native-firebase/auth';

export default class Gateway extends Component {
  constructor() {
    super();
    this.state = {
      uid:'',
      name:'',
      email:'',
      mobile:'',
      address: {},
      country: '',
      province:'',
      zipcode: '',
      username:'',
      wallet:0,
      Hotel: '',
            Operator: '',
            Rider:'',
            Store: '',
       loggedIn: ''    };
      this.FetchProfile();
  }

  
  FetchProfile = async() => {
    const userId= await AsyncStorage.getItem('uid');
 this.setState({
        loggedIn : userId
      })
    const ref =  firestore().collection('users').doc(userId);  
    ref.get().then((doc) => {
      if (doc.exists) { 
        const data = doc.data();
        this.setState({
          key: doc.id,
          name: data.Name,
          email: data.Email,
          mobile: data.Mobile,
          address: data.Address,
          username: data.Username,
          wallet: data.wallet,
        });
      }
    });

  }

  _bootstrapAsync =async () =>{
    const userId= await AsyncStorage.getItem('uid');
    
    if(userId){
    this.FetchProfile();
    this.setState({ uid: userId })
  }
  };


  signOut (){
  
        auth().signOut().then(() => {
          AsyncStorage.removeItem('uid');
          Alert.alert(
              "You have successfully logged out.",
              "Please come back soon.",
              [
                { text: "OK",   onPress: () =>  this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],})}  
              ],
              { cancelable: false }
            );
         
      })
      .catch(error => this.setState({ errorMessage: error.message }))  
    
 
    }

  componentDidMount() {
      this._bootstrapAsync(); 
      firestore().collection('LinkApp').onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
    console.log('doc.data(): ', doc.data())
          this.setState({
            Hotel: doc.data().Hotel,
            Operator: doc.data().Operator,
            Rider: doc.data().Rider,
            Store: doc.data().Store,
         });
        })
      })
  }

  render() {
    const {uid}=this.state;
    return (
      <Container>
      <CustomHeader title="Account Settings" isHome={true} Cartoff={true} navigation={this.props.navigation}/>
   
        <ScrollView>
        <Card>
        <Card.Title
            title={this.state.name}
            subtitle={this.state.username}
            left={(props) => <Avatar.Text size={64} color="white" style={{backgroundColor: 'gray'}} {...props} label={this.state.name.slice(0, 1).toUpperCase()} />}
            
          />
          
          </Card>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/> 
        
          <ListItem icon  onPress={()=> this.props.navigation.navigate('GatewayDetails',{'url': this.state.Rider, 'title': 'Work as a driver'})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <FontAwesome name="drivers-license-o" size={20} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Work as a driver</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>
         


 <ListItem icon  onPress={()=> this.props.navigation.navigate('GatewayDetails',{'url': this.state.Store, 'title': 'Be a merchant'})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="store" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Be a merchant</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>


          <ListItem icon onPress={()=> this.props.navigation.navigate('GatewayDetails',{'url': this.state.Hotel, 'title': 'Be a hotel, rentals and service merchant'})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../assets/rent.png')} />
              </Button>
            </Left>
            <Body>
              <Text>Be a hotel, rentals and service merchant</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

 <ListItem icon onPress={()=> this.props.navigation.navigate('GatewayDetails',{'url': this.state.Operator, 'title': 'Be a service provider'})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialIcons name="admin-panel-settings" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Be a service provider</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>
           
           <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
 
        </ScrollView>
      </Container>
    );
  }
}



const styles = StyleSheet.create({
  stepIndicator: {
  marginVertical: 10
},
container: {
   flex:1,
  alignItems: 'center', 
  justifyContent: 'center'
},

})