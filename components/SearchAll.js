import React, { Component } from 'react';
import {FlatList, TouchableOpacity, Dimensions, View, Alert, StatusBar, StyleSheet, ScrollView, TouchableHighlight, Image, Pressable} from 'react-native';
import { Col, Card, CardItem, Body, Button, Left, ListItem, List, Content, Thumbnail, Right, Text,Grid, Icon,  Container, Header,Item, Input, Toast, Root } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import FastImage from 'react-native-fast-image';
const SCREEN_WIDTH = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../screens/Header';
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign'
import styles from './styles'
import Modal from 'react-native-modal';
import { RadioButton, Divider, Checkbox } from 'react-native-paper';
import Loader from './Loader';
import { FlatGrid } from 'react-native-super-grid';
import {LayoutUtil} from './LayoutUtil';



export default class SearchAll extends Component {
    constructor(props) {
        super(props);
    console.log('params: ', this.props.route.params.selectedCityUser)
        this.ref =  firestore().collection('products');
        this.state = {
              dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: LayoutUtil.getLayoutProvider(0),
            City:this.props.route.params.selectedCityUser,
          loading: false,      
          data: [],      
          error: null,    
          items:[],
          searchText:'',
          store_name: '',
          token: [],
          cart: [],
          activeSlide: 0,
          selectedFruits: [],
          addonss:[],
          choice:[],
          productss: [],
          isVisibleAddons: false,
          name: '',
          price: 0,
          image: [],
          id: '',
          sale_price: 0,
          unit: '',
          brand: '',
          count: 1, 
          searchText: '',
                cLat: null,
      cLong: null,
      Prentals:[],
      Vrentals:[],
      MonthlyPrice: 0,
        DayPrice: 0,
        HourPrice: 0,
        WeeklyPrice: 0,
        VisibleAddInfoSErvice:false,
      VisibleAddInfo: false,
          VisibleAddInfoP:false,
      vInfo:{
        DetailedAddress: '',
        rentalType: '',
        MonthlyPrice: '',
        DayPrice: '',
        HourPrice: '',
        WeeklyPrice: '',
        StatDayPrice: false,
        StatHourPrice: false,
        StatWeeklyPrice: false,
        StatMonthlyPrice: false,
        ameneties: '',
        keywords: '',
      address: '',
        name: '',
        MotorCR: '',
        MotorOR: '',
        MBrand: '',
        ColorMotor: '',
        PlateNo: '',
        VModel:  '',
        brand:  '',
        description: '',
        imageArray:[],

         viewType: 1,
      limit: 50,
      lastVisible: null,
      refreshing: false,
      showMoreBtn: false,
      qty: 0,
      sale: false,
      selectedFilter: 'Alphabetical-(A-Z)',
      searchEnabled: false,
      showToast: false,
   
      }
        };
    
        this.arrayholder = [];
    }

    _incrementCount = () => {
      this.setState(prevState => ({ count: prevState.count + 1 }));
    }

  _decrementCount = () => {
      this.setState(prevState => ({ count: prevState.count - 1 }));
    }
    checkDrinkm(drink, object) {
      const {choice} = this.state;
      var i;
      for (i = 0; i < object.length; i++) {
        if (object[i].isChecked === 'checked') {
          
          object[i].isChecked = 'checked';
        }
      }
      drink.isChecked = "checked";

          let updatedCart = choice;
          let item =  updatedCart.find(item => drink.id === item.id);
          if(item){
              let itemIndex = updatedCart.findIndex(item => drink.id === item.id);
              updatedCart.splice(itemIndex, 1);
              choice.push(drink) 
          }else{
              choice.push(drink)
          }
      console.log(choice)
      this.setState({ refresh: true });
    }
    checkDrinkmunchecked(drink, object) {
      const {choice} = this.state;
      var i;
      for (i = 0; i < object.length; i++) {
        if (object[i].isChecked === 'unchecked') {
          
          object[i].isChecked = 'unchecked';
        }
      }
      drink.isChecked = "unchecked";

          let updatedCart = choice;
          let item =  updatedCart.find(item => drink.id === item.id);
          if(item){
              let itemIndex = updatedCart.findIndex(item => drink.id === item.id);
              updatedCart.splice(itemIndex, 1);
              choice.push(drink) 
          }else{
              choice.push(drink)
          }
      console.log(choice)
      this.setState({ refresh: true });
    }
  checkDrink(drink, object) {
      const {choice} = this.state;
      var i;
      for (i = 0; i < object.length; i++) {
        if (object[i].isChecked === 'checked') {
          
          object[i].isChecked = 'unchecked';
        }
      }
      drink.isChecked = "checked";

          let updatedCart = choice;
          let item =  updatedCart.find(item => drink.id === item.id);
          if(item){
              let itemIndex = updatedCart.findIndex(item => drink.id === item.id);
              updatedCart.splice(itemIndex, 1);
              choice.push(drink) 
          }else{
              choice.push(drink)
          }
      console.log(choice)
      this.setState({ refresh: true });
    }
  
    getAddonsTotal=()=>{
      const {choice, productss} = this.state;
      let  total = 0;
      productss.map((object, d) =>
      object.data.map((drink, i) =>{ 
          if(drink.isChecked === "checked"){
              total += drink.price
          }
      })
  )
  console.log(total)
  return total;
  }

  getAddonsDefault=()=>{
         const {choice,productss} = this.state;
        let item =[]
        productss.map((object, d) =>
            object.data.map((drink, i) =>{ 
                if(drink.isChecked === "checked"){
                    choice.push(drink)
                }
            })
        )
        for(var value of choice){
          if(item.indexOf(value) === -1){
              item.push(value);
          }
      }
        return item;
  }

