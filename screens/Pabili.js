import React, { Component } from 'react';
import {StyleSheet,TouchableWithoutFeedback, TextInput, ToastAndroid,TouchableOpacity, Dimensions, Alert, Image, FlatList, SafeAreaView, ScrollView, BackHandler, Keyboard, PermissionsAndroid} from 'react-native'
import { Container, View, Left, Right, Button, Icon, Grid, Col, Badge, Card, CardItem, Body,Item, Input,List, ListItem,Header, Title, Thumbnail,Text,Form, Textarea,Toast, Root } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Clipboard from '@react-native-clipboard/clipboard';

import auth from '@react-native-firebase/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// Our custom files and classes import
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import DeliveryDetails from './checkout/DeliveryDetails';
import { RadioButton, Chip, Divider } from 'react-native-paper';
//import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import Modal from 'react-native-modal';
import TearLines from "react-native-tear-lines";  
import NumberFormat from 'react-number-format';
import Loader from '../components/Loader';
import CustomHeader from './Header';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import axios  from 'axios';
import Rider_img from '../assets/rider.png';
import customer_img from '../assets/customer.png';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "react-native-image-picker"
import {imgDefault} from './images';
import marker from '../assets/icons-marker.png';
import Province  from './Province.json';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken('sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA');

Logger.setLogCallback(log => {
  const { message } = log;

  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});
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


export default class Pabili extends Component {
  constructor(props) {
      super(props);
      this.updateref =  firestore();
      this.updatecounts =  firestore();
      this.updateUserOrders =  firestore();
      this.checkoutref =  firestore();
      this.storeRef  =   firestore(); 
      this.paymentsRef  =   firestore(); 
      this.billingRef  =   firestore();
      this.paymentMethodRef =  firestore();
      this.ordercounters =  firestore();
      const newUserLocationCountry = this.props.route.params.UserLocationCountry == 'Philippines'?'vehicles':this.props.route.params.UserLocationCountry+'.vehicles';
      this.chargeref =  firestore().collection(newUserLocationCountry).where('vehicle', '==', 'Motorcycle' );
      this.state = {  
   
     VisibleAddInfo: false,
     datas: [],
     cLong:this.props.route.params.cLong,
     cLat:this.props.route.params.cLat,
      driver_charge: 0,
      xtra: 0,
      labor: 0,
      deliveryCharge: 0,
      pickup: 0,
      stores:[],
      paymentMethod: 'Cash on Delivery (COD)',
      billing_name: '',
      billing_postal: '',
      billing_phone: '',
      billing_street: '',
      billing_country: '',
      billing_province: '',
      billing_city: '',
      billing_barangay: '',
      billing_cluster: '',
      billing_nameTo: '',
      billing_postalTo: '',
      billing_phoneTo: '',
      billing_streetTo:this.props.route.params.billing_streetTo,
      billing_countryTo: '',
      billing_provinceTo:this.props.route.params.billing_provinceTo,
      billing_cityTo: this.props.route.params.currentLocation,
      billing_barangayTo: '',
      billing_clusterTo: '',
      billing_streetcurrent:this.props.route.params.billing_streetTo,
      billing_countrycurrent: '',
      billing_provincecurrent:this.props.route.params.billing_provinceTo,
      billing_citycurrent: this.props.route.params.currentLocation,
      preffered_delivery_time: '',
      currentDate: new Date(),
      visibleModal: false,
      isVisible: false,
      payments: [],
      methods: [],
      palawan_name: '',
      palawan_number: '',
      bank_number: '',
      bank_name: '',
      gcash_number: '',
      counter: 0,
      account_name: '',
      account_address: '',
      account_city: '',
      account_barangay: '',
      account_province: '',
      account_email: '',
      account_number: '',
      account_cluster: '',
      account_status:'',
      paypal_email:'',
      paypal_uname:'',
      note:'',
      vouchers: [],
      discount: 0,
      voucherArray: [],
      charge: 0,
      xtraCharge: 0,
      voucherCode: '',
      loading: false,
      address_list:[],
      visibleAddressModal: true,
      visibleAddressModalPin: false,
      //subtotal: subtotal,
      minimum: 0,
      selectedIndex: 0,
      selectedIndices: [0],  
      customStyleIndex: 0,
      isready:0,
      visibleAddressModalTo: false,
      visibleAddressModalToPin: false,
      passenger: '1',
      note: '',
      AlwaysOpen: true,
      Customerimage:null,
       Metro:0,
      City: 0,
      SCity: 0,
      SMetro: 0,
      warningModal: false,
      fromPlace: '',
        Tolat:this.props.route.params.cLat,
        Tolong:this.props.route.params.cLong,

       region:{ latitude:this.props.route.params.cLat,
      longitude:this.props.route.params.cLong,
      // latitudeDelta: 0.0005,
  //longitudeDelta: 0.05
            latitudeDelta: 0.01,
              longitudeDelta: 0.005},
                Currentlat:this.props.route.params.cLat,
        Currentlong:this.props.route.params.cLong,
        currentPlace:this.props.route.params.fromPlace,
      searchResult: [],
      searchResultto:[],
      toPlace: this.props.route.params.fromPlace,
      isLoading: false,
       keyboard: false,
      photo: '',
      PBasekm: 0,
        PbaseFare: 0,
          Psucceeding: 0,
            CityPBasekm: 0,
              CityPbaseFare: 0,
                CityPsucceeding: 0,
                MetroPsucceeding: 0,
                MetroPBasekm: 0,
                MetroPbaseFare: 0,
                routeForMap: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": [[this.props.route.params.cLong, this.props.route.params.cLat],[this.props.route.params.cLong, this.props.route.params.cLat]]
              }
            }
          ]
        },
        listModal: true,
   avoildingViewList:false,
   ItemList:[],
      
  };
  this.getLocation();

  }

  onRegionChange = (region) => {
    console.log('region: ', region)
  console.log('visibleAddressModalPin: ', this.state.visibleAddressModalPin)
    console.log('visibleAddressModalToPin: ', this.state.visibleAddressModalToPin)
    if(this.state.visibleAddressModal == true || this.state.visibleAddressModalPin == true){
      this.setState({isLoading: true, keyboard: false})
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${region[0]},${region[1]}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];

        let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)

const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            const Newprovince =province == undefined? item.context[0].text:province.province
const newarrLenght = arr.length-3
console.log("newarrLenght value", arr[newarrLenght])


             this.setState({
    billing_province:Newprovince,
    billing_city: arr[newarrLenght],
    billing_street:arr[0]+', '+ arr[1],
    billing_postal: arr[3],
    billing_barangay: item.context[1].text,
    flat:region[1],
    flong: region[0],
    cLong:region[0],
     cLat:region[1],
               region:{ latitude:region[1],
      longitude: 	region[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
       showfromBotton: true,
               fromPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+arr[newarrLenght]+', '+Newprovince, x: { latitude: region[1], longitude: region[0] },
               isLoading: false, LocationDoneto: true,
               })

console.log('Tolong: ',this.state.Tolong);
               if(this.state.Tolong != undefined){
                   console.log('working here')
              this.setState({isLoading: true})    
             let routeCoordinates = []
    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${region[1]},${region[0]}&waypoint1=geo!${this.state.Tolat},${this.state.Tolong}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
    .then(res => {
   
        res.data.response.route[0].leg[0].shape.map(m => {
          // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
          // need it seperate for <Polyline/>
          let latlong = m.split(',');
          let latitude = parseFloat(latlong[0]);
          let longitude = parseFloat(latlong[1]);
          routeCoordinates.push([longitude,latitude]);
      })
       console.log("routeCoordinates", routeCoordinates)
      this.setState({
        routeForMap: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": routeCoordinates
              }
            }
          ]
        },
               summary: res.data.response.route[0].summary,
         isLoading: false,

      })

      }).catch(err => {
          console.log('here fron: ',err)
       })
     
               }

       }).catch(err => {
          console.log('visibleAddressModal Region axios: ',err)
       })
    
       return;
    }
        console.log('visibleAddressModalTo: ',this.state.visibleAddressModalTo)
        console.log('visibleAddressModalToPin: ',this.state.visibleAddressModalToPin)
        if(this.state.visibleAddressModalTo == true || this.state.visibleAddressModalToPin == true ){
this.setState({isLoading: true, keyboard: false})

 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${region[0]},${region[1]}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];

    
    const {flat, flong, } = this.state;
    let from_lat = flat
    let from_long = flong
    let to_lat = region[1]
    let to_long = region[0]
   // [125.53647997480391, 8.93336215559458]
  console.log('to_lat: ', to_lat)
    console.log('to_long: ', to_long)
    let routeCoordinates = [];
    let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)
