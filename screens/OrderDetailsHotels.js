import React, { Component } from 'react';
import {StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert, Image, FlatList, SafeAreaView, ScrollView,Animated} from 'react-native'
import { Container, View, Left, Right, Button, Icon, Grid, Col, Badge,Title, Card, CardItem, Body,Item, Input,List,Picker, ListItem, Thumbnail,Text,Form, Textarea,Toast, Root, Header } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Foundation from 'react-native-vector-icons/Foundation'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// Our custom files and classes import
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
import { FlatGrid } from 'react-native-super-grid';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { marginTop } from 'styled-system';
import QRCode from 'react-native-qrcode-svg';
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



export default class OrderDetailsHotels extends Component {
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
      const cart = this.props.route.params.orders; 
      const datas = this.props.route.params.orders; 
      this.state = {  
     // slatitude:cart[0].slatitude,
      //slongitude:cart[0].slongitude,
     // cartItems: cart,
        OrderStatus: cart.OrderStatus,
     adminname: cart.adminname,
      DeliveredBy: cart.DeliveredBy.Name,
     VisibleAddInfo: false,
     datas: datas,
     cLong:this.props.route.params.orders.flong,
     cLat:this.props.route.params.orders.flat,
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
      SelectedPricing:datas.StatDayPrice == true?'Day':datas.StatHourPrice == true?'Hour':datas.StatWeeklyPrice == true?'Weekly':'Monthly',
      minimum: 0,
      selectedIndex: 0,
      selectedIndices: [0],  
      customStyleIndex: 0,
      isready:0,
      visibleAddressModalTo: false,
      passenger: '1',
      note: '',
      AlwaysOpen: true,
      Customerimage:null,
      Duration: '0',
      FinalCheckout:false,
      warningText: '',
      warningModal: false,
      ModalHelp: false,
       CancelledModal:false,
        CancelledBy:'',
        RiderCancel:[],
        CancelledReason:'',
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
    this.setState({Customerimage:image.assets[0].base64})
                 })
   }
   showDatePickerend = () => {
    this.setState({isDatePickerVisibleend: true})
      };
    
       hideDatePickerend = () => {
        this.setState({isDatePickerVisibleend: false})
      };
    
       handleConfirmend = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({Dateend: date, newDateend: moment(date).unix()})
        this.hideDatePickerend();
      };

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true})
      };
    
       hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
      };
    
       handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({startDate: date, newstartDate: moment(date).unix()})
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

 async componentDidMount() {
  this.StartImageRotationFunction()
    //this.setState({loading: true})
  const getData= firestore().collection('charges').doc(this.props.route.params.orders.adminID);
    const doc = await getData.get();
    if (!doc.exists) {
  console.log('No such document!');
} else {
  console.log('Document data:', doc.data());
  this.setState({
          Telephone_Help : doc.data().Telephone_Help,
          email_help: doc.data().email_help,
          fb_Help: doc.data().fb_Help,
          mobile_help: doc.data().mobile_help,
          
       })}
       firestore().collection('orders').where('OrderId', '==', this.props.route.params.orders.OrderId).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
    
          this.setState({
      
            datas: doc.data(),
            CancelledReason: doc.data().CancelledReason,
      isCancelled: doc.data().isCancelled,
      CancelledBy: doc.data().CancelledBy == undefined? '':doc.data().CancelledBy,
         
         });
         if(doc.data().OrderStatus == 'For Cancel'){
          this.setState({CancelledModal: true})
        }
    
        })
      })
    this._bootstrapAsync();

  }

  CancelOrder(){

    Alert.alert(
        'Confirmation',
        'are you sure to cancel this transaction?',
        [
          { text: 'cancel', onPress: () => null},
         
          { text: 'OK', onPress: () => {
            
            firestore().collection('stores').doc(this.state.datas.RentStoreId).update({
              Transactionprocessing: firestore.FieldValue.increment(-1),
              TransactionCancelled: firestore.FieldValue.increment(1),
          })
          
            const ref = firestore().collection('orders').doc(this.state.datas.OrderId);
            ref.update({ 
              OrderStatus : "Cancelled",
      rider_id:"",
      DeliveredBy : "",
              })
              this.setState({CancelledModal:false})
            this.props.navigation.goBack();
          }}
        ],
        { cancelable: false }
      );
    return;
    
 
}


