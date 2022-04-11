import React, { Component } from "react";
import {StyleSheet, FlatList, ScrollView,Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, Alert} from 'react-native';
import { Container, Header, Item,Input,Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button,Toast,List,ListItem, Title } from "native-base";
import StepIndicator from 'react-native-step-indicator'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import CustomHeader from './Header';
import MapView, {  Polyline,  PROVIDER_GOOGLE,  } from 'react-native-maps';

import axios  from 'axios';
import Rider_img from '../assets/rider.png';
import customer_img from '../assets/customer.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal';
import { Rating, AirbnbRating } from 'react-native-ratings';
import moment from "moment";
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken('sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA');

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}




export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    const orders = this.props.route.params.orders;
    const cartItems = [];
    const cart = cartItems.concat(orders.Stores)
    this.state = {
      orders:orders,
      user: null,
      email: "",
      password: "",
      formValid: true,
      error: "",
      loading: false,
      adminname: orders.AdminName,
      DeliveredBy: orders.DeliveredBy.Name,
      dataSource: orders.Products,
      labor:'',
      pickup:'',
      delivery: orders.delivery_charge,
      subtotal: orders.subtotal,
      total:'',
      extra: orders.extraKmCharge,
      status: '',
      products: [],
      OrderStatus: orders.OrderStatus,
    currentPosition:0,
      paymentmethod: orders.PaymentMethod,
    discount: orders.discount,
    isCancelled: orders.isCancelled,
    id : orders.OrderId,
    startingLocation: {
            latitude: orders.RLat == undefined? orders.ULat: orders.RLat,
            longitude: orders.RLong== undefined? orders.ULong:orders.RLong,
        },
        finishLocation: {
            latitude: orders.ULat,
            longitude: orders.ULong,
          },
          showMap:false,
          ModalHelp: false,
          rating: 0,
        ratingModal: false,
       };
   

  }

getCurretData(){
  firestore().collection('orders').where('OrderId', '==', this.props.route.params.orders.OrderId).onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {

      this.setState({
          rating:doc.data().rating == undefined?5:doc.data().rating,
      ratingModal: doc.data().OrderStatus=='Delivered' &&doc.data().rating == undefined? true:false,
        OrderStatus : doc.data().OrderStatus,
        RiderCancel: doc.data().RiderCancel,
        startingLocation: {
          latitude: doc.data().RLat == undefined? doc.data().ULat: doc.data().RLat,
          longitude: doc.data().RLong== undefined? doc.data().ULong:doc.data().RLong,
      },
      adminname: doc.data().AdminName,
    DeliveredBy: doc.data().DeliveredBy.Name,
    dataSource: doc.data().Products,
    delivery: doc.data().delivery_charge,
    subtotal: doc.data().subtotal,
    extra: doc.data().extraKmCharge,
    OrderStatus: doc.data().OrderStatus,
    paymentmethod: doc.data().PaymentMethod,
  discount: doc.data().discount,
  isCancelled: doc.data().isCancelled,
     
     });
     if(doc.data().OrderStatus == 'Pending'){
      this.setState({currentPosition: 0})
    }
  else if(doc.data().OrderStatus == 'Processing'|| doc.data().OrderStatus == 'On the way'){
    this.setState({currentPosition: 1, showMap: true});
 
  }
else if (doc.data().OrderStatus == 'Delivered'){
  this.setState({currentPosition: 2})
}
    })
  })
}

  async componentDidMount() {
  this.getCurretData();
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
    
}


 storeTotal (){
   const {dataSource} = this.state;
  let total =0;
  let addonTotal = 0;
   dataSource.forEach(item=>{

        if(item.sale_price){
          total += item.sale_price * item.qty
        }else{
          total += item.price * item.qty
        }
        
        if(item.choice){
          item.choice.forEach(addon => {
            addon.isChecked === 'unchecked' ? addonTotal += 0:
              addonTotal += addon.price * item.qty
          });
      }
      
   });
   return total + addonTotal;
 }