const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
console.log("newarrLenght value", arr[newarrLenght])
const findCity = Province.ZipsCollection.find( (items) => items.area === res.data.features[0].context[2].text)

console.log('UserLocation: ', UserLocation)
      const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
       const Newprovince =province == undefined? item.context[0].text:province.province;
 this.setState({
Tolat:region[1],
        Tolong:region[0],
    billing_provinceTo:Newprovince,
    billing_cityTo: UserLocation,
    billing_streetTo:arr[0]+', '+ arr[1],
    billing_postalTo: arr[3],
    billing_barangayTo: item.context[1].text,
    flatTo:region[1],
     flongTo:region[0],
  region:{ latitude:region[1],
      longitude: 	region[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
               toPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+UserLocation+', '+Newprovince, LocationDoneto: true, LocationDone: true,
          isLoading: false,
      })

   if(this.state.x != undefined){
       this.setState({isLoading:true})
    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
    .then(res => {
   
        res.data.response.route[0].leg[0].shape.map(m => {
          // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
          // need it seperate for <Polyline/>
          let latlong = m.split(',');
          let latitude = parseFloat(latlong[0]);
          let longitude = parseFloat(latlong[1]);
          routeCoordinates.push([longitude,latitude]);
      })

       console.log('summary: ',  res.data.response.route[0].summary);
       console.log("routeCoordinates", routeCoordinates)
      this.setState({
        routeForMap: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": routeCoordinates
              }
            }
          ]
        },
        
        
        
       
          summary: res.data.response.route[0].summary,
         

          isLoading: false,
      })

      }).catch(err => {
          console.log('here drop off: ',err)
       })

   }
       }).catch(err => {
           this.setState({ isLoading: false,})
        
               Alert.alert('Error', 'Internet Connection is unstable')
                console.log('Region visibleAddressModalTo axios: ',err)
       })
    }
 
  }

 getLocationType = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
    this.setState({LocationDone: false})
    console.log('text: ', text);
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA&country=${this.props.route.params.code.toLowerCase()}`)
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
  getLocationTypeto = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
    this.setState({LocationDoneto: false})
    console.log('text: ', text);
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA&country=${this.props.route.params.code.toLowerCase()}`)
     .then(res => {
    
    console.log('res: ', res.data.features[0]);
    let str = res.data.features[0].place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)

    this.setState({searchResultto:res.data.features })
       }).catch(err => {
          console.log('axios: ',err)
       })




 }
  getLocation (){


 /*firestore().collection('vehicles').where('vehicle', '==', this.state.datas.vehicle).onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
console.log('doc.data(): ', doc.data())
      this.setState({
        succeding: doc.data().succeed,
        amount_base: this.props.route.params.typeOfRate =='Municipal Rate'?doc.data().base_fare:this.props.route.params.typeOfRate =='City Rate'?doc.data().City:doc.data().Metro,
        base_dist: doc.data().base,
          Metro: doc.data().Metro,
            City: doc.data().City,
              SCity: doc.data().SCity,
                SMetro: doc.data().SMetro,
      
     });
    })
  })*/
  }

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true})
      };
    
       hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
      };
    
       handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({startDate: date})
        this.hideDatePicker();
      };

  checkbarangay(data) {
    const ref =  firestore().collection('barangay').doc(data);

    ref.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          barangay_km: data.kilometer,
          barangay_status: data.status ,
          charge : data.charge ,
          selectedBarangayCluster: data.cluster    
        });
        this.calculateXtraKm(data.charge, data.cluster);
      } 
    });
    
  }




    backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => null}
    ]);
    return true;
  };

  async componentDidMount() {
     /* this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );*/
   if(Platform.OS === 'android')
    {

    await request_device_location_runtime_permission();

    }

      Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
console.log('coordsL ', coords)
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];
    console.log('res: ', res.data.features[0]);
    let str = res.data.features[0].place_name;

let arr = str.split(',');
const province = Province.ZipsCollection.find( (items) => items.zip === res.data.features[0].context[0].text)

const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
console.log("newarrLenght value", arr[newarrLenght])

console.log('UserLocation: ', UserLocation)

             this.setState({
        Tolat:region[1],
        Tolong:region[0],
       
          summary: res.data.response.route[0].summary,
         
    billing_provinceTo:Newprovince,
    billing_cityTo: UserLocation,
    billing_streetTo:arr[0]+', '+ arr[1],
    billing_postalTo: arr[3],
    billing_barangayTo: item.context[1].text,
    flatTo:region[1],
     flongTo:region[0],
  region:{ latitude:region[1],
      longitude: 	region[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
               toPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+UserLocation+', '+Newprovince, LocationDoneto: true, LocationDone: true,
          isLoading: false, })

                
      
       }).catch(err => {
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
   this.chargeref.onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
console.log('doc.data(): ', doc.data())
      this.setState({
        PBasekm: doc.data().PBasekm,
        PbaseFare: doc.data().PbaseFare,
          Psucceeding: doc.data().Psucceeding,
            CityPBasekm: doc.data().CityPBasekm,
              CityPbaseFare: doc.data().CityPbaseFare,
                CityPsucceeding: doc.data().CityPsucceeding,
                MetroPsucceeding: doc.data().MetroPsucceeding,
                MetroPBasekm: doc.data().MetroPBasekm,
                MetroPbaseFare: doc.data().MetroPbaseFare,
      
     });
    })
  })
    this._bootstrapAsync();


  }

  
 componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    this.subscribe && this.subscribe();
    this.billinglistener && this.billinglistener();
    this.ordercounters && this.ordercounters();
        
  }
  getAdminCharge =async()=> {
   console.log('Get AdminId: ', this.state.cartItems[0])
   const getAdminId = this.state.cartItems[0];
    this.ordercounters.collection('charges').where('id', '==', getAdminId.adminID ).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
  
        this.setState({
          del_charge : doc.data().del_charge,
          driverCharge: doc.data().driverCharge,
          extra_charge: doc.data().extra_charge,
          labor_charge: doc.data().labor_charge,
          pickup_charge: doc.data().pickup_charge,
          succeding: doc.data().succeding,
          amount_base: doc.data().del_charge,
          base_dist: doc.data().base_dist,
        
       });
      })
    })
    
  }
  
  cartCount () {
    let total = 0
    this.state.cartItems.forEach((item) => {
      total += item.qty;
    })

    return total;
  }
  
