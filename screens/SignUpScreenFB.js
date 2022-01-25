import React,{Component} from 'react';
import { 
    Text, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet ,
    FlatList,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import { Container, View, Left, Right, Button, Icon, Item, Input, DatePicker, Picker } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MapView, {  Polyline,  PROVIDER_GOOGLE,  } from 'react-native-maps';
import axios from 'axios';
import {imgDefault} from './images';
import * as ImagePicker from "react-native-image-picker"
import messaging from '@react-native-firebase/messaging';

export default class SignUpScreenFB extends Component {
        constructor(props) {
            super(props);
            this.cityRef =  firestore().collection('city');
            this.barangayRef =  firestore();
            this.ref =  firestore();
            this.subscribe= null;
            this.state = {
              email: '',
              name: this.props.route.params.displayName,
              username: '',
              password: '',
              rePassword: '',
              mobile:'',
              hasError: false,
              errorText: '',
              loading: false,
              barangay: [],
              address:'',
              city:'',
              province:'',
              PickerValueHolder: 'Select Barangay',
              barangayList: [],
              cityList:[],
              userTypes: [{userType: 'admin', userName: 'Admin User'}, {userType: 'employee', userName: 'Employee User'}, {userType: 'dev', userName: 'Developer User'}],
              selectedCity: 'Select City/Municipality',
              selectedBarangay: 'Select Barangay',
              x: {  latitude: 14.599512,
                longitude: 	120.984222,},
                userPoint:{latitude: null,
                  longitude: 	null,}, 
                  LocationDone: true,
                  searchResult:[],
                  place: '',
                   image: null,
            };
        }

        openGallery = () => {
    ImagePicker.launchImageLibrary({
        maxWidth: 500,
        maxHeight: 500,
        mediaType: 'photo',
        includeBase64: true,
    }, image => {
     
        if(image.didCancel== true){
  return;
        }
    this.setState({image:image.assets[0].base64})
                 })
   }
  onCityUpdate = (querySnapshot) => {
    const city = [];
   querySnapshot.forEach((doc) => {
    city.push ({
           datas : doc.data(),
           key : doc.id
           });        
   });
   this.setState({
     cityList: city,
  });
  
  }

  onBarangayUpdate = (querySnapshot) => {
    const barangay = [];
   querySnapshot.forEach((doc) => {
    barangay.push ({
           datas : doc.data(),
           key : doc.id
           });        
   });
   this.setState({
     barangayList: barangay,
  });
  
  }

  fetchBarangay =(city)=>{
    this.setState({ selectedCity: city })

  }
      
        async componentDidMount(){
          const token= await AsyncStorage.getItem('token');
            console.log('current: ', auth().currentUser.uid)
            console.log('current: ', auth().currentUser)
            const userId = auth().currentUser.uid;
             firestore().collection('users').where('userId', '==', userId)
            .onSnapshot(querySnapshot => {
                let city=[];
              querySnapshot.docs.forEach(doc => {
              city.push(doc.data());
             
            });
console.log('city.length: ',city.length)
            if(city.length < 1){
      
            }else{
                AsyncStorage.setItem('uid',  auth().currentUser.uid);
                this.setState({
                    loading: false,
                    email: '', 
                    password: ''
                  })
                  const updateRef = firestore().collection('users').doc(auth().currentUser.uid);
            updateRef.update({
              token: firestore.FieldValue.arrayUnion(token),
            });
                  this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],})
            
            }

          });
          this.tosubscribe = this.cityRef.onSnapshot(this.onCityUpdate);
        }

        signup() {
          this.setState({ loading: true});
        /*   if(this.state.image == null) {
            this.setState({hasError: true, errorText: 'Upload Photo of you!',loading: false});
            return;
          }*/
          if(this.state.userPoint.latitude == null){
            this.setState({hasError: true, errorText: 'Enter Complete Address!',loading: false});
            return;
          }
          if(this.state.name===""||this.state.address==""||this.state.selectedCity=="Select City/Municipality"||this.state.province=="") {
            this.setState({hasError: true, errorText: 'Please fill all fields !',loading: false});
            return;
          }
  
        
          if(this.state.mobile.length < 11|| this.state.mobile.length > 11) {
            this.setState({hasError: true, errorText: 'Mobile number must contains at least 11 characters !',loading: false});
            return;
          }
       
          this.setState({hasError: false});
          this.saveUserdata();
      
        }
      
        saveUserdata() {
          const userId =  this.props.route.params.uid;
          AsyncStorage.setItem('uid', userId);
          this.ref.collection('users').doc(userId).set({
            photo:'',
            modeoflogin: 'Facebook',
            Name: this.state.name,
            Username: this.state.name,
            Mobile: this.state.mobile,
            Email: this.props.route.params.email,
            Password: this.state.password,
            ordered_times: 0,
            Gender: '',
            Birthdate: '',
            userId: userId,
            status: 'New',
            Country: this.state.Country.trim(),
            Address: {
              Address: this.state.address,
              Barangay: this.state.selectedBarangay,
              City: this.state.selectedCity.trim(),
              Province: this.state.province,
              Country: this.state.Country.trim(),
              lat:this.state.userPoint.latitude,
              long:this.state.userPoint.longitude,
            },
            Shipping_Address: [{
                Country: this.state.Country.trim(),
              id: userId,
              default: true,
              name:this.state.name,
              phone: this.state.mobile,
              address: this.state.address,
              barangay: this.state.selectedBarangay,
              city: this.state.selectedCity.trim(),
              province: this.state.province,
              postal:'8600',
              lat:this.state.userPoint.latitude,
              long:this.state.userPoint.longitude,
            
            }]
          }).then((docRef) => {
            this.setState({
              loading: false,
            });
            this.props.navigation.navigate('Home')
       
  }).catch((error)=> this.setState({
            loading: false,hasError: true, errorText: error
          }))
  

        }
      
        verifyEmail(email) {
          var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return reg.test(email);
        }
      
      myCurrentLocation = ()=>{
    /*    GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
      })
      .then(location => {
        this.setState({userPoint: {latitude: location.latitude, longitude: 	location.longitude},x: {latitude: location.latitude, longitude: 	location.longitude,}})
          console.log('location: ',location);
      })
      .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
      })
      */}
       getLocation = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
    this.setState({LocationDone: false})
    console.log('text: ', text);
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    
    console.log('res: ', res.data.features[0]);
    let str = res.data.features[0].place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)

    this.setState({searchResult:res.data.features })
       }).catch(err => {
          console.log('axios: ',err)
       })




 }
    render() {
      return (
        <Container style={{flex: 1,backgroundColor: '#fdfdfd'}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="always">
          <Loader loading={this.state.loading} />
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 50, paddingRight: 50, marginTop: 20}}>
            <View style={{marginBottom: 10, width: '100%'}}>
              <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left', width: '100%', color: '#183c57'}}>Set up your account, </Text>
              <Text style={{fontSize: 18, textAlign: 'left', width: '100%', color: '#687373'}}>Fill in to continue </Text>
              <Text style={{fontSize: 15, textAlign: 'left', width: '100%', color: '#183c57'}}>{this.state.errorText} </Text>
            </View>
            
        
            <Item>
                <AntDesign name="user" size={20} color={"#687373"}/>
                <Input placeholder='Name' value={this.state.name} onChangeText={(text) => this.setState({name: text})} placeholderTextColor="#687373" />
            </Item>
     
            <Item>
                <AntDesign name="mobile1" size={20} color={"#687373"}/>
                <Input placeholder='Mobile Number' onChangeText={(text) => this.setState({mobile: text})} placeholderTextColor="#687373" />
            </Item>
            <Item>
                <AntDesign name="enviromento" size={20} color={"#687373"}/>
                <Input placeholder='Complete Address' value={this.state.place} onChangeText={(text) => this.getLocation(text, 'place')} placeholderTextColor="#687373" />
            </Item>
            {this.state.LocationDone == false?<FlatList
        data={this.state.searchResult}
        renderItem={ ({ item }) => (
         <View style={{padding: 10}}>
           <TouchableOpacity onPress={()=>{ 
                 let str = item.place_name;

let arr = str.split(',');
let arrcountry = arr.length-1;
console.log("str", str)
console.log("arr", arr)
console.log('selectedCity:', arr[2])
            
const region=  {latitude: item.center[1], latitudeDelta: 0.0999998484542477, longitude: item.center[0], longitudeDelta: 0.11949475854635239}
console.log('region: ', region)
             this.setState({
               userPoint: { latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0] },
               province: item.context[0].text,
               selectedCity:arr[2],
               Country:arr[arrcountry],
               selectedBarangay:item.context[1].text,
               postal:arr[3],
               address: arr[0]+', '+ arr[1],
               userPoint:{ latitude:item.center[1],
      longitude: 	item.center[0]},
               place:item.place_name, LocationDone: true })}}>
           <Text>{item.place_name}</Text>
           </TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      />:null}
            <Item>
            <AntDesign name="enviromento" size={20} color={"#687373"}/>
                <Input placeholder='Detailed Address' onChangeText={(text) => this.setState({address: text})} placeholderTextColor="#687373" />
            </Item>
            <Item>
         
              </Item>      
    
            {this.state.hasError?<Text style={{color: "#c0392b", textAlign: 'center', marginTop: 10}}>{this.state.errorText}</Text>:null}
            <View style={{alignItems: 'center'}}>
              <Button onPress={() => this.signup()} style={{backgroundColor: '#019fe8', marginVertical: 20,width: '100%',
                                                                                      height: 50,
                                                                                      justifyContent: 'center',
                                                                                      alignItems: 'center',
                                                                                      borderRadius: 10, borderWidth: 1, borderColor: '#019fe8'}}>
                <LinearGradient
                    colors={['#019fe8','#183c57']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Set up</Text>
                </LinearGradient>
              </Button>
            </View>
            <View style={{alignItems: 'center'}}>
              <Button onPress={() => this.props.navigation.navigate('Login')} style={{backgroundColor: '#019fe8', marginVertical: 20,width: '100%',
                                                                                      height: 50,
                                                                                      justifyContent: 'center',
                                                                                      alignItems: 'center',
                                                                                      borderRadius: 10, borderWidth: 1, borderColor: '#019fe8'}}>
                 <LinearGradient
                    colors={['#019fe8','#183c57']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Already have account? Sign In</Text>
                </LinearGradient>
              </Button>
            </View>
          </View>
        </ScrollView>
      </Container>
    );
            }
};


const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
