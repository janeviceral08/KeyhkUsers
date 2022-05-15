import React, { Component } from 'react';
import {AppState,NativeModules,Animated, StyleSheet,View, ScrollView, Alert, Share,Dimensions, FlatList, PermissionsAndroid, BackHandler, TouchableOpacity, Image} from 'react-native'
import { Container, Header, Button, ListItem, Text, Icon, Left, Body, Right, Switch, CardItem, Item,Input  } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Zocial from 'react-native-vector-icons/Zocial'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Avatar,Caption } from 'react-native-paper';
import moment from "moment";

import firestore from '@react-native-firebase/firestore';
import CustomHeader from './Header';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import axios from 'axios'
import Province  from './Province.json';
import Geolocation from 'react-native-geolocation-service';
var DirectSms = NativeModules.DirectSms;
var {height, width } = Dimensions.get('window');
import Loader from '../components/Loader';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export async function request_device_location_runtime_permission() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Need Location Permission',
        'message': 'App needs access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
 
     
    }
    else {
 
       await request_device_location_runtime_permissions();
 
    }
  } catch (err) {
    console.warn(err)
  }
}
 


export async function request_device_location_runtime_permissions() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Need Location Permission',
        'message': 'App needs access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
 
     
    }
    else {
 
      
 
    }
  } catch (err) {
    console.warn(err)
  }
}
 


