import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity,BackHandler, Alert, ScrollView} from 'react-native';
import { Container, Header, Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button,List,ListItem } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from "../../components/Loader";
import CustomHeader from '../Header';

export default class Cancelled extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      email: "",
      password: "",
      formValid: true,
      error: "",
      loading: false,
    
    };
     }
    
     
  render() {
    return (
      <Container  style={{flex: 1}}>

        <Loader loading={this.state.loading}/>
        <ScrollView>

        <FlatList
               data={this.props.orders}
               renderItem={({ item }) => (
                <View>
                   {item.datas.OrderStatus == 'Cancelled'  ?
                   <Card>
                         <CardItem button onPress={() => {item.datas.SubProductType == 'Pabili'?this.props.navigation.navigate('OrderDetailsPabili',{ 'orders' : item.datas }):item.datas.ProductType == 'Rentals'?this.props.navigation.navigate('OrderDetailsRentals',{ 'orders' : item.datas }):item.datas.ProductType == 'Hotels'?this.props.navigation.navigate('OrderDetailsHotels',{ 'orders' : item.datas }):item.datas.ProductType == 'Transport'?this.props.navigation.navigate('OrderDetailsTranspo',{ 'orders' : item.datas }): this.props.navigation.navigate('OrderDetails',{ 'orders' : item.datas })}}>            
                        <Body style={{paddingLeft: 10, flex:3}}>
                            <Text style={{fontSize: 14,fontWeight: '900'}}>Transaction Number: #00{item.datas.OrderNo}</Text>
                            <Text note style={{color:'black', fontSize: 12}}>{item.datas.OrderDetails.Date_Ordered}</Text>
                            <Text note style={{color:'black', fontSize: 12}}>{item.datas.SubProductType == 'Pabili'?'Book a Rider':item.datas.ProductType == 'Foods'? 'Delivery':item.datas.ProductType == 'Transport'?'Ride': item.datas.ProductType}</Text>
                         <View style={{flexDirection: 'row'}}>
                       <Ionicons name={'ios-location-sharp'} style={{ marginRight: 10}} color={'green'}/> 
                       <Text note style={{color:'black', fontSize: 12}}>{item.datas.Billing.address}</Text>
                       </View>
                       { item.datas.SubProductType == 'Pabili'?  <View style={{flexDirection: 'row'}}>
                       <Ionicons name={'ios-location-sharp'} style={{ marginRight: 10}} color={'tomato'}/> 
                       <Text note style={{color:'black', fontSize: 12}}>{item.datas.billing_streetTo}</Text>
                       </View>:item.datas.ProductType == 'Foods'|| item.datas.ProductType == 'Hotels'|| item.datas.ProductType == 'Rentals'? null:<View style={{flexDirection: 'row'}}>
                       <Ionicons name={'ios-location-sharp'} style={{ marginRight: 10}} color={'tomato'}/> 
                       <Text note style={{color:'black', fontSize: 12}}>{item.datas.billing_streetTo}</Text>
                       </View>}
                        </Body>
                        <Right>
                          <Text style={{color: "salmon", fontStyle:"italic"}}>View</Text>
                        </Right>
                      </CardItem> 
                    </Card>:null }
                </View>

               )}
               
           /> 
        </ScrollView>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
      stepIndicator: {
      marginVertical: 10
    },
    container: {
       
      alignItems: 'center', 
      justifyContent: 'center'
    },
    
    })