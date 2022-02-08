import React, {Component} from 'react';
import { StyleSheet, View, Dimensions,  Image, TouchableOpacity, Alert ,TextInput, TouchableHighlight, ScrollView} from 'react-native';
import { Col, Card, CardItem, Body, Button, Left, ListItem, List, Content, Thumbnail, Right, Text,Grid, Icon,  Container, Header,Toast, Root } from 'native-base';

import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import {LayoutUtil} from './LayoutUtil';
const SCREEN_WIDTH = Dimensions.get('window').width;
import styles from './styles'
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal';
import { RadioButton, Divider } from 'react-native-paper';
import Loader from './Loader';
 
import AntDesign from 'react-native-vector-icons/AntDesign'
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



  
export default class HotelCard extends Component {

  constructor(props) {
    super(props);
    this.cartRef =  firestore().collection('cart');
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: LayoutUtil.getLayoutProvider(0),
      viewType: 1,
      limit: 50,
      lastVisible: null,
      loading: false,
      refreshing: false,
      showMoreBtn: true,
      products:[],
      qty: 0,
      sale: false,
      count: 1,
      selectedFilter: 'Alphabetical-(A-Z)',
      searchEnabled: false,
      cart: [],
      showToast: false,
      isVisibleAddons: false,
      name: '',
      price: 0,
      image: [],
      id: '',
      sale_price: 0,
      unit: '',
      brand: '',
      activeSlide: 0,
      selectedFruits: [],
      addonss:[],
      choice:[],
      productss: []
    };
  }

  openModal (){
    this.setState({   
        visibleModal: true,
    })
   }

   renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );


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


    onSelectionsChange = (selectedFruits) => {
        // selectedFruits is array of { label, value }
        this.setState({ selectedFruits })
      }
    
      router(item){
         console.log("working here only Redirect");
          if(!item.status){
              return null;
          }else{
               console.log("Redirect");
               this.props.navigation.navigate('CheckoutScreenHotels',{'datas': item, 'cLat': item.slatitude, 'cLong': item.slongitude, 'typeOfRate':this.props.typeOfRate, 'currency':this.props.currency })
          }
      }

  rowRenderer = (type, data) => {
    const {StatHourPrice3,StatHourPrice6,maxGuest,StatHourPrice12,HourPrice3,HourPrice6,HourPrice12, name, price, quantity, imageArray, unit, status, id,admin_control, storeId, DayPrice, HourPrice, MonthlyPrice,StatDayPrice,StatHourPrice,StatMonthlyPrice,StatWeeklyPrice,WeeklyPrice, brand ,cluster, addons} = data;
    const newData = imageArray.filter(items => {
        const itemData = items;
        const textData = 'AddImage';
       
        return itemData.indexOf(textData) == -1
      });
    return (
      <Card transparent style={{flex: 1, justifyContent: "center", alignContent: "center",padding: 5 }}>
      <CardItem style={{backgroundColor:'#fff1f3', paddingBottom: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0,borderRadius: 20, borderWidth:0.5 }}>
      <TouchableOpacity style={{width:SCREEN_WIDTH/2, flex: 1}} onPress={()=> this.router(data) }>
      <FastImage style={styles.productPhoto} source={{ uri: newData[0], headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal, }} 
                  resizeMode={FastImage.resizeMode.cover}
      >
      <View style={{backgroundColor: 'rgba(255, 255, 255, 0.4)',   position: 'absolute',
  bottom:0, width: '100%', height:50}}>
  <Text  numberOfLines={1} style={{ fontSize: 15,
    color: 'black',
    padding : 1,paddingLeft: 10}}>{name}</Text>
      <View style={{height:50,flexShrink: 1, flexDirection: 'row' }}>
        
    {!StatHourPrice3?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(HourPrice3).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
      {!StatHourPrice6?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(HourPrice6).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
      {!StatHourPrice12?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(HourPrice12).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
         {!StatHourPrice?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(HourPrice).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
        
        {!StatDayPrice?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1}}> ₱{parseFloat(DayPrice).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
     {!StatWeeklyPrice?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(WeeklyPrice).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
     {!StatMonthlyPrice?null:
<Text style={{ fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    padding : 1,}}> ₱{parseFloat(MonthlyPrice).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}    Good for {maxGuest}</Text>
     }
      </View>  
            {!admin_control || !status ? 
         <View style={styles.text}>
         <Text style={styles.title}>Unavailable</Text>
       </View>
        :   
         null
      }
     
      
        
        </View>
        </FastImage>
    </TouchableOpacity>
    </CardItem>
    </Card>
    )
  }

  async componentDidMount(){  
    const userId= await AsyncStorage.getItem('uid');
    this.setState({ loading: true });   
    

    this.loadProducts(false, true);

  }

  /* On unmount, we remove the listener to avoid memory leaks from using the same reference with the off() method: */
  componentWillUnmount() {
    this.unsubscribeCartItems;
		this.unsubscribeProduct && this.unsubscribeProduct();
  }


  loadProducts(loadmore, fromComponent) {
    const self = this;
    var productQuery =  firestore().collection('products');
    productQuery = productQuery.where('storeId', '==', this.props.storeId);
    
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
			case 'On Sale':
				productQuery = productQuery.where('sale_price', '>', 0);
				break;	
			default: 
				productQuery = productQuery.orderBy('name', 'asc');
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
					/* Add more items to the screen... */
					productChunk.push({ ...change.doc.data(), pid: change.doc.id });
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
			
			this.setState((prevState) => ({
                products: prevState.products && fromComponent ? [...prevState.products, ...productChunk]: productChunk,
                dataProvider: this.state.dataProvider.cloneWithRows(
                    prevState.products && fromComponent ? [...prevState.products, ...productChunk]: productChunk
                  ),
				loading: false,
				loadingBtn: false,
				lastVisible: snapshot.docs[snapshot.docs.length - 1], 
        showMoreBtn: productChunk.length < this.state.limit ? false : true, 
        visibleModal: false
      }));
		});
  };

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
  };

  render() {
       const {selectedFilter, activeSlide, productss} = this.state;
    return (
      <Root>
      <Container style={{flex: 1,
        backgroundColor: '#FFF',

       }}>
              
      
       
        <Loader loading={this.state.loading}/>
        <RecyclerListView
          style={{flex: 1, marginTop: 5, marginLeft: 5}}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.dataProvider}
          layoutProvider={this.state.layoutProvider}
          renderFooter={this.renderFooter}
        />
        
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
                <View style={{flexDirection: 'row'}}>
                    <RadioButton
                    value="On Sale"
                    status={selectedFilter === 'On Sale'? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ selectedFilter: 'On Sale' }); }}
                    />
                    <Text style={{padding: 5}}>On Sale</Text>
                </View>
                <Button bordered  block style={{marginVertical: 10, justifyContent: "center", textAlign: 'center', borderColor:'#019fe8'}} onPress={()=> this.loadProducts()}>
                  <Text style={{color:'#019fe8'}}>Done</Text>
                </Button>
          </View>
          </Modal>
          <Modal
          isVisible={this.state.isVisibleAddons}
          onBackButtonPress={() => this.setState({ isVisibleAddons: false })}
          animationInTiming={500}
          animationOutTiming={500}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          useNativeDriver={true}
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
            <Text style={{fontSize: 17, textAlign: 'center'}}>₱{this.state.price}</Text>
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
                        <Text style={{ fontSize: 13 }}>₱{drink.price}</Text>
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
            <AntDesign name="minus" size={30} color={"#019fe8"}/>
          </Button>
          <Button transparent>
            <Text style={{ fontSize: 25, textAlign: "center", color:'black'}}>{this.state.count}</Text>
          </Button>
          <Button  transparent onPress={()=> this._incrementCount()}>
            <AntDesign name="plus" size={30} color={"#019fe8"}/>
          </Button>
        </Left>
        <Right>
            <Button block style={{backgroundColor: '#019fe8'}} onPress={()=> this.addonsAddtoCart(this.state.addonss)}>
                <Text>Add to Cart</Text>
            </Button>
        </Right>  
      </CardItem>
      <TouchableHighlight onPress={()=> this.setState({isVisibleAddons: false})} style={styles.btnContainer}>
                    <AntDesign name="closecircleo" size={20} color={"#019fe8"}/>
                </TouchableHighlight>
    </Modal>
      </Container>
      </Root>
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