  async addonsdeleteCart(item){
    const userId= auth().currentUser.uid;
    AsyncStorage.setItem('cluster', item.cluster);
     firestore().collection('cart').doc(userId).delete()  
    .catch(function(error) {
        console.log("Error deleting documents: ", error);
    });
    let name = item.name.concat(' Added to Cart');
    let newItem = {
              id: item.id,
              store_name: item.store_name,
              notification_token: this.state.token,
              slongitude: item.slongitude,
                slatitude: item.slatitude,
              total_addons: this.getAddonsTotal(),
              note: '',
              cluster: item.cluster,
              choice: this.getAddonsDefault(),
              qty: this.state.count,
              adminID: item.adminID,
            };
            let cartRef =  firestore().collection('cart');
            let updatedCart =[];
            /* Push new cart item */
            updatedCart.push(newItem); 
            cartRef.doc(userId).set(Object.assign({}, updatedCart))

            this.setState({
              isVisibleAddons: false,
              productss:[],
              count:1,
              choice:[]
          })
  }

    async addonsAddtoCart(item){
      const {cart} = this.state;
      const userId= auth().currentUser.uid;
      if(userId){
        let id = item.id;
       let cluster = item.cluster
      let cluster_is_existing =Object.keys(cart).length && Object.values(cart).find(item => cluster === item.cluster);
      if ( cluster_is_existing == 0 || cluster_is_existing){
      let newItem = {
            id: item.id,
            store_name: this.state.store_name,
            notification_token: this.state.token,
            slongitude: item.slongitude,
                slatitude: item.slatitude,
            total_addons: this.getAddonsTotal(),
            note: '',
            qty: 1,
            cluster: item.cluster,
            choice: this.getAddonsDefault(),
            qty: this.state.count,
            adminID: item.adminID,
        };
        let updatedCart = Object.values(cart); /* Clone it first */
        let cartRef =  firestore().collection('cart');
        
        /* Push new cart item */
        updatedCart.push(newItem); 
        
        /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
        cartRef.doc(userId).set(Object.assign({}, updatedCart)).then(() => {
        
        });
  
        this.setState({
          isVisibleAddons: false,
          productss:[],
          count:1,
          choice:[]
      })
    }else{
      Alert.alert(
        'Discard Changes?',
         'This product belongs to other store, adding this product will delete the items in your cart.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => this.addonsdeleteCart(item)}
        ],
        { cancelable: false }
      );
    }
    }
      else {
        this.setState({
          isVisibleAddons: false,
          productss:[],
          count:1,
          choice:[]
      })
        this.props.navigation.navigate('Auth');
      }
    }

    renderImage = ({ item }) => (
      <TouchableHighlight>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: item }} />
        </View>
      </TouchableHighlight>
    );

  async deleteCart(item) {
    const userId= auth().currentUser.uid;
    AsyncStorage.setItem('cluster', item.cluster);
     firestore().collection('cart').doc(userId).delete()  
    .catch(function(error) {
        console.log("Error deleting documents: ", error);
    });
    let name = item.name.concat(' Added to Cart');
    let newItem = {
                id: item.id,
                store_name: this.state.store_name,
                notification_token: this.state.token,
                slongitude: item.slongitude,
                slatitude: item.slatitude,
                note: '',
                qty: 1,
                adminID: item.adminID,
                cluster: item.cluster
            };
            let cartRef =  firestore().collection('cart');
            let updatedCart =[];
            /* Push new cart item */
            updatedCart.push(newItem); 
            cartRef.doc(userId).set(Object.assign({}, updatedCart))
    
 
}
 
 	async onAddToCart(item) {
     const {cart} = this.state;
		const userId= auth().currentUser.uid;
		if(userId){ 
      let id = item.id;
       let cluster = item.cluster

       
      let cluster_is_existing =Object.keys(cart).length && Object.values(cart).find(item => cluster === item.cluster);
      if ( cluster_is_existing == 0 || cluster_is_existing){
          
          let is_existing = Object.keys(cart).length && Object.values(cart).find(item => id === item.id); /* Check if item already exists in cart from state */
          if(!is_existing){
           
            let newItem = {
                id: item.id,
                store_name: this.state.store_name,
                notification_token: this.state.token,
                slongitude: item.slongitude,
                slatitude: item.slatitude,
                note: '',
                qty: 1,
                adminID: item.adminID,
                cluster: item.cluster
            };
            let updatedCart = Object.values(cart); /* Clone it first */
            let cartRef =  firestore().collection('cart');
            
            /* Push new cart item */
            updatedCart.push(newItem); 
            
            /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
            cartRef.doc(userId).set(Object.assign({}, updatedCart))
          }
      else{
        let product = Object.keys(cart).length && Object.values(cart).find(item => id === item.id); /* Check if item exists in cart from state */
		
            if(product){
              if(product.qty >= item.quantity){
                /* Do not allow save if user is trying to checkout more than what is available on stock */
                
              }
               else if (product.qty <= item.quantity){
                let cartRef =  firestore().collection('cart');
                
                /* Get current cart contents */
                cartRef.doc(userId).get().then(snapshot => {
                  let updatedCart = Object.values(snapshot.data()); /* Clone it first */
                  let itemIndex = updatedCart.findIndex(item => id === item.id); /* Get the index of the item we want to delete */
                  
                  /* Set item quantity */
                  updatedCart[itemIndex]['qty'] = updatedCart[itemIndex]['qty'] + 1; 
                  
                  /* Set updated cart in firebase, no need to use setState because we already have a realtime cart listener in the componentDidMount() */
                  cartRef.doc(userId).set(Object.assign({}, updatedCart))
                });
              }
            }
      }
		} else {
			Alert.alert(
        'Discard Changes?',
         'This product belongs to other store, adding this product will delete the items in your cart.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => this.deleteCart(item)}
        ],
        { cancelable: false }
      );
		}
	}
  else {
			this.props.navigation.navigate('Login');
		}
}

    onCollectionUpdate = (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
       products.push ({
              datas : doc.data(),
              key : doc.id
              });
      });
        this.setState({loading: false, data: products.filter(items => {
        const itemData = items.datas.ProductType;
        const textData = 'Transport';
        return itemData.indexOf(textData) == -1
      })})
     // this.arrayholder = products;
    }

  
   async componentDidMount() {
    this.setState({loading: true})
     const userId= auth().currentUser.uid;
     //firestore().collection('products').where('city', '==', this.state.City.trim()).where('admin_control', '==', true).where('status', '==', true).onSnapshot(this.onCollectionUpdate);
     this.loadProducts(false, true);

       if(userId){
				/* Listen to realtime cart changes */
				this.unsubscribeCartItems =  firestore().collection('cart').doc(userId).onSnapshot(snapshotCart => {
					if(snapshotCart.data()){
						this.setState({cart: snapshotCart.data()});
					} else {
						this.setState({cart: []});
					}
				});
			}
    }
 
     loadProducts(loadmore, fromComponent) {
    const self = this;
    var productQuery =  firestore().collection('products').where('rentalType', '==', 'Foods').where('admin_control', '==', true).where('status', '==', true).where('city', '==', this.state.City.trim());
    productQuery = this.state.searchText ===""?productQuery:productQuery.where('keywords', 'array-contains-any', [this.state.searchText]);
    
    if( this.state.searchEnabled ){
			/* If request is from a search (onChangeSearch();), we clear out the product list then load the new search results */
			/* We identify weather the trigger is from a search or a load more button click using "searchEnabled" state */
			this.setState({
				products: [],
				searchEnabled: false
			});
		}

    switch(this.state.selectedFilter) {
      case 'Price-Ascending':
				productQuery = productQuery.orderBy('price', 'asc');
        break;
      case 'Price-Descending':
        productQuery = productQuery.orderBy('price', 'desc');
         break;
			case 'Alphabetical-(A-Z)':
				productQuery = productQuery.orderBy('name', 'asc');
				break;
			case 'Alphabetical-(Z-A)':
				productQuery = productQuery.orderBy('name', 'desc');
				break;
		
			default: 
				productQuery = productQuery.orderBy('price', 'asc');
		}
		productQuery = productQuery.limit(50);
		/* If there's a last item set, we start the query after that item using startAfter() method */
		if( loadmore && this.state.lastVisible ){
			productQuery = productQuery.startAfter(this.state.lastVisible); 
		}
		
		this.unsubscribeProducts = productQuery.onSnapshot(snapshot => { /* The onSnapshot() method registers a continuous listener that triggers every time something has changed, use get() to only call it once (disable realtime) */
			let productChunk = [];
			
			snapshot.docChanges().forEach(function(change) {
				if (change.type === "added") {
					/* Add more items to the screen...   const itemData = items.ProductType;
        const textData = 'Transport';*/
          if(change.doc.data().ProductType != 'Transport'){
					productChunk.push({ ...change.doc.data(), pid: change.doc.id })}
				} else if (change.type === "modified") {
					/* If there is a change in realtime... */
					/* Apply the modification to the item directly without changing the current item index. */
					self.setState({
						products: self.state.products.map(el => (el.pid === change.doc.id ? {...change.doc.data(), pid: change.doc.id} : el))
					});
				} else if(change.type === "removed"){
					let updatedProductList = Object.values(self.state.products); /* Clone it first */
					let itemIndex = updatedProductList.findIndex(item => change.doc.id === item.pid); /* Get the index of the item we want to delete */
					
					/* Remove item from the cloned cart state */
					updatedProductList.splice(itemIndex, 1); 
					/* Update state to remove item from screen */
					self.setState({
						products: updatedProductList
					});
				}
			});
			console.log('productChunk.length :', productChunk.length )
      console.log('limit: ',this.state.limit );
			this.setState((prevState) => ({
                products: prevState.products && fromComponent ? [...prevState.products, ...productChunk]: productChunk,
                dataProvider: this.state.dataProvider.cloneWithRows(
                    prevState.products && fromComponent ? [...prevState.products, ...productChunk]: productChunk
                  ),
				loading: false,
				loadingBtn: false,
				lastVisible: snapshot.docs[snapshot.docs.length - 1], 
        showMoreBtn: productChunk.length < 50 ? false : true, 
        visibleModal: false
      }));
		});
  };
    componentWillUnMount(){
      this.unsubscribe() && this.unsubscribe
    }
    searchFilterFunction = async() => {    
        this.setState({loading: true})
        console.log('CIty: ', this.state.City)
         console.log('searchText: ', this.state.searchText)
        const userId=auth().currentUser.uid;
        firestore().collection('products').where('keywords', 'array-contains-any', [this.state.searchText]).where('admin_control', '==', true).where('city', '==', this.state.City.trim()).onSnapshot((querySnapshot) => {
            const products = [];
            console.log('working here');
               console.log('querySnapshot: ', querySnapshot)
            querySnapshot.forEach((doc) => {
              console.log('search: ', doc.data())
             products.push ({
                    datas : doc.data(),
                    key : doc.id
                    });
            });
            this.setState({ data: products.filter(items => {
        const itemData = items.datas.ProductType;
        const textData = 'Transport';
        return itemData.indexOf(textData) == -1
      }) , loading: false}); 
        
          });
  
         if(userId){
                  /* Listen to realtime cart changes */
                  this.unsubscribeCartItems =  firestore().collection('cart').doc(userId).onSnapshot(snapshotCart => {
                      if(snapshotCart.data()){
                          this.setState({cart: snapshotCart.data()});
                      } else {
                          this.setState({cart: []});
                      }
                  });
              }


/*

      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.datas.name.toUpperCase()}   
         ${item.datas.brand.toUpperCase()}`;
        
         const textData = text.toUpperCase();
          
         return itemData.indexOf(textData) > -1;
      });
      if(text == ""){
        this.setState({ data: [] }); 
      }else{
        this.setState({ data: newData }); 
      }
      */
     
    };

    FoodAddons(item){
      let img=[];
      let add=[];
      this.setState({ isVisibleAddons: true,
                      name: item.name,
                      price: item.price,
                      image: img.concat(item.featured_image),
                      id: item.id,
                      sale_price: item.sale_price,
                      unit: item.unit,
                      brand: item.brand,
                      productss: item.addons,
                      addonss: item
      })

  }

  router(item){
    if(!item.status || item.quantity<= 0  || !item.admin_control){
        return null;
    }else{
        if(item.addons == null|| item.addons  == 0){
          this.onAddToCart(item)
        }else{
          this.FoodAddons(item)
        }
    }
}

    rowRenderer = (type, data)  => {
        const {
          DayPrice, HourPrice, MonthlyPrice,StatDayPrice,StatHourPrice,StatMonthlyPrice,StatWeeklyPrice,WeeklyPrice,address, ameneties, ColorMotor,imageArray,MBrand, VModel, name, price, quantity, ProductType, rentalType, featured_image, unit, status, id,admin_control, storeId, sale_price,sale_description, brand, store_name} = data;
        const newimageArray= imageArray == undefined? []:imageArray;
         const newData = newimageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      });
        
        return (
          <Card transparent style={{justifyContent: "center", alignContent: "center"}}>
          { rentalType =='Services'?

          <CardItem style={{backgroundColor:'#fff1f3', paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:0.5,width:SCREEN_WIDTH/2-10 }}>
      <TouchableOpacity style={{width:SCREEN_WIDTH/2-10, flex: 1}} onPress={()=>this.setState({vInfo: data, VisibleAddInfoSErvice: true,MonthlyPrice: data.MonthlyPrice.toString(),
        DayPrice: data.DayPrice.toString(),
        HourPrice: data.HourPrice.toString(),
        WeeklyPrice: data.WeeklyPrice.toString(),})}>
      <FastImage style={styles.productPhoto} source={{ uri: newData[0], headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal, }} 
                  resizeMode={FastImage.resizeMode.cover}
      >
      <View style={{backgroundColor: 'rgba(255, 255, 255, 0.4)',   position: 'absolute',
  bottom:0, width: '100%'}}>
      <View style={{height:20,flexShrink: 1, }}>
        <Text  numberOfLines={1} style={styles.categoriesStoreName}>{name}</Text>
      </View>  
            {!admin_control || !status ? 
         <View style={styles.text}>
         <Text style={styles.title}>Unavailable</Text>
       </View>
        :   quantity  <= 0  ?
        <View style={styles.text}>
        <Text style={styles.title}>Out of Stock</Text>
      </View>
        : 
         null
      }
     
     
    <View style={{flexDirection: 'row'}}>
     <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Service Provider :{store_name}</Text>
   
   
</View>
        <View>
        
  {!StatHourPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!StatDayPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Daily Rate : {this.props.route.params.currency}{parseFloat(DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatWeeklyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Weekly Rate : {this.props.route.params.currency}{parseFloat(WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatMonthlyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        </View>
        
        </View>
        </FastImage>
    </TouchableOpacity>
    </CardItem>


:rentalType =='Property'?
 <CardItem style={{paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:1 ,width:SCREEN_WIDTH/2-10}}>
  <TouchableOpacity style={{width:SCREEN_WIDTH/2-10, flex: 1}} onPress={()=>this.setState({vInfo: data, VisibleAddInfoP: true,MonthlyPrice: data.MonthlyPrice.toString(),
        DayPrice: data.DayPrice.toString(),
        HourPrice: data.HourPrice.toString(),
        WeeklyPrice: data.WeeklyPrice.toString(),})}>


           <Image style={styles.productPhoto} resizeMode="cover" source={{uri:newData[0]}} />
     
    <View style={{height:20,flexShrink: 1}}>
      <Text  numberOfLines={1} style={styles.categoriesStoreName}>{name}</Text>
    </View>  
   <View style={{flexDirection: 'row'}}>
   <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Location :{address}</Text>
   
   
</View>

     
{!StatHourPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!StatDayPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Daily Rate : {this.props.route.params.currency}{parseFloat(DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatWeeklyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Weekly Rate : {this.props.route.params.currency}{parseFloat(WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatMonthlyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
  </TouchableOpacity>
  </CardItem>

:rentalType =='Hotels'?

<CardItem style={{backgroundColor:'#fff1f3', paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:0.5,width:SCREEN_WIDTH/2-10 }}>
      <TouchableOpacity style={{width:SCREEN_WIDTH/2-10, flex: 1}} onPress={()=>this.props.navigation.navigate('CheckoutScreenHotels',{'datas': data, 'cLat': data.slatitude, 'cLong': data.slongitude, 'typeOfRate':this.props.route.params.typeOcurrencyfRate })}>
      <FastImage style={styles.productPhoto} source={{ uri: newData[0], headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal, }} 
                  resizeMode={FastImage.resizeMode.cover}
      >
      <View style={{backgroundColor: 'rgba(255, 255, 255, 0.4)',   position: 'absolute',
  bottom:0, width: '100%'}}>
      <View style={{height:20,flexShrink: 1, }}>
        <Text  numberOfLines={1} style={styles.categoriesStoreName}>{name}</Text>
      </View>  
            {!admin_control || !status ? 
         <View style={styles.text}>
         <Text style={styles.title}>Unavailable</Text>
       </View>
        :   quantity  <= 0  ?
        <View style={styles.text}>
        <Text style={styles.title}>Out of Stock</Text>
      </View>
        : 
         null
      }
     
     
    <View style={{flexDirection: 'row'}}>
   <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Location :{address}</Text>
   
   
</View>
        <View>
        {!data.StatHourPrice3?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(data.HourPrice3).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!data.StatHourPrice6?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(data.HourPrice6).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!data.StatHourPrice12?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(data.HourPrice12).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
  {!StatHourPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!StatDayPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Daily Rate : {this.props.route.params.currency}{parseFloat(DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatWeeklyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Weekly Rate : {this.props.route.params.currency}{parseFloat(WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatMonthlyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        </View>
        
        </View>
        </FastImage>
    </TouchableOpacity>
    </CardItem>


:rentalType =='Vehicle' || rentalType =='Equipment' ?

<CardItem style={{backgroundColor:'#fff1f3', paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:0.5,width:SCREEN_WIDTH/2-10 }}>
      <TouchableOpacity style={{width:SCREEN_WIDTH/2-10, flex: 1}}  onPress={()=>this.setState({vInfo: data, VisibleAddInfo: true,MonthlyPrice: data.MonthlyPrice.toString(),
        DayPrice: data.DayPrice.toString(),
        HourPrice: data.HourPrice.toString(),
        WeeklyPrice: data.WeeklyPrice.toString(),})}>
      <FastImage style={styles.productPhoto} source={{ uri: newData[0], headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal, }} 
                  resizeMode={FastImage.resizeMode.cover}
      >
      <View style={{backgroundColor: 'rgba(255, 255, 255, 0.4)',   position: 'absolute',
  bottom:0, width: '100%'}}>
      <View style={{height:20,flexShrink: 1, }}>
        <Text  numberOfLines={1} style={styles.categoriesStoreName}>{name}</Text>
      </View>  
            {!admin_control || !status ? 
         <View style={styles.text}>
         <Text style={styles.title}>Unavailable</Text>
       </View>
        :   quantity  <= 0  ?
        <View style={styles.text}>
        <Text style={styles.title}>Out of Stock</Text>
      </View>
        : 
         null
      }
     
     
        <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Brand : {brand}</Text>
          <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Model : {VModel}</Text>
  <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Color : {ColorMotor}</Text>

        
        <View>
        
  {!StatHourPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(HourPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        
        {!StatDayPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Daily Rate : {this.props.route.params.currency}{parseFloat(DayPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatWeeklyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Weekly Rate : {this.props.route.params.currency}{parseFloat(WeeklyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
     {!StatMonthlyPrice?null:
<Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Hour Rate : {this.props.route.params.currency}{parseFloat(MonthlyPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
     }
        </View>
        
        </View>
        </FastImage>
    </TouchableOpacity>
    </CardItem>


: <CardItem style={{backgroundColor:'#fff1f3', paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:0.5,width:SCREEN_WIDTH/2-10 }}>
      <TouchableOpacity style={{width:SCREEN_WIDTH/2-10, flex: 1}} onPress={()=> this.router(data) }>
      <FastImage style={styles.productPhoto} source={{ uri: featured_image, headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal, }} 
                  resizeMode={FastImage.resizeMode.cover}
      >
      <View style={{backgroundColor: 'rgba(255, 255, 255, 0.4)',   position: 'absolute',
  bottom:0, width: '100%'}}>
      <View style={{height:20,flexShrink: 1, }}>
        <Text  numberOfLines={1} style={styles.categoriesStoreName}>{name}</Text>
      </View>  
            {!admin_control || !status ? 
         <View style={styles.text}>
         <Text style={styles.title}>Unavailable</Text>
       </View>
        :   quantity  <= 0  ?
        <View style={styles.text}>
        <Text style={styles.title}>Out of Stock</Text>
      </View>
        : 
         null
      }
     
     
        <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>Brand : {brand}</Text>
        <Text style={{fontStyle: "italic",  fontSize: 10, paddingLeft: 20}}>In Stock :{quantity}</Text>

        {sale_price ? 
        <View style={{flexDirection: "row"}}>
        <Text style={styles.categoriesPrice}>{this.props.route.params.currency}{sale_price}</Text>
        <Text style={styles.categoriesPriceSale}>{this.props.route.params.currency}{price}</Text>
        </View> :
        <View>
        <Text style={styles.categoriesPrice}>{this.props.route.params.currency}{price}</Text>
        </View>
        }
        </View>
        </FastImage>
    </TouchableOpacity>
    </CardItem>}
    </Card>
        )
      }
     openModal (){
    this.setState({   
        visibleModal: true,
    })
   }

  renderFooter = () => {
    try {
      // Check If Loading
      if (this.state.showMoreBtn) {
        return (
            <Button block success success style={{margin: 5}} onPress={()=>this.loadProducts(true, true)}>
            <Text>Load More</Text>
          </Button>
        )
      }
      else {
        return(
          <Text style={{ justifyContent: "center", alignSelf: "center", color:'#f0ac12', paddingVertical: 5}}>End of result.</Text>
        );
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    console.log('alpaOrder', this.state.alpaOrder);
    const {selectedFilter, activeSlide, productss} = this.state;
    return (
      <Container style={{flex: 1}}>
       <CustomHeader title={'Search from '+this.state.store_name} fromPlace={this.props.route.params.fromPlace}  navigation={this.props.navigation} currency={this.props.route.params.currency} />
        <Header searchBar rounded androidStatusBarColor={'#ee4e4e'} style={{backgroundColor: '#ee4e4e', elevation: 0}}>
          <Item style={{padding: 5}}>
                <Fontisto name="search" size={20} color={"#000000"}/>
                <Input placeholder="Search..."
                onChangeText={(text) => this.setState({searchText: text})}
                onSubmitEditing={()=> this.loadProducts()}
                style={{marginTop: 9}} />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
  
          <Left style={{flexDirection: "row", paddingLeft: 10}}>
         { this.state.PriceOrder==false?
           <TouchableOpacity style={{flexDirection: "row"}} onPress={()=> {this.setState({PriceOrder: !this.state.PriceOrder,selectedFilter: this.state.PriceOrder==true? 'Price-Ascending':'Price-Descending' });this.loadProducts()}}>
           <Fontisto name="arrow-swap" size={20} color={"#FFFFFF"} onPress={()=> {this.setState({PriceOrder: !this.state.PriceOrder,selectedFilter: this.state.PriceOrder==true? 'Price-Ascending':'Price-Descending'})}} style={{transform: [{ rotate: '90deg' },{rotateY: '180deg'}]}}/>
            <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 9, color: 'white'}}>9</Text>
             <Text style={{fontSize: 9, color: 'white'}}>0</Text>
            </View>
            </TouchableOpacity>
         :
         <TouchableOpacity style={{flexDirection: "row"}} onPress={()=> {this.setState({PriceOrder: !this.state.PriceOrder,selectedFilter: this.state.PriceOrder==true? 'Price-Ascending':'Price-Descending' });this.loadProducts()}}>
           <Fontisto name="arrow-swap" size={20} color={"#FFFFFF"} onPress={()=> {this.setState({PriceOrder: !this.state.PriceOrder,selectedFilter: this.state.PriceOrder==true? 'Price-Ascending':'Price-Descending'})}} style={{transform: [{ rotate: '90deg' }]}}/>
            <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 9, color: 'white'}}>0</Text>
             <Text style={{fontSize: 9, color: 'white'}}>9</Text>
            </View>
            </TouchableOpacity>
          
            }
           {  this.state.alpaOrder==false? 
           <TouchableOpacity style={{flexDirection: "row"}} onPress={()=> {this.setState({alpaOrder: !this.state.alpaOrder,selectedFilter: this.state.alpaOrder==true? 'Alphabetical-(A-Z)':'Alphabetical-(Z-A)'});this.loadProducts()}}>
             <Fontisto name="arrow-swap" size={20} color={"#FFFFFF"} onPress={()=> {this.setState({alpaOrder: !this.state.alpaOrder,selectedFilter: this.state.alpaOrder==true? 'Alphabetical-(A-Z)':'Alphabetical-(Z-A)'});this.loadProducts()}} style={{transform: [{ rotate: '90deg' },{rotateY: '180deg'}], marginLeft: 20}}/>
            <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 9, color: 'white'}}>Z</Text>
             <Text style={{fontSize: 9, color: 'white'}}>A</Text>
            </View>
            </TouchableOpacity>
           
           : <TouchableOpacity style={{flexDirection: "row"}} onPress={()=> {this.setState({alpaOrder: !this.state.alpaOrder,selectedFilter: this.state.alpaOrder==true? 'Alphabetical-(A-Z)':'Alphabetical-(Z-A)'});this.loadProducts()}}>
             <Fontisto name="arrow-swap" size={20} color={"#FFFFFF"} onPress={()=> {this.setState({alpaOrder: !this.state.alpaOrder,selectedFilter: this.state.alpaOrder==true? 'Alphabetical-(A-Z)':'Alphabetical-(Z-A)'});this.loadProducts()}} style={{transform: [{ rotate: '90deg' }], marginLeft: 20}}/>
            <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 9, color: 'white'}}>A</Text>
             <Text style={{fontSize: 9, color: 'white'}}>Z</Text>
            </View>
            </TouchableOpacity>}
            {/*<FontAwesome name="sliders" size={20} color={"#FFFFFF"}/>
            <TouchableOpacity style={{paddingLeft: 10}} onPress={()=>this.openModal()}>
                <Text style={{color: '#FFFFFF'}}>Filters</Text>
              </TouchableOpacity>*/}
            </Left>
        </Header>
          <Modal
            isVisible={this.state.visibleModal}
            animationInTiming={1000}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            animationOutTiming={1000}
            useNativeDriver={true}
            onBackdropPress={() => this.setState({visibleModal: false})} transparent={true}>
           <View style={style.content}> 
           <Text style={{justifyContent: "center", textAlign:"center", paddingVertical: 10, color: '#019fe8', fontWeight:'bold'}}>Select Filter</Text>
           <Divider />
           <View style={{flexDirection: 'row'}}>
                    <RadioButton
                    value="Price-Ascending"
                    status={selectedFilter === 'Price-Ascending'? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ selectedFilter: 'Price-Ascending' }); }}
                    />
                    <Text style={{padding: 5}}>Price-Ascending</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <RadioButton
                    value="Price-Descending"
                    status={selectedFilter === 'Price-Descending'? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ selectedFilter: 'Price-Descending' }); }}
                    />
                    <Text style={{padding: 5}}>Price-Descending</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <RadioButton
                    value="Alphabetical-(A-Z)"
                    status={selectedFilter === 'Alphabetical-(A-Z)'? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ selectedFilter: 'Alphabetical-(A-Z)' }); }}
                    />
                    <Text style={{padding: 5}}>Alphabetical-(A-Z)</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <RadioButton
                    value="Alphabetical-(Z-A)"
                    status={selectedFilter === 'Alphabetical-(Z-A)'? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ selectedFilter: 'Alphabetical-(Z-A)' }); }}
                    />
                    <Text style={{padding: 5}}>Alphabetical-(Z-A)</Text>
                </View>
            
                <Button bordered  block style={{marginVertical: 10, justifyContent: "center", textAlign: 'center', borderColor:'#019fe8'}} onPress={()=> this.loadProducts()}>
                  <Text style={{color:'#019fe8'}}>Done</Text>
                </Button>
          </View>
          </Modal>
        <Loader loading={this.state.loading}/>
        {this.searchFilterFunction &&
        
        <RecyclerListView
          style={{flex: 1, marginHorizontal: 5, }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.dataProvider}
          layoutProvider={this.state.layoutProvider}
          renderFooter={this.renderFooter}
        />
      }
           {/* <FlatList
          data={this.state.data}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderItem={({ item }) => this.rowRenderer(item.datas)}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          numColumns={2}
          columnWrapperStyle={{justifyContent:'space-between'}}
          keyExtractor={(item, index) => index.toString()}
          /> */}
    <Modal
      isVisible={this.state.VisibleAddInfoSErvice}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({VisibleAddInfoSErvice: false})} transparent={true}>
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
      data={this.state.vInfo.imageArray.filter(items => {
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
             
         <Text style={{marginTop: 15, fontSize: 10}}>Label</Text>
         <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.vInfo.name}  value={this.state.vInfo.name} placeholderTextColor="#687373" />
         </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Description</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.description} placeholderTextColor="#687373" />
         </Item>
       
         <Text style={{marginTop: 15, fontSize: 10}}>Ameneties</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.ameneties} placeholderTextColor="#687373" />
         </Item>


           </ScrollView>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => this.props.navigation.navigate('CheckoutScreenService',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude, 'selectedCityUser':this.props.selectedCityUser ==null? this.state.City: this.props.selectedCityUser })}
      >
       <Text style={{color:'white'}}>Procceed</Text>
      </Button>
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
        <View style={{justifyContent: 'center',alignItems: 'center', paddingVertical: 10}}>
              <Text style={{color:'tomato', fontWeight:'bold'}}>Detailed Information</Text>
              </View>
        <Text>Photos</Text>
        <FlatGrid
      itemDimension={120}
      data={this.state.vInfo.imageArray.filter(items => {
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
             
         <Text style={{marginTop: 15, fontSize: 10}}>Label</Text>
         <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.vInfo.name}  value={this.state.vInfo.name} placeholderTextColor="#687373" />
         </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Location</Text>
         <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.vInfo.address}  value={this.state.vInfo.address}placeholderTextColor="#687373" />
         </Item>
        
        <Text style={{marginTop: 15, fontSize: 10}}>Detailed Address</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.DetailedAddress} placeholderTextColor="#687373" />
         </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Description</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.description} placeholderTextColor="#687373" />
         </Item>
        
                      
         <Text style={{marginTop: 15, fontSize: 10}}>Ameneties</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.ameneties} placeholderTextColor="#687373" />
         </Item>


           </ScrollView>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() =>{this.state.vInfo.rentalType =='Equipment'? this.props.navigation.navigate('CheckoutScreenEquipment',{'datas': this.state.vInfo, 'typeOfRate':this.props.route.params.typeOfRate, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude }): this.props.navigation.navigate('CheckoutScreenRentals',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude })}}
      >
       <Text style={{color:'white'}}>Procceed</Text>
      </Button>
    </Card>
    </Modal>


    <Modal
      isVisible={this.state.VisibleAddInfoP}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({VisibleAddInfoP: false})} transparent={true}>
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
      data={this.state.vInfo.imageArray.filter(items => {
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
             
         <Text style={{marginTop: 15, fontSize: 10}}>Label</Text>
         <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.vInfo.name}  value={this.state.vInfo.name} placeholderTextColor="#687373" />
         </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Location</Text>
         <Item regular style={{marginTop: 7}}>
             <Input placeholder={this.state.vInfo.address}  value={this.state.vInfo.address}placeholderTextColor="#687373" />
         </Item>
        
        <Text style={{marginTop: 15, fontSize: 10}}>Detailed Address</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.DetailedAddress} placeholderTextColor="#687373" />
         </Item>
         <Text style={{marginTop: 15, fontSize: 10}}>Description</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.description} placeholderTextColor="#687373" />
         </Item>
     
         <Text style={{marginTop: 15, fontSize: 10}}>Ameneties</Text>
         <Item regular style={{marginTop: 7}}>
             <Input value={this.state.vInfo.ameneties} placeholderTextColor="#687373" />
         </Item>


           </ScrollView>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => this.props.navigation.navigate('CheckoutScreenRentals',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude })}
      >
       <Text style={{color:'white'}}>Procceed</Text>
      </Button>
    </Card>
    </Modal>
          <Modal
          isVisible={this.state.isVisibleAddons}
          onBackButtonPress={() => this.setState({ isVisibleAddons: false })}
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={true}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          style={style.modal}>
               
               <ScrollView style={styles.container}>
        
        <View style={styles.carouselContainer}>
          <View style={[styles.carousel,{height: 200}]}>      
          
           <Carousel
              ref={c => {
                this.slider1Ref = c;
              }}
              data={this.state.image}
              renderItem={this.renderImage}
              sliderWidth={SCREEN_WIDTH}
              itemWidth={SCREEN_WIDTH}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              firstItem={0}
              loop={false}
              autoplay={false}
              autoplayDelay={500}
              autoplayInterval={3000}
              onSnapToItem={index => this.setState({ activeSlide: index })}
            />
            <Pagination
              dotsLength={this.state.image.length}
              activeDotIndex={activeSlide}
              containerStyle={styles.paginationContainer}
              dotColor="rgba(255, 255, 255, 0.92)"
              dotStyle={styles.paginationDot}
              inactiveDotColor="white"
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              carouselRef={this.slider1Ref}
              tappableDots={!!this.slider1Ref}
            />
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', width: SCREEN_WIDTH}}>
            <Text style={styles.infoRecipeName}>{this.state.name}</Text>
            <Text style={{fontSize: 15,fontWeight:'bold', position: 'absolute', right:20, top:10}}>{this.props.route.params.currency} {this.state.price}</Text>
            </View>
          <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
        {productss.map((object, d) =>       
          <View key={d}>
            <Divider style={{height: 1}}/>
            <Text style={{ fontSize: 15, marginVertical: 2, fontWeight:'bold', marginLeft: 10 }}>{object.title}</Text>
            <Text style={{ fontSize: 12, marginVertical: 2, marginLeft: 10 }}>({object.mode == 'single'? 'Select one':'Select up to 2'})</Text>
            {object.data.map((drink, i) =>
              <View key={i}>
                {object.mode == 'single'?
                <CardItem style={{ flexDirection: 'row',flex:1}} button onPress={() => this.checkDrink(drink, object.data)} >
                    <View  style={{justifyContent: "flex-start"}}>
                        <RadioButton value={drink.price} status={drink.isChecked} onPress={() => this.checkDrink(drink, object.data)}/>
                    </View>
                    <View style={{justifyContent: "flex-start", flex: 5}}>
                        <Text style={{ fontSize: 12}}>{drink.label}</Text>
                    </View>
                    <View style={{justifyContent: "flex-end", flex:1}}>
                        <Text style={{ fontSize: 13 }}>{this.props.route.params.currency}{drink.price}</Text>
                    </View>                  
                </CardItem>
                :
                <CardItem style={{ flexDirection: 'row',flex:1}} button onPress={() => {drink.isChecked=='checked'?this.checkDrinkmunchecked(drink, object.data):this.checkDrinkm(drink, object.data)}} >
                    <View  style={{justifyContent: "flex-start"}}>
                        <Checkbox value={drink.price} status={drink.isChecked} onPress={() => {drink.isChecked=='checked'?this.checkDrinkmunchecked(drink, object.data):this.checkDrinkm(drink, object.data)}}/>
                    </View>
                    <View style={{justifyContent: "flex-start", flex: 5}}>
                        <Text style={{ fontSize: 12}}>{drink.label}</Text>
                    </View>
                    <View style={{justifyContent: "flex-end", flex:1}}>
                        <Text style={{ fontSize: 13 }}>{this.props.route.params.currency}{drink.price}</Text>
                    </View>                  
                </CardItem>
                }
              </View>
            )}
          </View>
        )}
      </View>
          
        </View>
      </ScrollView>
      <CardItem style={{flexDirection:'row', justifyContent:"space-around"}}>
        <Left style={{flexDirection:'row', justifyContent:"space-evenly"}}>
         <Pressable onPress={()=> {this.state.count<2?null:this._decrementCount()}} style={{backgroundColor: this.state.count<2?"gray":"#019fe8", borderRadius: 30,}}>
            <AntDesign name="minus" size={25} color={'white'} style={{textAlign: 'center',padding: 10}}/>
          </Pressable>
          <Button transparent>
            <Text style={{ fontSize: 25, textAlign: "center", color:'black'}}>{this.state.count}</Text>
          </Button>
          <Pressable onPress={()=> this._incrementCount()} style={{backgroundColor: "#019fe8", borderRadius: 30,}}>
            <AntDesign name="plus" size={25} color={"white"} style={{textAlign: 'center',padding: 10}}/>
          </Pressable>
        </Left>
        <Right>
            <Button block style={{backgroundColor: '#019fe8', borderRadius: 10}} onPress={()=> this.addonsAddtoCart(this.state.addonss)}>
                <Text>Add to Cart</Text>
            </Button>
        </Right>  
      </CardItem>
      <TouchableHighlight onPress={()=> this.setState({isVisibleAddons: false})} style={styles.btnContainer}>
                    <AntDesign name="closecircleo" size={20} color={"#019fe8"}/>
                </TouchableHighlight>
    </Modal>
      </Container>

    );
  }
}

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
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  drinkCard: {
    paddingLeft: 2,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: 'white',
    height: 40,
  }
});