/**
* This is the Checkout Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { TouchableHighlight, BackHandler,ScrollView, TouchableOpacity, Image,Animated } from 'react-native';
import { Container, View, Grid, Col, Left, Right, Button, Icon, List,Thumbnail, ListItem, Body, Radio, Input, Item,Text,Toast, Root } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader';
import CustomHeader from './Header';
import {imgDefault} from './images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as ImagePicker from "react-native-image-picker"
// Our custom files and classes import

export default class Profile extends Component {
  constructor(props) {
      super(props);
      this.Rotatevalue = new Animated.Value(0);
      this.ref =  firestore();
      this.state = {
        name: '',
        email: '',
        phone: '',
        gender:' ',
        photo:'',
        date:'',
        isLoading: false
      };
      this.FetchProfile();
  }

  FetchProfile = () => {
    const userId =  auth().currentUser.uid;
    const ref =  firestore().collection('users').doc(userId);
    ref.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          key: doc.id,
          name: data.Name,
          email: data.Email,
          phone: data.Mobile,
           photo: data.photo,
          gender: data.Gender,
          isLoading: false,
        });
      }
    });

  }
    openGallery = () => {
      ImagePicker.launchImageLibrary({
          maxWidth: 500,
          maxHeight: 500,
          mediaType: 'photo',
          includeBase64: true,
      }, image => {
        if(image.didCancel == true){
            return;
        }
          this.setState({image: image.assets[0].base64})
      })
  }
  openGallerylaunchCameraLicense = () => {
    
    ImagePicker.launchCamera({
    title: 'Take Image',
    type: 'capture',
    includeBase64: true,
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
    },
  }, image => {
      if(image.didCancel== true){
        return;
              }
              this.setState({image: image.assets[0].base64})

        
    })
}
updateTextInput = (text, field) => {
  const state = this.state
  state[field] = text;
  this.setState(state);
}
componentDidMount() {
  this.StartImageRotationFunction()
}
 
StartImageRotationFunction(){
  this.Rotatevalue.setValue(0);
  Animated.timing(this.Rotatevalue,{
    toValue:1,
    duration:3000,
  }).start(()=>this.StartImageRotationFunction());
}
render() {
//console.log('selectedCityUser Homescreen: ',this.state.selectedCityUser)
 //  console.log('UserLocationCountry typeOfRate: ', this.state.UserLocationCountry)
 //  console.log('CountryNow: ', this.state.CountryNow)
 const RotateData = this.Rotatevalue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '368deg']
})

const trans={
  transform:[
    {rotate: RotateData}
  ]
}
   
    return(
      <Root>
      <Container style={{backgroundColor: '#fdfdfd'}}>
      <CustomHeader title="Account Information"  Cartoff={true} navigation={this.props.navigation}/>
            <Loader loading={this.state.isLoading} trans={trans}/>
        <ScrollView style={{paddingHorizontal: 10}}>
          <View>
            <Text style={{marginTop: 15, fontSize: 18}}>Personal Information</Text>
            <View style={{flexDirection: 'row',justifyContent: "center", alignContent: "center"}}>
        <TouchableOpacity >
       
               <Image style={{  width: 160, height: 160, resizeMode: 'contain',margin: 10}}  source={this.state.image ? {uri: `data:image;base64,${this.state.image}`} :this.state.photo === ""? {imgDefault}: {uri:this.state.photo }} />
           {   // <ActivityIndicator size="large" color="#00ff00" style={{position: 'absolute', right: 0, flex: 1}}/>
           }
             </TouchableOpacity>
             <View style={{flexDirection: 'column', justifyContent: "center", alignContent: "center"}}>
             <MaterialIcons name="photo" size={30} onPress={this.openGallery} />
             <MaterialIcons name="photo-camera" size={30} style={{marginTop: 20}} onPress={()=> {this.openGallerylaunchCameraLicense()}}/>
             </View>
             </View>


            <Text style={{marginTop: 15, fontSize: 10}}>Name</Text>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder={this.state.name}  value={this.state.name} onChangeText={(text) => this.updateTextInput(text, 'name')} placeholderTextColor="#687373" />
            </Item>
            <Text style={{marginTop: 15, fontSize: 10}}>Gender</Text>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder={this.state.gender}  value={this.state.gender} onChangeText={(text) => this.updateTextInput(text, 'gender')} placeholderTextColor="#687373" />
            </Item>
            <Text style={{marginTop: 15, fontSize: 18}}>Contact Information</Text>
            <Text style={{marginTop: 15, fontSize: 10}}>Email Address</Text>
            <Item regular style={{marginTop: 7}}>
                <Input disabled value={this.state.email} onChangeText={(text) => this.updateTextInput(text, 'email')} placeholderTextColor="#687373" />
            </Item>
            <Text style={{marginTop: 15, fontSize: 10}}>Contact No.</Text>
            <Item regular style={{marginTop: 7}}>
                <Input  value={this.state.phone} onChangeText={(text) => this.updateTextInput(text, 'phone')} placeholderTextColor="#687373" />
            </Item>
          </View>
          <View style={{marginTop: 10, marginBottom: 10, paddingBottom: 7}}>
            <Button onPress={() => this.updatUserInfo()} style={{backgroundColor: "tomato"}} block iconLeft>
              <Text style={{color: '#fdfdfd'}}>Update Info</Text>
            </Button>
          </View>
        </ScrollView>
       
      </Container>
      </Root>
    );
  }



   async updatUserInfo() {
    this.setState({
      isLoading: true,
    });
    if(this.state.image == null){
    const userId= await AsyncStorage.getItem('uid');
    const updateRef =  firestore().collection('users').doc(userId);
    updateRef.update({
      Name: this.state.name,
      Mobile: this.state.phone,
      Email: this.state.email,
      Gender: this.state.gender,
      Birthdate: this.state.date
    }).then((docRef) => {   
      
      this.FetchProfile();
     Toast.show({
                  text: "Profile successfully updated.",
                  position: "bottom",
                  type: "success",
                  textStyle: { textAlign: "center" },
                })
    })
    }

    else {
              let base64Img = `data:image/jpg;base64,${this.state.image}`;
              let data = {
                "file": base64Img,
                "upload_preset": "bgzuxcoc",
              }
            let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kusinahanglan/upload';
              fetch(CLOUDINARY_URL, {
                body: JSON.stringify(data),
                headers: {
                  'content-type': 'application/json'
                },
                method: 'POST',
              }).then(async r => {
                            let data = await r.json()
                                const userId= await AsyncStorage.getItem('uid');
                            const updateRef =  firestore().collection('users').doc(userId);
                            updateRef.update({
                              photo:'https'+data.url.slice(4),
                              Name: this.state.name,
                              Mobile: this.state.phone,
                              Email: this.state.email,
                              Gender: this.state.gender,
                              Birthdate: this.state.date
                            }).then((docRef) => {   
                              
                                    this.FetchProfile();
                                  Toast.show({
                                                text: "Profile successfully updated.",
                                                position: "bottom",
                                                type: "success",
                                                textStyle: { textAlign: "center" },
                                              })
                            }).catch(err => {    this.setState({ loading: false, }) })
                      
                })

            }
   }
}
const styles = {
  invoice: {
    paddingLeft: 20,
    paddingRight: 20
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7'
  }
};