_bootstrapAsync =async () =>{
  const userId= await AsyncStorage.getItem('uid');
  this.billinglistener = firestore().collection('users').where('userId','==', userId).onSnapshot(this.onCollectionUpdateBilling);      

  this.ordercounters = this.ordercounters.collection('orderCounter').onSnapshot(this.OrderCounter); 

  
  this.setState({ uid: userId })
  };


  
   onCPaymentMethodUpdate = (querySnapshot) => {
    const methods = [];
    querySnapshot.forEach((doc) => {
      this.setState({
        palawan_name: doc.data().palawan_receiver,
        palawan_number: doc.data().palawan_number,
        bank_number: doc.data().bank_number,
        bank_name: doc.data().bank_name,
        gcash_number: doc.data().gcash_number,
        bank_name2 : doc.data().bank_name2,
        bank_number2: doc.data().bank_number2,
        paypal_uname: doc.data().paypal_uname,
        paypal_email: doc.data().paypal_email
     });
    });

  }

  onCPaymentOptionUpdate = (querySnapshot) => {
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push ({
            datas : doc.data(),
            key : doc.id
            });
    });
    this.setState({
      payments : payments,    
   });

  }


  OrderCounter = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      this.setState({
        counter : doc.data().counter,    
     });
    });
  

  }


     
  onCollectionUpdateBilling = (querySnapshot) => {
  querySnapshot.forEach((doc) => {
console.log('User Info: ', doc.data().photo)
    this.setState({
  userToken:doc.data().token,
      account_name: doc.data().Name,
      account_address: doc.data().Address.Address,
      account_city: doc.data().Address.City,
      account_barangay: doc.data().Address.Barangay,
      account_province: doc.data().Address.Province,
      account_email: doc.data().Email,
      account_number: doc.data().Mobile,
      account_cluster: doc.data().Address.Cluster,
      account_status: doc.data().status,
      photo: doc.data().photo,
      address_list : Object.values(doc.data().Shipping_Address)
    });
 
    
  });
  this.defaultShippingAddress();
  }

   onCollectionUpdateCharge = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
     this.setState({
       driver_charge: doc.data().driverCharge,
       xtra: doc.data().extra_charge,
       labor: doc.data().labor_charge,
       deliveryCharge: doc.data().del_charge,
       pickup: doc.data().pickup_charge
    });
    
            
    });
    
    }

 

  async calculateXtraKm(charge, clustering){
    let total =0
    const cluster = await AsyncStorage.getItem('cluster');

   if(clustering == cluster){
      total=0;
   }else{
     total = charge;
   }
   this.setState({xtraCharge : total})
  }

  calculateOverAllTotal () {
    const { paymentMethod, minimum, selectedIndex, selectedIndices, customStyleIndex } = this.state;
    let total = 0
    if(customStyleIndex === 0){
      total = this.state.subtotal + this.calculateTotalDeliveryCharge() + this.extraKMCharges();
    }else if(customStyleIndex === 1){
      total = this.state.subtotal + this.extraKMCharges();
    } 
    return total;
  }
   
  calculateLaborCharge () {
    let total = 0
     this.state.cartItems.forEach((item) => {
       if(item.sale_price){
           total +=  (item.qty * item.sale_price) * item.labor_charge
       }else{
           total +=  (item.qty * item.price) * item.labor_charge
       }       
      })
    return total;
  }

  calculatePickupCharge () {
    let total = 0

      total = this.state.pickup * this.storeID().length
     return total;
  }

  calculateTotalDeliveryCharge(){
    let total = 0;

total = this.state.amount_base;


    return total;
  }

  extraKMCharges(){
      let total = 0;
  let distance= this.state.summary === undefined? 0: parseFloat(this.state.summary.distance/1000);
  let NewDistance = distance - this.state.base_dist;
  let extrakm = NewDistance > 0? NewDistance * this.state.succeding: 0
  console.log('extrakm: ', extrakm)
  total = extrakm;
      return total;
 
  }
  storeIDS (){
      let store={};
      this.state.cartItems.forEach((item) => {    
        store[item.storeId] = "Pending";
      })
  
        return store;
   }

  storeID (){
    let store=[];
    let uniqueArray=[];
     this.state.cartItems.forEach((item) => {    
       store.push(item.storeId)
     })
     for(var value of store){
      if(uniqueArray.indexOf(value) === -1){
          uniqueArray.push(value);
      }
  }

      return uniqueArray;
   }

   token (){
    let store=[];
    let uniqueArray=[];
     this.state.cartItems.forEach((item) => {    
       store.push(...item.notification_token)
     })
     for(var value of store){
      if(uniqueArray.indexOf(value) === -1){
          uniqueArray.push(value);
      }
  }
     return uniqueArray;
   }

