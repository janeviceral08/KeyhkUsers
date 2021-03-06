import React, { Component } from 'react';
import {StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert, Image, FlatList, SafeAreaView, ScrollView, BackHandler, Keyboard,Animated} from 'react-native'
import { Container, View, Left, Right, Button, Icon, Grid, Picker, Col, Badge, Card, CardItem, Body,Item, Input,List,Title,Header, ListItem, Thumbnail,Text,Form, Textarea,Toast, Root } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
// Our custom files and classes import
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import AccountInfo from './checkout/AccountInfo';
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





export default class CheckoutTransport extends Component {
  constructor(props) {
      super(props);
      this.Rotatevalue = new Animated.Value(0);
      this.updateref =  firestore();
      this.updatecounts =  firestore();
      this.updateUserOrders =  firestore();
      this.checkoutref =  firestore();
      this.storeRef  =   firestore(); 
      this.paymentsRef  =   firestore(); 
      this.billingRef  =   firestore();
      this.paymentMethodRef =  firestore();
      this.ordercounters =  firestore();
      this.chargeref =  firestore().collection('charges').where('status', '==', 'on process' );
      const datas = this.props.route.params.datas; 
      this.state = {  
     // slatitude:cart[0].slatitude,
      //slongitude:cart[0].slongitude,
     // cartItems: cart,
     VisibleAddInfo: false,
     datas: datas,
     cLong:this.props.route.params.cLong,
     cLat:this.props.route.params.cLat,
      driver_charge: 0,
      xtra: 0,
      labor: 0,
      deliveryCharge: 0,
      pickup: 0,
      stores:[],
      paymentMethod: 'Cash',
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
      billing_streetTo: '',
      billing_countryTo: '',
      billing_provinceTo: '',
      billing_cityTo: '',
      billing_barangayTo: '',
      billing_clusterTo: '',
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
      visibleAddressModal: false,
      //subtotal: subtotal,
      minimum: 0,
      selectedIndex: 0,
      selectedIndices: [0],  
      customStyleIndex: 0,
      isready:0,
      visibleAddressModalTo: true,
      passenger: '1',
      note: '',
      AlwaysOpen: true,
      Customerimage:null,
       Metro:0,
      City: 0,
      SCity: 0,
      SMetro: 0,
      phone:'Select Phone Number',
      warningModal: false,
      fromPlace: this.props.route.params.fromPlace,
      flat:this.props.route.params.cLat,
      flong:this.props.route.params.cLong,
       region:{ latitude:this.props.route.params.cLat,
      longitude:this.props.route.params.cLong,
      // latitudeDelta: 0.0005,
  //longitudeDelta: 0.05
            latitudeDelta: 0.01,
              longitudeDelta: 0.005},
      searchResult: [],
      searchResultto:[],
      toPlace: '',
      isLoading: false,
      photo: '',
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
        admin_token:[],
        RiderToken:[],
        adult:1,
        children:0,
        PassengerDescription:'',
      ExtraBaggage:false,
      willingtopay:false,
      tip:0,
      paymentMethods:[],
      present: -1,
      carsAvailable:[],
  };
  this.getLocation();

  }

  onRegionChange = (region) => {
    console.log('region: ', region)
  console.log('visibleAddressModal: ', this.state.visibleAddressModal)
    console.log('visibleAddressModalTo: ', this.state.visibleAddressModalTo)
    if(this.state.visibleAddressModal == true){
      this.setState({isLoading: true})
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${region[0]},${region[1]}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];

        let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)
const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            