export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.Rotatevalue = new Animated.Value(0);
    this.backCount=0;
    this.cityRef =  firestore();
    this.state = {
      appState: AppState.currentState,
      uid:'',
      name:'',
      email:'',
      mobile:'',
      address: {},
      country: '',
      province:'',
      zipcode: '',
      username:'',
      ShareLink: '',
      ShareLinkLabel: '',
      QRCodeURL:'',
      wallet:0,
       loggedIn: '',
       modalSelectedCity:false,
       modalSelectedCityNoUser:false,
       UserLocationCountry:'',
      AvailableOn:[],
      currentLocation: '',
      newCity: [],
      SelectedAvailableOn:[],
      searchCountry:'',
      searchState:'',
      SelectedSearchState:[],
      selectedCountry:'',
      CountryNow:[{labelRider: '', currency: '', currencyPabili:''}],
      ViewCountry:false,
      photo:'',
      processing: 0,
      delivered:0,
      asyncselectedCity:null,
      asyncselectedCountry:null,
      coords:null,
      str:null,
      res_data:[],
      RiderIDS:[],
      NumberAmbulance:[],
      NumberFireman:[],
      NumberPolice:[],
      cityOriginal:{},
      SOSMOdal: false,
      status:'New',
      cities:[],
      modalSelectedState:false,
      SelectedCountryInfo:null,
      states:[],
      PressedCountry:null,
      loading: false,
      EmptyOperator:false,
      Operator:'',
      };
      this.FetchProfile();
  }



  
  FetchProfile = async() => {
    const userId= await AsyncStorage.getItem('uid');
 this.setState({
        loggedIn : userId
      })
       firestore().collection('users').where('userId', '==', userId).onSnapshot(
                querySnapshot => {
                   
                    querySnapshot.forEach(doc => {
                     const data = doc.data();
                      this.setState({
                        key: doc.id,
                        name: data.Name,
                        email: data.Email,
                        mobile: data.Mobile,
                        address: data.Address,
                        username: data.Username,
                        photo: data.photo,
                        wallet: data.wallet,
                        selectedCity: data.selectedCity,
                        selectedCountryUser: data.selectedCountry,
                        RiderIDS: data.RiderIDS == undefined? []:data.RiderIDS,
                        status:data.status,
                      });
                    });
                
                   
                },
                error => {
                 //   console.log(error)
                }
            );

            firestore().collection('orders').where('userId', '==', userId ).onSnapshot(     
              querySnapshot => {
                 let  processing = 0;
                 let  delivered = 0;
              querySnapshot.forEach(doc => {
               const data = doc.data();
               if(data.OrderStatus == 'Pending'){
                processing = processing+1
               }
               if(data.OrderStatus == 'Processing'){
                processing = processing+1
               }
               if(data.OrderStatus == 'Delivered'){
                delivered = delivered+1
               }
              });
              this.setState({
                processing,delivered
              });
             
          },
          error => {
           //   console.log(error)
          })


  }

  _bootstrapAsyncs =async () =>{
    const userId= await AsyncStorage.getItem('uid');
    
    if(userId){
    this.FetchProfile();
    this.setState({ uid: userId })
  }
  };


  signOut (){

   Alert.alert(
              "Are You sure to logout?",
              "Please come back soon.",
              [
                { text: "Cancel",   onPress: () => console.log('canceled')},

                { text: "OK",   onPress: () =>  { auth().signOut().then(() => {
          AsyncStorage.removeItem('uid');
          Alert.alert(
              "You have successfully logged out.",
              "Please come back soon.",
              [
                { text: "OK",   onPress: () =>  this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home2' }],})}  
              ],
              { cancelable: false }
            );
         
      })
      .catch(error => this.setState({ errorMessage: error.message }))  
      }}  
              ],
              { cancelable: false }
            );
       
    
 
    }
    backAction = () => {
console.log('BackPressed')
    };
    componentWillUnmount() {
      this.appStateSubscription.remove();
      this.backHandler.remove();
    }
  async componentDidMount() {
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
    this.StartImageRotationFunction()
    const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
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
this.setState({asyncselectedCity,asyncselectedCountry})
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
      this._bootstrapAsyncs(); 
      firestore().collection('LinkApp').onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
    //console.log('doc.data(): ', doc.data())
          this.setState({
            ShareLink: doc.data().ShareLink,
            ShareLinkLabel: doc.data().ShareLinkLabel,
            QRCodeURL: doc.data().QRCodeURL,
         });
        })
      })
      this.setState({loading: true})


      if(Platform.OS === 'android')
 {

 await request_device_location_runtime_permission();

 }

   Geolocation.getCurrentPosition(
         info => {
             const { coords } = info
//console.log('coordsL ', coords)

axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
  .then(res => {
 let str = res.data.features[0].place_name;
// console.log("str ", res.data.features[0])
let arr = str.split(',');
const newarrLenghtCountry= arr.length-1
const UserLocationCountry = arr[newarrLenghtCountry]
//console.log("UserLocationCountry ", UserLocationCountry)

const  result = res.data.features[0].context.find((user) => user.id.includes("region."));
const  short_code = res.data.features[0].context.find((user) => user.short_code);
//console.log("short_code ", short_code)
//console.log("short_code ", short_code)
          this.setState({
            cityOriginal: result,
            coords,
            str,
            res_data: res.data.features[0].context,
            UserLocationCountry: UserLocationCountry=='Philippines'?'city':UserLocationCountry.trim(),
originalCountry:  UserLocationCountry=='Philippines'?'city':UserLocationCountry.trim(),
            
        })
        this.getAllStates(short_code.short_code)
        this.getAllCity()
    }).catch(err => {
           //   Alert.alert('Error', 'Internet Connection is unstable')
      console.log('Region axios: ',err)
      this.setState({loading:false})
    })
         },
         error => console.log(error),
         {
             enableHighAccuracy: false,
             timeout: 2000,
             maximumAge: 3600000
         }
     )
  firestore().collection('AvailableOn').where('status', '==', true).orderBy('label', 'asc').onSnapshot(
             querySnapshot => {
                 const AvailableOn = []
                 querySnapshot.forEach(doc => {
                     
                     AvailableOn.push(doc.data())
                 });
            //     console.log('AvailableOn ',AvailableOn)
                 this.setState({
   AvailableOn : AvailableOn, loading:false })
             },
             error => {
               this.setState({loading:false})
                 console.log(error)
             }
         );



  }
    onShare = async () => {
      try {
        const result = await Share.share({
          message: this.state.ShareLinkLabel+' '+ this.state.ShareLink,
          url: this.state.QRCodeURL,
        });
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    setSOS(){
      if(this.state.status != 'Verified'){
        Alert.alert(
          'Cannot Proceed.',
          'You are not a verified user')
          return;
      }
this.setState({SOSMOdal : true})
     /*  Alert.alert(
          'Confirmation',
          'Which one do you need?',
          [
        
            { text: 'Police', onPress: () => this.SOSPolice() },
            { text: 'Fireman', onPress: () => this.SOSFireman() },
            { text: 'Ambulance', onPress: () => this.SOSAmbulance() },
          ],
          { cancelable: false }
        );*/
      console.log('long press')
  
    }
    async sendDirectSms (NumberData, callFor) {
      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.SEND_SMS,
              {
                  title: 'Tadiwanashe App Sms Permission',
                  message:
                      'Tadiwanashe App needs access to your inbox ' +
                      'so you can send messages in background.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
              },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            var loopData = ''
            var i ;
            let arr = this.state.str == null? 'this.state.str':this.state.str.split(',');
    let arrs = arr== 'this.state.str'?'haha':arr.splice(0, arr.length-2);
    let joinArrs = arr== 'this.state.str'?'haha':arrs.join();

   // console.log('arr', arr);
    //console.log('arrs', arrs);
   // console.log('joinArrs', joinArrs);
            var message = this.state.name+' needs '+callFor+'. LOC: '+joinArrs+'. Lat: '+this.state.coords.latitude+'. Long: '+ this.state.coords.longitude;
            for(i=0; i < NumberData.length; i++){
              loopData += 
              DirectSms.sendDirectSms(NumberData[i], message);
       //       console.log('NumberData[i]', NumberData[i]);
       //       console.log('message:', this.state.name+' needs '+callFor+'. Location: '+joinArrs+'. Lat: '+this.state.coords.latitude+'. Long: '+ this.state.coords.longitude)
          }
             
          } else {
              console.log('SMS permission denied');
          }
      } catch (err) {
          console.warn(err);
      }
  }


    SOSAmbulance(){
      if(this.state.res_data.length < 1){
        Alert.alert('Cant Get your current location');
        return;
       }
       this.sendDirectSms(this.state.NumberAmbulance, 'Ambulance');
        const newDocumentID = firestore().collection('SOS').doc().id;
          firestore().collection('SOS').doc(newDocumentID).set({
            RiderIDS:this.state.RiderIDS,
            photo: this.state.photo,
            userId: this.state.key,
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            coords:this.state.coords,
            str:this.state.str,
            context: this.state.res_data,
            CountryWikiData: this.state.res_data[this.state.res_data.length-1].wikidata,
            CityWikiData: this.state.res_data[this.state.res_data.length-2].wikidata,
            UserLocationCountry: this.state.UserLocationCountry,
            DatePressed: moment().unix(),
            callFor: 'Ambulance',
            id:newDocumentID,
            accountOf: 'User',
          }).then(()=>{
            this.setState({SOSMOdal: false});
            Alert.alert('S.O.S is sent')
          }
          )
    }


    SOSPolice(){
      if(this.state.res_data.length < 1){
        Alert.alert('Cant Get your current location');
        return;
       }

       this.sendDirectSms(this.state.NumberPolice, 'Police');
        const newDocumentID = firestore().collection('SOS').doc().id;
          firestore().collection('SOS').doc(newDocumentID).set({
            RiderIDS:this.state.RiderIDS,
            photo: this.state.photo,
            userId: this.state.key,
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            coords:this.state.coords,
            str:this.state.str,
            context: this.state.res_data,
            CountryWikiData:this.state.res_data.length> 0? this.state.res_data[this.state.res_data.length-1].wikidata:'',
            CityWikiData:this.state.res_data.length> 0? this.state.res_data[this.state.res_data.length-2].wikidata:'',
            UserLocationCountry: this.state.UserLocationCountry,
            DatePressed: moment().unix(),
            callFor: 'Police',
            id:newDocumentID,
            accountOf: 'User',
          }).then(()=>{
            this.setState({SOSMOdal: false});
            Alert.alert('S.O.S is sent')
          }
          )
    }


    SOSFireman(){
      if(this.state.res_data.length < 1){
        Alert.alert('Cant Get your current location');
        return;
       }
      this.sendDirectSms(this.state.NumberFireman, 'Fireman');
        const newDocumentID = firestore().collection('SOS').doc().id;
          firestore().collection('SOS').doc(newDocumentID).set({
            RiderIDS:this.state.RiderIDS,
            photo: this.state.photo,
            userId: this.state.key,
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            coords:this.state.coords,
            str:this.state.str,
            context: this.state.res_data,
            CountryWikiData: this.state.res_data[this.state.res_data.length-1].wikidata,
            CityWikiData: this.state.res_data[this.state.res_data.length-2].wikidata,
            UserLocationCountry: this.state.UserLocationCountry,
            DatePressed: moment().unix(),
            callFor: 'Fireman',
            id:newDocumentID,
               accountOf: 'User',
          }).then(()=>{
          this.setState({SOSMOdal: false});
          Alert.alert('S.O.S is sent')
        }
          )
    }

    _bootstrapAsync =async(selected,item, typeOfRate, city) =>{
   //   const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
  //  console.log('selectedCity: ',this.state.selectedCity)
        const NewCityItem = item.trim();
        const NewValueofCityUser = city.find( (items) => items.label === NewCityItem);
      this.setState({selectedCityUser: this.state.selectedCity == undefined?item: this.state.selectedCity == 'none'? item:this.state.selectedCity, typeOfRate: NewValueofCityUser.typeOfRate})
     const newUserLocationCountry = this.state.UserLocationCountry =='Philippines'?'vehicles':this.state.UserLocationCountry+'.vehicles';
  //    firestore().collection(newUserLocationCountry).where('succeed', '>',0).onSnapshot(this.onCollectionProducts);

      
    }
    async getAllCity() {
      this.setState({loading: true})
      
      const collect= this.state.UserLocationCountry.trim() =='Philippines'?'city':this.state.UserLocationCountry.toString()+'.city';
      // console.log('collect: ', collect)
      //     console.log('UserLocationCountry: ', this.state.UserLocationCountry)
     //            console.log('selectedCountry: ', this.state.selectedCountry)
        firestore().collection(collect)
        .onSnapshot(querySnapshot => {
          const city = [];
          querySnapshot.docs.forEach(doc => {
          city.push(doc.data());
      //    console.log('collect data: ', doc.data())
        });
      //  console.log('city getAllCity: ', city)
        this.setState({
          cities: city,
        }) 
      }); 
    
      const SosCity = [];
      const Soscollect= this.state.originalCountry.trim() =='Philippines'?'city':this.state.originalCountry.toString()+'.city';
    //  console.log('collect: ', Soscollect)
    //      console.log('originalCountry: ', this.state.originalCountry)
       firestore().collection(Soscollect).where('country', '==', this.state.originalCountry.trim())
       .onSnapshot(querySnapshot => {
         querySnapshot.docs.forEach(doc => {
          SosCity.push(doc.data());
       //  console.log('SosCity: ', doc.data())
       });
     }); 

       firestore().collection(Soscollect).where('arrayofCity', 'array-contains-any', [this.state.cityOriginal.text.trim()])
       .onSnapshot(querySnapshot => {
         querySnapshot.docs.forEach(doc => {
      //    console.log('NumberAmbulance: ', doc.data().NumberAmbulance)
     //     console.log('NumberFireman: ', doc.data().NumberFireman)
      //    console.log('NumberPolice: ', doc.data().NumberPolice)
            this.setState({
              NumberAmbulance:doc.data().NumberAmbulance,
              NumberFireman:doc.data().NumberFireman,
              NumberPolice:doc.data().NumberPolice,
            })
       });
     }); 


     
    
             const CountryNow = this.state.AvailableOn.filter(items => {
            const itemData = items.label;
            const textData = this.state.UserLocationCountry;
           
            return itemData.indexOf(textData) > -1
          })
           
      
          this.setState({
            CountryNow,
            loading:false,
          })  
          
         
          Geolocation.getCurrentPosition(
                info => {
                    const { coords } = info
  //  console.log('coordsL ', coords)
    
     axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
         .then(res => {
        const item = res.data.features[0];
        let str = res.data.features[0].place_name;
    
    let arr = str.split(',');
    const newarrLenght= arr.length-3
    const UserLocation = arr[newarrLenght]
    
    const province = Province.ZipsCollection.find( (items) => items.zip === res.data.features[0].context[0].text);
    const valprovince = province == undefined? arr[newarrLenght]:province.province;

                 this.setState({
                   selectedCityUser: UserLocation,
                   currentLocation:UserLocation,
                   billing_streetTo:arr[0],
                   billing_provinceTo:arr[1],
                    fromPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+UserLocation+' '+valprovince+' '+arr[3],
                   location:item.place_name, x: { latitude: coords.latitude, longitude: coords.longitude },loading:false })
    
                       this._bootstrapAsync(true,UserLocation, null,UserLocation);
          
           }).catch(err => {
               //      Alert.alert('Error', 'Internet Connection is unstable')
              console.log('Region axios: ',err)
           })
                },
                error => console.log(error),
                {
                    enableHighAccuracy: false,
                    timeout: 2000,
                    maximumAge: 3600000
                }
            )
       
        }
        async getAllStates(short_code){
          this.setState({loading: true})
          const userId =  auth().currentUser.uid;
    
          console.log('getAllStates short_code: ',short_code.toUpperCase())
        
          firestore().collection('AvailableOn').doc(short_code.toUpperCase()).collection('states')
          .onSnapshot(querySnapshot => {
            const states = [];
            querySnapshot.docs.forEach(doc => {
     //         console.log('getCountryCity: ', doc.data().label)
            states.push(doc.data());
           
          });
          this.setState({
            states: states,
          
          })  
        }); 
  
     
            this.setState({
     
              loading:false,
            })  
           
      }

        async getCountryCity(PressedCountrycode){
          this.setState({loading: true})
          const userId =  auth().currentUser.uid;
          const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
          firestore().collection('users').doc(userId).update({  selectedCountry: PressedCountrycode.trim()})
          console.log('PressedCountrycode: ',PressedCountrycode)
          console.log('selectedCountry: ',this.state.SelectedCountryInfo)
        
          firestore().collection('AvailableOn').doc(this.state.SelectedCountryInfo.code).collection('states')
          .onSnapshot(querySnapshot => {
            const states = [];
            querySnapshot.docs.forEach(doc => {
     //         console.log('getCountryCity: ', doc.data().label)
            states.push(doc.data());
           
          });
          this.setState({
            states: states,
            modalSelectedState:true,modalSelectedCityNoUser: false,modalSelectedCity:false,
          })  
        }); 
            const collect= asyncselectedCountry == null?PressedCountrycode =='Philippines'?'city':PressedCountrycode.trim()+'.city':asyncselectedCountry.trim()+'.city';
              firestore().collection(collect)
              .onSnapshot(querySnapshot => {
                const city = [];
                querySnapshot.docs.forEach(doc => {
         //         console.log('getCountryCity: ', doc.data().label)
                city.push(doc.data());
               
              });
              this.setState({
                cities: city,
              })  
            }); 
            if( this.state.AvailableOn.length <1){
              this.setState({  
                CountryNow:[{labelRider: '', currency: '', currencyPabili:''}]
              })
            }
      
            const CountryNow = this.state.AvailableOn.filter(items => {
              const itemData = items.label;
              const textData = PressedCountrycode;
             
              return itemData.indexOf(textData) > -1
            })
              
            this.setState({
              CountryNow:CountryNow.length < 1?[{labelRider: '', currency: '', currencyPabili:''}]: CountryNow,
            PressedCountry:PressedCountrycode,
              loading:false,
            })  
           
      }

