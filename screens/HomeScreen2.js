import React, { Component } from 'react';
import {Animated,TouchableWithoutFeedback, Dimensions, StyleSheet, FlatList, Image, TouchableOpacity,Text,View,ScrollView,PermissionsAndroid, Alert, Platform, ImageBackground} from 'react-native';
import { Container, Content, Button, Left, Right,  Card, CardItem, Header,Toast, Root,Item,Input } from 'native-base';
var {height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import firestore from '@react-native-firebase/firestore';
import CategoryBlock from '../components/CategoryBlock'
import Loader from '../components/Loader';
import CustomHeader from './Header';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoreCard from '../components/StoreCard';
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal';
import { RadioButton, Divider,Badge } from 'react-native-paper';
import SegmentedControlTab from "react-native-segmented-control-tab";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'
import Province  from './Province.json';
import HomeScreenRentals from './HomeScreenRentals';
import HomeScreenService from './HomeScreenService';
import CartBadge from '../components/CartBadge';
import auth from '@react-native-firebase/auth';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import Draggable from 'react-native-draggable';
import Icon from 'react-native-vector-icons/AntDesign';
import { FlatGrid } from 'react-native-super-grid';


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

const BannerWidth = Dimensions.get('window').width;




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
 

export default class HomeScreen2 extends Component {
  constructor(props){
    super(props)
    this.Rotatevalue = new Animated.Value(0);
    this.cityRef =  firestore();
    this.ref =  firestore().collection('carousel');
    this.catref =  firestore().collection('categories');
    this.catref = this.catref.orderBy("id", "asc")
    this.state = {
      product: [],
      loading: false,
      categories:[],
      dataBanner:[],
      dataCategories:[],
      dataFood:[],
      selectCatg:0,
      rewards: [],
      featured: [],
      dataSource: [],
      selectedCity: "All",
      visibleModal: false,
      City: '',
      country:'',
      cities: [],
      selectedFilter: 'Alphabetical-(A-Z)',
     selectedcategories:0,
      selectedIndex: 0,
      selectedIndexRentals: 0,
      carsAvailable: [],
      cLat: null,
      cLong: null,
      Prentals:[],
      Vrentals:[],
      selectedCityUser: '',
      typeOfRate: '',
      userId:'',
       fromPlace:'',
      x: { latitude: 8.952566677309449, longitude: 125.5309380090034 },
      modalSelectedCity: false,
      open: false,
      categoriesStores:['All'],
      UserLocationCountry:'',
      AvailableOn:[],
      currentLocation: '',
      newCity: [],
      SelectedAvailableOn:[],
      searchCountry:'',
      selectedCountry:'',
      CountryNow:[{labelRider: '', currency: '', currencyPabili:''}],
      asyncselectedCity:null,
      orders:0,
      transportSelected: 0,
      vInfos:{
        imageArray: [],
        name:'',
        address:'',
        DetailedAddress: '',
        description: '',
        ameneties: '',
        slatitude:'',
        slongitude:'',
      },
    }
    this.arrayholder = [];
    this.FetchProfile();
  }
  
  FetchProfile = async() => {
console.log('Displaying')
  }
  handleIndexChangeRentals = index => {
    this.setState({
      ...this.state,
      selectedIndexRentals: index
    });
  };
  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };
  handleIndexChangecategories = index => {
    this.setState({
      ...this.state,
      selectedcategories: index
    });
  };
  onCollectionUpdate = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      this.setState({
        product : doc.data().images,
        loading: false,
       
     });
    });
  }

  onCategoriesUpdate = (querySnapshot) => {
    const stores = [];
    querySnapshot.forEach((doc) => {
     stores.push ({
            datas : doc.data(),
            key : doc.id
            });
    });
    this.setState({
      categories : stores,
      loading: false    
   });
 
  }

  getData = async() =>{
    const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
         if(Platform.OS === 'android')
    {
    await request_device_location_runtime_permission();
    }
      Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    let str = res.data.features[0].place_name;
let arr = str.split(',');
const newarrLenghtCountry= arr.length-1
const UserLocationCountry = arr[newarrLenghtCountry]
             this.setState({
               UserLocationCity: UserLocationCountry=='Philippines'?'city':UserLocationCountry.trim()+'.city',
           })
           this.getAllCity()
       }).catch(err => {
                 Alert.alert('Error', 'Internet Connection is unstable')
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
      AvailableOn : AvailableOn })
                },
                error => {
                 //   console.log(error)
                }
            );
   
  firestore().collection('categories').where('order', '>=', 0).orderBy('order', 'asc').onSnapshot(
                querySnapshot => {
                    const categories = []
                    querySnapshot.forEach(doc => {
                     //   console.log('doc.data(): ',doc.data())
                        categories.push (doc.data().title)
                    });
                  //  console.log('categories: ', categories)
                    this.setState({
      categoriesStores : categories })
                },
                error => {
                 //   console.log(error)
                }
            );
     // this.getUserCity();
     
      this.unsubscribe = this.ref.where('city','==',this.state.selectedCityUser ==null? this.state.City: this.state.selectedCityUser).onSnapshot(this.onCollectionUpdate);
      this.subscribe = this.catref.onSnapshot(this.onCategoriesUpdate);
  }



 async  componentDidMount() {
     this.setState({loading: true})
     //const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
//console.log('asyncselectedCity: ', asyncselectedCity)
const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
this.setState({asyncselectedCity})

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

let arr = str.split(',');
const newarrLenghtCountry= arr.length-1
const UserLocationCountry = arr[newarrLenghtCountry]
console.log("UserLocationCountry ", UserLocationCountry)


             this.setState({
               UserLocationCountry: UserLocationCountry.trim(),
           })
           this.getAllCity()
       }).catch(err => {
                 Alert.alert('Error', 'Internet Connection is unstable')
       //   console.log('Region axios: ',err)
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
      AvailableOn : AvailableOn })
                },
                error => {
                 //   console.log(error)
                }
            );
   
  firestore().collection('categories').where('order', '>=', 0).orderBy('order', 'asc').onSnapshot(
                querySnapshot => {
                    const categories = []
                    querySnapshot.forEach(doc => {
                     //   console.log('doc.data(): ',doc.data())
                        categories.push (doc.data().title)
                    });
                  //  console.log('categories: ', categories)
                    this.setState({
      categoriesStores : categories })
                },
                error => {
                 //   console.log(error)
                }
            );
     // this.getUserCity();

      this.unsubscribe = this.ref.where('city','==', asyncselectedCity == null?
    this.state.selectedCityUser ==null? this.state.City: this.state.selectedCityUser:asyncselectedCity).onSnapshot(this.onCollectionUpdate);
      this.subscribe = this.catref.onSnapshot(this.onCategoriesUpdate);
      console.log('city show ',asyncselectedCity==null? this.state.selectedCityUser ==null? this.state.City: this.state.selectedCityUser:asyncselectedCity)
    }
   
    onPrentals = (querySnapshot) => {
      let Prentals =[]
      querySnapshot.forEach((doc) => {
        Prentals.push(doc.data())
      });
      this.setState({
        Prentals: Prentals.sort((a, b) => Number(b.arrange) - Number(a.arrange)),
     });
     }

    onVrentals = (querySnapshot) => {
      let Vrentals =[]
      querySnapshot.forEach((doc) => {
        Vrentals.push(doc.data())
      });
      this.setState({
        Vrentals: Vrentals.sort((a, b) => Number(b.arrange) - Number(a.arrange)),
     });
     }
    onCollectionProducts  = (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        //console.log('products: ', doc.data())
       products.push ({
         
              datas : doc.data(),
              key : doc.id
              });
      });
     // console.log('products: ', products)
        this.setState({loading: false,  carsAvailable: products})
     // this.arrayholder = products;
    }


    async getStores(db){
      
      const city = [];
      await db.get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
          city.push(doc.data());
          
        });
      }); 
      console.log('Stores: ',city )
      this.setState({
        dataSource: city.sort((a, b) => Number(b.arrange) - Number(a.arrange)),
        loading: false
      }) 
    }
    
  _bootstrapAsync =async(selected,item, typeOfRate, city) =>{
    console.log('Reading bootstrapasync')
    const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
    const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
    console.log('asyncselectedCountry:', asyncselectedCountry)
    console.log('asyncselectedCity:', asyncselectedCity)
      const NewCityItem =asyncselectedCity== null? item.trim():asyncselectedCity.trim();
      console.log('NewCityItem: ',NewCityItem.trim())
//console.log('cities: ', city)
//console.log('cities find: ',  city.find( (items) => items.label === NewCityItem))
      const NewValueofCityUser = city.find( (items) => items.label === NewCityItem);

console.log('NewValueofCityUser: ',NewValueofCityUser)
 console.log('typeOfRates: ',NewValueofCityUser.typeOfRate)
    this.setState({selectedCityUser: item, typeOfRate: NewValueofCityUser.typeOfRate})
    this.ref.where('city','==',NewCityItem).onSnapshot(this.onCollectionUpdate);

   const newUserLocationCountry = asyncselectedCountry == null? this.state.UserLocationCountry.trim() =='Philippines'?'city':this.state.UserLocationCountry.trim()+'.city':asyncselectedCountry.trim() =='Philippines'?'city': asyncselectedCountry+'.city';
   console.log('newUserLocationCountry: ',newUserLocationCountry)
   firestore().collection(newUserLocationCountry).doc(NewCityItem).collection('vehicles').where('succeed', '>',0).onSnapshot(this.onCollectionProducts);
    this.cityRef.collection('products').where('rentalType','==', 'Property').where('arrayofCity','array-contains-any',[NewCityItem]).onSnapshot(this.onPrentals)
    this.cityRef.collection('products').where('rentalType','==', 'Vehicle').where('arrayofCity','array-contains-any',[NewCityItem]).onSnapshot(this.onVrentals)
     
      firestore().collection('stores').where('arrayofCity','array-contains-any',[NewCityItem]).where('Account', '==', 'Food Delivery').where('wallet', '>', 0).onSnapshot(querySnapshot=>{
        const city = [];
            querySnapshot.docs.forEach(doc => {
            city.push(doc.data());
          });
       // console.log('Stores: ',city )
        this.setState({
          dataSource: city.sort((a, b) => Number(b.arrange) - Number(a.arrange)),
          loading: false
        }) 
      });
    
  }
   async getUserCity(){
     
      const userId= await AsyncStorage.getItem('uid');
      this.setState({userId: userId})
    //  console.log('userId: ', userId)
    //  this.subscribe = this.cityRef.collection('users').where('userId','==', userId).onSnapshot(this.onCityUpdate)
     
    }
  