ReasonOfCancel(){
  if(this.props.route.params.orders.OrderStatus != 'Pending' ){
    const update_StoreTransaction = firestore().collection('stores').doc(this.props.route.params.orders.Products[0].storeId);
    update_StoreTransaction.update({ 
      userTransactionCancelled: firestore.FieldValue.increment(1),
      TransactionCancelled: firestore.FieldValue.increment(1),
      Transactionprocessing: firestore.FieldValue.increment(-1)
    })
    const update_RiderTransaction = firestore().collection('riders').doc(this.props.route.params.orders.DeliveredBy.id);
    update_RiderTransaction.update({ 
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
componentWillUnmount(){
  this.getCurretData()
}

ratingCompleted =(rating)=> {
  console.log("Rating is: " + rating)
  this.setState({rating: rating})
}

SubmitRating(){
    console.log('rating: ', this.state.rating);
    console.log('Driver Id: ', this.state.dataSource[0].storeId);
    this.setState({isLoading: true})
if(parseFloat(this.state.rating) == 0){
    Alert.alert(
            'Invalid Rating',
            'Rating should be 1-5'
            )
            return;
}
   firestore().collection('stores').doc(this.state.dataSource[0].storeId).update({
      star1: parseFloat(this.state.rating) ==1?firestore.FieldValue.increment(1):firestore.FieldValue.increment(0),
       star2: parseFloat(this.state.rating) ==2?firestore.FieldValue.increment(1):firestore.FieldValue.increment(0),
        star3: parseFloat(this.state.rating) ==3?firestore.FieldValue.increment(1):firestore.FieldValue.increment(0),
         star4: parseFloat(this.state.rating) ==4?firestore.FieldValue.increment(1):firestore.FieldValue.increment(0),
          star5: parseFloat(this.state.rating) ==5?firestore.FieldValue.increment(1):firestore.FieldValue.increment(0),
           NumberofDeliveries: firestore.FieldValue.increment(1),
       }).then((docRef) => {  
             const ref = firestore().collection('orders').doc(this.props.route.params.orders.OrderId);
    ref.update({ 
       rating: parseFloat(this.state.rating),
           }).then((docRef) => {  

           
            this.setState({isLoading: false}),
                        Alert.alert(
            'Rating Successfully',
            'Thank you for feedback',
            [{text: 'OK', onPress: () =>  this.setState({ ratingModal: false,})}]
        )

           })
           
        }).catch((err)=>{
            console.log('err: ', err);
            this.setState({isLoading: false}),Alert.alert(
            'Rating Failed',
            err
            )})

}





  render() {
    const {orders}=this.state;
    return (
      <Container>
        <Header androidStatusBarColor="#2c3e50" style={{backgroundColor: '#183c57'}}>
          <Left style={{flex:1}}>
          <Button transparent onPress={()=> this.props.navigation.goBack()}>
                 <MaterialIcons name="arrow-back" size={25} color="white" />
                </Button> 
          </Left>
          <Left style={{flex: 3}}>
            <Title style={{color:'white'}}></Title>
          </Left>
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
        
<Modal
                  useNativeDriver={true}
                  isVisible={this.state.ratingModal}
                  onSwipeComplete={this.close}
                  swipeDirection={['up', 'left', 'right', 'down']}
                  style={styles.view}
                 transparent={true}>
                <View style={[styles.content,{height: SCREEN_HEIGHT/3}]}> 
                   
                                             <Text style={{textAlign: 'center'}}>Store Rating</Text>
                            <Rating
            showRating={false}
            onFinishRating={this.ratingCompleted}
            startingValue={5}
            style={{ paddingVertical: 10}}
            imageSize={20}
            />

                   <TouchableOpacity onPress={()=> this.SubmitRating()} style={{borderColor: '#396ba0', borderWidth: 1, borderRadius: 10, backgroundColor: '#396ba0', padding: 10, marginTop: 10,    justifyContent: 'center',
    alignSelf: 'center', width: SCREEN_WIDTH/2}}>
<Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 15}}>SUBMIT</Text>
</TouchableOpacity>

                </View>
                </Modal>
             {console.log('orders.OrderStatus: ',orders.OrderStatus)}
        <ScrollView style={{ backgroundColor: "white" }}>
        {orders.OrderStatus=='Processed' || orders.OrderStatus=='Processing' || orders.OrderStatus == 'Pending'? 
          
          <Card>
                <Body >
                <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}>
                        <Text style={{color:'#33c37d',fontSize: 16, fontWeight:'bold'}}>Thank You!</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text> Transaction # {orders.OrderNo}</Text>
                    </View>   
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                      <Text> ({moment(orders.OrderDetails.Timestamp).format('MMM D, Y')}) {orders.OrderDetails.Time}</Text>
                    </View> 
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text style={{ fontSize: 15, fontWeight: 'bold'}}> {this.state.dataSource[0].store_name}</Text>
                    </View>
                  </Body>              
                   
                    </Card>
          
          :
          <Card>
                <Body >
                <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}>
                        <Text style={{color:'#33c37d',fontSize: 16, fontWeight:'bold'}}>Thank You!</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text> Transaction # {orders.OrderNo}</Text>
                    </View>   
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                      <Text> ({moment(orders.OrderDetails.Timestamp).format('MMM D, Y')}) {orders.OrderDetails.Time}</Text>
                    </View> 
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text style={{ fontSize: 15, fontWeight: 'bold'}}> {this.state.dataSource[0].store_name}</Text>
                    </View>
                  </Body>   
   
                   
                    </Card>}
                    { orders.OrderStatus=='Processed' || orders.OrderStatus=='Processing' ||orders.OrderStatus == 'Pending'?     <View style={styles.stepIndicator}>
          <StepIndicator  
            stepCount={3}   
            customStyles={secondIndicatorStyles}
            currentPosition={this.state.currentPosition}
            labels={[    
                'Queued',        
              'Accepted',
              'Completed'
            ]}
          />
               
        </View>:null}
                    {orders.OrderStatus=='Processed'|| orders.OrderStatus=='Processing' || orders.OrderStatus == 'Pending'? 
                     <Card>
                <Body >
               
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Delivered to:</Text><Text> {orders.Billing.name}</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text style={{ fontSize: 14}}>{orders.Billing.address}, {orders.Billing.barangay},{orders.Billing.province}</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <TouchableOpacity style={{flexDirection: 'row',paddingVertical: 5}} onPress={()=>this.onCall(orders.Billing.phone)}>
                            <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Contact #:</Text><Text> {orders.Billing.phone}</Text>
                        </TouchableOpacity>
                    </View>

                  </Body>

                       
                  
                  
                    {orders.RiderCancel < 0 || orders.RiderCancel== undefined?null:  <View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text numberOfLines={5} note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}>Cancelled By Riders:</Text>
                    </View>  
                  {orders.RiderCancel.map((info, index) =>  {return(<View style={{flexDirection: 'row',paddingLeft:30, paddingBottom:10}} key={index}> 
                        <Text>{info.RiderName}- {info.CancelledReason}</Text>
                    </View>)} )}
                    </View> }
                                                 
   
                   
                    </Card>
          
          :
          <Card>
                <Body >
                <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}>Assigned Rider :</Text><Text style={{fontSize: 14}}> {orders.DeliveredBy.Name}</Text>
                    </View> 
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Delivered to:</Text><Text> {orders.Billing.name}</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Text style={{ fontSize: 14}}>{orders.Billing.address}, {orders.Billing.barangay},{orders.Billing.province}</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <TouchableOpacity style={{flexDirection: 'row',paddingVertical: 5}} onPress={()=>this.onCall(orders.Billing.phone)}>
                            <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Contact #:</Text><Text> {orders.Billing.phone}</Text>
                        </TouchableOpacity>
                    </View>
                  </Body>
                  
                   
                    </Card>}
        {  orders.Mode == 'Pick-up' ? null: orders.OrderStatus == 'Pending'? null:
        
        
        orders.OrderStatus=='Processed'|| orders.OrderStatus=='Processing'?       <Card>
<CardItem> 
<Modal
      isVisible={this.state.showURL}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      style={{marginLeft: 0}}
      onBackdropPress={() => this.setState({showURL: false})} transparent={true}>
    <TouchableWithoutFeedback onPress={()=> this.setState({showURL: false})}>
     <Image style={{  width: SCREEN_WIDTH, height:SCREEN_HEIGHT, resizeMode: 'contain'}} source={{uri: this.state.SelectedURL}} />
   </TouchableWithoutFeedback>
    </Modal>
<Body style={{flexDirection: 'row'}}>
 <View style={{flexDirection: 'column', marginLeft: 10}}>
 <TouchableOpacity onPress={()=> this.setState({showURL: true, SelectedURL:orders.DeliveredBy.image})}>
   <Image style={{  width: 80, height: 80, borderRadius: 50, borderWidth: 5, borderColor: 'black', overflow: "hidden", }} source={{uri: orders.DeliveredBy.image}} />
</TouchableOpacity>

    </View>
  <View style={{flexDirection: 'column', marginLeft: 10, top: 0}}>
   <Text style={{fontSize: 15}}>{orders.DeliveredBy.Name} </Text>
  <Text style={{fontSize: 12}}>{orders.DeliveredBy.ColorMotor} {orders.DeliveredBy.MBrand} {orders.DeliveredBy.VModel}</Text>
  <Text style={{fontSize: 12}}>Plate Number :<Text style={{fontSize: 10}}>{orders.DeliveredBy.PlateNo} </Text></Text>
  {orders.DeliveredBy.rating > 4.5  ?   //5
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
       <MaterialIcons name="star" size={20} color={'yellow'} />
       <MaterialIcons name="star" size={20} color={'yellow'} />
        </View>
:orders.DeliveredBy.rating > 4.4 && orders.DeliveredBy.rating < 5? //4.5
 <View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
         <MaterialIcons name="star-half" size={20} color={'yellow'} />
        </View>
:orders.DeliveredBy.rating > 3.9 && orders.DeliveredBy.rating < 4.5?  //4
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 3.4 && orders.DeliveredBy.rating < 4 ?  //3.5
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
    <MaterialIcons name="star" size={20} color={'yellow'} />
       <MaterialIcons name="star-half" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 2.9 && orders.DeliveredBy.rating < 3.5?  //3
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star" size={20} color={'yellow'} />
        <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 2.4 && orders.DeliveredBy.rating < 3?  //2.5
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
           <MaterialIcons name="star-half" size={20} color={'yellow'} />
        <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 1.9 && orders.DeliveredBy.rating < 2.5?  //2
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
    <MaterialIcons name="star" size={20} color={'yellow'} />
      <MaterialIcons name="star-outline" size={20} color={'yellow'} />
      <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 1.4 && orders.DeliveredBy.rating < 2?  //1.5
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
       <MaterialIcons name="star-half" size={20} color={'yellow'} />
        <MaterialIcons name="star-outline" size={20} color={'yellow'} />
       <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :orders.DeliveredBy.rating > 0.9 && orders.DeliveredBy.rating < 1.5?  //1
<View  style={{flexDirection: 'row', }}>
    <MaterialIcons name="star" size={20} color={'yellow'}/>
  <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        <MaterialIcons name="star-outline" size={20} color={'yellow'} />
       <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
        :
<View  style={{flexDirection: 'row', }}>
<MaterialIcons name="star-outline" size={20} color={'yellow'} />
  <MaterialIcons name="star-outline" size={20} color={'yellow'} />
      <MaterialIcons name="star-outline" size={20} color={'yellow'} />
      <MaterialIcons name="star-outline" size={20} color={'yellow'} />
         <MaterialIcons name="star-outline" size={20} color={'yellow'} />
        </View>
}
       <Text style={{fontSize: 10,  textAlign: 'center'}}>{Math.round((orders.DeliveredBy.rating)*10)/10} </Text>
  </View>
</Body>



</CardItem>
</Card>:null}
        <View style={styles.container}>
       {!this.state.showMap?null: <View style={{height: 400}}>
          <View style={{position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
 }}>

   
<MapboxGL.MapView style={{ flex: 1, position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}} 

attributionEnabled={false}
logoEnabled={false}
  >
  <MapboxGL.Camera 
  centerCoordinate={[this.state.startingLocation.longitude, this.state.startingLocation.latitude]} 
  zoomLevel={15}
  followUserMode={'normal'}
  
  />
 

    
<MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true}  />



           <MapboxGL.PointAnnotation coordinate={[this.state.startingLocation.longitude, this.state.startingLocation.latitude]} />
   

          <MapboxGL.PointAnnotation coordinate={[this.state.finishLocation.longitude, this.state.finishLocation.latitude]} />
   

  </MapboxGL.MapView>

      {/*
    <MapView
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
            latitude: this.state.startingLocation.latitude, 
            longitude: this.state.startingLocation.longitude,
             latitudeDelta: 0.01,
              longitudeDelta: 0.1,
          }}
         
          >
             
          <MapView.Marker
             coordinate={{latitude: this.state.startingLocation.latitude, longitude: this.state.startingLocation.longitude}}
             title={"Store"}
             description={"Store Location"}
             image={Rider_img}
          />
              <MapView.Marker
             coordinate={{latitude: this.state.finishLocation.latitude, longitude: this.state.finishLocation.longitude}}
             title={"User"}
             description={"user Description"}
             image={customer_img}
          />
          
          </MapView>*/}
        </View>
         </View>}
  
      
       
         <Card>
        <FlatList
               data={this.state.dataSource}
               renderItem={({ item }) => (            
            <Card transparent>
            
              {item.sale_price ?  <CardItem>
                <Body style={{paddingLeft: 5}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {item.qty > 0 ? item.qty+" x " : null}
                    {item.name}
                  </Text>
                  <Text note style={{fontSize: 14}}>Brand: {item.brand}</Text>
                  <Text note style={{fontSize: 14}}>Note: {item.note}</Text>
                </Body>
                <Right style={{textAlign: 'right'}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{this.props.route.params.orders.currency}{Math.round((item.sale_price * item.qty)*10)/10}</Text>
                </Right>
                </CardItem>: 
                  <CardItem>
                <Body style={{paddingLeft: 5}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {item.qty > 0 ? item.qty+" x " : null}
                    {item.name}
                  </Text>
                  <Text note style={{fontSize: 14}}>Brand: {item.brand}</Text>
                  <Text note style={{fontSize: 14}}>Note: {item.note}</Text>
                </Body>
                <Right style={{textAlign: 'right'}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{this.props.route.params.orders.currency}{Math.round((item.price * item.qty)*10)/10}</Text>
                </Right>
              </CardItem>
                
                }
                 {item.choice  ? 
              [item.choice.map((drink, i) =>
                drink.isChecked === 'unchecked' ? null :
                <View key={i}>
                   <List style={{marginLeft: 20}}>
                   <ListItem>
                      <Left  style={{justifyContent: "flex-start"}}>
                          <Text style={{fontWeight:'bold', fontSize: 20}}>{'\u2022' + " "}</Text>
                      </Left>
                      <Body style={{justifyContent: "flex-start", flex: 5, flexDirection: "row"}}>
                          <Text style={{ fontSize: 12}}>{item.qty}x </Text>
                          <Text style={{ fontSize: 12}}>{drink.label}</Text>
                      </Body>
                      <Right style={{justifyContent: "flex-end", flex:1}}>
                          <Text style={{ fontSize: 12, fontWeight:'bold' }}>{this.props.route.params.orders.currency}{drink.price*item.qty}</Text>
                      </Right>                                                   
                   </ListItem>
               </List>
               </View>
              )] : null}
            </Card>
           )}
           
       />
        </Card>
      
         {  orders.Mode == 'Pick-up' ? null:<CardItem>
            <Body>
              <Text style={{fontSize: 15, color: 'gray'}}>Delivery Charge</Text>
            </Body>
            <Right>
              <Text style={{fontSize: 15}}>
              {this.props.route.params.orders.currency}{(Math.round(parseFloat(this.state.delivery)*10)/10+Math.round(parseFloat(this.state.extra)*10)/10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              </Text>
            </Right>
          </CardItem> }      
       {this.props.route.params.orders.USERAdd> 0? <CardItem>
            <Body>
              <Text style={{fontSize: 15, color: 'gray'}}>Reservation Charge</Text>
            </Body>
            <Right>
              <Text style={{fontSize: 15, color:'gray'}}>
             {parseFloat(this.props.route.params.orders.USERAdd).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              </Text>
            </Right>
          </CardItem>:null}
          <CardItem>
            <Body>
              <Text style={{fontSize: 15, color: 'tomato'}}>Discount</Text>
            </Body>
            <Right>
              <Text style={{fontSize: 15, color:'tomato'}}>
             - {this.props.route.params.orders.currency}{parseFloat(this.state.discount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              </Text>
            </Right>
          </CardItem>
          <View style={{borderTopColor: 'black', borderTopWidth: 2,borderStyle: 'dashed',  borderRadius: 1}}/>
          <CardItem>
            <Left>
               <Text style={{color:'orange'}}>{this.state.paymentmethod}<Text style={{color:'orange', fontWeight: 'bold'}}> TOTAL</Text></Text>
            </Left>
     

               { orders.Mode == 'Pick-up' ?        <Right>
              {console.log('extra: ', this.state.extra)}
              {console.log('storeTotal: ', this.storeTotal())}
              {console.log('delivery: ', this.state.delivery)}
              {this.props.route.params.orders.USERAdd> 0?
              
               <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.route.params.orders.currency}{(Math.round((this.storeTotal() + this.props.route.params.orders.USERAdd - this.state.discount)*10)/10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
          :
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.route.params.orders.currency}{(Math.round((this.storeTotal() - this.state.discount)*10)/10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
              }
               </Right>:
                      <Right>
                      {console.log('extra: ', this.state.extra)}
                      {console.log('storeTotal: ', this.storeTotal())}
                      {console.log('delivery: ', this.state.delivery)}
                      {this.props.route.params.orders.USERAdd> 0?
                      
                       <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.route.params.orders.currency}{(Math.round((this.state.extra + this.storeTotal() + this.props.route.params.orders.USERAdd +this.state.delivery - this.state.discount)*10)/10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                  :
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.route.params.orders.currency}{(Math.round((this.state.extra + this.storeTotal() +  this.state.delivery - this.state.discount)*10)/10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                      }
                       </Right>
               
               }
          </CardItem>
      
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
        </ScrollView>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
      stepIndicator: {
      marginVertical: 10
    },
    view: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    content: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    })