changeCity (item){
    const userId =  auth().currentUser.uid;
  firestore().collection('users').doc(userId).update({  selectedCity: this.state.currentLocation.trim() == item.label? 'none':item.label, cityLat:this.state.currentLocation.trim() == item.label? 'none':item.cLat, cityLong:this.state.currentLocation.trim() == item.label? 'none':item.cLong })
  this._bootstrapAsync(true, item.label, item.typeOfRate, this.state.cities);
  this.setState({modalSelectedCity: false,newCity:[], searchcity:''})
}


async getCountryCityNoUser(PressedCountrycode){
      this.setState({loading: true})
   
 //console.log('PressedCountrycode getCountryCityNoUser : ', PressedCountrycode)
    AsyncStorage.setItem('asyncselectedCountry', PressedCountrycode.trim())
    const collect= PressedCountrycode =='Philippines'?'city':PressedCountrycode.trim()+'.city';
   // console.log('getCountryCityNoUser: ', collect)
     firestore().collection(collect)
      .onSnapshot(querySnapshot => {
        const city = [];
        querySnapshot.docs.forEach(doc => {
     //     console.log('getCountryCity: ', doc.data().label)
        city.push(doc.data());
      })
      this.setState({
        cities: city,
      })  
      });
    
    if( this.state.AvailableOn.length <1){
      this.setState({
        CountryNow:[{labelRider: '', currency: '', currencyPabili:''}]
      })
    }

    const CountryNow = this.state.AvailableOn.filter(items => {
      const itemData = items.label;
      const textData = PressedCountrycode;
     
      return itemData.indexOf(textData) > -1
    })
      
    this.setState({
      CountryNow:CountryNow.length < 1?[{labelRider: '', currency: '', currencyPabili:''}]: CountryNow,
 
      loading:false,
    })  
   
}