async getCountryCity(PressedCountrycode){
    this.setState({loading: true})
    //  console.log('getCountryCity')
 // console.log('PressedCountrycode: ', PressedCountrycode)

 const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
      const city = [];
      const collect= asyncselectedCountry == null? PressedCountrycode =='Philippines'?'city':this.state.UserLocationCountry+'.city':asyncselectedCountry+'.city';
    //   console.log('collect: ', collect)
      //     console.log('UserLocationCountry: ', this.state.UserLocationCountry)
       //          console.log('selectedCountry: ', this.state.selectedCountry)
        firestore().collection(collect).where('country', '==', asyncselectedCountry == null? PressedCountrycode:asyncselectedCountry)
        .onSnapshot(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
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
  //       console.log('CountryNow: ', CountryNow)

//  console.log('getCountryCity city: ', city)
      this.setState({
        CountryNow:CountryNow.length < 1?[{labelRider: '', currency: '', currencyPabili:''}]: CountryNow,
        cities: city,
        loading:false,
      })  
     
}
  
    async getAllCity() {
  this.setState({loading: true})
      const city = [];
      const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
      const asyncselectedCountry= await AsyncStorage.getItem('asyncselectedCountry');
     // const asyncselectedCity= await AsyncStorage.getItem('asyncselectedCity');
      const collect= asyncselectedCountry == null? this.state.UserLocationCountry.trim() =='Philippines'?'city':this.state.UserLocationCountry.trim()+'.city':asyncselectedCountry.trim() =='Philippines'?'city':asyncselectedCountry+'.city';
      console.log('getAllCity collect: ', collect)
      //     console.log('UserLocationCountry: ', this.state.UserLocationCountry)
      //           console.log('selectedCountry: ', this.state.selectedCountry)
        firestore().collection(collect).where('country', '==', asyncselectedCountry == null? this.state.UserLocationCountry.trim():asyncselectedCountry.trim())
        .onSnapshot(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
          city.push(doc.data());
      //    console.log('collect data: ', doc.data())
        });
      }); 
      
         const CountryNow = this.state.AvailableOn.filter(items => {
        const itemData = items.label;
        const textData = asyncselectedCountry == null? this.state.UserLocationCountry:asyncselectedCountry;
       
        return itemData.indexOf(textData) > -1
      })
       console.log('city: ', city)
       console.log('CountryNow: ', CountryNow)
      this.setState({
        cities: city,
        CountryNow,
      })  
      
     
      Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
