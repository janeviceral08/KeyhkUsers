import React, { Component } from 'react';
import {FlatList, TouchableOpacity, Dimensions, View, Alert, StatusBar, StyleSheet, ScrollView, TouchableHighlight, Image, Pressable} from 'react-native';
import { Col, Card, CardItem, Body, Button, Left, ListItem, List, Content, Thumbnail, Right, Text,Grid, Icon,  Container, Header,Item, Input, Toast, Root } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
const SCREEN_WIDTH = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../screens/Header';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign'
import styles from './styles'
import Modal from 'react-native-modal';
import { RadioButton, Divider } from 'react-native-paper';
import Loader from './Loader';
import { FlatGrid } from 'react-native-super-grid';




export default class SearchProperty extends Component {
    constructor(props) {
        super(props);
    console.log('params: ', this.props.route.params.selectedCityUser)
        this.ref =  firestore().collection('products');
        this.state = {
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
      }
        };
    
        this.arrayholder = [];
    }




    renderImage = ({ item }) => (
      <TouchableHighlight>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: item }} />
        </View>
      </TouchableHighlight>
    );

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
     firestore().collection('products').where('storeId', '==', this.props.route.params.storeId).where('rentalType', '==', 'Property').onSnapshot(this.onCollectionUpdate);
     

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
 
     
    componentWillUnMount(){
      this.unsubscribe() && this.unsubscribe
    }
    searchFilterFunction = async() => {    
        this.setState({loading: true})
        console.log('CIty: ', this.state.City)
        const userId= auth().currentUser.uid;
        firestore().collection('products').where('keywords', 'array-contains-any', [this.state.searchText]).where('storeId', '==', this.props.route.params.storeId).where('rentalType', '==','Property').onSnapshot((querySnapshot) => {
            const products = [];
            querySnapshot.forEach((doc) => {
              //console.log('search: ', doc.data())
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

    rowRenderer = (data) => {
        const {
          DayPrice, HourPrice, MonthlyPrice,StatDayPrice,StatHourPrice,StatMonthlyPrice,StatWeeklyPrice,WeeklyPrice,address, ameneties, ColorMotor,imageArray,MBrand, VModel, name, price, quantity, ProductType, rentalType, featured_image, unit, status, id,admin_control, storeId, sale_price,sale_description, brand, store_name} = data;
        const newimageArray= imageArray == undefined? []:imageArray;
         const newData = newimageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      });
        
        return (
          <Card transparent style={{flex: 1, justifyContent: "center", alignContent: "center"  }}>
       
 <CardItem style={{paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:1 ,width:SCREEN_WIDTH/2-5}}>
  <TouchableOpacity style={{width:SCREEN_WIDTH/2-5, flex: 1}} onPress={()=>{if(!data.status){
              return null;
          }else{
               console.log("Redirect");
               this.props.navigation.navigate('CheckoutScreenRentals',{'datas': data, 'cLat': data.slatitude, 'cLong': data.slongitude, 'typeOfRate':this.props.route.params.typeOfRate, 'currency':this.props.route.params.currency })
          }}}>


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
        :   
         null
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
        </FastImage>
  </TouchableOpacity>
  </CardItem>


    </Card>
        )
      }
    

  render() {
    const {selectedFilter, activeSlide, productss} = this.state;
    console.log('search typeOfRate', this.props.route.params.typeOfRate)
    return (
      <Container style={{flex: 1}}>
        <Header searchBar rounded androidStatusBarColor={'#ee4e4e'} style={{backgroundColor: '#ee4e4e', elevation: 0}}>
          <Item style={{padding: 5}}>
                <Fontisto name="search" size={20} color={"#000000"}/>
                <Input placeholder="Search..."
                onChangeText={(text) => this.setState({searchText: text})}
                onSubmitEditing={()=> this.searchFilterFunction()}
                style={{marginTop: 9}} />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Loader loading={this.state.loading}/>
        {this.searchFilterFunction &&
        <FlatList
          data={this.state.data}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderItem={({ item }) => this.rowRenderer(item.datas)}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          numColumns={2}
          columnWrapperStyle={{justifyContent:'space-between'}}
          keyExtractor={(item, index) => index.toString()}
          /> }
          
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
        onPress={() => this.props.navigation.navigate('CheckoutScreenService',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude, 'selectedCityUser':this.props.selectedCityUser ==null? this.state.City: this.props.selectedCityUser , 'currency':this.props.route.params.currency })}
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
        onPress={() => this.props.navigation.navigate('CheckoutScreenRentals',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude, 'currency':this.props.route.params.currency  })}
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
        onPress={() => this.props.navigation.navigate('CheckoutScreenRentals',{'datas': this.state.vInfo, 'cLat': this.state.vInfo.slatitude, 'cLong': this.state.vInfo.slongitude, 'currency':this.props.route.params.currency })}
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
          <View style={styles.carousel}>      
          
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
            <Text style={styles.infoRecipeName}>{this.state.name}</Text>
            <Text style={{fontSize: 17, textAlign: 'center'}}>{this.props.route.params.currency}{this.state.price}</Text>
          <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
        {productss.map((object, d) =>       
          <View key={d}>
            <Divider />
            <Text style={{ fontSize: 15, marginVertical: 5, fontWeight:'bold', marginLeft: 10 }}>{object.title}</Text>
            {object.data.map((drink, i) =>
              <View key={i}>
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
              </View>
            )}
          </View>
        )}
      </View>
          
        </View>
      </ScrollView>
      <CardItem style={{flexDirection:'row', justifyContent:"space-around"}}>
        <Left style={{flexDirection:'row', justifyContent:"space-evenly"}}>
         <Button  transparent onPress={()=> this._decrementCount()}>
            <AntDesign name="minus" size={30} color={"tomato"}/>
          </Button>
          <Button transparent>
            <Text style={{ fontSize: 25, textAlign: "center", color: "black"}}>{this.state.count}</Text>
          </Button>
          <Button  transparent onPress={()=> this._incrementCount()}>
            <AntDesign name="plus" size={30} color={"tomato"}/>
          </Button>
        </Left>
        <Right>
            <Button block style={{backgroundColor: 'tomato'}} onPress={()=> this.addonsAddtoCart(this.state.addonss)}>
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