changeCityNoUser (item){
  //this.state.currentLocation.trim() == item.label
 
     console.log('asyncselectedCity: ', item.label)
this._bootstrapAsync(true, item.label, item.typeOfRate, this.state.cities);
this.setState({modalSelectedCityNoUser: false,newCity:[], searchcity:''})
  
}



async getCityProvince(PressedCountrycode){
    this.setState({loading: true})
  const userId =  auth().currentUser.uid;
  const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
  console.log('selectedCountry: ',this.state.selectedCountry)
  console.log('asyncselectedCountry: ',asyncselectedCountry)
  console.log('PressedCountrycode: ',PressedCountrycode)

    const collect=  this.state.selectedCountry == null?this.state.selectedCountry =='Philippines'?'city':this.state.selectedCountry.trim()+'.city':this.state.UserLocationCountry.trim() =='Philippines'?'city':this.state.UserLocationCountry.trim()+'.city';
    console.log('collect: ',collect)
    firestore().collection(collect).where('province', '==', PressedCountrycode)
      .onSnapshot(querySnapshot => {
        const city = [];
        querySnapshot.docs.forEach(doc => {
         console.log('getCityProvince: ', doc.data().label)
        city.push(doc.data());
       
      });
      this.setState({
        cities: city,
      })  
    }); 


      
    this.setState({modalSelectedCity:true,
      modalSelectedState:false,
      loading:false,
    })  
   
}