//console.log('coordsL ', coords)

 axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA`)
     .then(res => {
    const item = res.data.features[0];
 //   console.log('res: ', res.data.features[0]);
    let str = res.data.features[0].place_name;

let arr = str.split(',');
//console.log('arr: ', arr)
const newarrLenght= arr.length-3
const UserLocation = arr[newarrLenght]
//console.log("newarrLenght value", arr[newarrLenght])

const province = Province.ZipsCollection.find( (items) => items.zip === res.data.features[0].context[0].text);
const valprovince = province == undefined? arr[newarrLenght]:province.province;
//console.log('UserLocation: ', UserLocation)

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
         // console.log('Region axios: ',err)
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
  
  
    
    onCityUpdate = async(querySnapshot) => {
        const userId= await AsyncStorage.getItem('uid');
       // console.log('userId: ', userId)
let Address ='';

     querySnapshot.forEach((doc) => {
       Address =doc.data().Address.City,
      this.setState({
        City: doc.data().Address.City,
     });      
     });
     const addresspass= userId == null?this.state.cities[0].label: Address;
  //   console.log('addresspass: ', addresspass)
     this._bootstrapAsync(false,addresspass, null, this.state.cities);
    }
  

    openModal (){
      this.setState({   
          visibleModal: true,
      })
     }
    renderCategories() {
      let cat = [];
      //console.log('carousel : ', this.state.categories )
      for(var i=0; i<this.state.categories.length; i++) {
        cat.push(
          <CategoryBlock key={this.state.categories[i].datas.id} id={this.state.categories[i].datas.id} image={this.state.categories[i].datas.image} title={this.state.categories[i].datas.title} navigation={this.props.navigation} />
        );
      }
      return cat;
    }

    async getLocationNow (){
   /*   const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

      if (granted) {
        console.log( "You can use the ACCESS_FINE_LOCATION" )
      } 
      else {
        console.log( "ACCESS_FINE_LOCATION permission denied" )
      }
     GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
            timeout: 150000,
  })
  .then(location => {
      console.log('location: ', location)
     this.setState({   cLat: location.latitude,
      cLong: location.longitude})

  })
  .catch(ex => {
    const { code, message } = ex;
    console.warn(code, message);
    if (code === 'CANCELLED') {
        //Alert.alert('Location cancelled by user or by another request');
      //  GetLocation.openGpsSettings();
      //this.getLocationNow();
    }
    if (code === 'UNAVAILABLE') {
      //  Alert.alert('Location service is disabled or unavailable');
    }
    if (code === 'TIMEOUT') {
      //  Alert.alert('Location request timed out');
    }
    if (code === 'UNAUTHORIZED') {
     //   Alert.alert('Authorization denied');
    }
});*/
    }

    

    rowRenderer = (data) => {
      const { name, quantity, image, unit, vehicle, id,base, base_fare, succeed,ColorMotor, brand, store_name} = data;
     
      return (
        <Card transparent style={{flex: 1, justifyContent: "center", alignContent: "center"  }}>
    <CardItem style={{paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:1 ,width:SCREEN_WIDTH/2-5, backgroundColor: '#333333'}}>
    <TouchableOpacity style={{width:SCREEN_WIDTH/2-5, flex: 1}} onPress={()=>{this.state.userId == null?this.props.navigation.navigate('Login'): this.state.x.latitude == null? Alert.alert('Enable Location'):this.props.navigation.navigate('CheckoutTransport',{'datas': data, 'cLat': this.state.x.latitude, 'cLong': this.state.x.longitude, 'typeOfRate':this.state.typeOfRate, 'selectedCityUser': this.state.selectedCityUser, 'fromPlace': this.state.fromPlace,'UserLocationCountry': this.state.UserLocationCountry,'currency':this.state.CountryNow[0].currency, 'code':this.state.CountryNow[0].code} ) }}>
 
  <Swiper style={{ width: '100%',
    height: 150,
    shadowOffset: {
      width: 0,
      height: 3
    },
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3}} key={image.length} showsButtons={false} autoplay={true} autoplayTimeout={3}>
             {
               image.map((itembann,index)=>{
                 return(
                  itembann=="AddImage"?null:
             <Image style={styles.productPhoto} resizeMode="cover" source={{uri:itembann}} key={index} />
                 )
               })
             }
           </Swiper>
    <View style={{height:20,flexShrink: 1, marginBottom: 5}}>
      <Text  numberOfLines={1} style={[styles.categoriesStoreName,{color: 'white', fontWeight: 'normal'}]}>{vehicle}          ₱{base_fare}</Text>
    </View>  

  </TouchableOpacity>
  </CardItem>
  </Card>
      )
    }

     setOpen=(open)=> {
    this.setState({
      open
    });
  }
  
 
  rowRendererVrentals = (data) => {
    console.log('data: ', data)
    const { admin_control,name,DayPrice, HourPrice, MonthlyPrice,StatDayPrice,StatHourPrice,StatMonthlyPrice,StatWeeklyPrice,WeeklyPrice,MBrand, VModel, ColorMotor,imageArray, brand, store_name} = data;
    const newData = imageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      });
    return (
      <Card transparent style={{flex: 1, justifyContent: "center", alignContent: "center"  }}>
  <CardItem style={{paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:1 ,width:SCREEN_WIDTH/2-5}}>
  <TouchableOpacity style={{width:SCREEN_WIDTH/2-5, flex: 1}} onPress={()=>this.setState({vInfos: data, VisibleAddInfo: true,MonthlyPrice: data.MonthlyPrice.toString(),
    DayPrice: data.DayPrice.toString(),
    HourPrice: data.HourPrice.toString(),
    WeeklyPrice: data.WeeklyPrice.toString(),})}>

<FastImage style={styles.productPhoto} source={{ uri: newData[0], headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal, }} 
              resizeMode={FastImage.resizeMode.cover}
  >
  {!admin_control? <AntDesign name="hearto" size={21} color="salmon"  style={{ backgroundColor: "white", width: 32, marginLerightft:  10, height: 32, marginTop: 5,padding: 5, borderRadius: 5}} onPress={()=> this.activate(id)}/>:
          <AntDesign name="heart" size={21} color="salmon"  style={{ backgroundColor: "white", width: 32, marginLeft: 10, height: 32, marginTop: 5,padding: 5, borderRadius: 5}} onPress={()=> this.deactivate(id)}/>}

{!StatHourPrice?null:
<View style={{backgroundColor: "white", width: 70,height: 35, flexDirection: 'column',alignSelf: 'flex-end', position: 'absolute' }}>
<Text style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>{this.props.currency}{parseFloat(HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
<Text  style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>/Hour</Text>
</View>
}
    
    {!StatDayPrice?null:
    <View style={{backgroundColor: "white", width: 70,height: 35, flexDirection: 'column',alignSelf: 'flex-end', position: 'absolute' }}>
<Text style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>{this.props.currency}{parseFloat(DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
<Text  style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>/Day</Text>
</View>  }
 {!StatWeeklyPrice?null:
   <View style={{backgroundColor: "white", width: 70,height: 35, flexDirection: 'column',alignSelf: 'flex-end', position: 'absolute' }}>
<Text style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>{this.props.currency}{parseFloat(WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
<Text  style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>/Week</Text>
</View>
}
 {!StatMonthlyPrice?null:
   <View style={{backgroundColor: "white", width: 70,height: 35, flexDirection: 'column',alignSelf: 'flex-end', position: 'absolute' }}>
<Text style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>{this.props.currency}{parseFloat(MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
<Text  style={{fontStyle: "italic", borderRadius: 5,  fontSize: 10, paddingLeft: 5}}>/Month</Text>
</View>
}
         
         
  </FastImage>
           
  <View style={{height:20,flexShrink: 1}}>
    <Text  numberOfLines={1} style={styles.categoriesStoreName}>{MBrand} {VModel} </Text>
  </View>  
 <View style={{flexDirection: 'row'}}>
 <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Color : {ColorMotor}</Text>

 
 
</View>
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Type :{name}</Text>


</TouchableOpacity>
</CardItem>
</Card>
    )
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

//console.log('selectedCityUser Homescreen: ',this.state.selectedCityUser)
   //  console.log('UserLocationCountry typeOfRate: ', this.state.UserLocationCountry)
   //  console.log('CountryNow: ', this.state.CountryNow)

    return (
      <Container style={{backgroundColor: '#a3b6c9'}}>
        
           <Header androidStatusBarColor="#396ba0" style={{backgroundColor: '#396ba0', height: 150,}} elevated={true}>
       <ImageBackground source={require('../assets/homescreen.jpg')} resizeMode="cover" style={{height: 150, width: SCREEN_WIDTH}}>
     

          <Left style={{flex:3, width: '100%', flexDirection: 'row'}}>
    
      {  /*<Image style={{  width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: 'white', overflow: "hidden"}} source={require('../assets/logo.png')} />
        */ } 
         
          
          
          <View style={{flexDirection: 'column',width: '90%', marginLeft: 15, marginTop: 20,paddingLeft: 10}}>
            <View style={{flex:1, alignSelf: 'flex-end', position: 'absolute', right: 0,}}>
                      <CartBadge navigation={this.props.navigation} fromPlace={this.state.fromPlace} currency={this.state.CountryNow.length == 0?'':this.state.CountryNow.length == 0? '':this.state.CountryNow[0].currency}/>
          </View>
         {/* <Text style={{color: 'white', fontSize: 22}}>Booking Shares</Text>
          <Text style={{color: '#4bccac', fontSize: 15,width: '100%'}}>Shared Booking Portal</Text>*/}
           <View style={{width: SCREEN_WIDTH/2.5,marginTop: 10 }}>
             {/*console.log('Dropdown cities: ', this.state.cities)*/}
           {/*  <TouchableOpacity onPress={()=> this.setState({modalSelectedCity: true})}>
             <Text style={{ fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0dcf5',}}>{this.state.selectedCityUser}</Text>
                  </TouchableOpacity>*/}

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
          <TouchableOpacity onPress={()=> this.setState({ViewCountry: !this.state.ViewCountry})}>
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
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH, flexDirection: 'row'}} key={index} button  onPress={() => {this.getCountryCity(item.label);this.setState({selectedCountry: item.label,SelectedAvailableOn:[], searchCountry:'', ViewCountry: false})}}>
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
                    <CardItem  bordered style={{marginTop: 0, width: SCREEN_WIDTH,}} key={index} button  onPress={() => {this._bootstrapAsync(true, item.label, item.typeOfRate, this.state.cities);this.setState({modalSelectedCity: false,newCity:[], searchcity:''})}}>
                      <Text style={{fontSize: 17}}>{item.label} <Text style={{color: 'gray'}}>{this.state.currentLocation.trim() ==item.label? '(You are here)':null }</Text></Text>
                    </CardItem>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                />
{        /*          <DropDownPicker
         open={true}
        showArrowIcon={true}
                items={this.state.cities}
          searchable={true}
                defaultValue={this.state.country}
                placeholder={'Select City/Municipality'}
                containerStyle={{height: 46}}
                labelStyle={{
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0dcf5',
                  borderColor: '#396ba0',
              
              }}
              searchPlaceholder="Search City/Municipality..."
                style={{backgroundColor: '#396ba0',borderColor: '#396ba0',}}
                itemStyle={{
                    justifyContent: 'center'
                }}
             dropDownContainerStyle={{height: SCREEN_HEIGHT}}
                dropDownStyle={{backgroundColor: '#ffffff',}}
               
            />*/}


                    </Card>

                  }
                </View>
                </Modal>
       {/* <DropDownPicker
        onPress={(open) => console.log('was the picker open?')}
                items={this.state.cities}
          searchable={true}
                defaultValue={this.state.country}
                placeholder={this.state.selectedCityUser}
                containerStyle={{height: 46}}
                labelStyle={{
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#b0dcf5',
                  borderColor: '#396ba0',
              }}
              showArrow = {false}
                style={{backgroundColor: '#396ba0',borderColor: '#396ba0',}}
                itemStyle={{
                    justifyContent: 'center'
                }}
             
                dropDownStyle={{backgroundColor: '#ffffff',}}
                onChangeItem={item => this._bootstrapAsync(true, item.label, item.typeOfRate, this.state.cities)}
            />*/}
     {   /*    <TouchableOpacity onPress={()=> this.setState({modalSelectedCity: true})}>
         <Entypo name="location" size={23} color={"#f7f6d8"} style={{position: 'absolute', bottom: 0, marginBottom: 0, marginLeft: 0}}/>
                  </TouchableOpacity>
          */  }
            </View>
            
          </View>
          
          </Left>
          
       </ImageBackground>
         
        </Header>
        
{/// Map and pabili
}
          <View style={{backgroundColor:'#ee4e4e', height: 60,}}>
          <View style={{flex: 1,flexDirection:'row', width: 200, height: 60,}}>
              <MapboxGL.MapView 
              style={{ height: 60, width: SCREEN_WIDTH/2, marginLeft: -10}}
              attributionEnabled={false}
              logoEnabled={false}
           onPress = {()=> this.props.navigation.navigate("Login")} 
              >
<MapboxGL.Camera 
centerCoordinate={[this.state.x.longitude, this.state.x.latitude]} 
zoomLevel={11}
followUserMode={'normal'}
/>

         <MapboxGL.PointAnnotation coordinate={[this.state.x.longitude, this.state.x.latitude]} />
</MapboxGL.MapView>
<TouchableOpacity style={{justifyContent: "center", alignContent: "center", width: SCREEN_WIDTH/2.2, flexDirection: 'column',paddingTop:0, paddingLeft: 10}}
 onPress = {()=>this.props.navigation.navigate("Login")} 
>
<Text style={{ fontSize: 11,paddingLeft: 5, color: 'white', left: 80}}>Starts at </Text>
<Text style={{ fontSize: 20,paddingLeft: 5, color: 'white'}}>{ this.state.CountryNow.length == 0? '':this.state.CountryNow[0].labelRider}    {this.state.CountryNow.length == 0? '':this.state.CountryNow[0].currencyPabili} {this.state.CountryNow.length == 0? '':this.state.CountryNow[0].pabiliminim}</Text>

          </TouchableOpacity>
          </View>  
         </View>           
{/*<Header style={{backgroundColor:'#019fe8', height: 46}}>
          <View style={{flex: 1,flexDirection:'row', width: 200, height: 36, justifyContent: "center", alignItems: 'center',backgroundColor:'white', marginTop: 5,borderRadius: 30}}>
          <TouchableOpacity style={{alignItems:'center',justifyContent:'center', flexDirection:'row',  }} onPress = {()=>{this.state.selectedIndex == 1?this.props.navigation.navigate('SearchRentals',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate, }):this.state.selectedIndex == 3?this.props.navigation.navigate('SearchServices',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate, }):this.props.navigation.navigate('SearchAll',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate, })}} underlayColor = 'transparent'>
              <View style={{flex: 1}}>
                <Text style={{justifyContent: "center", alignSelf: "center"}}>Search</Text>
              </View>
          
                  <View style={{paddingRight: 10}}>
                  <Fontisto name="search" size={20} color={"#000000"}/>
    
                  </View>
              </TouchableOpacity>
          </View>
       
        </Header>*/}
         
        <View transparent style={{width: SCREEN_WIDTH-30, alignSelf: 'center',  borderRadius: 10, backgroundColor: '#a3b6c9', marginTop: 10, flexDirection: 'row'}}>
      
    { /*   <SegmentedControlTab
          values={["Stores","Rentals", "Transportation", "Services"]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
          borderRadius ={10}
          tabTextStyle={{ color: '#666666'}}
          tabsContainerStyle ={{borderRadius: 10, marginBottom: 10, width: '91%'}}
          tabStyle={{borderColor: '#a3b6c9'}}
          activeTabStyle={{backgroundColor: '#666666',}}
    />*/}
      {/*  <FlatList
         horizontal
data={[{label: "Stores", icon: 'MaterialIcons', iconName: 'storefront'},{label: "Rentals", icon: 'Ionicons', iconName: 'md-key-outline'},{label: "Transportation", icon: 'MaterialCommunityIcons', iconName: 'car-multiple'}, {label: "Services", icon: 'MaterialCommunityIcons', iconName: 'account-hard-hat'}]}
renderItem={({ item }) => 
(
  <TouchableOpacity style={{width: SCREEN_WIDTH/4.5}}>
        {item.icon == 'MaterialIcons'?  <MaterialIcons name={item.iconName} size={30} />:item.icon == 'Ionicons'?  <Ionicons name={item.iconName}size={30} />:<MaterialCommunityIcons name={item.iconName} size={30}/>}
    
    {  console.log('item item', item)}
    </TouchableOpacity>)
}
enableEmptySections={true}
/>*/}
<View style={{flexDirection: 'row'}}>
<TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: SCREEN_WIDTH/6,}} onPress={()=>this.setState({selectedIndex: 0})}>
         <MaterialIcons name={'storefront'} size={this.state.selectedIndex == 0? 30:30} color={this.state.selectedIndex == 0?'white':'#525252'} style={{alignSelf: 'center', backgroundColor: this.state.selectedIndex == 0?'#ee4e4e':'white',borderRadius: 15, padding: 5}}/>
    
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: SCREEN_WIDTH/6}} onPress={()=>this.setState({selectedIndex: 1})}>
       <Ionicons name={'md-key-outline'} size={this.state.selectedIndex == 1? 30:30} color={this.state.selectedIndex == 1?'white':'#525252'} style={{alignSelf: 'center', backgroundColor: this.state.selectedIndex == 1?'#1c9fef':'white',borderRadius: 15, padding: 5}}/>
    
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: SCREEN_WIDTH/6}} onPress={()=>this.setState({selectedIndex: 2})}>
<MaterialCommunityIcons name={'car-multiple'}  size={this.state.selectedIndex == 2? 30:30} color={this.state.selectedIndex == 2?'white':'#525252'} style={{alignSelf: 'center', backgroundColor: this.state.selectedIndex == 2?'#28ae07':'white',borderRadius: 15, padding: 5}}/>
    

    </TouchableOpacity>
    <TouchableOpacity style={{width: SCREEN_WIDTH/6}} onPress={()=>this.setState({selectedIndex: 3})}>
<MaterialCommunityIcons name={'account-hard-hat'}  size={this.state.selectedIndex == 3? 30:30} color={this.state.selectedIndex == 3?'white':'#525252'} style={{alignSelf: 'center', backgroundColor: this.state.selectedIndex == 3?'#f6a60d':'white',borderRadius: 15, padding: 5}}/>
    
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: SCREEN_WIDTH/6}} onPress={()=> this.props.navigation.navigate('Account')}>
<MaterialCommunityIcons name={'menu'}  size={this.state.selectedIndex == 4? 35:30} color={this.state.selectedIndex == 4?'#396ba0':'#525252'} style={{alignSelf: 'center', backgroundColor: 'white',borderRadius: 15, padding: 5}}/>
    
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24, width: (SCREEN_WIDTH)/6}} onPress = {()=>{this.state.selectedIndex == 1?this.props.navigation.navigate('SearchRentals',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate,'currency':this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency, 'fromPlace': this.state.fromPlace }):this.state.selectedIndex == 3?this.props.navigation.navigate('SearchServices',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate, 'currency':this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency, 'fromPlace':  this.state.fromPlace}):this.props.navigation.navigate('SearchAll',{'selectedCityUser':  this.state.selectedCityUser ==null? this.state.City:  this.state.selectedCityUser,'typeOfRate':this.state.typeOfRate, 'currency':this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency, 'fromPlace': this.state.fromPlace})}} underlayColor = 'transparent'>
        
        <Fontisto name="search" size={20} color={"#525252"} style={{alignSelf: 'flex-start', backgroundColor: 'white',borderRadius: 15, padding: 9}}/>
        </TouchableOpacity>
    </View>
         
         </View>
   {this.state.selectedIndex ==0 ?
   <View style={{flexDirection: 'row', marginLeft: 30}}>
       <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft:2, marginBottom: 2}}>Delivery</Text></View>
   :this.state.selectedIndex ==1 ?<View style={{flexDirection: 'row', marginLeft: 30, marginBottom: 2}}>
       <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft:2}}>Rentals</Text></View>
   :this.state.selectedIndex ==2 ?<View style={{flexDirection: 'row', marginLeft: 30}}>
       <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft:2}}>Transportation</Text></View>
   :<View style={{flexDirection: 'row', marginLeft: 30}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft:2}}>Services</Text></View>
  }

{this.state.selectedIndex == 2?
               <View style={{flexDirection: 'row',marginLeft: 30 }}>
               <TouchableOpacity style={{shadowColor: "#000",
               shadowOffset: {
                 width: 0,
                 height: 12,
               },
               shadowOpacity: 0.58,
               shadowRadius: 16.00,
               elevation: 24,width: (SCREEN_WIDTH-55)/2,backgroundColor: this.state.transportSelected ==0 ?'#dadada':'white',borderRadius: 15, padding: 5, flexDirection: 'row'}} onPress={()=>this.setState({transportSelected: 0})}>
                        <MaterialIcons name={'local-taxi'} size={15} color={'#28ae07'} />
                   <Text style={{color:'black', fontWeight: 'bold'}}> Hire a Car</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={{shadowColor: "#000",
               shadowOffset: {
                 width: 0,
                 height: 12,
               },
               shadowOpacity: 0.58,
               shadowRadius: 16.00,
               elevation: 24,width: (SCREEN_WIDTH-55)/2, backgroundColor:this.state.transportSelected ==1 ?'#dadada':'white',borderRadius: 15, padding: 5, flexDirection: 'row', marginLeft: 10, marginRight: 10}} onPress={()=>this.setState({transportSelected: 1})}>
                      <MaterialIcons name={'car-rental'} size={15} color={'#28ae07'}/>
                      <Text style={{color: 'black', fontWeight: 'bold'}}> Rent a car</Text>
                   </TouchableOpacity>
               
                   </View>
                   
                  :null}
        <Loader loading={this.state.loading} trans={trans} />
    {this.state.selectedIndex ==0 ? <View style={{flex: 1,}}>
  {/*    <SegmentedControlTab
          values={this.state.categoriesStores}
          selectedIndex={this.state.selectedcategories}
          onTabPress={this.handleIndexChangecategories}
tabsContainerStyle={{width: SCREEN_WIDTH-30,alignSelf: 'center',}}
                 tabTextStyle={{ color: '#666666'}}
            
          tabStyle={{borderColor: '#a3b6c9',}}
          activeTabStyle={{backgroundColor: '#666666',}}
  />*/}
        <View style={{flexDirection: 'row',marginLeft: 15 }}>
<TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: (SCREEN_WIDTH-50)/3,backgroundColor: this.state.selectedcategories ==0 ?'#f06767':'white',borderRadius: 15, padding: 5, flexDirection: 'row'}} onPress={()=>this.setState({selectedcategories: 0})}>
         <FontAwesome5 name={'hamburger'} size={15} color={this.state.selectedcategories ==0 ?'white':'#525252'} />
    <Text style={{color: this.state.selectedcategories ==0 ?'white':'#525252',}}> Fastfood</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: (SCREEN_WIDTH-50)/3, backgroundColor:this.state.selectedcategories ==1 ?'#f28080':'white',borderRadius: 15, padding: 5, flexDirection: 'row', marginLeft: 10, marginRight: 10}} onPress={()=>this.setState({selectedcategories: 1})}>
       <MaterialCommunityIcons name={'fruit-watermelon'} size={15} color={this.state.selectedcategories ==1 ?'white':'#525252'}/>
       <Text style={{color: this.state.selectedcategories ==1 ?'white':'#525252',}}> Produce etc.</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,
elevation: 24,width: (SCREEN_WIDTH-50)/3, backgroundColor:this.state.selectedcategories ==2 ?'#f06767':'white',borderRadius: 15, padding: 5, flexDirection: 'row'}} onPress={()=>this.setState({selectedcategories: 2})}>
<Fontisto name={'shopping-bag-1'}  size={17} color={this.state.selectedcategories ==2 ?'white':'#525252'} />
<Text style={{color: this.state.selectedcategories ==2 ?'white':'#525252',}}>  Merchandise</Text>

    </TouchableOpacity>
    </View>
      <FlatList
                  data={this.state.dataSource.filter(items => {
      const itemData = items.section;
      const textData = this.state.categoriesStores[this.state.selectedcategories];
     
      return itemData.indexOf(textData) > -1
    })}
                  renderItem={({ item }) => (
                    <Card transparent style={{borderRadius: 10,marginTop: 0, width: SCREEN_WIDTH-30, alignSelf: 'center'}}>
                        <StoreCard product={item} navigation={this.props.navigation} typeOfRate={this.state.typeOfRate} fromPlace={this.state.fromPlace} currency={this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency}/>
                    </Card>
                  )}
                  keyExtractor = { (item,index) => index.toString() }
                  refreshing={this.state.loading}
                  onRefresh={this.getData}
                />
     {/*    <TouchableOpacity style={{  left: 5, bottom: -20 }} onPress = {()=>{this.props.navigation.navigate('Pabili',{'typeOfRate':this.state.typeOfRate, 'selectedCityUser':  this.state.selectedCityUser, 'cLat': this.state.x.latitude, 'cLong':this.state.x.longitude, fromPlace: this.state.fromPlace})}} underlayColor = 'transparent'>
            <Image style={{  borderWidth: 2,left: 5, bottom: -20}} source={require('../assets/task.png')} />
            <View style={{marginTop: '18%', flexDirection: 'column', position: 'absolute', marginLeft: 45}}>
              <Text style={{color: 'white', fontSize: 15,fontWeight: 'bold' }}>Rider</Text>
              <Text style={{color: 'white', fontSize: 15,fontWeight: 'bold' }}>Task</Text>
              </View>
              <Text style={{color: 'white', fontSize: 15,fontWeight: 'bold',position: 'absolute', bottom:'31.5%', left:SCREEN_WIDTH/3.2 }}>Starts at 10</Text>
            </TouchableOpacity>*/ }
  { /* <View style={{width: SCREEN_WIDTH/2.8,left:10, orderRadius: 10, marginBottom: 10, backgroundColor: '#8ce881', borderRadius: 10,    shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 3.5, height: 110,}}>
            <View style={{width: SCREEN_WIDTH/3, height: 100,  borderRadius: 10, backgroundColor: '#8ce881', borderRadius: 10, shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 3.5}}>
          <View style={{flex: 1,flexDirection:'row', height: 36,  borderRadius: 10, justifyContent: "center", alignItems: 'center',backgroundColor: '#d9f3f4', marginTop: 5, shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 3.5}}>
          <TouchableOpacity style={{alignItems:'center',justifyContent:'center', flexDirection:'row',  }} onPress = {()=>{this.props.navigation.navigate('Pabili',{'typeOfRate':this.state.typeOfRate, 'selectedCityUser':  this.state.selectedCityUser, 'cLat': this.state.x.latitude, 'cLong':this.state.x.longitude, fromPlace: this.state.fromPlace})}} underlayColor = 'transparent'>
              <View style={{flex: 1, flexDirection: 'column',}}>
                <Text style={{marginLeft: 20, marginTop: 0, color: '#1b4a7c', fontSize: 20,}}>Rider Task</Text>
            <View style={{borderColor: 'black', borderWidth: 0.5, width: '90%',alignSelf: 'center', left: 5, marginTop: 10}} />
               <Text style={{marginLeft: 25, color: '#1b4a7c', fontSize: 12}}>Starts </Text>
               <Text style={{marginLeft: 25,  color: '#1b4a7c', fontSize: 20}} >at Php 9</Text>
              </View>
          
                  <View style={{paddingRight: 10}}>
                  
    
                  </View>
              </TouchableOpacity>
          </View>
         
        </View>
        </View>*/}
     </View>:
     this.state.selectedIndex == 1?<View style={{ flex: 1 }}><HomeScreenRentals navigation={this.props.navigation}  typeOfRate={this.state.typeOfRate} selectedCityUser={this.state.asyncselectedCity == null?this.state.selectedCityUser:this.state.asyncselectedCity} cLat={this.state.x.latitude} cLong={this.state.x.longitude} currency={this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency}/></View>:
     this.state.selectedIndex == 2?
     <View>
 
     { this.state.transportSelected == 0?    <FlatList
               data={this.state.carsAvailable}
               ItemSeparatorComponent={this.ListViewItemSeparator}
               renderItem={({ item }) => this.rowRenderer(item.datas)}
               enableEmptySections={true}
               style={{ marginTop: 0 , marginBottom: 315}}
               numColumns={2}
               columnWrapperStyle={{justifyContent:'space-between'}}
               keyExtractor={(item, index) => index.toString()}
               refreshing={this.state.loading}
                       onRefresh={this.getData}
               />
             :
             <FlatList
             key={'_'}
             data={this.state.Vrentals}
             ItemSeparatorComponent={this.ListViewItemSeparator}
             renderItem={({ item }) => this.rowRendererVrentals(item)}
             enableEmptySections={true}
             style={{ marginTop: 0 , marginBottom: 315}}
             numColumns={2}
             columnWrapperStyle={{justifyContent:'space-between'}}
             keyExtractor={(item, index) => index.toString()}
             refreshing={this.state.loading}
             onRefresh={this.getData}
             />
             
             }
               
               
               
               </View>:
<HomeScreenService navigation={this.props.navigation} selectedCityUser={this.state.asyncselectedCity == null?this.state.selectedCityUser:this.state.asyncselectedCity} typeOfRate={this.state.typeOfRate} currency={this.state.CountryNow.length == 0?'':this.state.CountryNow[0].currency}/>
    }

{/*this.state.orders > 0 ?<Draggable z={12} x={0} y={0} renderSize={56}  children={   <View>
        <Icon.Button name="profile" size={25} color={'white'} backgroundColor="none" style={{borderRadius: 50, backgroundColor:'#f06767' }} onPress={()=> this.props.navigation.navigate("Orders")} ></Icon.Button>
     
          <Badge style={{position: 'absolute', top: -3, right: 3, backgroundColor: '#ee4e4e'}}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {this.state.orders}
            </Text>
          </Badge>
        

    
      </View>
  } isCircle /> : null*/}

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
       
        <ScrollView>
        <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold'}}>Detailed Information</Text>
              </View>
        <Text>Photos</Text>
        <FlatGrid
      itemDimension={120}
      data={this.state.vInfos.imageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      })}
      // staticDimension={300} 
      // fixed
      spacing={10}
      renderItem={({ item }) => (
               <TouchableWithoutFeedback onPress={()=> this.setState({showURL: true, SelectedURL:item})}>
                <Image style={{  width: 160, height: 160, resizeMode: 'contain',margin: 10}} source={{uri: item}} />
</TouchableWithoutFeedback>
              
       
      )}
    />
           
         <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'bold'}}>Label: <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'normal'}}>{this.state.vInfos.rentalType == 'Equipment'?this.state.vInfos.name: this.state.vInfos.MBrand+' '+this.state.vInfos.VModel} </Text></Text>
         
         <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'bold'}}>Location: <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'normal'}}>{this.state.vInfos.address}</Text></Text>
        
        <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'bold'}}>Detailed Address: <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'normal'}}>{this.state.vInfos.DetailedAddress}</Text></Text>
         
         <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'bold'}}>Description: <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'normal'}}>{this.state.vInfos.description}</Text> </Text>
     
        
                      
         <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'bold'}}>Ameneties: <Text style={{marginTop: 15, fontSize: 14, fontWeight: 'normal'}}>{this.state.vInfos.ameneties}</Text></Text>
        

           </ScrollView>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => {this.setState({VisibleAddInfo: false}); this.state.selectedIndexRentals ==2 || this.state.selectedIndexRentals ==3?this.props.navigation.navigate('CheckoutScreenEquipment',{'datas': this.state.vInfos, 'typeOfRate':this.props.typeOfRate, 'cLat': this.state.vInfos.slatitude, 'cLong': this.state.vInfos.slongitude , 'currency':this.props.currency}):this.props.navigation.navigate('CheckoutScreenRentals',{'datas': this.state.vInfos, 'typeOfRate':this.props.typeOfRate, 'cLat': this.state.vInfos.slatitude, 'cLong': this.state.vInfos.slongitude, 'currency':this.props.currency })}}
      >
       <Text style={{color:'white'}}>Proceed</Text>
      </Button>
    </Card>
    </Modal>
   </Container>
    );
  }

}



const styles = StyleSheet.create({
  imageBanner: {
    height:width/2 -20,
    width:BannerWidth - 20,
    borderRadius:5,
  },
  divCategorie:{
    backgroundColor:'red',
    margin:5, alignItems:'center',
    borderRadius:5,
    padding:3
  },
  titleCatg:{
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    marginTop:10,
    fontStyle: 'italic'
  },
  imageFood:{
    width:((width/2)-20)-10,
    height:((width/2)-20)-30,
    backgroundColor:'transparent',
    position:'absolute',
    top:-45
  },
  divFood:{
    width:(width/2)-20,
    padding:10,
    borderRadius:10,
    marginTop:55,
    marginBottom:5,
    marginLeft:10,
    alignItems:'center',
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
    backgroundColor:'white',
  },
  
  categoriesPhoto: {
    width: '100%',
    height: 150,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3
  },
  productPhoto: {
    width: '100%',
    height: 150,
    shadowColor: 'blue',
    backgroundColor:'#cccccc',
    shadowOffset: {
      width: 0,
      height: 3
    },
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3
  },
  favorite: {
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    borderTopRightRadius: 20
  },
  subtitlSale: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic',
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 5,
    borderTopLeftRadius: 20
  },
  subtitleopen: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic',
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 5,
    borderTopLeftRadius: 20
  },
  subtitleclose: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic',
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    flex: 1,
    backgroundColor: 'tomato',
    padding: 5,
  },
  textoverlay: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic',
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 5,
    color: '#ffffff'
  },
  categoriesName: { 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#043D08',
    padding : 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  categoriesStoreName: { 
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 20,
   

  },
  categoriesAddress: {
    fontSize: 15,
    textAlign: 'center',
    color: '#043D08',
    paddingBottom : 5,
  },
  categoriesPrice: {
    fontSize: 15,
    paddingLeft: 20,
    fontWeight: "bold",
    color: 'tomato',
    padding : 1,
  
  },
  categoriesPriceSale: {
    fontSize: 10,
    color: '#043D08',
    padding : 1,
    textDecorationLine: 'line-through',
  
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  },
  text: {
    width: Dimensions.get('window').width / 2 - 10,
    height: 200,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 15,
    fontWeight: '900',
    fontWeight: 'bold',
    textShadowColor: 'black', 
        textShadowOffset: { width: -1, height: 0 },
        textShadowRadius: 10,
  },
  categoriesItemContainer:{
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin : 5,
    backgroundColor: '#ffffb2'
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 180,
    padding: 8,
    margin: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    position: "absolute"
  },
  btnIcon: {
    height: 17,
    width: 17
  },
  carouselContainer: {
    minHeight: 100
  },
  carousel: {},

  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 250
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    height: 250
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 200
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    color: '#2cd18a'
  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    margin: 15
  },
  infoRecipeName: {
    fontSize: 20,
    margin: 10,
    color: 'black',
    textAlign: 'center'
  }
});

const style = StyleSheet.create({
  container: {
    flex: 1
  },

  headerContainer: {
    marginTop: 5
  },
  headerText: {
    color:'black'
  },
  tabItemContainer: {
    backgroundColor: "#cf6bab"
  },
  content: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
});