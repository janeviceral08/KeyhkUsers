import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, FlatList , ScrollView,TouchableOpacity, Alert,Platform, PermissionsAndroid} from 'react-native';
import {Card, CardItem, Thumbnail, Body, Left, Header, Right, Title,Input, Item, Button, Icon, Picker, Toast, Container, Root,Switch} from 'native-base';
import ConfettiCannon from 'react-native-confetti-cannon';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { ToggleButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MapView, {  Polyline,  PROVIDER_GOOGLE,  } from 'react-native-maps';
import axios  from 'axios';
import marker from '../assets/icons-marker.png';
import Province  from './Province.json';
import DropDownPicker from 'react-native-dropdown-picker';
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

export default class Address extends Component {
constructor(props) {
            super(props);
            this.cityRef =  firestore().collection('city');
            this.barangayRef =  firestore();
            this.ref =  firestore();
            this.subscribe= null;
            this.state = {
              email: '',
              name: '',
              username: '',
              password: '',
              rePassword: '',
              mobile:'',
              hasError: false,
              errorText: '',
              loading: false,
              barangay: [],
              address:'',
              postal:'',
              city:'',
              province:'',
              PickerValueHolder: '',
              barangayList: [],
              cityList:[],
              userTypes: [{userType: 'admin', userName: 'Admin User'}, {userType: 'employee', userName: 'Employee User'}, {userType: 'dev', userName: 'Developer User'}],
              selectedCity: '',
              selectedBarangay: '',
              address_list:[],
              Edit: false,
              isDefault: false,
              id: '',
              AvailableOn:[],
              visibleEditModal:false,
              x: {  latitude: 14.599512,
                longitude: 	120.984222,},
                region:[ 120.984222, 14.599512],
                userPoint:{latitude: null,
                  longitude: 	null,}, 
                    searchResult: [],
      LocationDone:false,
      Country: '',
            };
        }

  async component (){
    let userId= await AsyncStorage.getItem('uid');
 	/* Listen to realtime cart changes */
     this.unsubscribeCartItems =  firestore().collection('users').doc(userId).onSnapshot(snapshotCart => {
        if(snapshotCart.data()){
            this.setState({address_list: Object.values(snapshotCart.data().Shipping_Address)});
   
        } else {
            this.setState({address_list: [], loading: false});
        }
    });
  }

  async componentDidMount() {
   if(Platform.OS === 'android')
    {

    await request_device_location_runtime_permission();

    }

      Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
console.log('coordsL ', coords)
    this.setState({region:[coords.longitude,coords.latitude] })

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
                    this.setState({
      AvailableOn : AvailableOn })
                },
                error => {
                    console.log(error)
                }
            );
   this.component();
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

updateTextInput = (text, field) => {
  const state = this.state
  state[field] = text;
  this.setState(state);
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
 fetchCity =(city)=>{
   console.log('fetchCity: ',city.label);
   this.setState({ Country: city.label })
    const collect= city.label =='Philippines'?'city':city.label+'.city';
    this.subscribe = firestore().collection(collect).where('country', '==', city.label).onSnapshot(this.onCityUpdate)
  }
  fetchBarangay =(city)=>{
    this.setState({ selectedCity: city })
    this.subscribe = this.barangayRef.collection('barangay').where('city', '==', city).onSnapshot(this.onBarangayUpdate)
  }

 async onEditSave(){
    const userId= await AsyncStorage.getItem('uid');
    let addressRef =  firestore().collection('users');
    let ChangeDefaultRef =  firestore().collection('users');

  /*Change Default Address*/
  if(this.state.newDefaultValue != undefined && this.state.defaultValue != this.state.newDefaultValue){
  ChangeDefaultRef.doc(userId).get().then(snapshot => {
    let updatedCart = Object.values(snapshot.data().Shipping_Address); /* Clone it first */
    console.log('newDefaultValue: ', updatedCart)
    let itemIndex = updatedCart.findIndex(item => item.default == true ); /* Get the index of the item we want to delete */
    console.log('newDefaultValue itemIndex: ', itemIndex)
    /* Set item quantity */
    updatedCart[itemIndex]['default'] = this.state.defaultValue;
    
    /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
    ChangeDefaultRef.doc(userId).update({Shipping_Address:  updatedCart}).then(() => {
    
    });
  }); 
  /* Get current cart contents */
  addressRef.doc(userId).get().then(snapshot => {
    let updatedCart = Object.values(snapshot.data().Shipping_Address); /* Clone it first */
    console.log(updatedCart)
    let itemIndex = updatedCart.findIndex(item => this.state.id === item.id); /* Get the index of the item we want to delete */
    
    /* Set item quantity */
    updatedCart[itemIndex]['postal'] = this.state.postal;
    updatedCart[itemIndex]['address'] = this.state.address; 
    updatedCart[itemIndex]['city'] = this.state.selectedCity; 
    updatedCart[itemIndex]['province'] = this.state.province; 
    updatedCart[itemIndex]['phone'] = this.state.mobile; 
    updatedCart[itemIndex]['name'] = this.state.name;  
    updatedCart[itemIndex]['lat'] = this.state.region[1]  
    updatedCart[itemIndex]['long'] = this.state.region[0];  
    updatedCart[itemIndex]['default'] = this.state.newDefaultValue;
    
    
    /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
    addressRef.doc(userId).update({Shipping_Address:  updatedCart}).then(() => {
      this.setState({
        postal: '',
        address:'',
        selectedCity: '',
        selectedBarangay: '',
        province: '',
        mobile: '',
        name: '',
        id: '',
        visibleEditModal: false
      })
    
      Toast.show({
        text: "Address updated succesfuly.",
        position: "center",
        type: "success",
        textStyle: { textAlign: "center" },
      })
    });
  }); 
  return;
}
else{
    /* Get current cart contents */
    addressRef.doc(userId).get().then(snapshot => {
      let updatedCart = Object.values(snapshot.data().Shipping_Address); /* Clone it first */
      console.log(updatedCart)
      let itemIndex = updatedCart.findIndex(item => this.state.id === item.id); /* Get the index of the item we want to delete */
      
      /* Set item quantity */
      updatedCart[itemIndex]['postal'] = this.state.postal;
      updatedCart[itemIndex]['address'] = this.state.address; 
      updatedCart[itemIndex]['city'] = this.state.selectedCity; 
      updatedCart[itemIndex]['province'] = this.state.province; 
      updatedCart[itemIndex]['phone'] = this.state.mobile; 
      updatedCart[itemIndex]['name'] = this.state.name;  
      updatedCart[itemIndex]['lat'] = this.state.region[1]  
      updatedCart[itemIndex]['long'] = this.state.region[0];  
      
      
      /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
      addressRef.doc(userId).update({Shipping_Address:  updatedCart}).then(() => {
        this.setState({
          postal: '',
          address:'',
          selectedCity: '',
          selectedBarangay: '',
          province: '',
          mobile: '',
          name: '',
          id: '',
          visibleEditModal: false
        })
      
        Toast.show({
          text: "Address updated succesfuly.",
          position: "center",
          type: "success",
          textStyle: { textAlign: "center" },
        })
      });
    }); 
  }
  }

  editAddress(item){
    this.setState({
       region:[item.long, item.lat],
      postal: item.postal,
      address:item.address,
      selectedCity: item.city,
      province: item.province,
      mobile: item.phone,
      name: item.name,
      id: item.id,
      Country: item.Country,
      defaultValue: item.default,
      visibleEditModal: true,
      x: {  latitude: item.lat,
        longitude: item.long,}
    })
   // this.fetchBarangay(item.city)
  }

  ondeleteConfirm(item){
    Alert.alert(
      'Delete address?',
      'Are you sure you want to delete your billing address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.ondeleteAddress(item) }
      ],
      { cancelable: false }
    );
  }

  async ondeleteAddress(data){
    let userId= await AsyncStorage.getItem('uid');
    let addressRef =  firestore().collection('users');
				
    /* Get current cart contents */
    if(!data.default){
      addressRef.doc(userId).get().then(snapshot => {
        let updatedCart = Object.values(snapshot.data().Shipping_Address); /* Clone it first */
        let itemIndex = updatedCart.findIndex(item => data.id === item.id); /* Get the index of the item we want to delete */
        
        /* Remove item from the cloned cart state */
        updatedCart.splice(itemIndex, 1); 
  
        /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
        addressRef.doc(userId).update({Shipping_Address: updatedCart})
    })
    }else{
      Alert.alert(
        'Note',
        'Default address cannot be deleted.',
        [
          { text: 'OK', onPress: () => console.log('ok Pressed') }
        ],
        { cancelable: false }
      );
    }
    
}
  
 async onCreateAddress() {
   const {address_list} = this.state;
   if(this.state.region[0] === null){
    Toast.show({
      text: "Pin the exact location",
      position: "top",
      type: "danger",
      textStyle: { textAlign: "center" },
    })
   }
            let userId= await AsyncStorage.getItem('uid');
            const newDocumentID =  firestore().collection('users').doc().id;
            let newItem = {
              Country: this.state.Country,
                id: newDocumentID,
                name: this.state.name,
                phone: this.state.mobile,
                province: this.state.province,
                city: this.state.selectedCity,
                postal: this.state.postal,
                address: this.state.address,
                lat: this.state.region[1],
                long: this.state.region[0],
            };
            let updatedCart = Object.values(address_list); /* Clone it first */
            let ref =  firestore().collection('users').doc(userId);

            
            /* Push new cart item */
            updatedCart.push(newItem); 
            
            /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
            ref.update({
              Shipping_Address: Object.assign({}, updatedCart)
              }).then(() => {
                this.setState({visibleModal:false})
              Toast.show({
                  text: "Added new address",
                  position: "top",
                  type: "success",
                  textStyle: { textAlign: "center" },
                })
            });
    }


    myCurrentLocation = async()=>{
  if(Platform.OS === 'android')
    {

    await request_device_location_runtime_permission();

    }

      Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
console.log('coordsL ', coords)
    this.setState({region:[coords.longitude,coords.latitude] })

            },
            error => console.log(error),
            {
                enableHighAccuracy: false,
                timeout: 2000,
                maximumAge: 3600000
            }
        )
    }
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
    console.log('cityList', this.state.cityList)
    return (
      <Root>
      <Container style={styles.Container}>
                <Header androidStatusBarColor="#2c3e50" style={{backgroundColor: '#183c57'}}>
                <Left> 
                  <Button transparent onPress={()=> this.props.navigation.goBack()}>
                  <MaterialIcons name="arrow-back" size={25} color="white" />
                 </Button> 
                </Left>
                <Body style={{justifyContent: "center", alignContent: "center"}}>
                    <Title style={{color: 'white'}}>My Address</Title>
                </Body>
                <Right>
                  <TouchableOpacity onPress={()=> this.setState({visibleModal: true})}>
                      <Text style={{color:'white'}}>Add Address</Text>
                  </TouchableOpacity>
                </Right>
                </Header>
                <FlatList
                    data={this.state.address_list}
                    renderItem={({ item }) => 
                    <Card transparent>
                    <CardItem style={{borderRadius: 5, borderWidth: 0.1, marginHorizontal: 10}}>      
                                 
                      <Body style={{flex: 3, flexDirection: 'column'}}>
                        {item.default == true?  <Text style={{color: 'salmon', alignSelf: 'flex-end', position: 'absolute'}}>[Default]</Text>  
                        :null  
                      }
                     
    <Text style={{fontSize: 13}}>{item.name} | {item.phone} {"\n"}{item.address}, {item.city}, {item.province}, {item.postal}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Left style={{paddingLeft:20, paddingTop: 10}}>
                            <TouchableOpacity onPress={()=> this.editAddress(item)} style={{backgroundColor:'#019fe8', paddingHorizontal: 10, paddingVertical: 5}}>
                              <Text style={{color: 'white', fontSize: 15, fontStyle:'italic'}}>Edit</Text>
                            </TouchableOpacity>
                          </Left>
                          <Right style={{paddingRight:20, paddingTop: 10}}>
                            <TouchableOpacity onPress={()=> this.ondeleteConfirm(item)} style={{backgroundColor:'#019fe8', paddingHorizontal: 10, paddingVertical: 5}}>
                              <Text  style={{color: 'white', fontSize: 15, fontStyle:'italic'}}>Delete</Text>
                            </TouchableOpacity>
                          </Right>
                        </View>
                      </Body>                   
                    </CardItem>
                  </Card>  
                    }
                    keyExtractor={item => item.key}
                />
                  
            <Modal
            useNativeDriver={true}
            isVisible={this.state.visibleModal}
            onSwipeComplete={this.close}
            swipeDirection={['up', 'left', 'right', 'down']}
            style={styles.view}
            onBackdropPress={() => this.setState({visibleModal: false})} transparent={true}>
           <View style={styles.content}> 
              <View>
                <ScrollView keyboardShouldPersistTaps="always">
                   <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text style={{marginTop: 15, fontSize: 18}}>Create new address</Text>
                  <TouchableOpacity onPress={()=> this.setState({visibleModal: false,mobile:'',
                  location:'',
                                                                                      name:'',
                                                                                      address:'',
                                                                                      postal:'',
                                                                                      city:'',
                                                                                      province:'',
                                                                                      selectedCity: 'Select City/Municipality',
                                                                                      selectedBarangay: 'Select Barangay',})}>
                      <AntDesign name="closecircleo" size={20} color="#687373" style={{marginTop: 5,alignContent: 'flex-end'}}/>
                     
                   </TouchableOpacity>
                   </View>
                   <Item>
                    <MapboxGL.MapView style={{ height: 300, width: '100%'}}

onPress={e => {this.setState({ region:e.geometry.coordinates}) }}

      logoEnabled={false}
      attributionEnabled={false}
      pitchEnabled={false}
      zoomEnabled={true}
        scrollEnabled={true}
>
<MapboxGL.Camera 
centerCoordinate={this.state.region} 
zoomLevel={15}
/>

    
           
  

         <MapboxGL.PointAnnotation coordinate={this.state.region} />
      
        


</MapboxGL.MapView>
                {/* <MapView
                 testID="map"
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={true}
             style={{ height: 300, width: '100%'}}
    initialRegion={this.state.region}
    showsMyLocationButton={true}
          showsBuildings={true}
          maxZoomLevel={17.5}
          loadingEnabled={true}
     >
     
    </MapView>*/}
  {/* <View style={{ left: '50%',
  marginLeft: -16,
  marginTop: -125,
  position: 'absolute',
  top: '79.5%'}}>
        <Image style={{height: 36,
  width: 36,}} source={marker} />
      </View>*/}
            </Item>
            <Button onPress={this.myCurrentLocation} style={{ height: 30, backgroundColor:  "#019fe8", marginTop: 10, justifyContent: 'center', alignContent: 'center'}}>
              <Text style={[styles.textSign, { color:'#fff'}]}>Get your Location</Text></Button>
              
         <Item regular>
             <Input placeholder={'Type Address Here'}  value={this.state.location} onChangeText={(text) => this.getLocation(text, 'location')} placeholderTextColor="#687373" />
           
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
const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
            
const region=  {latitude: item.center[1], latitudeDelta: 0.0999998484542477, longitude: item.center[0], longitudeDelta: 0.11949475854635239}
console.log('region: ', region)
//this.onRegionChange(region)
console.log('region on press',item.geometry.coordinates);
             this.setState({
               region: item.geometry.coordinates,
               province: province.province,
               selectedCity:arr[2].trim(),
               selectedBarangay:item.context[1].text,
               Country: arr[arrcountry].trim(),
               postal:arr[3],
               address: arr[0]+', '+ arr[1],
               
               location:item.place_name, x: { latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0] }, LocationDone: true })}}>
           <Text>{item.place_name}</Text>
           {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      />:null}
                  <Text style={{marginTop: 15, fontSize: 10}}>Full Name</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.name} value={this.state.name}  onChangeText={(text) => this.updateTextInput(text, 'name')} placeholderTextColor="#687373" />
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>Phone Number</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.mobile} value={this.state.mobile} keyboardType='numeric'  onChangeText={(text) => this.updateTextInput(text, 'mobile')} placeholderTextColor="#687373" />
                  </Item>
                   <Text style={{marginTop: 15, fontSize: 10}}>Country</Text>
           
                    <DropDownPicker
         open={true}
        showArrowIcon={true}
                items={this.state.AvailableOn}
          searchable={true}
                defaultValue={this.state.Country}
                placeholder={'Select Country'}
                containerStyle={{height: 46}}
                labelStyle={{
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0dcf5',
                  borderColor: '#396ba0',
              
              }}
              searchPlaceholder="Search..."
                style={{backgroundColor: '#396ba0',borderColor: '#396ba0',}}
                itemStyle={{
                    justifyContent: 'center'
                }}
                dropDownStyle={{backgroundColor: '#ffffff',}}
                onChangeItem={item => this.fetchCity(item)}
               
            />    
                  <Text style={{marginTop: 15, fontSize: 10}}>Province/State</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.province} value={this.state.province}   onChangeText={(text) => this.updateTextInput(text, 'province')} placeholderTextColor="#687373" />
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>City</Text>
                  <Item>

                  
                  <Picker
                         selectedValue={this.state.selectedCity}
                         onValueChange={(itemValue, itemIndex) => 
                               this.fetchBarangay(itemValue)                        
                             }>     
                            <Picker.Item label = {this.state.selectedCity == ''? 'Select City':this.state.selectedCityy}  value={this.state.selectedCity == ''? 'Select City':this.state.selectedCity}  />
                                                        {this.state.cityList.map(user => (
                              <Picker.Item label={user.datas.label} value={user.datas.label} />
                            ))        }
                    </Picker>
                  </Item>
                     
                  <Text style={{marginTop: 15, fontSize: 10}}>Postal Address</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.postal} value={this.state.postal}   onChangeText={(text) => this.updateTextInput(text, 'postal')} placeholderTextColor="#687373" />
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>Detailed Address</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.address} value={this.state.address}   onChangeText={(text) => this.updateTextInput(text, 'address')} placeholderTextColor="#687373" />
                  </Item>
                  
                  <Button block style={{ height: 30, backgroundColor:  "#019fe8", marginTop: 10}}
                    onPress={() => this.onCreateAddress()}
                  >
                  <Text style={{color:'white'}}>SAVE</Text>
                  </Button>
                  </ScrollView>
              </View>
          </View>
          </Modal>
          <Modal
            useNativeDriver={true}
            isVisible={this.state.visibleEditModal}
            onSwipeComplete={this.close}
            swipeDirection={['up', 'left', 'right', 'down']}
            style={styles.view}
            onBackdropPress={() => this.setState({visibleEditModal: false})} transparent={true}>
           <View style={styles.content}> 
              <View>
                <ScrollView keyboardShouldPersistTaps="always">
                   <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text style={{marginTop: 15, fontSize: 18}}>Create new address</Text>
                  <TouchableOpacity onPress={()=> this.setState({visibleEditModal: false,mobile:'',location:'',
                                                                                      name:'',
                                                                                      address:'',
                                                                                      postal:'',
                                                                                      city:'',
                                                                                      province:'',
                                                                                      selectedCity: 'Select City/Municipality',
                                                                                      selectedBarangay: 'Select Barangay',})}>
                      <AntDesign name="closecircleo" size={20} color="#687373" style={{marginTop: 5,alignContent: 'flex-end'}}/>
                     
                   </TouchableOpacity>
                   </View>
                   <Item>
                          <MapboxGL.MapView style={{ height: 300, width: '100%'}}