StartImageRotationFunction(){
  this.Rotatevalue.setValue(0);
  Animated.timing(this.Rotatevalue,{
    toValue:1,
    duration:3000,
    useNativeDriver: true // Add This line
  }).start(()=>this.StartImageRotationFunction());
}



  render() {
    const {uid}=this.state;
   console.log('states: ', this.state.states)
   const RotateData = this.Rotatevalue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '368deg']
  })

  const trans={
    transform:[
      {rotate: RotateData}
    ]
  }
    return (
      <Container>
      <CustomHeader title="Account Settings" isHome={true} Cartoff={true} navigation={this.props.navigation}/>
      <Loader loading={this.state.loading} trans={trans}/>
      <Modal
              isVisible={this.state.SOSMOdal}
              animationInTiming={500}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              animationOutTiming={500}
              useNativeDriver={true}
              onBackButtonPress={() => this.setState({SOSMOdal: false})} transparent={true}>
            <View style={styles.contents}>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold', textAlign: 'center'}}>Click on the Corresponding Emergency Assistance you need for Help</Text>
               </View>
         <View>
              <TouchableOpacity onPress={()=> this.SOSPolice()} style={{flexDirection: 'row',  marginBottom: 25}}>
            <View style={{justifyContent: 'flex-end'}}>
              <View style={{ backgroundColor: "#FFFFFF" , height: 27,  shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3, borderRadius: 5, padding: 2, bottom: 5 }}>
              <MaterialCommunityIcons name="police-badge-outline" size={25} color="gray" style={{top:0}} />
              </View>
            </View>
            <View>
              <Text> Police</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={()=> this.SOSFireman()} style={{flexDirection: 'row',  marginBottom: 25}}>
            <View style={{justifyContent: 'flex-end'}}>
              <View style={{ backgroundColor: "#FFFFFF" , height: 27,  shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3, borderRadius: 5, padding: 2, bottom: 5 }}>
              <MaterialCommunityIcons name="fire-truck" size={25} color="gray" />
              </View>
            </View>
            <View>
              <Text > Fireman</Text>
            </View>
          </TouchableOpacity>
     

          <TouchableOpacity onPress={()=> this.SOSAmbulance()} style={{flexDirection: 'row',marginBottom: 10}}>
            <View style={{justifyContent: 'flex-end'}}>
              <View style={{ backgroundColor: "#FFFFFF" , height: 27,  shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3, borderRadius: 5, padding: 2, bottom: 5 }}>
              <MaterialCommunityIcons name="ambulance" size={25} color="gray" style={{top:0}} />
              </View>
            </View>
            <View>
              <Text> Ambulance</Text>
            </View>
          </TouchableOpacity>
          <Text style={{color:'black', fontWeight:'bold', fontSize: 14, textAlign: 'center', marginTop: 5}}>Your Personal Information and specific location will be made public.</Text>
             
          </View>
            </View>
            </Modal>
            <Modal
              isVisible={this.state.EmptyOperator}
              animationInTiming={500}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              animationOutTiming={500}
              useNativeDriver={true}
              onBackButtonPress={() => this.setState({EmptyOperator: false})} transparent={true}>
            <View style={styles.contents}>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold', textAlign: 'center'}}>No Available Franchise Operator</Text>
               </View>
         <View style={{justifyContent:'center',alignItems: 'center'}}>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('GatewayDetails',{'url': this.state.Operator, 'title': 'Be a service provider'})} style={{flexDirection: 'row',  marginBottom: 25}}>
 
            <View style={{backgroundColor:'#e85017',width: SCREEN_WIDTH/2,}}>
              <Text style={{color: 'white', textAlign:'center', padding: 3}}> Click here to join</Text>
            </View>
          </TouchableOpacity>


          </View>
            </View>
            </Modal>
      <Modal
                  useNativeDriver={true}
                  isVisible={this.state.modalSelectedCity}
                  onSwipeComplete={this.close}
                  swipeDirection={['up', 'left', 'right', 'down']}
                  style={styles.view}
                  onBackButtonPress={() => this.setState({ modalSelectedCity: false })}
                  onBackdropPress={() => this.setState({modalSelectedCity: false})} transparent={true}>
                <View style={[styles.content,{height: SCREEN_HEIGHT,width: SCREEN_WIDTH, backgroundColor: 'white', marginLeft: -20}]}> 
                <Card style={{ width: SCREEN_WIDTH, marginTop: this.state.keyboardav == true? 130:0}}>
  <CardItem listItemPadding={0} >
 <Left style={{flex:1}}>
          <Button transparent onPress={()=> this.setState({modalSelectedCity: false})}>
                 <MaterialIcons name="arrow-back" size={25} color="black" />
                </Button> 
          </Left>
          <Right>
          <TouchableOpacity onPress={()=> this.setState({ViewCountry : !this.state.ViewCountry})}>
          <Text>{this.state.selectedCountry == ''?this.state.UserLocationCountry:this.state.selectedCountry}</Text>
           </TouchableOpacity>
          </Right>
                </CardItem>
                </Card>
                  { this.state.ViewCountry==true?
                  
                    <Card>
                    <Item>
                    <Input placeholder="Search..." value={this.state.searchCountry} onChangeText={(text) => {
                      
                      
                      this.setState({SelectedAvailableOn: this.state.AvailableOn.filter(items => {
        const itemData = items.label;
        const textData = text;
       
        return itemData.indexOf(textData) > -1
      }),searchCountry:text })}} placeholderTextColor="#687373"  onFocus={()=> this.setState({keyboardav: true})} onBlur={()=> this.setState({keyboardav: false})}/>
                    </Item>
                     <FlatList
                  data={this.state.SelectedAvailableOn.length < 1? this.state.AvailableOn:this.state.SelectedAvailableOn}
                  renderItem={({ item,index }) => (
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row'}} key={index} button  onPress={() => {this.getCountryCity(item.label);this.setState({selectedCountry: item.label,SelectedAvailableOn:[], searchCountry:'', ViewCountry: false, keyboardav: false,SelectedCountryInfo:item});  }}>
                       <Image style={{  width: 70, height: 50,}} resizeMethod="scale" resizeMode="contain" source={{uri: item.flag}} />
                      <Text style={{fontSize: 17, paddingLeft: 20}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null }{item.label=="Cebu City"? '(Demo City)':null }</Text></Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />


                    </Card>

                    :


                   <Card>
                    <Item>
                    <Input placeholder="Search City..." value={this.state.searchcity} onChangeText={(text) => {
                      
                      
                      this.setState({newCity: this.state.cities.filter(items => {
        const itemData = items.label;
        const textData = text;
       
        return itemData.indexOf(textData) > -1
      }),searchcity:text })}} placeholderTextColor="#687373"  onFocus={()=> this.setState({keyboardav: true})} onBlur={()=> this.setState({keyboardav: false})}/>
                    </Item>
                     <FlatList
                     style={{marginBottom: 120}}
                  data={this.state.newCity.length < 1? this.state.cities:this.state.newCity}
                  renderItem={({ item,index }) => (
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH,}} key={index} button  onPress={() => {item.OperatorsAvail ==0? this.setState({EmptyOperator:true}):this.changeCity(item)}}>
                      <Text style={{fontSize: 17}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null } {item.label=="Cebu City"? '(Demo City)':null }</Text></Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />



                    </Card>

                  }
                </View>
                </Modal>

                <Modal
                  useNativeDriver={true}
                  isVisible={this.state.modalSelectedState}
                  onSwipeComplete={this.close}
                  swipeDirection={['up', 'left', 'right', 'down']}
                  style={styles.view}
                  onBackButtonPress={() => this.setState({ modalSelectedState: false })}
                  onBackdropPress={() => this.setState({modalSelectedState: false})} transparent={true}>
                <View style={[styles.content,{height: SCREEN_HEIGHT,width: SCREEN_WIDTH, backgroundColor: 'white', marginLeft: -20}]}> 
                <Card style={{ width: SCREEN_WIDTH, marginTop: this.state.keyboardav == true? 130:0}}>
  <CardItem listItemPadding={0} >
 <Left style={{flex:1}}>
          <Button transparent onPress={()=> this.setState({modalSelectedState: false})}>
                 <MaterialIcons name="arrow-back" size={25} color="black" />
                </Button> 
          </Left>
          <Right>
          <TouchableOpacity onPress={()=> this.setState({ViewCountry : !this.state.ViewCountry})}>
          <Text>{this.state.selectedCountry == ''?this.state.UserLocationCountry:this.state.selectedCountry}</Text>
           </TouchableOpacity>
          </Right>
                </CardItem>
                </Card>
          
                  
                    <Card>
                    {this.state.states.length < 1? null: <Item>
                    <Input placeholder="Search State..." value={this.state.searchState} onChangeText={(text) => {
                      
                      
                      this.setState({SelectedSearchState: this.state.states.filter(items => {
        const itemData = items.label;
        const textData = text;
       
        return itemData.indexOf(textData) > -1
      }),searchState:text })}} placeholderTextColor="#687373"  onFocus={()=> this.setState({keyboardav: true})} onBlur={()=> this.setState({keyboardav: false})}/>
                    </Item>}
                    {this.state.states.length < 1?
                     <CardItem  style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row', justifyContent: 'center'}} >
                    <Text style={{fontSize: 17, paddingLeft: 20}}>No Available Francise Operator</Text>
                  </CardItem>
                    :<FlatList
                  data={this.state.SelectedSearchState.length> 0?this.state.SelectedSearchState: this.state.states}
                  renderItem={({ item,index }) => (
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row'}} key={index} button  onPress={() => {this.getCityProvince(item.label);this.setState({selectedState: item.label,SelectedAvailableOn:[], searchState:'',  SelectedStateInfo:item });  }}>
                      <Text style={{fontSize: 17, paddingLeft: 20}}>{item.label} </Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />
}

                    </Card>

           
                </View>
                </Modal>

                <Modal
                  useNativeDriver={true}
                  isVisible={this.state.modalSelectedCityNoUser}
                  onSwipeComplete={this.close}
                  swipeDirection={['up', 'left', 'right', 'down']}
                  style={styles.view}
                  onBackButtonPress={() => this.setState({ modalSelectedCityNoUser: false })}
                  onBackdropPress={() => this.setState({modalSelectedCityNoUser: false})} transparent={true}>
                <View style={[styles.content,{height: SCREEN_HEIGHT,width: SCREEN_WIDTH, backgroundColor: 'white', marginLeft: -20}]}> 
                <Card style={{ width: SCREEN_WIDTH, marginTop: this.state.keyboardav == true? 130:0}}>
  <CardItem listItemPadding={0} >
 <Left style={{flex:1}}>
          <Button transparent onPress={()=> this.setState({modalSelectedCityNoUser: false})}>
                 <MaterialIcons name="arrow-back" size={25} color="black" />
                </Button> 
          </Left>
          <Right>
          <TouchableOpacity onPress={()=> this.setState({ViewCountry : !this.state.ViewCountry})}>
          <Text>{this.state.asyncselectedCountry == null?this.state.selectedCountry == ''?this.state.UserLocationCountry:this.state.selectedCountry:this.state.asyncselectedCountry}</Text>
           </TouchableOpacity>
          </Right>
                </CardItem>
                </Card>
                  { this.state.ViewCountry==true?
                  
                    <Card>
                    <Item>
                    <Input placeholder="Search..." value={this.state.searchCountry} onChangeText={(text) => {
                      
                      
                      this.setState({SelectedAvailableOn: this.state.AvailableOn.filter(items => {
        const itemData = items.label;
        const textData = text;
       
        return itemData.indexOf(textData) > -1
      }),searchCountry:text })}} placeholderTextColor="#687373"  onFocus={()=> this.setState({keyboardav: true})} onBlur={()=> this.setState({keyboardav: false})}/>
                    </Item>
                     <FlatList
                  data={this.state.SelectedAvailableOn.length < 1? this.state.AvailableOn:this.state.SelectedAvailableOn}
                  renderItem={({ item,index }) => (
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row'}} key={index} button  onPress={() => {this.getCountryCityNoUser(item.label);this.setState({selectedCountry: item.label,SelectedAvailableOn:[], searchCountry:'', ViewCountry: false, keyboardav: false});  }}>
                       <Image style={{  width: 70, height: 50,}} resizeMethod="scale" resizeMode="contain" source={{uri: item.flag}} />
                      <Text style={{fontSize: 17, paddingLeft: 20}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null } {item.label=="Cebu City"? '(Demo City)':null }</Text></Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />


                    </Card>

                    :


                   <Card>
                    <Item>
                    <Input placeholder="Search..." value={this.state.searchcity} onChangeText={(text) => {
                      
                      
                      this.setState({newCity: this.state.cities.filter(items => {
        const itemData = items.label;
        const textData = text;
       
        return itemData.indexOf(textData) > -1
      }),searchcity:text })}} placeholderTextColor="#687373"  onFocus={()=> this.setState({keyboardav: true})} onBlur={()=> this.setState({keyboardav: false})}/>
                    </Item>
                     <FlatList
                  data={this.state.newCity.length < 1? this.state.cities:this.state.newCity}
                  renderItem={({ item,index }) => (
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH,}} key={index} button  onPress={() => {this.changeCityNoUser(item)}}>
                      <Text style={{fontSize: 17}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null } {item.label=="Cebu City"? '(Demo City)':null }</Text></Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />



                    </Card>

                  }
                </View>
                </Modal>
      {uid ?
        <ScrollView>
        <Card>
     {this.state.photo == ''?
      <Card.Title
   
            title={this.state.name}
            subtitle={this.state.username}
            titleStyle={{ color: this.state.status == 'Verified'? "#28ae07":'#4a4a4a' }}
            left={(props) => <Avatar.Text size={64} color="white" style={{backgroundColor: 'gray'}} {...props} label={this.state.name.slice(0, 1).toUpperCase()} />}
            right={ (props) =><Card transparent onPress={()=> this.signOut()} style={{marginRight: 20}}>
            <Left>
           
              <AntDesign name="logout" size={25} color="gray" />
            
            </Left>
            <Body>
              <Text style={{fontSize: 12, color: 'gray', marginTop: 10}}>Logout</Text>
            </Body>
           
          </Card>}
          />
     :
     
      <Card.Title
            title={this.state.name}
            subtitle={this.state.status + ' user'}
            titleStyle={{ color: this.state.status == 'Verified'? "#28ae07":'#4a4a4a'}}
            left={(props) => <Avatar.Image size={64} color="white" style={{backgroundColor: 'gray'}} {...props} source={{uri: this.state.photo}} />}
            right={ (props) =><Card transparent onPress={()=> this.signOut()} style={{marginRight: 20}}>
            <Left>
           
              <AntDesign name="logout" size={25} color="gray" />
            
            </Left>
            <Body>
              <Text style={{fontSize: 12, color: 'gray', marginTop: 10}}>Logout</Text>
            </Body>
           
          </Card>}
          />
     
     }
       
           
          
          </Card>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/> 
        
        
          <ListItem icon onPress={()=>this.setState({modalSelectedState: true})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialIcons name="my-location" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>City: {this.state.selectedCityUser}</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
             
          <View style={{
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  }}>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate("Orders")} style={ { width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }}>
            <Title>{this.state.processing}</Title>
            <Caption>Pending & Processing</Caption>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate("Orders")} style={{ width: '50%',
    alignItems: 'center',
    justifyContent: 'center',}}>
            <Title>{this.state.delivered}</Title>
            <Caption>Delivered</Caption>
          </TouchableOpacity>
      </View>
          {/*<ListItem icon onPress={()=> this.props.navigation.navigate("Orders")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <AntDesign name="profile" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Transaction</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
        </ListItem>*/}
         <ListItem icon onPress={()=> this.props.navigation.navigate("Favorites",{ 'cLat': this.props.route.params.cLat, 'cLong': this.props.route.params.cLong, 'typeOfRate':this.props.route.params.typeOfRate, 'selectedCityUser': this.props.route.params.selectedCityUser, 'fromPlace': this.props.route.params.fromPlace,'UserLocationCountry': this.props.route.params.UserLocationCountry,'currency':this.props.route.params.currency, 'code':this.props.route.params.code,'cityLat': this.props.route.params.cityLat,'cityLong': this.props.route.params.cityLong})}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <AntDesign name="heart" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Favorites</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
          <ListItem icon onPress={()=> this.props.navigation.navigate("Vouchers")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="ticket-percent" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Vouchers</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="star-circle" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Points</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
         {/* <ListItem icon onPress={()=> this.props.navigation.navigate("wallet")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="account-edit" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Wallet</Text>
            </Body>
            <Right>       
            <Text>{'₱' +this.state.wallet.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text> 
            </Right>
          </ListItem>*/}
          <ListItem icon onPress={()=> this.props.navigation.navigate("Edit")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="account-edit" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Profile Settings</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
          <ListItem icon onPress={()=> this.props.navigation.navigate("Address")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>         
              <MaterialIcons name="edit-location" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Address Settings</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

          <ListItem icon  onPress={()=> this.props.navigation.navigate("MyVoucher")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="ticket" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>My Vouchers</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

        {  /*  <ListItem icon onLongPress={()=>this.setSOS()} delayLongPress={2000}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="alarm-light" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>S.O.S</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>*/}
 
                <ListItem icon onPress={this.onShare}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="share-variant" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Share this app</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="help-box" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Help</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>





             <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem icon onPress={()=> this.props.navigation.navigate("Gateway")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <FontAwesome name="drivers-license-o" size={20} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Entrepreneur Registration</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>
        
           
        
 {/*this.state.loggedIn ?
            <ListItem icon onPress={()=> this.signOut()}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="logout" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Logout</Text>
            </Body>
           
          </ListItem> :
           <ListItem icon onPress={()=> this.props.navigation.navigate("Login")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="login" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Sign In</Text>
            </Body>
           
          </ListItem>
         */
         }
    <TouchableOpacity style={{marginLeft: SCREEN_WIDTH/1.3, marginTop: SCREEN_HEIGHT/8}}     onPress={() => {
        this.backCount++
        if (this.backCount == 5) {
            clearTimeout(this.backTimer)
         this.setSOS()
        } else {
            this.backTimer = setTimeout(() => {
            this.backCount = 0
            }, 3000) 
        }

    }}
>
         <Card style={{height: 70, width: 70, borderRadius: 35, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{height: 60, width: 60, borderRadius: 30, borderWidth: 1,justifyContent: 'center', alignItems: 'center', margin:5,}}>
          <Zocial name="call" size={38} color="gray" style={{top:-4,right:-1, position: 'absolute',transform: [{rotateY: '200deg'},{rotateX: '180deg'}]}}/>
           <Text style={{fontSize: 12,textAlign: 'center',}}>SOS</Text>
          </View>
         </Card>
          </TouchableOpacity>
        </ScrollView>:
          this.state.loggedIn ?
            <ListItem icon onPress={()=> this.signOut()}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="logout" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Logout</Text>
            </Body>
           
          </ListItem> :
          <View>
           <ListItem icon onPress={()=> this.props.navigation.navigate("Login")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="login" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Sign In</Text>
            </Body>
           
          </ListItem>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/> 
          <ListItem icon onPress={()=>this.setState({modalSelectedCityNoUser: true})}>
              <Left>
                <Button style={{ backgroundColor: "#FFFFFF" }}>
                <MaterialIcons name="my-location" size={25} color="gray" />
                </Button>
              </Left>
              <Body>
                <Text>City: {this.state.asyncselectedCity == null?this.state.selectedCityUser:this.state.asyncselectedCity}</Text>
              </Body>
              <Right>       
              <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
              </Right>
            </ListItem>
          <ListItem icon onPress={()=> this.props.navigation.navigate("Vouchers")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="ticket-percent" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Vouchers</Text>
            </Body>
            <Right>       
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />    
            </Right>
          </ListItem>
            <ListItem icon onPress={this.onShare}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="share-variant" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Share this app</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <MaterialCommunityIcons name="help-box" size={25} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Help</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem itemDivider style={{backgroundColor: "#FFFFFF"}}/>
          <ListItem icon onPress={()=> this.props.navigation.navigate("Gateway")}>
            <Left>
              <Button style={{ backgroundColor: "#FFFFFF" }}>
              <FontAwesome name="drivers-license-o" size={20} color="gray" />
              </Button>
            </Left>
            <Body>
              <Text>Entrepreneur Registration</Text>
            </Body>
            <Right>
            <MaterialIcons name="keyboard-arrow-right" size={25} color="gray" />
            </Right>
          </ListItem>

          </View>
          }
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
contents: {
  backgroundColor: 'white',
  padding: 22,
  borderRadius: 4,
  borderColor: 'rgba(0, 0, 0, 0.1)',
},
})