defaultShippingAddress(){

   this.state.address_list.forEach((item) => {    
      if(item.default){
       // console.log('item.lat: ', item.lat);
      //  console.log('item.long: ', item.long);
  
           this.setState({
            billing_name: item.name,
            billing_phone: item.phone,
          
            USERlat: item.lat,
            USERlong: item.long,
         
          })

          const {slatitude, slongitude, } = this.state;
       
          let from_lat = slatitude
          let from_long = slongitude
          let to_lat = item.lat
          let to_long = item.long

          let routeCoordinates = [];

          axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;bicycle;traffic:disabled&legAttributes=shape`)
          .then(res => {
         
              res.data.response.route[0].leg[0].shape.map(m => {
                // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
                // need it seperate for <Polyline/>
                let latlong = m.split(',');
                let latitude = parseFloat(latlong[0]);
                let longitude = parseFloat(latlong[1]);
                routeCoordinates.push([longitude,latitude]);
            })
            this.setState({
              ULat: item.lat,
              ULong:item.long,
                // here we can access route summary which will show us how long does it take to pass the route, distance etc.
                summary: res.data.response.route[0].summary,
                
                isready: 1,
                loading: false,
            })
         
            }).catch(err => {
           // console.log(err)
            })
      }
      
     })
  
}

   OrderSuccess (){
    this.props.navigation.reset({
    index: 0,
    routes: [{ name: 'Home' }],})
    this.setState({visibleModal: false});
   }


   changeAddress(item){
 
}
changeAddressto(itemLat, itemLong){

  }
changePaymentMethod(item){
  this.setState({
    paymentMethod: item.datas.label,
    visiblePaymentModal: false
  })
}

handleCustomIndexSelect = (index: number) => {
  //handle tab selection for custom Tab Selection SegmentedControlTab
  this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
};

navigateAddress(){
  this.setState({visibleAddressModal: false})
  this.props.navigation.navigate('Address')
}

 footer= () => {
    return(
    <View>
      <Button block  style={{alignSelf:'center', backgroundColor:'#019fe8'}}  onPress={()=>this.navigateAddress() }>
            <Text style={{color: 'white'}}>Add Address</Text>
      </Button>
    </View>
    )
  }
onUserLocationUpdate(location) {
//console.log('user Moveeed!', location);
null;
  }
    onRegionWillChange(regionFeature) {
   console.log('user regionFeature!', regionFeature);
  }

  onRegionDidChange(regionFeature) {
    console.log('user onRegionDidChange!', regionFeature);
  }

  onRegionIsChanging(regionFeature) {
   console.log('user onRegionIsChanging!', regionFeature);
  }
currentPickup(){
    console.log('Get current Location');
const long=this.props.route.params.cLong;
const lat=this.props.route.params.cLat;
  this.setState({isLoading: true, keyboard: false})
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];

        let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)

const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            const Newprovince =province == undefined? item.context[0].text:province.province
const newarrLenght = arr.length-3
console.log("newarrLenght value", arr[newarrLenght])


             this.setState({
    billing_province:Newprovince,
    billing_city: arr[newarrLenght],
    billing_street:arr[0]+', '+ arr[1],
    billing_postal: arr[3],
    billing_barangay: item.context[1].text,
    flat:lat,
    flong:long,
    cLong:long,
     cLat:lat,
             
       showfromBotton: true,
               fromPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+arr[newarrLenght]+', '+Newprovince, x: { latitude: lat, longitude: long },
               isLoading: false, LocationDoneto: true,
               })

console.log('Tolong: ',this.state.Tolong);
               if(this.state.Tolong != undefined){
                   console.log('working here')
              this.setState({isLoading: true})    
             let routeCoordinates = []
    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${lat},${long}&waypoint1=geo!${this.state.Tolat},${this.state.Tolong}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
    .then(res => {
   
        res.data.response.route[0].leg[0].shape.map(m => {
          // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
          // need it seperate for <Polyline/>
          let latlong = m.split(',');
          let latitude = parseFloat(latlong[0]);
          let longitude = parseFloat(latlong[1]);
          routeCoordinates.push([longitude,latitude]);
      })
       console.log("routeCoordinates", routeCoordinates)
      this.setState({
        routeForMap: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": routeCoordinates
              }
            }
          ]
        },
               summary: res.data.response.route[0].summary,
         isLoading: false,

      })

      }).catch(err => {
          console.log('here fron: ',err)
       })
     
               }

       }).catch(err => {
          console.log('currentPickup Region axios: ',err)
       })

}


currentDropoff(){
  console.log('Get current Location');
const long=this.props.route.params.cLong;
const lat=this.props.route.params.cLat;
this.setState({isLoading: true, keyboard: false})

axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
.then(res => {
const item = res.data.features[0];


const {flat, flong, } = this.state;
let from_lat = flat
let from_long = flong
let to_lat = lat
let to_long = long
// [125.53647997480391, 8.93336215559458]
console.log('to_lat: ', to_lat)
console.log('to_long: ', to_long)
let routeCoordinates = [];
let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)
const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
console.log("newarrLenght value", arr[newarrLenght])
const findCity = Province.ZipsCollection.find( (items) => items.area === res.data.features[0].context[2].text)

console.log('UserLocation: ', UserLocation)
 const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
  const Newprovince =province == undefined? item.context[0].text:province.province;
this.setState({
Tolat:lat,
   Tolong:long,
billing_provinceTo:Newprovince,
billing_cityTo: UserLocation,
billing_streetTo:arr[0]+', '+ arr[1],
billing_postalTo: arr[3],
billing_barangayTo: item.context[1].text,
flatTo:lat,
flongTo:long,
region:{ latitude:lat,
 longitude: 	long,
 latitudeDelta: 0.1,
 longitudeDelta: 0.1,},
          toPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+UserLocation+', '+Newprovince, LocationDoneto: true, LocationDone: true,
     isLoading: false,
 })

if(this.state.x != undefined){
  this.setState({isLoading:true})
axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
.then(res => {

   res.data.response.route[0].leg[0].shape.map(m => {
     // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
     // need it seperate for <Polyline/>
     let latlong = m.split(',');
     let latitude = parseFloat(latlong[0]);
     let longitude = parseFloat(latlong[1]);
     routeCoordinates.push([longitude,latitude]);
 })

  console.log('summary: ',  res.data.response.route[0].summary);
  console.log("routeCoordinates", routeCoordinates)
 this.setState({
   routeForMap: {
     "type": "FeatureCollection",
     "features": [
       {
         "type": "Feature",
         "properties": {},
         "geometry": {
           "type": "LineString",
           "coordinates": routeCoordinates
         }
       }
     ]
   },
   
   
   
  
     summary: res.data.response.route[0].summary,
    

     isLoading: false,
 })

 }).catch(err => {
     console.log('here drop off: ',err)
  })

}
  }).catch(err => {
      this.setState({ isLoading: false,})
   
          Alert.alert('Error', 'Internet Connection is unstable')
           console.log('Region visibleAddressModalTo axios: ',err)
  })


}

pushAItem(){
  let ItemList = this.state.ItemList
  ItemList.push(this.state.pabiliItem)
this.setState({ItemList: ItemList,pabiliItem: ''})


}
  render() {
    const { paymentMethod, minimum, selectedIndex, selectedIndices, customStyleIndex, slatitude, slongitude, lat, ULat,summary } = this.state;
 
    let distance = this.state.summary === undefined? null: this.state.summary.distance/1000;

    let newDistance = distance - this.state.PBasekm;
    let distanceAmount = newDistance*this.state.Psucceeding;
     const NewdistanceAmount = distanceAmount > 0? distanceAmount: 0;
    let amountpay= this.state.PbaseFare +NewdistanceAmount;

      let distanceAmountCity = newDistance*this.state.CityPsucceeding;
      const NewdistanceAmountCity = distanceAmountCity > 0? distanceAmountCity: 0;
    let amountpayCity= this.state.CityPbaseFare +NewdistanceAmountCity;

     let distanceAmountMetro= newDistance*this.state.MetroPsucceeding;
        const NewdistanceAmountMetro = distanceAmountMetro > 0? distanceAmountMetro: 0;
    let amountpayMetro= this.state.MetroPbaseFare +NewdistanceAmountMetro;
    
    const actualAmountPay = this.props.route.params.typeOfRate =='Municipal Rate'?amountpay:this.props.route.params.typeOfRate =='City Rate'?amountpayCity:amountpayMetro
  const typeOfRate = this.props.route.params.typeOfRate; 
// console.log('newDistance: ', newDistance);
// console.log('actualAmountPay: ', actualAmountPay);
//  console.log('distanceAmountCity: ', distanceAmountCity);
//  console.log('amountpayCity: ', amountpayCity);
//console.log('typeOfRate: ', typeOfRate);
console.log('pabiliItem: ', this.state.pabiliItem);
console.log('this.state.ItemList:', this.state.ItemList)

const copyToClipboard = () => {
  const keys = this.state.ItemList;

  let text = "";
  for (let x of keys) {
    text += '* '+x + '\n';
  }
  
  Clipboard.setString(text);
  ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
};

const deleteListItem =(item)=>{
  console.log('pressed')
  console.log(item)
  const NewListItem = this.state.ItemList.filter(value => {
    return value.indexOf(item) == -1 ;
});
console.log('NewListItem: ', NewListItem)
this.setState({ItemList: NewListItem})

}
    return(
        <Root>
          <Container style={{backgroundColor: '#CCCCCC'}}>   
             
      <Header androidStatusBarColor="#2c3e50" style={{backgroundColor: '#396ba0'}}>
          <Left style={{flex:3, width: '70%'}}>
      <Title style={{color:'white', marginLeft: 20}}>KeyHK</Title>
          </Left>
          <Body style={{flex: 3}}>
            
          </Body>
          <Right style={{flex:1}}>
            <FontAwesome5 name="clipboard-list" size={25} color="white" onPress={()=> this.setState({listModal:true})}/>
          </Right>
        </Header>
          <Loader loading={this.state.loading}/>     
            <Modal
              isVisible={this.state.listModal}
              useNativeDriver={true}>
              <View style={{position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginLeft: -20,
    backgroundColor:'white'}}>
    <Item regular style={{top: this.state.avoildingViewList == true ? 130: 0,}}>
<Input value={this.state.pabiliItem} placeholder="Pabili Item" style={{fontSize: 17,}}  onChangeText={(text) => this.setState({pabiliItem: text})} onFocus={()=>this.setState({avoildingViewList: true})} onBlur={()=>this.setState({avoildingViewList: false})}/>
<Button  style={{alignSelf:'center', backgroundColor:'#019fe8'}}  onPress={()=>this.pushAItem()}>
            <Text style={{color: 'white'}}>Add</Text>
      </Button>
       </Item>     
       <Text style={{marginLeft: 10}}>Item List</Text>       
       <FlatList
                                 style={{display:this.state.avoildingViewList == true ?'none':'flex'}}
                                 data={this.state.ItemList}
                                 renderItem={ ({ item }) => (
                                   <View style={{marginLeft: 40, flexDirection: 'row', backgroundColor: 'rgba(232,231,232, 0.5)', width: '80%'}}>
                                  <TouchableOpacity  style={{flexDirection: 'row'}} onPress={copyToClipboard}>
                                 <Text style={{padding: 10, width: '95%'}}>{item}</Text>
        </TouchableOpacity >
        <MaterialCommunityIcons name={'delete-circle-outline'} size={30} color={'white'} onPress={()=>deleteListItem(item)} style={{backgroundColor: '#cf5149',right:0,marginLeft: 'auto', padding: 5}}/>
         
       </View>
       )}
       keyExtractor={item => item.id}
     />

<Button  style={{alignSelf:'center', backgroundColor:'#019fe8', width: '100%', alignContent: 'center'}}  onPress={()=>this.setState({listModal:false})}>
            <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>Done</Text>
      </Button>
    </View>
</Modal>
            <Modal
              isVisible={this.state.visibleModalPickup}
    
              useNativeDriver={true}
              onBackdropPress={() => this.setState({visibleModalPickup: false,visibleAddressModal: false ,visibleAddressModalPin:false})} transparent={true}>

               <View style={{position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginLeft: -20}}>
      
  <MapboxGL.MapView style={{ flex: 1}} 

  onPress={e => {this.state.visibleAddressModal == true? this.onRegionChange(e.geometry.coordinates):
          this.state.visibleAddressModalTo == true?this.onRegionChange(e.geometry.coordinates):null
        }}
  //onRegionWillChange={this.onRegionWillChange}
  //        onRegionIsChanging={this.onRegionIsChanging}
attributionEnabled={false}
              logoEnabled={false}
  onRegionDidChange={() => {Keyboard.dismiss(); this.setState({LocationDoneto: true, LocationDone: true, keyboard: false})}}
onUserLocationUpdate={()=> {console.log('user moved')}}
  >
  <MapboxGL.Camera 
  centerCoordinate={[this.props.route.params.cLong,this.props.route.params.cLat]} 
  zoomLevel={15}
  followUserMode={'normal'}
            
  />
 
          
             
    
<MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} onUpdate={this.onUserLocationUpdate} />

   { this.state.x == undefined? null:  
            this.state.x != undefined && this.state.flat == this.props.route.params.clat?
            <MapboxGL.PointAnnotation coordinate={[this.state.x.longitude, this.state.x.latitude]} onSelected={()=>console.log('Marker Selected')}/>
            
            
            :  <MapboxGL.PointAnnotation coordinate={[this.state.flong, this.state.flat]} onSelected={()=>console.log('Marker Selected')}/>
             
            
         }
          
 

  </MapboxGL.MapView>


  <Card style={{ left: 0, top: this.state.keyboard == true ? 130: 0, position: 'absolute', width: SCREEN_WIDTH/1.02}}>
  <CardItem listItemPadding={0} onPress={() =>this.setState({visibleAddressModal: true, visibleAddressModalto: false})}>
    <Button transparent onPress={()=> this.setState({visibleModalPickup: false,visibleAddressModal: false ,visibleAddressModalPin:false})} style={{ width: 40}}>
                 <MaterialIcons name="arrow-back" size={25} color="black" />
                </Button> 
                  <View regular style={{ height: 40, flexDirection: 'row', width: SCREEN_WIDTH/1.4}}>
                <Text style={{fontWeight: 'bold'}}> Current Location: <Text> {this.state.currentPlace}</Text></Text>
                    </View>
                 <MaterialIcons name="my-location" size={25} color="black" onPress={()=>this.currentPickup()}/>
 
                </CardItem>
   <CardItem listItemPadding={0} onPress={() =>this.setState({visibleAddressModal: true, visibleAddressModalto: false})}>
  <FontAwesome name={'dot-circle-o'} style={{ marginRight: 10}}/> 
   <View style={{flexDirection: 'column'}}>

   
                    <Text style={{fontWeight: 'normal', fontSize: 17, color: 'green'}}>Pickup location </Text>
                      
                    {!this.state.loading &&
                   
                    <View regular style={{ height: 40, flexDirection: 'row', width: SCREEN_WIDTH/1.2}}>
                    <Input value={this.state.fromPlace} style={{fontSize: 17}}  onChangeText={(text) => this.getLocationType(text, 'fromPlace')}  onFocus={() =>this.setState({visibleAddressModal: true, visibleAddressModalto: false,keyboard: true,}) }  onBlur={()=>this.setState({keyboard: false})} />
                       <FontAwesome name={'times-circle-o'} style={{ marginRight: 5,top: 10}}size={15} onPress={()=>this.setState({fromPlace: '',x:undefined})}/> 
                         </View>      }
                         </View> 
                </CardItem>
                
               {this.state.LocationDone == false?<View><FlatList
                                 
        data={this.state.searchResult}
        renderItem={ ({ item }) => (
         <View style={{padding: 10, marginLeft: 50}}>
           <TouchableOpacity onPress={()=>{ 
            
 let str = item.place_name;

let arr = str.split(',');


const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
             const Newprovince =province == undefined? item.context[0].text:province.province
const region=  {latitude: item.center[1], latitudeDelta: 0.0999998484542477, longitude: item.center[0], longitudeDelta: 0.11949475854635239}
console.log('region: ', region)
console.log("province", province)
  
    const {Tolat, Tolong, } = this.state;
    let from_lat = Tolat
    let from_long = Tolong
    let to_lat = item.center[1]
    let to_long = item.center[0]
  console.log('to_lat: ', to_lat)
    console.log('to_long: ', to_long)
    let routeCoordinates = [];

    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
    .then(res => {
   
        res.data.response.route[0].leg[0].shape.map(m => {
          // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
          // need it seperate for <Polyline/>
          let latlong = m.split(',');
          let latitude = parseFloat(latlong[0]);
          let longitude = parseFloat(latlong[1]);
          routeCoordinates.push([longitude,latitude]);
      })

const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
console.log("newarrLenght value", arr[newarrLenght])
console.log('UserLocation: ', UserLocation)
      this.setState({
        routeForMap: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": routeCoordinates
              }
            }
          ]
        },
        flat: item.center[1],
        flong:item.center[0],
       cLat: item.center[1],
        cLong:item.center[0],
          summary: res.data.response.route[0].summary,
         
    billing_province:Newprovince,
    billing_city: UserLocation,
    billing_street:arr[0]+', '+ arr[1],
    billing_postal: arr[3],
    billing_barangay: item.context[1].text,
  region:{ latitude:item.center[1],
      longitude: 	item.center[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
      showfromBotton: true,
               fromPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+UserLocation+', '+Newprovince,x: { latitude: item.center[1], longitude: item.center[0] },
               isLoading: false, LocationDoneto: true,
      })
      //console.log('sum: ', res.data.response.route[0].summary);
      }).catch(err => {
     // console.log(err)
      })
               
               
               }}>
 
           <Text style={{fontSize: 17}}>{item.place_name}</Text>
           {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      /></View>:null}
               
                   

             
         </Card>
              {this.state.summary === undefined? null:<View style={{ height: 40, alignItems: 'center'}}>
							<TouchableOpacity  style={[styles.centerElement, {backgroundColor: '#019fe8', width: SCREEN_WIDTH, height: 40, borderRadius: 5, padding: 10}]} onPress={() => this.setState({visibleModalPickup: false,visibleAddressModal: false ,visibleAddressModalPin:false}) }>
								<Text style={{color: '#ffffff'}}>DONE</Text>
							</TouchableOpacity>
            </View>}
  </View>
            </Modal>
  <Modal
              isVisible={this.state.visibleModalDropoff}
    
              useNativeDriver={true}
              onBackdropPress={() => this.setState({visibleModalDropoff: false})} transparent={true}>

               <View style={{position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginLeft: -20}}>
      
  <MapboxGL.MapView style={{ flex: 1}} 

  onPress={e => {this.state.visibleAddressModal == true? this.onRegionChange(e.geometry.coordinates):
          this.state.visibleAddressModalTo == true?this.onRegionChange(e.geometry.coordinates):null
        }}
  //onRegionWillChange={this.onRegionWillChange}
  //        onRegionIsChanging={this.onRegionIsChanging}
attributionEnabled={false}
              logoEnabled={false}
  onRegionDidChange={() => {Keyboard.dismiss(); this.setState({LocationDoneto: true, LocationDone: true, keyboard: false})}}
onUserLocationUpdate={()=> {console.log('user moved')}}
  >
  <MapboxGL.Camera 
  centerCoordinate={this.state.Tolat == undefined?[this.props.route.params.cLong,this.props.route.params.cLat]:[this.state.Tolong, this.state.Tolat]} 
  zoomLevel={15}
  followUserMode={'normal'}
            
  />
 
          
             
    
<MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} onUpdate={this.onUserLocationUpdate} />

 {  this.state.Tolat == undefined? null:
           <MapboxGL.PointAnnotation coordinate={[this.state.Tolong, this.state.Tolat]} onSelected={()=>console.log('Marker Selected')}/>
        
           }
 
          
 

  </MapboxGL.MapView>


  <Card style={{ left: 0, top: this.state.keyboard == true ? 130: 0, position: 'absolute', width: SCREEN_WIDTH/1.02}}>
  <CardItem listItemPadding={0} onPress={() =>this.setState({visibleAddressModal: true, visibleAddressModalTo: false})}>

          <Button transparent onPress={()=> this.setState({visibleModalDropoff: false})} style={{ width: 40}}>
                 <MaterialIcons name="arrow-back" size={25} color="black" />
                </Button> 
                  <View regular style={{ height: 40, flexDirection: 'row', width: SCREEN_WIDTH/1.4}}>
                <Text style={{fontWeight: 'bold'}}> Current Location: <Text> {this.state.currentPlace}</Text></Text>
                    </View>
                 <MaterialIcons name="my-location" size={25} color="black" onPress={()=>this.currentDropoff()}/>
 
                </CardItem>
   <CardItem listItemPadding={0} onPress={() =>this.setState({visibleAddressModalTo: true,visibleAddressModal: false})}>
  <FontAwesome name={'dot-circle-o'} style={{ marginRight: 10}}/> 
   <View style={{flexDirection: 'column'}}>

   
                    <Text style={{fontWeight: 'normal', fontSize: 17, color: 'green'}}>Drop-off location</Text>
                      
                    {!this.state.loading &&
                   
                   <View regular style={{ height: 40, flexDirection: 'row', width: SCREEN_WIDTH/1.2}}>
                   <Input value={this.state.toPlace} style={{fontSize: 17}}  onChangeText={(text) => this.getLocationTypeto(text, 'toPlace')}  onFocus={() =>this.setState({visibleAddressModalTo: true,visibleAddressModal: false, keyboard: true,LocationDoneto: false}) }  onBlur={()=>this.setState({keyboard: false})} />
                      <FontAwesome name={'times-circle-o'} style={{ marginRight: 5,top: 10}}size={15} onPress={()=>this.setState({toPlace: '',Tolat:undefined})}/> 
                        </View>      }
                        </View> 
               </CardItem>
              
                  
 {this.state.LocationDoneto == false?<View><FlatList
                                
       data={this.state.searchResultto}
       renderItem={ ({ item }) => (
        <View style={{padding: 10, marginLeft: 50}}>
          <TouchableOpacity onPress={()=>{ 
            this.setState({isLoading: true})
                let str = item.place_name;

let arr = str.split(',');


const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            const Newprovince =province == undefined? item.context[0].text:province.province
const region=  {latitude: item.center[1], latitudeDelta: 0.0999998484542477, longitude: item.center[0], longitudeDelta: 0.11949475854635239}
console.log('region: ', region)
console.log("province", province)
 
   const {flat, flong, } = this.state;
   let from_lat = flat
   let from_long = flong
   let to_lat = item.center[1]
   let to_long = item.center[0]
 console.log('to_lat: ', to_lat)
   console.log('to_long: ', to_long)
   let routeCoordinates = [];

   axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
   .then(res => {
  
       res.data.response.route[0].leg[0].shape.map(m => {
         // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
         // need it seperate for <Polyline/>
         let latlong = m.split(',');
         let latitude = parseFloat(latlong[0]);
         let longitude = parseFloat(latlong[1]);
         routeCoordinates.push([longitude,latitude]);
     })

const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
console.log("newarrLenght value", arr[newarrLenght])
console.log('UserLocation: ', UserLocation)
     this.setState({
       routeForMap: {
         "type": "FeatureCollection",
         "features": [
           {
             "type": "Feature",
             "properties": {},
             "geometry": {
               "type": "LineString",
               "coordinates": routeCoordinates
             }
           }
         ]
       },
       Tolat: item.center[1],
       Tolong:item.center[0],
      
         summary: res.data.response.route[0].summary,
        
   billing_provinceTo:Newprovince,
   billing_cityTo: UserLocation,
   billing_streetTo:arr[0]+', '+ arr[1],
   billing_postalTo: arr[3],
   billing_barangayTo: item.context[1].text,
   flatTo:item.geometry.coordinates[0] ,
    flongTo:item.geometry.coordinates[1],
 region:{ latitude:item.center[1],
     longitude: 	item.center[0],
     latitudeDelta: 0.1,
     longitudeDelta: 0.1,},
              toPlace:arr[0]+', '+arr[1]+', '+item.context[1].text+', '+UserLocation+', '+Newprovince, LocationDoneto: true,    visibleAddressModalTo: false, 
         isLoading: false,
     })
     //console.log('sum: ', res.data.response.route[0].summary);
     }).catch(err => {
    // console.log(err)
     })

  }}>

          <Text style={{fontSize: 17}}>{item.place_name}</Text>
          {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
        </View>
       )}
       keyExtractor={item => item.id}
     /></View>:null}
            
        </Card>
             {this.state.toPlace == ""? null:<View style={{ height: 40, alignItems: 'center'}}>
             <TouchableOpacity  style={[styles.centerElement, {backgroundColor: '#019fe8', width: SCREEN_WIDTH, height: 40, borderRadius: 5, padding: 10}]} onPress={() => this.setState({visibleModalDropoff: false}) }>
               <Text style={{color: '#ffffff'}}>DONE</Text>
             </TouchableOpacity>
           </View>}
 </View>
            </Modal>

     <Loader loading={this.state.isLoading}/>  
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,}}>
      
  <MapboxGL.MapView style={{ flex: 1}} 

 // onPress={e => {this.state.visibleAddressModal == true? this.onRegionChange(e.geometry.coordinates):
 //         this.state.visibleAddressModalTo == true?this.onRegionChange(e.geometry.coordinates):null
 //       }}
  //onRegionWillChange={this.onRegionWillChange}
  //        onRegionIsChanging={this.onRegionIsChanging}

//  onRegionDidChange={() => {Keyboard.dismiss(); this.setState({LocationDoneto: true, LocationDone: true,visibleAddressModalto: true})}}
onUserLocationUpdate={()=> {console.log('user moved')}}
  >
  <MapboxGL.Camera 
  centerCoordinate={[this.props.route.params.cLong,this.props.route.params.cLat]} 
  zoomLevel={15}
  followUserMode={'normal'}
            followUserLocation
  />
 
           <MapboxGL.ShapeSource id='shapeSource' shape={this.state.routeForMap}>
              <MapboxGL.LineLayer id='lineLayer' style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#ff0000'}} />
            </MapboxGL.ShapeSource>
          
        
          {/*<MapboxGL.ShapeSource id='line1' shape={this.state.routeForMap}>
            <MapboxGL.LineLayer id='linelayer1' style={{lineColor:'red'}} />
          </MapboxGL.ShapeSource>
           [[125.5377352, 8.9420342], [125.5376709, 8.9416051], [125.5371988, 8.9390945], [125.5371666, 8.9386547], [125.5395055, 8.9385045], [125.5395055, 8.9381933], [125.5395269, 8.9378929], [125.5396342, 8.9370775], [125.5396986, 8.9361334], [125.5396776, 8.9323785]]
          
          */}
             
    
<MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} onUpdate={this.onUserLocationUpdate} />

   { this.state.x == undefined? null:  
            this.state.x != undefined && this.state.flat == this.props.route.params.clat?
            <MapboxGL.PointAnnotation coordinate={[this.state.x.longitude, this.state.x.latitude]} onSelected={()=>console.log('Marker Selected')} />
            
            
            :  <MapboxGL.PointAnnotation coordinate={[this.state.flong, this.state.flat]} onSelected={()=>console.log('Marker Selected')}/>
             
            
         }
           {  this.state.Tolat == undefined? null:
           <MapboxGL.PointAnnotation coordinate={[this.state.Tolong, this.state.Tolat]} onSelected={()=>console.log('Marker Selected')}/>
        
           }
 
{console.log('this.state.Tolat: ', this.state.x)}
  </MapboxGL.MapView>

  {/*
  
   <MapView
            testID="map"
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={() => {Keyboard.dismiss(); this.setState({LocationDoneto: true, LocationDone: true})}}
        onPress = {() => {Keyboard.dismiss();}}
        showsUserLocation={true}
          style={{ position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}
         mapPadding={{ right: 0, top: SCREEN_HEIGHT/1.4, bottom: 150 }}
    initialRegion={this.state.region}
    showsMyLocationButton={true}
    pitchEnabled={false}
          showsBuildings={true}
          maxZoomLevel={17.5}
          loadingEnabled={true}
zoomTapEnabled={false}
      zoomEnabled={true}
        scrollEnabled={true}
        onPress={e => {this.state.visibleAddressModal == true? this.onRegionChange(e.nativeEvent.coordinate):
          this.state.visibleAddressModalTo == true?this.onRegionChange(e.nativeEvent.coordinate):null
        }}
          >
              
             {this.state.routeForMap && (
                <Polyline
                  key="editingPolyline"
                  coordinates={this.state.routeForMap}
                  strokeColor="#019fe8"
                  fillColor="#019fe8"
                  strokeWidth={5}
                />
              )}
              {console.log('clat: ', this.props.route.params.cLat)}
               {console.log('flat: ', this.state.flat)}
          { this.state.x == undefined? null:  
            this.state.x != undefined && this.state.flat == this.props.route.params.clat?
             <MapView.Marker
             coordinate={{latitude: this.state.x.latitude, longitude: this.state.x.longitude}}
             title={"From"}
             description={this.state.fromPlace}
             image={Rider_img}
          />
            : <MapView.Marker
             coordinate={{latitude: this.state.flat, longitude: this.state.flong}}
             title={"From"}
             description={this.state.fromPlace}
             image={Rider_img}
          />}
           {  this.state.Tolat == undefined? null:
         
           <MapView.Marker
             coordinate={{latitude: this.state.Tolat, longitude: this.state.Tolong}}
             title={"To"}
             description={this.state.toPlace}
             image={customer_img}
       />}
 
          
          </MapView>
  
  */ }
          <Card>
          </Card>
          
    {/*   <View style={{ right: 0, top: '20%', position: 'absolute'}} >
  <TouchableOpacity onPress={()=> this.setState({visibleAddressModal: true, visibleAddressModalToPin: false})}>
        <Image style={{height: 36,
  width: 36,}} source={marker} />
</TouchableOpacity>
      </View>
         
        <View style={{ right: 0, top: '25%', position: 'absolute',
  }}>
  <TouchableOpacity onPress={()=> this.setState({visibleAddressModalToPin: true, visibleAddressModal: false})}>
        <Image style={{height: 36,
  width: 36,}} source={marker} />
  </TouchableOpacity>
      </View>*/}



         <Card style={{ left: 0, top: 0, position: 'absolute', width: SCREEN_WIDTH/1.02}}>
   <CardItem listItemPadding={0} onPress={() =>this.setState({visibleAddressModal: true, visibleAddressModalto: false})}>
  <FontAwesome name={'dot-circle-o'} style={{ marginRight: 10}}/> 
   <View style={{flexDirection: 'column'}}>

   
                    <Text style={{fontWeight: 'normal', fontSize: 13, color: 'green'}}>Pickup location </Text>
                      
                    {!this.state.loading &&
                    <View regular style={{ height: 40}}>
                    <TouchableWithoutFeedback style={{width: SCREEN_WIDTH/1.02}} onPress={()=> this.setState({visibleModalPickup: true, visibleAddressModalPin: true})}>
                   <Text style={{fontSize: 12}}>{this.state.fromPlace==""?'Enter Pickup Location Here':this.state.fromPlace}</Text>
                    </TouchableWithoutFeedback>
                         </View>}
                         </View> 
                </CardItem>
                
               
                <CardItem style={{marginTop: -20}} onPress={() =>this.setState({visibleAddressModalTo: true,visibleAddressModal: false})}>
                  <FontAwesome name={'dot-circle-o'} style={{ marginRight: 10}}/> 
                <View style={{flexDirection: 'column'}}>
              
  
                    <Text style={{fontWeight: 'normal', fontSize: 13, color: 'blue'}}>Drop-off location</Text>
                 
                    {!this.state.loading &&
                       
                    <View regular style={{height: 40}}>
                        <TouchableWithoutFeedback style={{width: SCREEN_WIDTH/1.02}} onPress={()=> this.setState({visibleModalDropoff: true, visibleAddressModalTo: true,visibleAddressModal: false,visibleAddressModalToPin: true})}>
                   <Text style={{fontSize: 12}}>{this.state.toPlace}</Text>
                    </TouchableWithoutFeedback>
                     </View>  
                   }
                   </View>
                  
                </CardItem>
                    

<View style={{
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    width: 1,
    height: this.state.LocationDoneto === false? '28%':'50%', position: 'absolute', left: 21, top:this.state.LocationDoneto === false? '15%': '25%'
  }}>
</View>
             
         </Card>
         
        </View>
         </View>
         <View>
               
              
    
            {this.state.summary === undefined? null:
            parseFloat(this.state.summary.distance/1000) > 85?
 <View style={{ height: 40, alignItems: 'center', marginBottom: 10}}>
							<TouchableOpacity  style={[styles.centerElement, {backgroundColor: 'gray', width: SCREEN_WIDTH - 10, height: 40, borderRadius: 5, padding: 10}]}>
								<Text style={{color: '#ffffff'}}>{'Distance is more than 85km '}</Text>
							</TouchableOpacity>
            </View>
            :
            
            <View style={{ height: 40, alignItems: 'center', marginBottom: 10}}>
							<TouchableOpacity  style={[styles.centerElement, {backgroundColor: '#019fe8', width: SCREEN_WIDTH - 10, height: 40, borderRadius: 5, padding: 10}]} onPress={() => {this.state.uid == null?  this.props.navigation.navigate('Login') :  Alert.alert(
      "Are you sure to proceed?",
      "Book a rider",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.checkOut() }
      ]
    )}}>
								<Text style={{color: '#ffffff'}}>{this.state.uid == null?'Log in to Continue':'Book Now  '+ this.props.route.params.currency+ ' '+Math.round((actualAmountPay*10)/10)}</Text>
							</TouchableOpacity>
            </View>}
               
               
               </View>

             
             
          </Container>
          </Root>
    );
  }


  async checkOut(){
console.log('this.state.photo: ', this.state.photo)

         this.setState({loading: true})

    let distance = this.state.summary === undefined? null: this.state.summary.distance/1000;

    let newDistance = distance - this.state.PBasekm;
    let distanceAmount = newDistance*this.state.Psucceeding;
     const NewdistanceAmount = distanceAmount > 0? distanceAmount: 0;
    let amountpay= this.state.PbaseFare +NewdistanceAmount;

      let distanceAmountCity = newDistance*this.state.CityPsucceeding;
      const NewdistanceAmountCity = distanceAmountCity > 0? distanceAmountCity: 0;
    let amountpayCity= this.state.CityPbaseFare +NewdistanceAmountCity;

     let distanceAmountMetro= newDistance*this.state.MetroPsucceeding;
        const NewdistanceAmountMetro = distanceAmountMetro > 0? distanceAmountMetro: 0;
    let amountpayMetro= this.state.MetroPbaseFare +NewdistanceAmountMetro;
    
    const actualAmountPay = this.props.route.params.typeOfRate =='Municipal Rate'?amountpay:this.props.route.params.typeOfRate =='City Rate'?amountpayCity:amountpayMetro
 const typeOfRate = this.props.route.params.typeOfRate; 


    const newDocumentID = this.checkoutref.collection('orders').doc().id;
    const today = this.state.currentDate;
    const timeStamp= new Date().getTime();
    const date_ordered = moment(today).format('MMMM Do YYYY, h:mm:ss a');
    const week_no = moment(today , "MMDDYYYY").isoWeek();
    const time =  moment(today).format('h:mm:ss a');
    const date = moment(today).format('MMMM D, YYYY');
    const day = moment(today).format('dddd');
    const month = moment(today).format('MMMM');
    const year = moment(today).format('YYYY');
    const userId= await AsyncStorage.getItem('uid');
    const token = await AsyncStorage.getItem('token');
    const updatecounts =  firestore().collection('orderCounter').doc('orders');
    const updateUserOrders =  firestore().collection('users').doc(userId);

const DatasValue = {
  PickupNotifUser: false,
  PickupNotifRider: false,
  DropoffNotifUser: false,
  DropoffNotifRider: false,
  ItemList:this.state.ItemList,
  currency:this.props.route.params.currency,
        Customerimage:this.state.photo,
     OrderNo : this.state.counter,
     OrderId: newDocumentID,
     OrderStatus: 'Pending',
     adminID: '',
     originalAddress:this.props.route.params.fromPlace,
     AccountInfo: {
       name: this.state.account_name,
       address: this.state.account_address,
       phone: this.state.account_number,
       email: this.state.account_email,
       barangay: this.state.account_barangay==undefined?'': this.state.account_barangay,
       city: this.state.account_city.trim(),
       province: this.state.account_province,
       status: this.state.account_status,
     },
    DeliveredBy:{
            ColorMotor:'',
            MBrand:'',
            Name:'',
            PlateNo:'',
            VModel:'',
            eta:0,
            id:'',
            ratings:0,
            token:[],
    },
     Billing: {
       name: this.state.account_name,
       address: this.state.billing_street,
       phone: this.state.account_number,
       barangay:this.state.billing_barangay==undefined?'': this.state.billing_barangay,
       province: this.state.billing_province,
       billing_city: this.state.billing_city.trim(),

     },
     OrderDetails: {
      Date_Ordered: date_ordered,
      Preffered_Delivery_Time_Date:this.state.preffered_delivery_time,
      Week_No: week_no,
      Year: year,
      Month: month,
      Time: time,
      Date: date,
      Day: day,
      Timestamp: timeStamp
     },
     billing_nameTo: this.state.account_name,
     billing_phoneTo:this.state.account_number,
     billing_provinceTo: this.state.billing_provinceTo,
     billing_cityTo: this.state.billing_cityTo,
     billing_streetTo: this.state.billing_streetTo,
     billing_postalTo: this.state.billing_postalTo,
     billing_barangayTo:this.state.billing_barangayTo,
     Timestamp: moment().unix(),
     user_token : this.state.userToken,
     Note: this.state.note,
     PaymentMethod: this.state.paymentMethod,
     DeliveredBy: '',
     rider_id:'',
     isCancelled: false,
     userId: userId,
     distance: this.state.summary.distance,
     flat: this.state.flat,
     flong:this.state.flong,
     Tolong: this.state.Tolong,
     Tolat: this.state.Tolat,
     discount: this.state.discount,
     voucherUsed: this.state.voucherCode,
     km:  this.state.summary.distance/1000,
     total: Math.round((actualAmountPay*10)/10),
     exkm: newDistance,
     estTime:  this.state.summary.baseTime,
     succeding: this.props.route.params.typeOfRate =='Municipal Rate'?this.state.Psucceeding:this.props.route.params.typeOfRate =='City Rate'?this.state.CityPsucceeding:this.state.MetroPsucceeding,
     amount_base: this.props.route.params.typeOfRate =='Municipal Rate'?this.state.PbaseFare:this.props.route.params.typeOfRate =='City Rate'?this.state.CityPbaseFare:this.state.MetroPbaseFare,
     base_dist: this.props.route.params.typeOfRate =='Municipal Rate'?this.state.PBasekm:this.props.route.params.typeOfRate =='City Rate'?this.state.PBasekm:this.state.PBasekm,
delivery_charge:Math.round((actualAmountPay*10)/10),
extraKmCharge:0,
subtotal:0,
    ProductType: 'Foods',
    SubProductType: 'Pabili',
    }

    this.checkoutref.collection('orders').doc(newDocumentID).set(DatasValue).then(
      updatecounts.update({ counter:   firestore.FieldValue.increment(1) }),
      updateUserOrders.update({ ordered_times:   firestore.FieldValue.increment(1) }),
  
      this.setState({
        loading: false
      }),
      this.props.navigation.navigate('pabiliOrderDetails',{ 'orders' : DatasValue })
    )  .catch((error)=>     Alert.alert(
        'Try Again',
        '',
        [
          {text: 'OK'},
        ]
      ))

  }

}


const styles = {
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7',
    marginBottom: 10,
    marginTop: 10
  },
   view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  invoice: {
      padding: 20,
      backgroundColor:"#FFFFFF",
      borderWidth: 0.2,
      borderBottomColor: '#ffffff',
      borderTopColor: '#ffffff',

    },
    centerElement: {justifyContent: 'center', alignItems: 'center'},
    content: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
};