onPress={e => {this.setState({ region:e.geometry.coordinates}) }}

      logoEnabled={false}
      attributionEnabled={false}
      pitchEnabled={false}
      zoomEnabled={true}
        scrollEnabled={true}
>
<MapboxGL.Camera 
centerCoordinate={this.state.region} 
zoomLevel={15}
/>

    
           
  

         <MapboxGL.PointAnnotation coordinate={this.state.region} />
      
        


</MapboxGL.MapView>
              { /*  <MapView
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={true}
             style={{ height: 300, width: '100%'}}
    initialRegion={this.state.region}
     >
     
    </MapView>
   <View style={{ left: '50%',
  marginLeft: -16,
  marginTop: -125,
  position: 'absolute',
  top: '79.5%'}}>
        <Image style={{height: 36,
  width: 36,}} source={marker} />
      </View>*/}
            </Item>
            <Button onPress={this.myCurrentLocation} style={{ height: 30, backgroundColor:  "#019fe8", marginTop: 10, justifyContent: 'center', alignContent: 'center'}}>
              <Text style={[styles.textSign, { color:'#fff'}]}>Get your Location</Text></Button>
              
         <Item regular>
             <Input placeholder={'Type Address Here'}  value={this.state.location} onChangeText={(text) => this.getLocation(text, 'location')} placeholderTextColor="#687373" />
           
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
const province = Province.ZipsCollection.find( (items) => items.zip === item.context[0].text)
             console.log('region on press',item.geometry.coordinates);
             
             this.setState({
               region:item.geometry.coordinates,
                Country: arr[arrcountry].trim(),
               province: province.province,
               selectedCity:arr[2].trim(),
               selectedBarangay:item.context[1].text,
               postal:arr[3],
               address: arr[0]+', '+ arr[1],
               location:item.place_name, x: { latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0] }, LocationDone: true })}}>
            <Text>{item.place_name}</Text>
           {console.log('coordinates:', item.geometry.coordinates)}</TouchableOpacity>
         </View>
        )}
        keyExtractor={item => item.id}
      />:null}
           
                  <Text style={{marginTop: 15, fontSize: 10}}>Full Name</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.name} value={this.state.name}  onChangeText={(text) => this.updateTextInput(text, 'name')} placeholderTextColor="#687373" />
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>Phone Number</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.mobile} value={this.state.mobile} keyboardType='numeric'  onChangeText={(text) => this.updateTextInput(text, 'mobile')} placeholderTextColor="#687373" />
                  </Item>
                   <Text style={{marginTop: 15, fontSize: 10}}>Country</Text>
           
                    <DropDownPicker
         open={true}
        showArrowIcon={true}
                items={this.state.AvailableOn}
          searchable={true}
                defaultValue={this.state.Country}
                placeholder={'Select Country'}
                containerStyle={{height: 46}}
                labelStyle={{
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0dcf5',
                  borderColor: '#396ba0',
              
              }}
              searchPlaceholder="Search..."
                style={{backgroundColor: '#396ba0',borderColor: '#396ba0',}}
                itemStyle={{
                    justifyContent: 'center'
                }}
                dropDownStyle={{backgroundColor: '#ffffff',}}
                onChangeItem={item => this.fetchCity(item)}
               
            />    
                  <Text style={{marginTop: 15, fontSize: 10}}>Province/State</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.province} value={this.state.province}   onChangeText={(text) => this.updateTextInput(text, 'province')} placeholderTextColor="#687373" />
                  </Item>

                  <Text style={{marginTop: 15, fontSize: 10}}>City</Text>
                  <Item>
                  <Picker
                         selectedValue={this.state.selectedCity}
                         onValueChange={(itemValue, itemIndex) => 
                               this.fetchBarangay(itemValue)                        
                             }>     
                            <Picker.Item label = {this.state.selectedCity}  value={this.state.selectedCity}  />
                                                        {this.state.cityList.map(user => (
                              <Picker.Item label={user.datas.label} value={user.datas.label} />
                            ))        }
                    </Picker>
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>Postal Address</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.postal} value={this.state.postal}   onChangeText={(text) => this.updateTextInput(text, 'postal')} placeholderTextColor="#687373" />
                  </Item>
                  <Text style={{marginTop: 15, fontSize: 10}}>Detailed Address</Text>
                  <Item regular style={{marginTop: 7}}>
                      <Input placeholder={this.state.address} value={this.state.address}   onChangeText={(text) => this.updateTextInput(text, 'address')} placeholderTextColor="#687373" />
                  </Item>
                  <Item style={{marginTop: 7}}>
                    {console.log('this.state.defaultValue: ', this.state.defaultValue)}
                  <Text style={{marginTop: 15, fontSize: 12}}>Set as Default Address</Text>
                  {this.state.defaultValue == true?  <Switch colorScheme="emerald"  size="lg" value={this.state.newDefaultValue == undefined? this.state.defaultValue: this.state.newDefaultValue} onValueChange={()=> this.setState({newDefaultValue: this.state.newDefaulValue == undefined? !this.state.defaultValue: !this.state.newDefaultValue})} style={{marginLeft: '45%'}}/>
                  :
                  <Switch colorScheme="emerald"  size="lg" style={{marginLeft: '45%'}} value={this.state.newDefaultValue == undefined? this.state.defaultValue: this.state.newDefaultValue} onValueChange={()=> this.setState({newDefaultValue: this.state.newDefaulValue == undefined? !this.state.defaultValue: !this.state.newDefaultValue})}/>
                  }
                 
                  </Item>
                  <Button block style={{ height: 30, backgroundColor:  "#019fe8", marginTop: 10}}
                    onPress={() => this.onEditSave()}
                  >
                  <Text style={{color:'white'}}>SAVE</Text>
                  </Button>
                  </ScrollView>
              </View>
          </View>
          </Modal>

      </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
  cardLayoutView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff9c4',
  }, 
  paragraphHeading: {
    margin: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  logo: {
    height: 130,
    width: 130,
    marginBottom: 20,
  },
});