             this.setState({
    billing_province:item.context[0].text,
    billing_city: arr[2],
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
               fromPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], x: { latitude: region[1], longitude: region[0] },
               isLoading: false,
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

      })
     
               }

       }).catch(err => {
          console.log('Region axios: ',err)
       })
    
       return;
    }
        
        if(this.state.visibleAddressModalTo == true){
this.setState({isLoading: true})
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${region[0]},${region[1]}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];

    
    const {flat, flong, } = this.state;
    let from_lat = flat
    let from_long = flong
    let to_lat = region[1]
    let to_long = region[0]
  console.log('to_lat: ', to_lat)
    console.log('to_long: ', to_long)
    let routeCoordinates = [];
    let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)
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
        Tolat:region[1],
        Tolong:region[0],
       
          summary: res.data.response.route[0].summary,
         
    billing_provinceTo:item.context[0].text,
    billing_cityTo: arr[2],
    billing_streetTo:arr[0]+', '+ arr[1],
    billing_postalTo: arr[3],
    billing_barangayTo: item.context[1].text,
    flatTo:region[1],
     flongTo:region[0],
  region:{ latitude:region[1],
      longitude: 	region[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
               toPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], LocationDoneto: true,   
          isLoading: false,
      })

      })
       }).catch(err => {
          console.log('Region axios: ',err)
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

 const newUserLocationCountry = this.props.route.params.UserLocationCountry =='Philippines'?'vehicles':this.props.route.params.UserLocationCountry+'.vehicles';
 firestore().collection(newUserLocationCountry).where('vehicle', '==', this.props.route.params.datas.vehicle).onSnapshot((querySnapshot) => {
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
                RiderToken: doc.data().tokens,
      
     });
    })
  })
  }

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true})
      };
    
       hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
      };
    
       handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({startDate: date, AlwaysOpen: false})
        this.hideDatePicker();
      };





  async component (){
    let userId= await AsyncStorage.getItem('uid');
    const self = this;

			/* This will also be triggered when new items are added to or removed from cart  */
			self.unsubscribeCartItems =  firestore().collection('user_vouchers').doc(userId).onSnapshot(snapshot => {
				let updatedCart = []; /* Set empty array cart by default */
				
				if(snapshot.data() && Object.keys(snapshot.data()).length){
					/* Loop through list of cart item IDs  */
					Object.values(snapshot.data()).forEach(function (snapshotCart, index) {
							updatedCart.push({...snapshotCart});
							self.setState({vouchers: updatedCart, loading: false}); /* !!!! setState is running multiple times here, figure out how to detect when child_added completed*/
					
					});
				} else {
					self.setState({vouchers: [], loading: false})
				}
      });
     
  }

  checkVoucherDetails(data){
    const { voucherArray } = this.state;
    let total = 0;
    let discount = this.state.discount;
    if(this.state.voucherCode != data.id || !this.state.voucherCode){
    this.state.cartItems.forEach((item) => {

      if(item.storeId == data.store_id){
        if(item.sale_price){
          total += item.sale_price * item.qty
        }else{
          total += item.price * item.qty

        }
      }
    })
    console.log('vtotal: ', total)
    console.log('discount: ', this.state.discount)
    if(total >= parseFloat(data.minimum)){
      this.setState({discount: data.amount, voucherCode: data.id , isVisible: false})
    }else{
      Toast.show({
                      text: "Inapplicable Voucher",
                      position: "center",
                      type: "warning",
                      textStyle: { textAlign: "center" },
                })
      this.setState({isVisible: false})
    }

  }else{
    Alert.alert(
      'Voucher already in-use.',
      '',
      [
        {text: 'OK'},
      ]
    )
    this.setState({isVisible: false})
  }
 
  }

    backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => this.props.navigation.goBack()}
    ]);
    return true;
  };
  onCollectionVehicles = (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((doc) => {
      //console.log('products: ', doc.data())
      if(doc.data().vehicle != this.state.datas.vehicle)
   {  products.push ({
       
            datas : doc.data(),
            key : doc.id
            });
          }
    });
   // console.log('products: ', products)
      this.setState({loading: false,  carsAvailable: products})
   // this.arrayholder = products;
  }

  componentDidMount() {
    this.StartImageRotationFunction()
      this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
     const newUserLocationCountry = this.props.route.params.UserLocationCountry.trim() =='Philippines'?'AppShare':this.props.route.params.UserLocationCountry.trim()+'.AppShare';
     const newUserLocationCountryVehicles = this.props.route.params.UserLocationCountry.trim() =='Philippines'?'vehicles':this.props.route.params.UserLocationCountry.trim()+'.vehicles';
     console.log('newUserLocationCountry: ',newUserLocationCountry)
     firestore().collection(newUserLocationCountryVehicles).where('succeed', '>',0).onSnapshot(this.onCollectionVehicles);
    firestore().collection(newUserLocationCountry).where('label', '==', 'rides').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
  console.log('modeOfPayment', doc.data().modeOfPayment)
        this.setState({
          paymentMethods: doc.data().modeOfPayment == undefined? []:doc.data().modeOfPayment,
       });
      })
    })
    firestore().collection('admin_token').where('city', '==', this.props.route.params.selectedCityUser.trim()).onSnapshot(
      querySnapshot => {
          const orders = []
          querySnapshot.forEach(doc => {
              this.setState({
      
                admin_token: doc.data().tokens,
               })
          });
  
      },
      error => {
          console.log(error)
      }
  )
    this._bootstrapAsync();


  }

  
 componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    this.subscribe && this.subscribe();
    this.billinglistener && this.billinglistener();
    this.paymentslistener && this.paymentslistener();
    this.paymentsmethodlistener && this.paymentsmethodlistener();
    this.ordercounters && this.ordercounters();
        this.backHandler.remove();
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
      phone:doc.data().Mobile,
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
            billing_province: item.province,
            billing_barangay: item.barangay,
            billing_city: this.props.route.params.selectedCityUser,
            billing_street: this.props.route.params.fromPlace,
            billing_postal: item.postal,
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
                routeCoordinates.push({latitude: latitude, longitude: longitude});
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

