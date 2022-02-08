import React, { Component } from 'react';
import {StyleSheet,View, ScrollView, Alert, Share,Dimensions, FlatList, PermissionsAndroid, BackHandler, TouchableOpacity, Image} from 'react-native'
import { Container, Header, Button, ListItem, Text, Icon, Left, Body, Right, Switch, CardItem, Item,Input  } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Zocial from 'react-native-vector-icons/Zocial'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import CustomHeader from './Header';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import axios from 'axios'
import Province  from './Province.json';
import Geolocation from 'react-native-geolocation-service';
var {height, width } = Dimensions.get('window');

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
    this.backCount=0;
    this.cityRef =  firestore();
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
      ShareLink: '',
      ShareLinkLabel: '',
      QRCodeURL:'',
      wallet:0,
       loggedIn: '',
       modalSelectedCity:false,
       UserLocationCountry:'',
      AvailableOn:[],
      currentLocation: '',
      newCity: [],
      SelectedAvailableOn:[],
      searchCountry:'',
      selectedCountry:'',
      CountryNow:[{labelRider: '', currency: '', currencyPabili:''}],
      ViewCountry:false,
      photo:'',
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
                        selectedCountry: data.selectedCountry,
                      });
                    });
                
                   
                },
                error => {
                 //   console.log(error)
                }
            );


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
 
      this.backHandler.remove();
    }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
      this._bootstrapAsyncs(); 
      firestore().collection('LinkApp').onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
    console.log('doc.data(): ', doc.data())
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
console.log('coordsL ', coords)

axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
  .then(res => {
 let str = res.data.features[0].place_name;

let arr = str.split(',');
const newarrLenghtCountry= arr.length-1
const UserLocationCountry = arr[newarrLenghtCountry]
console.log("UserLocationCountry ", UserLocationCountry)


          this.setState({
            UserLocationCountry: UserLocationCountry=='Philippines'?'city':UserLocationCountry.trim(),
        })
        this.getAllCity()
    }).catch(err => {
              Alert.alert('Error', 'Internet Connection is unstable')
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
  firestore().collection('AvailableOn').where('status', '==', true).orderBy('label', 'asc').onSnapshot(
             querySnapshot => {
                 const AvailableOn = []
                 querySnapshot.forEach(doc => {
                     
                     AvailableOn.push(doc.data())
                 });
                 console.log('AvailableOn ',AvailableOn)
                 this.setState({
   AvailableOn : AvailableOn })
             },
             error => {
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
      console.log('long press')
      Alert.alert('S.O.S is sent to all riders')
    }
    _bootstrapAsync =async(selected,item, typeOfRate, city) =>{
   //   const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
    console.log('selectedCity: ',this.state.selectedCity)
        const NewCityItem = item.trim();
        const NewValueofCityUser = city.find( (items) => items.label === NewCityItem);
      this.setState({selectedCityUser: this.state.selectedCity == undefined?item: this.state.selectedCity == 'none'? item:this.state.selectedCity, typeOfRate: NewValueofCityUser.typeOfRate})
     const newUserLocationCountry = this.state.UserLocationCountry =='Philippines'?'vehicles':this.state.UserLocationCountry+'.vehicles';
      firestore().collection(newUserLocationCountry).where('succeed', '>',0).onSnapshot(this.onCollectionProducts);

      
    }
    async getAllCity() {
      this.setState({loading: true})
          const city = [];
          const collect= this.state.UserLocationCountry.trim() =='Philippines'?'city':this.state.UserLocationCountry.toString()+'.city';
           console.log('collect: ', collect)
               console.log('UserLocationCountry: ', this.state.UserLocationCountry)
                     console.log('selectedCountry: ', this.state.selectedCountry)
          await  firestore().collection(collect).where('country', '==', this.state.UserLocationCountry.trim())
            .onSnapshot(querySnapshot => {
              querySnapshot.docs.forEach(doc => {
              city.push(doc.data());
              console.log('collect data: ', doc.data())
            });
          }); 
    
             const CountryNow = this.state.AvailableOn.filter(items => {
            const itemData = items.label;
            const textData = this.state.UserLocationCountry;
           
            return itemData.indexOf(textData) > -1
          })
             console.log('CountryNow: ', CountryNow)
      
          this.setState({
            cities: city,
            CountryNow,
          })  
          
         
          Geolocation.getCurrentPosition(
                info => {
                    const { coords } = info
    console.log('coordsL ', coords)
    
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
    
                       this._bootstrapAsync(true,UserLocation, null,city);
          
           }).catch(err => {
                     Alert.alert('Error', 'Internet Connection is unstable')
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

        async getCountryCity(PressedCountrycode){
          const userId =  auth().currentUser.uid;
          firestore().collection('users').doc(userId).update({  selectedCountry: PressedCountrycode.trim()})
          console.log('PressedCountrycode: ',PressedCountrycode)
          this.setState({loading: true})
            const city = [];
            const collect= PressedCountrycode =='Philippines'?'city':PressedCountrycode.trim()+'.city';
            await  firestore().collection(collect).where('country', '==', PressedCountrycode)
              .onSnapshot(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                  console.log('getCountryCity: ', doc.data().label)
                city.push(doc.data());
               
              });
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
              cities: city,
              loading:false,
            })  
           
      }

changeCity (item){
    const userId =  auth().currentUser.uid;
  firestore().collection('users').doc(userId).update({  selectedCity: this.state.currentLocation.trim() == item.label? 'none':item.label,})
  this._bootstrapAsync(true, item.label, item.typeOfRate, this.state.cities);
  this.setState({modalSelectedCity: false,newCity:[], searchcity:''})
}


  render() {
    const {uid}=this.state;
    return (
      <Container>
      <CustomHeader title="Account Settings" isHome={true} Cartoff={true} navigation={this.props.navigation}/>

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
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row'}} key={index} button  onPress={() => {this.getCountryCity(item.label);this.setState({selectedCountry: item.label,SelectedAvailableOn:[], searchCountry:'', ViewCountry: false, keyboardav: false});  }}>
                       <Image style={{  width: 70, height: 50,}} resizeMethod="scale" resizeMode="contain" source={{uri: item.flag}} />
                      <Text style={{fontSize: 17, paddingLeft: 20}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null }</Text></Text>
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
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH,}} key={index} button  onPress={() => {this.changeCity(item)}}>
                      <Text style={{fontSize: 17}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null }</Text></Text>
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
            subtitle={this.state.username}
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
          <ListItem icon onPress={()=>this.setState({modalSelectedCity: true})}>
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
          <ListItem icon onPress={()=> this.props.navigation.navigate("Orders")}>
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
        console.log('this.backCount: ',this.backCount);
        if (this.backCount == 5) {
            clearTimeout(this.backTimer)
           Alert.alert('Coming Soon', 'This feature is not yet available')
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
          <ListItem icon onPress={()=>this.setState({modalSelectedCity: true})}>
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

})