PendingOrder(){

  Alert.alert(
      'Confirmation',
      'are you sure to move this transaction to pending?',
      [
        { text: 'cancel', onPress: () => null},
       
        { text: 'OK', onPress: () => {
          firestore().collection('stores').doc(this.state.datas.RentStoreId).update({
            Transactionprocessing: firestore.FieldValue.increment(-1),
            TransactionPending: firestore.FieldValue.increment(1),
        })
        
          const ref = firestore().collection('orders').doc(this.state.datas.OrderId);
          ref.update({ 
            OrderStatus : "Pending",
            })
            this.setState({CancelledModal:false})
          this.props.navigation.goBack();
        }}
      ],
      { cancelable: false }
    );
  return;
  

}

  
 componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    this.subscribe && this.subscribe();
    this.billinglistener && this.billinglistener();
    this.paymentslistener && this.paymentslistener();
    this.paymentsmethodlistener && this.paymentsmethodlistener();
    this.ordercounters && this.ordercounters();
    this._bootstrapAsync();
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
  this.billinglistener = this.billingRef.collection('users').where('userId','==', userId).onSnapshot(this.onCollectionUpdateBilling);      
 // this.paymentslistener = this.paymentsRef.collection('payment_options').onSnapshot(this.onCPaymentOptionUpdate);   
 // this.paymentsmethodlistener = this.paymentMethodRef.collection('payment_methods').onSnapshot(this.onCPaymentMethodUpdate);  
  this.ordercounters = this.ordercounters.collection('orderCounter').onSnapshot(this.OrderCounter); 

  
  this.setState({ 'uid': userId })
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


    //total = this.calculateLaborCharge() + this.calculatePickupCharge() + this.state.deliveryCharge;

    return total;
  }

  extraKMCharges(){
    
  
  
      //total = this.calculateLaborCharge() + this.calculatePickupCharge() + this.state.deliveryCharge;
  
      return 0;
    
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
            billing_city: item.city,
            billing_street: item.address,
            billing_postal: item.postal,
            USERlat: item.lat,
            USERlong: item.long,
            flat: item.lat,
            flong: item.long,
            loading: false,
          })
          //this.checkbarangay(item.barangay);


          const {slatitude, slongitude, } = this.state;
       
      
  
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
  this.setState({
    billing_name: item.name,
    billing_phone: item.phone,
    billing_province: item.province,
    billing_city: item.city,
    billing_street: item.address,
    billing_postal: item.postal,
    billing_barangay: item.barangay,

    visibleAddressModal: false,
   
     loading: false,
  })
  //this.checkbarangay(item.barangay);
  
  const {slatitude, slongitude, } = this.state;
  
}
changeAddressto(item){
    this.setState({
      billing_nameTo: item.name,
      billing_phoneTo: item.phone,
      billing_provinceTo: item.province,
      billing_cityTo: item.city,
      billing_streetTo: item.address,
      billing_postalTo: item.postal,
      billing_barangayTo: item.barangay,
      flatTo: item.lat,
      flongTo: item.long,
      visibleAddressModalTo: false,
      loading: false,
    })
    //this.checkbarangay(item.barangay);
    
    const {flat, flong, } = this.state;
   
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

FinalCheckouts (){

let in_check_extension =  moment(this.state.newstartDate*1000).format('YYYY-MM-D hh:mm:ss')
let out_check_extension = moment(this.state.newDateend*1000).format('YYYY-MM-D hh:mm:ss')

const a =moment(in_check_extension.toString());  
const b = moment(out_check_extension.toString());  
const diff = b.diff(a, 'hours');  
console.log('diff',diff)

const total = this.state.SelectedPricing=='Day'?(diff/24)*parseFloat(this.state.datas.DayPrice):this.state.SelectedPricing=='Hour'?diff*parseFloat(this.state.datas.HourPrice): this.state.SelectedPricing=='Weekly'?parseFloat(this.state.Duration)*parseFloat(this.state.datas.WeeklyPrice):parseFloat(this.state.Duration)*parseFloat(this.state.datas.MonthlyPrice);

    if(this.state.SelectedPricing == undefined){
this.setState({warningText: 'Choose Rate', warningModal: true})
return;
    }
    if(this.state.passenger == '0' || this.state.passenger == ''){
        this.setState({warningText: 'Enter Number of People', warningModal: true})
        return;
            }
            if(this.state.startDate == undefined){
                this.setState({warningText: 'Enter Start Date of REntal', warningModal: true})
                return;
                    }
            
                    if(this.state.SelectedPricing == 'Day' ||this.state.SelectedPricing == 'Hour'  ){
                        if(this.state.Dateend== undefined){
                            this.setState({warningText: 'Enter End Date of REntal', warningModal: true})
                            return;
                        }
                    }
                    this.setState({numberofhours: diff, FinalCheckout: true, total: total})
}
 footer= () => {
    return(
    <View>
      <Button block  style={{alignSelf:'center', backgroundColor:'salmon'}}  onPress={()=>this.navigateAddress() }>
            <Text style={{color: 'white'}}>Add Address</Text>
      </Button>
    </View>
    )
  }

ReasonOfCancel(){
  if(this.props.route.params.orders.OrderStatus != 'Pending' ){
    const update_StoreTransaction = firestore().collection('stores').doc(this.props.route.params.orders.RentStoreId);
    update_StoreTransaction.update({ 
      userTransactionCancelled: firestore.FieldValue.increment(1),
      TransactionCancelled: firestore.FieldValue.increment(1),
      Transactionprocessing: this.props.route.params.orders.OrderStatus == 'Processing'? firestore.FieldValue.increment(-1): firestore.FieldValue.increment(0),
      TransactionPending: this.props.route.params.orders.OrderStatus == 'Pending'? firestore.FieldValue.increment(-1): firestore.FieldValue.increment(0),
    })
  }
    const ref = firestore().collection('orders').doc(this.props.route.params.orders.OrderId);
    ref.update({ 
        OrderStatus : "Cancelled",
        rider_id:"",
        DeliveredBy : "",
        RiderCancel: firestore.FieldValue.arrayUnion({RiderId: '', RiderName: 'User', TimeCancelled: moment().unix(), CancelledReason: 'Cancelled By User'})
    })
    this.props.navigation.goBack();
}
StartImageRotationFunction(){
  this.Rotatevalue.setValue(0);
  Animated.timing(this.Rotatevalue,{
    toValue:1,
    duration:3000,
    useNativeDriver: true, // Add this line
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
   

let StatDayPrice = this.state.datas.StatDayPrice == true?'Day':null;
let StatHourPrice = this.state.datas.StatHourPrice == true?'Hour':null;
let StatWeeklyPrice = this.state.datas.StatWeeklyPrice == true?'Weekly':null;
let StatMonthlyPrice = this.state.datas.StatMonthlyPrice == true?'Monthly':null;
    let DropdownSelect =[StatHourPrice,StatDayPrice,StatWeeklyPrice,StatMonthlyPrice ];
    let pricetoPay = this.state.SelectedPricing =='Hour'?this.state.datas.HourPrice:this.state.SelectedPricing =='Day'?this.state.datas.DayPrice:this.state.SelectedPricing =='Weekly'?this.state.datas.WeeklyPrice:this.state.datas.MonthlyPrice;
console.log('cLat: ', this.state.cLat);

let out = this.state.SelectedPricing =='Weekly'?moment(this.state.startDate).add(7*parseInt(this.state.Duration), 'days').unix(): this.state.SelectedPricing =='Monthly'?moment(this.state.startDate).add(30*parseInt(this.state.Duration), 'days').unix():moment(this.state.Dateend).unix();
console.log('out: ', out);
    return(
        <Root>
          <Container style={{backgroundColor: '#CCCCCC'}}>   
          <Header androidStatusBarColor="#2c3e50" style={{display:'none'}} style={{backgroundColor: '#183c57'}}>
          <Left style={{flex:1}}>
          <Button transparent onPress={()=> this.props.navigation.goBack()}>
                 <MaterialIcons name="arrow-back" size={25} color="white" />
                </Button> 
          </Left>
          <Body style={{flex: 3}}>
            <Title style={{color:'white'}}>{this.state.datas.name}</Title>
          </Body>
         <Right style={{flex:1}}>
          <Button transparent onPress={()=> this.setState({ModalHelp: true})}>
                 <MaterialIcons name="help-outline" size={25} color="white" />
                </Button> 
                {this.props.route.params.orders.OrderStatus == 'Pending'?
                <Button transparent onPress={()=> Alert.alert('Are you Sure to Cancel?', 'You cannot undo this process',[
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.ReasonOfCancel()}
      ])}>
                 <MaterialIcons name="cancel" size={25} color="white" />
                </Button> 
                :null
                }
          </Right>
        </Header>
          <Loader loading={this.state.loading} trans={trans}/>     
     
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
 width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/1.6,}}>
      
  <MapboxGL.MapView
      zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        style={{ position: 'absolute',flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}
        attributionEnabled={false}
        logoEnabled={false}
    
  >
 
 <MapboxGL.Camera 
  centerCoordinate={[this.props.route.params.orders.flong,this.props.route.params.orders.flat]} 
  zoomLevel={15}
  followUserMode={'normal'}
            followUserLocation
  />

<MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true}  />
            <MapboxGL.PointAnnotation coordinate={[this.props.route.params.orders.flong,this.props.route.params.orders.flat]} />
  </MapboxGL.MapView>




   {/* <MapView
      provider={PROVIDER_GOOGLE}
      zoomEnabled={true}
        showsUserLocation={true}
        scrollEnabled={true}
                pitchEnabled={true}
        style={{ position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}
          region={{
            latitude: this.state.cLong, 
            longitude: this.state.cLat,
             latitudeDelta: 0.09,
              longitudeDelta: 0.009,
          }}
          >
            
              
          <MapView.Marker
             coordinate={{latitude: this.state.cLong, longitude: this.state.cLat}}
             title={"Location"}
             description={'Location Here'}
             image={Rider_img}
          />
          </MapView>*/}
        </View>
         </View>
         <View>
               
         <Card style={{height: SCREEN_HEIGHT/2, borderTopLeftRadius: 50, borderTopRightRadius: 50, top: SCREEN_HEIGHT/16}}>
              <View style={{marginTop: 20, marginLeft: 20}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.datas.RentStoreName}</Text>
                </View>
              <Card style={{height: 60, width: 60, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 50, top: -35}}>
              <QRCode
      value={this.state.datas.refNo}
      size={50}
    />
                </Card>


                <View style={{marginTop: 10,marginLeft: 20, flexDirection: 'row'}}>
                <View style={{margin: 0, flexDirection: 'row',width: SCREEN_WIDTH/ 1.6}}>
                  <MaterialIcons name={'location-pin'} size={16}/>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>{this.state.datas.address} ({this.state.datas.DetailedAddress})</Text>
                </View>
              { <TouchableOpacity  style={{margin: 0, right: 20, flexDirection: 'row', position: 'absolute'}} onPress={()=>{this.props.route.params.orders.OrderStatus=='Cancelled'?this.setState({showCancelled: true}):null }}>
  <View style={{ flexDirection: 'row',}}>

               {this.state.datas.OrderStatus == 'Pending'? <MaterialCommunityIcons name={'calendar-clock'} size={16}/>:
                <MaterialCommunityIcons name={'calendar-check'} size={16}/>}
                <Text style={{fontSize: 14,color: 'gray'}}>{this.state.datas.OrderStatus}</Text>
                </View>
                </TouchableOpacity>}
                </View>
                <Card  style={{borderRadius: 20, top: 10,width: SCREEN_WIDTH-40,padding: 10,left: 20, backgroundColor: '#f7f8fa'}}>
                <TouchableOpacity onPress={()=> this.setState({VisibleAddInfo: true})} >
                    <Text style={{fontWeight: 'bold', fontSize: 10, marginBottom: 10}}>Room Details </Text>
                   <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <Foundation name={'dollar-bill'} size={20} style={{bottom: 3}} />
                              <Text style={{fontSize: 12}}> {this.state.datas.currency}{this.state.datas.SelectedPricing=='3Hour'?parseFloat(this.state.datas.HourPrice3).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):this.state.datas.SelectedPricing=='6Hour'?parseFloat(this.state.datas.HourPrice6).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):this.state.datas.SelectedPricing=='12Hour'?parseFloat(this.state.datas.HourPrice12).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):this.state.datas.SelectedPricing=='Weekly'?parseFloat(this.state.datas.WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):this.state.datas.SelectedPricing=='Monthly'?parseFloat(this.state.datas.MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):this.state.datas.SelectedPricing=='Hour'?parseFloat(this.state.datas.HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):parseFloat(this.state.datas.DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} /{this.state.datas.SelectedPricing}</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <Fontisto name={'hotel-alt'} size={18}/>
                              <Text style={{fontSize: 12}}> {this.state.datas.name}</Text>
                    </View>
                    </View>
                    </TouchableOpacity>

                </Card>

                <Card  style={{borderRadius: 20, top: 10,width: SCREEN_WIDTH-40,padding: 10,left: 20, backgroundColor: '#f7f8fa'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 10, marginBottom: 10}}>Guest Details </Text>
                   <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <Fontisto name={'person'} size={16} style={{bottom: 3}} />
                              <Text style={{fontSize: 12}}> {this.state.datas.isGuest == true?this.state.datas.AccountInfo.name:this.state.datas.guestName }</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <FontAwesome name={'calendar-check-o'} size={16}/>
                              <Text style={{fontSize: 12}}> {moment(this.state.datas.startDate * 1000).format('MMM D, YYYY hh:mm a')}</Text>
                    </View>
                    </View>


                    <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <Fontisto name={'persons'} size={16} style={{bottom: 3}} />
                              <Text style={{fontSize: 12}}> {this.state.datas.passenger }</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: (SCREEN_WIDTH-20)/2}}>
                    <MaterialCommunityIcons name={'calendar-range-outline'} size={18}/>
                              <Text style={{fontSize: 12}}> {this.state.datas.SelectedPricing =='Weekly'?moment(this.state.datas.startDate * 1000).add(7*parseInt(this.state.datas.Duration), 'days').format('MMM D, YYYY hh:mm a'): this.state.datas.SelectedPricing =='Monthly'?moment(this.state.datas.startDate*1000).add(30*parseInt(this.state.datas.Duration), 'days').format('MMM D, YYYY hh:mm a'):moment(this.state.datas.Dateend * 1000).format('MMM D, YYYY hh:mm a')}</Text>
                    </View>
                    </View>

                </Card>
               
              
                <Card  style={{borderRadius: 20, top: 10,width: SCREEN_WIDTH-40,padding: 10,left: 20, backgroundColor: '#f7f8fa'}}>
                   
                   <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row',alignItems: 'center', width: (SCREEN_WIDTH-20)/2}}>
                              <Text style={{fontSize: 14,textAlign: 'center'}}> Your Total </Text>
                    </View>
                    <View style={{flexDirection: 'column', width: (SCREEN_WIDTH-20)/2}}>
                              <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.datas.currency}{parseFloat(this.state.datas.total).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                              <Text style={{fontSize: 13, fontWeight: 'bold', marginBottom: 10}}>{this.state.datas.PaymentMethod}</Text>

                    </View>
                    </View>
                </Card>

                
            </Card> 
           
           
               
               </View>

                       <Modal
      isVisible={this.state.ModalHelp}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({ModalHelp: false})} transparent={true}>
     <Card style={{ backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',}}>
       
        <ScrollView>
       <View style={{justifyContent: 'center',alignItems: 'center'}}>
     <Text style={{ fontSize: 15, fontWeight: 'bold'}}>Contact Us On</Text>
            </View> 
      <Text style={{marginTop: 15, fontSize: 10}}>Facebook</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input value={this.state.fb_Help}/>
         </Item>


           <Text style={{marginTop: 15, fontSize: 10}}>Mobile Number</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input value={this.state.mobile_help}/>
         </Item>

         <Text style={{marginTop: 15, fontSize: 10}}>Telephone Number</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input value={this.state.Telephone_Help}/>
         </Item>
          

           <Text style={{marginTop: 15, fontSize: 10}}>Email</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.email_help}/>
         </Item>
     </ScrollView>   
  
    </Card>
    </Modal>
            <Modal
      isVisible={this.state.VisibleAddInfo}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({VisibleAddInfo: false})} transparent={true}>
     <Card style={{ backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',}}>
       
        <ScrollView>
       
     
             
         <FlatGrid
      itemDimension={120}
      data={this.state.datas.imageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      })}
      // staticDimension={300} 
      // fixed
      spacing={10}
      renderItem={({ item }) => (
          
              <Image style={{  width: 160, height: 160, resizeMode: 'contain',margin: 10}} source={{uri: item}} />
       
      )}
    />


           <Text style={{marginTop: 15, fontSize: 10}}>Note</Text>
                        <Item regular style={{marginTop: 7}}>
             <Input value={this.state.datas.note}/>
         </Item>
          

           <Text style={{marginTop: 15, fontSize: 10}}>Description</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.datas.description} placeholderTextColor="#687373" />
         </Item>
     </ScrollView>   
  
    </Card>
    </Modal>
    <Modal
              isVisible={this.state.warningModal}
              animationInTiming={500}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              animationOutTiming={500}
              useNativeDriver={true}
              onBackdropPress={() =>  this.setState({warningModal: false})} transparent={true}>
            <View style={styles.content}>
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold'}}>Error!</Text>
              </View>
            
              <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'black', fontWeight:'bold'}}>{this.state.warningText}</Text>
              </View>
            <Button block style={{ height: 30, backgroundColor: "salmon"}}
             onPress={()=> this.setState({warningModal: false})} >
              <Text style={{color: 'white'}}>Ok</Text>
              </Button>
            </View>
            </Modal>
            <Modal
      isVisible={this.state.showCancelled}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({showCancelled: false})} transparent={true}>
     <Card style={{ backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',}}>
       
        <ScrollView>
      <View style={{flexDirection: 'column'}}>
 <Text style={{fontWeight: 'bold', fontSize: 12}}>Cancelled Reason:  </Text>
    {this.props.route.params.orders.RiderCancel == undefined? null:this.props.route.params.orders.RiderCancel.map((items)=>
   <Text style={{fontSize: 12}}>{items.CancelledReason}</Text> )}
     </View>
     
     </ScrollView>   
  
    </Card>
    </Modal>


    <Modal
                  useNativeDriver={true}
                  isVisible={this.state.CancelledModal}
                  onSwipeComplete={this.close}
                  swipeDirection={['up', 'left', 'right', 'down']}
                  style={styles.view}
                 transparent={true}>
                <View style={[styles.content,{height: SCREEN_HEIGHT/3}]}> 
                   
                                             <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>Cancelled By {this.state.CancelledBy}</Text>
                                             <Text style={{textAlign: 'left', marginTop: 20}}>Reasons: {this.state.CancelledReason}</Text>
                                            
                                            
<View style={{flexDirection: 'row', justifyContent: 'center',}}>
                   <TouchableOpacity onPress={()=> this.PendingOrder()} style={{borderColor: '#396ba0', borderWidth: 1, borderRadius: 10, backgroundColor: '#396ba0', padding: 10, marginTop: 10,    justifyContent: 'center',
    alignSelf: 'center', width: SCREEN_WIDTH/3, marginRight: 10}}>
<Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 15}}>Pending</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=> this.CancelOrder()} style={{borderColor: '#396ba0', borderWidth: 1, borderRadius: 10, backgroundColor: '#396ba0', padding: 10, marginTop: 10,    justifyContent: 'center',
    alignSelf: 'center', width: SCREEN_WIDTH/3}}>
<Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 15}}>Cancel</Text>
</TouchableOpacity>
</View>
                </View>
                </Modal>



          </Container>
          </Root>
    );
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
