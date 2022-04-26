import React, { Component } from "react";
import { Platform, StyleSheet, View, ImageBackground, Image,Dimensions } from "react-native";
import DynamicTabView from "react-native-dynamic-tab-view";
import { Container, Header, Item, Input, Icon, Button, Text, Left, Right,Body,Title,Form, Picker } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from './Header';
import FFCard from "../components/FFCard";
import CartBadge from '../components/CartBadge';
import auth from '@react-native-firebase/auth';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class FastFoods extends Component{
  constructor(props) {
    super(props);
    const store = this.props.route.params.store;
    const slatitude = this.props.route.params.slatitude;
    const slongitude = this.props.route.params.slongitude;
    this.state = {
      StoreCountry: this.props.route.params.store.Country,
      defaultIndex: 0,
      category : store.subcategory,
      name: store.name,
      store_id: store.id,
      token: store.notification_token,
      visibleModal: false,
      count: 0,
      dataProvider: [],
      slongitude: slongitude,
      slatitude:slatitude,
    };
  }

  _renderItem = (item, index) => {
    return (
      <View
        key={item["key"]}
        style={{ backgroundColor: '#ffffff', flex: 1}}
      >
        <FFCard title={item["title"]} store={this.state.name} StoreCountry={this.state.StoreCountry} currency={this.props.route.params.currency} fromPlace={this.props.route.params.fromPlace} storeId={this.state.store_id} token={this.state.token} slatitude={this.state.slatitude} slongitude={this.state.slongitude} navigation={this.props.navigation}/>
      </View>
    );
  };


  onChangeTab = index => {};
  
render() {
   
    return (
    <Container style={{flex: 1}}>
{/*
    <Header androidStatusBarColor="#2c3e50" style={{display:'none'}} style={{backgroundColor: '#396ba0'}}>
          <Left style={{flex:3, width: '70%'}}>
      <Title style={{color:'white', marginLeft: 20}}>{this.state.name}</Title>
          </Left>
          <Body style={{flex: 3}}>
          <Title style={{color:'white', marginLeft: 20}}>{this.state.name}</Title>
          </Body>
          <Right style={{flex:1}}>
          
                      <CartBadge navigation={this.props.navigation} currency={this.props.route.params.currency}/> 
            
          </Right>
</Header>*/}
        <Header androidStatusBarColor="#396ba0" style={{height: SCREEN_HEIGHT/6}}>
         <ImageBackground source={{/* uri: this.props.route.params.store.foreground */}} resizeMode="cover" style={{height: SCREEN_HEIGHT/6, backgroundColor: '#ee4e4e'}}>

          <Left style={{flex:2, width: '100%',marginTop: 20, flexDirection: 'row'}}>
    
        <Image style={{width: SCREEN_HEIGHT/8, height: SCREEN_HEIGHT/8, borderRadius: 50, borderWidth: 2,borderColor: 'white', overflow: "hidden", marginLeft: '5%'}} source={{uri: this.props.route.params.store.foreground}} />
          <View style={{flexDirection: 'column',width: '80%', marginLeft: 15, marginTop: 30,backgroundColor: 'rgba(255, 255, 255, 0.6)',paddingLeft: 10}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.state.name}</Text>
          <Text style={{color: 'white', fontSize: 12,width: '80%'}}>{this.props.route.params.store.address + ', ' + this.props.route.params.store.city}</Text>
          </View>
          
          </Left>
              <Right style={{flex:1, position: 'absolute', right: 30, top: 5}}>
          
                      <CartBadge navigation={this.props.navigation} currency={this.props.route.params.currency} fromPlace={this.props.route.params.fromPlace} store={'show'}  /> 
            
          </Right>
         </ImageBackground>
        </Header>
      <DynamicTabView
        data={this.state.category}
        renderTab={this._renderItem}
        defaultIndex={this.state.defaultIndex}
        containerStyle={styles.container}
        headerBackgroundColor={'white'}
        headerTextStyle={styles.headerText}
        onChangeTab={this.onChangeTab}
        headerUnderlayColor={'#c6c7c8'}
      /> 
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    paddingTop: 0,
    marginTop:0,
    marginBottom:0,
    height: 50
  },

  headerContainer: {
    marginTop: 5,
   
  },
  headerText: {
    color:'black'
  },
  tabItemContainer: {
    backgroundColor: "#cf6bab"
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});