changeAddressto(itemLat, itemLong){
/*
    
    const {flat, flong, } = this.state;
    let from_lat = flat
    let from_long = flong
    let to_lat = itemLat
    let to_long = itemLong
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
          routeCoordinates.push({latitude: latitude, longitude: longitude});
      })
      this.setState({
        routeForMap: routeCoordinates,
        Tolat: item.lat,
        Tolong:item.long,
       
          summary: res.data.response.route[0].summary,
         
          isLoading: false,
      })
      //console.log('sum: ', res.data.response.route[0].summary);
      }).catch(err => {
     // console.log(err)
      })*/
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

  getLocationNow(){

if(this.state.visibleAddressModal == true)
 {   this.setState({fromPlace: this.props.route.params.fromPlace,
      flat:this.props.route.params.cLat,
      flong:this.props.route.params.cLong,
      region:{ latitude:this.props.route.params.cLat,
        longitude:this.props.route.params.cLong,
        // latitudeDelta: 0.0005,
    //longitudeDelta: 0.05
              latitudeDelta: 0.01,
                longitudeDelta: 0.005},})
    }

    Geolocation.getCurrentPosition(
      info => {
          const { coords } = info


    console.log('visibleAddressModal: ', this.state.visibleAddressModal)
      console.log('visibleAddressModalTo: ', this.state.visibleAddressModalTo)
      if(this.state.visibleAddressModal == true){
        this.setState({isLoading: true})
   axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
       .then(res => {
      const item = res.data.features[0];
  
          let str = item.place_name;
  
  let arr = str.split(',');
  
  console.log("str", str)
  console.log("arr", arr)
  const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
              
  
  
               this.setState({
      billing_province:item.context[0].text,
      billing_city: arr[2],
      billing_street:arr[0]+', '+ arr[1],
      billing_postal: arr[3],
      billing_barangay: item.context[1].text,
      flat:coords.latitude,
      flong: coords.longitude,
      cLong:coords.longitude,
       cLat:coords.latitude,
                 region:{ latitude:coords.latitude,
        longitude: 	coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,},
                 fromPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], x: { latitude: coords.latitude, longitude: region[0] },
                 isLoading: false,
                 })
  
                 console.log('Tolong: ',this.state.Tolong);
                 if(this.state.Tolong != undefined){
                     console.log('working here')
                this.setState({isLoading: true})    
               let routeCoordinates = []
      axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${coords.latitude},${region[0]}&waypoint1=geo!${this.state.Tolat},${this.state.Tolong}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
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
  
        })
       
                 }
  
         }).catch(err => {
            console.log('Region axios: ',err)
            this.setState({  isLoading: false,})
         })
      
         return;
      }
          
          if(this.state.visibleAddressModalTo == true){
  this.setState({isLoading: true})
   axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
       .then(res => {
      const item = res.data.features[0];
  
      
      const {flat, flong, } = this.state;
      let from_lat = flat
      let from_long = flong
      let to_lat = coords.latitude
      let to_long = coords.longitude
    console.log('to_lat: ', to_lat)
      console.log('to_long: ', to_long)
      let routeCoordinates = [];
      let str = item.place_name;
  
  let arr = str.split(',');
  
  console.log("str", str)
  console.log("arr", arr)
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
          Tolat:coords.latitude,
          Tolong:coords.longitude,
         
            summary: res.data.response.route[0].summary,
           
      billing_provinceTo:item.context[0].text,
      billing_cityTo: arr[2],
      billing_streetTo:arr[0]+', '+ arr[1],
      billing_postalTo: arr[3],
      billing_barangayTo: item.context[1].text,
      flatTo:coords.latitude,
       flongTo:coords.longitude,
    region:{ latitude:coords.latitude,
        longitude: 	coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,},
                 toPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], LocationDoneto: true,   
            isLoading: false,
        })
  
        })
         }).catch(err => {
            console.log('Region axios: ',err)
            this.setState({  isLoading: false,})
         })
      }
    },
    error => {console.log(error),    this.setState({  isLoading: false,})},
    {
        enableHighAccuracy: false,
        timeout: 2000,
        maximumAge: 3600000
    }
    )
  }



  changeVehicleAdd (){
 /*   this.setState({
              present: this.state.present+1,
      })*/
    console.log('Pressed', this.state.present)
    this.setState({
      datas:this.state.carsAvailable[this.state.present+1].datas,
      succeding: this.state.carsAvailable[this.state.present+1].datas.succeed,
      amount_base: this.props.route.params.typeOfRate =='Municipal Rate'?this.state.carsAvailable[this.state.present+1].datas.base_fare:this.props.route.params.typeOfRate =='City Rate'?this.state.carsAvailable[this.state.present+1].datas.City:this.state.carsAvailable[this.state.present+1].datas.Metro,
      base_dist: this.state.carsAvailable[this.state.present+1].datas.base,
        Metro: this.state.carsAvailable[this.state.present+1].datas.Metro,
          City: this.state.carsAvailable[this.state.present+1].datas.City,
            SCity: this.state.carsAvailable[this.state.present+1].datas.SCity,
              SMetro: this.state.carsAvailable[this.state.present+1].datas.SMetro,
              RiderToken: this.state.carsAvailable[this.state.present+1].datas.tokens,
              present: this.state.present+1,
      })
  }


  changeVehicleMinus (){
    console.log('Pressed', this.state.present-1)
  if(this.state.present-1 >= 0){  this.setState({
      datas:this.state.carsAvailable[this.state.present-1].datas,
      succeding: this.state.carsAvailable[this.state.present-1].datas.succeed,
      amount_base: this.props.route.params.typeOfRate =='Municipal Rate'?this.state.carsAvailable[this.state.present-1].datas.base_fare:this.props.route.params.typeOfRate =='City Rate'?this.state.carsAvailable[this.state.present-1].datas.City:this.state.carsAvailable[this.state.present-1].datas.Metro,
      base_dist: this.state.carsAvailable[this.state.present-1].datas.base,
        Metro: this.state.carsAvailable[this.state.present-1].datas.Metro,
          City: this.state.carsAvailable[this.state.present-1].datas.City,
            SCity: this.state.carsAvailable[this.state.present-1].datas.SCity,
              SMetro: this.state.carsAvailable[this.state.present-1].datas.SMetro,
              RiderToken: this.state.carsAvailable[this.state.present-1].datas.tokens,
              present: this.state.present-1,
      })}
      else{
      this.getLocation();
      this.setState({
        datas: this.props.route.params.datas,
                present: this.state.present-1,
        })

      }
      
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
    const { paymentMethod, minimum, selectedIndex, selectedIndices, customStyleIndex, slatitude, slongitude, lat, ULat,summary } = this.state;
   
    let distance = this.state.summary === undefined? null: this.state.summary.distance/1000;
    let newDistance = distance - this.state.base_dist;
    let distanceAmount = newDistance*this.state.succeding;
    let amountpay= this.state.amount_base +distanceAmount;
      let distanceAmountCity = newDistance*this.state.SCity;
    let amountpayCity= this.state.City +distanceAmountCity;
     let distanceAmountMetro= newDistance*this.state.SMetro;
    let amountpayMetro= this.state.Metro +distanceAmountMetro;
    
    const actualAmountPay = this.props.route.params.typeOfRate =='Municipal Rate'?amountpay:this.props.route.params.typeOfRate =='City Rate'?amountpayCity:amountpayMetro
  const typeOfRate = this.props.route.params.typeOfRate; 
 console.log('newDistance: ', newDistance);
 console.log('this.state.SCity: ', this.state.SCity);
 console.log('this.state.City: ', this.state.City);
  console.log('distanceAmountCity: ', distanceAmountCity);
  console.log('amountpayCity: ', amountpayCity);
console.log('typeOfRate: ', typeOfRate);
//console.log('summary: ', summary);
console.log('region: ', this.state.region);
    return(
        <Root>
          <Container style={{backgroundColor: '#CCCCCC'}}>   
  
          <Header androidStatusBarColor="#28ae07" style={{display:'none'}} style={{backgroundColor: '#28ae07'}}>
          <Left style={{flex:3, flexDirection: 'row'}}>
          <Button transparent onPress={()=> this.props.navigation.goBack()}>
                 <MaterialIcons name="arrow-back" size={25} color="white" />
                </Button> 
                <Title style={{color:'white', marginTop: 7, marginLeft: 10}}>Booking Shares</Title>
          </Left>
        <Right>
        <MaterialIcons name="my-location" size={30} color={'white'} onPress={()=> this.getLocationNow()} />       
         
          </Right>
        </Header>
          
          <Loader loading={this.state.loading} trans={trans}/>     
     <Loader loading={this.state.isLoading} trans={trans}/>  
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,}}>
          
  <MapboxGL.MapView style={{ flex: 1,position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}} 

 onPress={e => {this.state.visibleAddressModal == true? this.onRegionChange(e.geometry.coordinates):
          this.state.visibleAddressModalTo == true?this.onRegionChange(e.geometry.coordinates):null
        }}
  //onRegionWillChange={this.onRegionWillChange}
  //        onRegionIsChanging={this.onRegionIsChanging}

  onRegionDidChange={() => {Keyboard.dismiss();}}
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
  <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />
    { this.state.flong == undefined? null: 

              <MapboxGL.PointAnnotation coordinate={[this.state.flong, this.state.flat]} />
             
            
         }
           {  this.state.Tolat == undefined? null:
           <MapboxGL.PointAnnotation coordinate={[this.state.Tolong, this.state.Tolat]} />
        
           }

  </MapboxGL.MapView>

    {/*<MapView
      mapPadding={{top:0, right:0, left:0, bottom:230}}
            testID="map"
        provider={PROVIDER_GOOGLE}
    onRegionChangeComplete={() => {Keyboard.dismiss();}}
        showsUserLocation={true}
          style={{ position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}
    initialRegion={this.state.region}
    showsMyLocationButton={true}
  
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
              
          { this.state.flong == undefined? null:  
          <MapView.Marker
             coordinate={{latitude: this.state.flat, longitude: this.state.flong}}
             title={"From"}
             description={this.state.fromPlace}
             image={Rider_img}
          />}
           {  this.state.Tolong == undefined? null:
           
           <MapView.Marker
             coordinate={{latitude: this.state.Tolat, longitude: this.state.Tolong}}
             title={"To"}
             description={this.state.toPlace}
             image={customer_img}
       />}
          
          </MapView>*/}
        { /* <MaterialIcons name="my-location" size={40} style={{backgroundColor: 'white', width: 40,  right: 10, top: 150, position: 'absolute'}} onPress={()=> this.getLocationNow()} />       
        */ }  
        
       <Card style={{ left: 0, top: 0, position: 'absolute'}}>
        <CardItem>
                    <Text style={{fontWeight: 'bold'}}>From: </Text>
                    {!this.state.loading &&
                   
                    <Item regular style={{width: '80%', height: 40}}>
                    <Input value={this.state.fromPlace} style={{fontSize: 13}}   onChangeText={(text) => this.getLocationType(text, 'fromPlace')}  onFocus={() =>this.setState({visibleAddressModal: true, visibleAddressModalTo: false}) } />
                       
                         </Item>      }
                         <MaterialIcons name="clear" size={20} onPress={()=>Alert.alert('Are you sure to clear?', 'Clear the address', [ {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.setState({fromPlace: '',LocationDone: true,visibleAddressModal: true, visibleAddressModalTo: false}) }])}/>       
                </CardItem>
                 {this.state.LocationDone == false?<View style={{height: 100}}><FlatList
                                 
        data={this.state.searchResult}
        renderItem={ ({ item }) => (
         <View style={{padding: 10}}>
           <TouchableOpacity onPress={()=>{ 
                 let str = item.place_name;

let arr = str.split(',');

console.log("str", str)
console.log("arr", arr)
//const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            
const region=  {latitude: item.center[1], latitudeDelta: 0.0999998484542477, longitude: item.center[0], longitudeDelta: 0.11949475854635239}
console.log('region: ', region)

             this.setState({
 
    billing_province:item.context[0].text,
    billing_city: arr[2],
    billing_street:arr[0]+', '+ arr[1],
    billing_postal: arr[3],
    billing_barangay: item.context[1].text,
    flat: item.geometry.coordinates[1],
    flong: item.geometry.coordinates[0] ,

    cLong:item.geometry.coordinates[0] ,
     cLat:item.geometry.coordinates[1],

            

               region:{ latitude:item.center[1],
      longitude: 	item.center[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
               fromPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], x: { latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0] }, LocationDone: true,    visibleAddressModalTo: false, })}}>
 
           <Text>{item.place_name}</Text>
           {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      /></View>:null}
                <CardItem>
                    <Text style={{fontWeight: 'bold'}}>To:      </Text>
                    {!this.state.loading &&
                       
                    <Item regular style={{width: '80%', height: 40}}>
                    <Input value={this.state.toPlace} style={{fontSize: 13}}   onChangeText={(text) => this.getLocationTypeto(text, 'toPlace')}  onFocus={() =>this.setState({visibleAddressModalTo: true,visibleAddressModal: false}) }  />
                         </Item>  
                   }
                   <MaterialIcons name="clear" size={20} onPress={()=>Alert.alert('Are you sure to clear?', 'Clear the address', [ {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.setState({toPlace: '',LocationDoneto: true,visibleAddressModalTo: true,visibleAddressModal: false}) }])}/> 
                </CardItem>
                     {this.state.LocationDoneto == false?<View style={{height: 100}}><FlatList
                                 
        data={this.state.searchResultto}
        renderItem={ ({ item }) => (
         <View style={{padding: 10}}>
           <TouchableOpacity onPress={()=>{ 
             this.setState({isLoading: true})
                 let str = item.place_name;

let arr = str.split(',');


const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            
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
         
    billing_provinceTo:province == undefined?item.context[0].text :province.province,
    billing_cityTo: arr[2],
    billing_streetTo:arr[0]+', '+ arr[1],
    billing_postalTo: arr[3],
    billing_barangayTo: item.context[1].text,
    flatTo:item.geometry.coordinates[0] ,
     flongTo:item.geometry.coordinates[1],
  region:{ latitude:item.center[1],
      longitude: 	item.center[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,},
               toPlace:arr[0]+', '+arr[1]+' '+item.context[1].text+' '+arr[2]+' '+item.context[0].text+' '+arr[3], LocationDoneto: true,    visibleAddressModalTo: false, 
          isLoading: false,
      })
      //console.log('sum: ', res.data.response.route[0].summary);
      }).catch(err => {
     // console.log(err)
      })

   }}>
 
           <Text>{item.place_name}</Text>
           {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      /></View>:null}
       </Card>
        </View>
         </View>
         <View>
               
       { /* <Card >
              
            </Card>*/} 
              <Card style={{height: SCREEN_HEIGHT < 767?SCREEN_HEIGHT/3:SCREEN_HEIGHT/5, borderTopRightRadius: 20, borderTopLeftRadius: 20,}}>
              { this.state.present < 0? null: <TouchableOpacity style={{position: 'absolute',  top: SCREEN_HEIGHT < 767?SCREEN_HEIGHT/9:SCREEN_HEIGHT/13, flex: 100}} onPress={()=> this.changeVehicleMinus()}>
<MaterialIcons name="keyboard-arrow-left" size={30} color={'black'} onPress={()=> this.changeVehicleMinus()} />       
         
</TouchableOpacity>
}
              <View style={{flexDirection: 'row'}}>
<View style={{flexDirection: 'column', width: SCREEN_WIDTH/2}}>
<Text style={{fontSize: SCREEN_HEIGHT < 767?18:28, marginLeft: 25, paddingTop: 10, fontWeight: 'bold'}}>
{this.state.datas.vehicle}
</Text>
<Text style={{fontSize: SCREEN_HEIGHT < 767?10:13, marginLeft: 25,  fontWeight: 'bold'}}>
Base fare: 
<NumberFormat  renderText={text => <Text style={{fontSize: SCREEN_HEIGHT < 767?10:13, marginLeft: 25,}}> {text}</Text>} value={this.props.route.params.typeOfRate =='Municipal Rate'?this.state.datas.base_fare:this.props.route.params.typeOfRate =='City Rate'?this.state.datas.City:this.state.datas.Metro} displayType={'text'} thousandSeparator={true} prefix={this.props.route.params.currency} />
</Text>
{this.state.summary === undefined? null: 
            <Text style={{fontSize: SCREEN_HEIGHT < 767?15:20, marginLeft: 25,  fontWeight: 'bold'}}>
            Fare: <NumberFormat  renderText={text => <Text style={{fontSize: SCREEN_HEIGHT < 767?15:20, marginLeft: 25,}}> {text}</Text>} value={this.state.summary === undefined? null: distanceAmount < 1?this.state.amount_base: Math.round((actualAmountPay*10)/10)} displayType={'text'} thousandSeparator={true} prefix={this.props.route.params.currency} /> </Text>     
               }
  {this.state.summary === undefined? null:<View style={{ height: 40, alignItems: 'center', marginBottom: 10}}>
							<TouchableOpacity  style={[styles.centerElement, {backgroundColor: '#53BE38', borderRadius: 5, padding: 10, width: '100%',}]} onPress={() => {this.state.uid == null?  this.props.navigation.navigate('Login') :this.setState({VisibleAddInfo: true})}}>
								<Text style={{color: '#ffffff'}}>{this.state.uid == null?'Log in to Continue':'Book Now'}</Text>
							</TouchableOpacity>
            </View>}
</View>
<View style={{flexDirection: 'column', width: SCREEN_WIDTH/2}}>
<Image style={{  width: SCREEN_WIDTH/2.2, height:SCREEN_WIDTH/2, resizeMode: 'contain', marginTop: -30}} source={{uri: this.state.datas.image[0]}} />
</View>
</View>
{ this.state.present >= this.state.carsAvailable.length? null: <TouchableOpacity style={{position: 'absolute', right: 0, top: SCREEN_HEIGHT < 767?SCREEN_HEIGHT/9:SCREEN_HEIGHT/13, flex: 100}} onPress={()=> this.changeVehicleAdd()}>
<MaterialIcons name="keyboard-arrow-right" size={30} color={'black'} onPress={()=> this.changeVehicleAdd()} />       
         
</TouchableOpacity>
}
</Card>
    
    
         {/*   <Card>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>Vehicle:  </Text>
                    <Left>
                        <Text style={{fontSize: 15}}>{this.state.datas.vehicle}</Text>
                    </Left>
             
                   {this.state.summary === undefined? null: <Body style={{paddingLeft: 10}}>
                  
                    <Text style={{fontSize: 15}}>{this.state.summary === undefined? null: distanceAmount < 1?this.props.route.params.currency+' '+ this.state.amount_base: this.props.route.params.currency+' '+Math.round((actualAmountPay*10)/10)}</Text>
                    <Text  style={{fontSize: 15}}>{this.state.summary === undefined? null: Math.round(((this.state.summary.baseTime/60)*10)/10)} mins</Text>
                    </Body>}
                    <Body>
                    {this.state.summary === undefined? null:<View style={{ height: 40, alignItems: 'center', marginBottom: 10}}>
							<TouchableOpacity  style={[styles.centerElement, {backgroundColor: '#019fe8', borderRadius: 5, padding: 10, width: '100%',}]} onPress={() => {this.state.uid == null?  this.props.navigation.navigate('Login') :this.setState({VisibleAddInfo: true})}}>
								<Text style={{color: '#ffffff'}}>{this.state.uid == null?'Log in to Continue':'Book Now'}</Text>
							</TouchableOpacity>
            </View>}
                    </Body>
                </CardItem>
            </Card> */}

            
               
               </View>

               
            <Modal
      isVisible={this.state.VisibleAddInfo}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackButtonPress={() => this.setState({ VisibleAddInfo: false })}
      onBackdropPress={() => this.setState({VisibleAddInfo: false})} transparent={true}>
     <Card style={{ backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',}}>
        <View  style={{ alignSelf: 'flex-end', position: 'absolute', top: 10, right:10, flex: 5}}>
                        <AntDesign name="closecircle" color="gray" size={25} onPress={() => this.setState({VisibleAddInfo: false})}/>
                        </View>
        <View>
                        <Text style={{marginTop: 15, fontSize: 10}}>Number of Passengers</Text>
                         <Item regular style={{marginTop: 7, padding: 10}}> 
                             <View style={{flexDirection: 'column'}}>
                             <View style={{flexDirection: 'row'}}>
                 <AntDesign name="minuscircle" onPress={()=> {this.state.adult > 1 ?this.setState({adult: this.state.adult-1}):null}} size={20}/> 
                
                 <Text style={{paddingLeft: 10, paddingRight: 10}}>{this.state.adult}</Text>
                 
                 <AntDesign name="pluscircle" onPress={()=> this.setState({adult: this.state.adult+1})} size={20}/> 
                 
                <Text style={{paddingLeft: 10, paddingRight: 10}}>Adult</Text>
                 </View>

                       <View style={{flexDirection: 'row'}}>
                 <AntDesign name="minuscircle" onPress={()=> {this.state.children > 0 ?this.setState({children: this.state.children-1}):null}} size={20}/> 
                
                 <Text style={{paddingLeft: 10, paddingRight: 10}}>{this.state.children}</Text>
                 
                 <AntDesign name="pluscircle" onPress={()=> this.setState({children: this.state.children+1})} size={20}/> 
                 
                <Text style={{paddingLeft: 10, paddingRight: 10}}>Children</Text>
                 </View>
                 </View>
              </Item>
             
         <Text style={{marginTop: 15, fontSize: 10}}>Pickup Time</Text>
                    <Item regular style={{marginTop: 7, padding: 10}}>
                       <TouchableOpacity onPress={this.showDatePicker} style={{width: '60%'}}>
<Text>{this.state.startDate===""?'Start Date/Time':moment(this.state.startDate).format('h:mm a')}</Text>
</TouchableOpacity>
{this.state.AlwaysOpen==false?
  <MaterialCommunityIcons name="checkbox-blank-outline" size={25} color="green" onPress={()=> this.setState({AlwaysOpen: true})}><Text style={{fontSize: 15}}>Asap</Text></MaterialCommunityIcons>
  :
 <MaterialCommunityIcons name="checkbox-marked-outline" size={25} color="red" onPress={()=> this.setState({AlwaysOpen: false})}><Text style={{fontSize: 15}}>Asap</Text></MaterialCommunityIcons>
 
 
}
<DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="time"
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
                    </Item>
                    <Item>
                  {this.state.ExtraBaggage==false?
  <MaterialCommunityIcons name="checkbox-blank-outline" size={25} color="green" onPress={()=> this.setState({ExtraBaggage: true})}><Text style={{fontSize: 15}}>Extra Baggage</Text></MaterialCommunityIcons>
  :
 <MaterialCommunityIcons name="checkbox-marked-outline" size={25} color="red" onPress={()=> this.setState({ExtraBaggage: false})}><Text style={{fontSize: 15}}>Extra Baggage</Text></MaterialCommunityIcons>
 
 
}

{this.state.willingtopay==false?
  <MaterialCommunityIcons name="checkbox-blank-outline" size={25} color="green" onPress={()=> this.setState({willingtopay: true})}><Text style={{fontSize: 15}}>Willing to pay</Text></MaterialCommunityIcons>
  :
 <MaterialCommunityIcons name="checkbox-marked-outline" size={25} color="red" onPress={()=> this.setState({willingtopay: false})}><Text style={{fontSize: 15}}>Willing to pay</Text></MaterialCommunityIcons>
 
 
}

            </Item>
            <Item>
            
{this.state.willingtopay==false?
 null  :
  <Input placeholder={'Tip Amount'}  value={this.state.tip} onChangeText={(text) => {isNaN(text)? null:this.setState({tip: text})}} placeholderTextColor="#687373" keyboardType={'number-pad'}/>
        
}
            </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Phone Number</Text>
                    <Item>
                   
                   <Picker
                         selectedValue={this.state.phone}
                         onValueChange={(itemValue, itemIndex) => this.setState({phone: itemValue}) }>     
                            <Picker.Item label = {this.state.phone}  value={this.state.phone}  />
                              {this.state.address_list.map((user, index) => (
     <Picker.Item label={user.phone} value={user.phone} key={index}/>
  ))        }
                    </Picker>
            </Item>
              <Text style={{marginTop: 15, fontSize: 10}}>Passenger Description</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.PassengerDescription}  value={this.state.PassengerDescription} onChangeText={(text) => {this.setState({PassengerDescription: text})}} placeholderTextColor="#687373" />
        </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Mode of payment</Text>
                    <Item>
                   
                   <Picker
                         selectedValue={this.state.PaymentMethod}
                         onValueChange={(itemValue, itemIndex) => this.setState({paymentMethod: itemValue}) }>         
                            <Picker.Item label = {this.state.paymentMethod}  value={this.state.paymentMethod}  />
                            <Picker.Item label = {'Cash'}  value= {'Cash'} />
                              {this.state.paymentMethods.map((user, index) => (
                                            
     <Picker.Item label={user.Label} value={user.Label} key={index}/>
    
  ))        }
                    </Picker>
            </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Note to Rider</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.note}  value={this.state.note} onChangeText={(text) => {this.setState({note: text})}} placeholderTextColor="#687373" />
         </Item>
           </View>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => this.checkOut()}
      >
       <Text style={{color:'white'}}>Procceed</Text>
      </Button>
    </Card>
    </Modal>
            

                <Modal
              isVisible={this.state.visibleModal}
              animationInTiming={500}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              animationOutTiming={500}
              useNativeDriver={true}
              onBackButtonPress={() => this.OrderSuccess()}
              onBackdropPress={() => this.OrderSuccess()} transparent={true}>
            <View style={styles.content}>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold'}}>Thank you for using Booking Shares!</Text>
              </View>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 20}}>
              <Image
                  style={{ height: 150, width: 150}}
                  source={require('../assets/check.png')}
                />
              </View>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'black', fontWeight:'bold'}}>Your Transaction is Queued!</Text>
              <Text style={{color:'black', fontWeight:'600', textAlign: "center"}}>Please wait patiently.</Text>
              </View>
            <Button block style={{ height: 30, backgroundColor: "#019fe8"}}
             onPress={()=> this.OrderSuccess()} >
              <Text style={{color: 'white'}}>Ok</Text>
              </Button>
            </View>
            </Modal>
              <Modal
              isVisible={this.state.warningModal}
              animationInTiming={500}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              animationOutTiming={500}
              useNativeDriver={true}
              onBackButtonPress={() => this.setState({ warningModal: false })}
              onBackdropPress={() =>  this.setState({warningModal: false})} transparent={true}>
            <View style={styles.content}>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold'}}>Error!</Text>
              </View>
            
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'black', fontWeight:'bold'}}>{this.state.warningText}</Text>
              </View>
            <Button block style={{ height: 30, backgroundColor: "#019fe8"}}
             onPress={()=> this.setState({warningModal: false})} >
              <Text style={{color: 'white'}}>Ok</Text>
              </Button>
            </View>
            </Modal>
          </Container>
          </Root>
    );
  }


  async checkOut(){
console.log('this.state.photo: ', this.state.photo)
console.log('this.state.startDate: ', this.state.startDate)
if(this.state.PassengerDescription == ''){
  Alert.alert(
       'Enter Passenger Description',
       '',
       [
         {text: 'OK'},
       ]
     )
     return;
}
if(this.state.phone == ''|| this.state.phone == undefined ||this.state.phone == 'Select Phone Number' ){
  Alert.alert(
       'Add Phone Number',
       '',
       [
         {text: 'OK'},
       ]
     )
     return;
}
if(this.state.photo == ''|| this.state.photo == undefined){
       Alert.alert(
            'Please Update Your Photo',
            '',
            [
              {text: 'OK'},
            ]
          )
          return;
}
    if(this.state.passenger=='0' || this.state.passenger==''){
        Alert.alert(
            'Declare number of Passenger',
            '',
            [
              {text: 'OK'},
            ]
          )
          return;
    }
    if(this.state.AlwaysOpen == false && this.state.startDate==undefined){
        Alert.alert(
            'Set Time',
            '',
            [
              {text: 'OK'},
            ]
          )
          return;
    }
        
    const distance = this.state.summary === undefined? null: this.state.summary.distance/1000;
  
  
    let newDistance = distance - this.state.base_dist;
    let distanceAmount = newDistance*this.state.succeding;
    let amountpay= this.state.amount_base +distanceAmount;
      let distanceAmountCity = newDistance*this.state.SCity;
    let amountpayCity= this.state.City +distanceAmountCity;
     let distanceAmountMetro= newDistance*this.state.SMetro;
    let amountpayMetro= this.state.Metro +distanceAmountMetro;
    
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

    const datavalue = {
      admin_token:this.state.admin_token.concat(this.state.RiderToken).filter((a)=>a),
      city:this.state.billing_city.trim(),
      ExtraBaggage:this.state.ExtraBaggage,
      willingtopay:this.state.willingtopay,
      tip:this.state.tip,
      adult: this.state.adult,
      children: this.state.children,
      currency:this.props.route.params.currency,
        Customerimage:this.state.photo,
     OrderNo : this.state.counter,
     OrderId: newDocumentID,
     OrderStatus: 'Pending',
     passengers: this.state.adult+ this.state.children,
     pickupArrive: false,
     dropOffArrive: false,
     needAsap:this.state.AlwaysOpen,
     pickupTime:this.state.startDate === undefined? null:this.state.startDate,
     adminID: '',
     PassengerDescription: this.state.PassengerDescription,
     AccountInfo: {
       name: this.state.account_name,
       address: this.state.account_address,
       phone: this.state.phone,
       email: this.state.account_email,
       barangay: this.state.account_barangay==undefined?'': this.state.account_barangay,
       city: this.state.account_city.trim(),
       province: this.state.account_province.toLowerCase(),
       status: this.state.account_status,
     },
     Billing: {
       name: this.state.account_name,
       address: this.state.billing_street,
       phone: this.state.phone,
       barangay:this.state.billing_barangay==undefined?'':  this.state.billing_barangay,
       province: this.state.billing_province.toLowerCase(),
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
     billing_phoneTo:this.state.phone,
     billing_provinceTo: this.state.billing_provinceTo.toLowerCase(),
     billing_cityTo: this.state.billing_cityTo,
     billing_streetTo: this.state.billing_streetTo,
     billing_postalTo: this.state.billing_postalTo,
     billing_barangayTo:this.state.billing_barangayTo,
     Timestamp: moment().unix(),
     user_token : token,
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
     total:  distanceAmount < 1? this.state.amount_base: actualAmountPay,
     exkm: newDistance,
     estTime:  this.state.summary.baseTime,
     succeding: this.state.succeding,
     amount_base: this.state.amount_base,
     base_dist: this.state.base_dist,
    vehicle: this.state.datas.vehicle,
    ProductType: 'Transport',
    }

  Alert.alert(
            'Process this transaction?',
            'are you sure?',
            [
                 {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => {
         this.setState({loading: true})
        this.checkoutref.collection('orders').doc(newDocumentID).set(datavalue).then(
      updatecounts.update({ counter:   firestore.FieldValue.increment(1) }),
      updateUserOrders.update({ ordered_times:   firestore.FieldValue.increment(1) }),
  
      this.setState({
        loading: false,
        visibleModal: true
      })
    )  .catch((error)=>     Alert.alert(
        'Try Again',
        '',
        [
          {text: 'OK'},
        ]
      ))

      }} 
            ]
          )
    
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
