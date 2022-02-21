import React, { Component } from 'react';
import {View, Image, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import {Container, Header , Left, Right,Body, Button, Title, Text, List, ListItem} from 'native-base';
import CartBadge from '../components/CartBadge';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class CustomHeader extends Component {
  render(){
      let {title, isHome, Cartoff} = this.props;
    return(


        
      <Header androidStatusBarColor="#ee4e4e" style={{backgroundColor: '#ee4e4e'}}>
          <Left style={{flex:3, flexDirection: 'row'}}>
          <Button transparent onPress={()=> this.props.navigation.goBack()}>
                 <MaterialIcons name="arrow-back" size={25} color="white" />
                </Button> 
                <Title style={{color:'white', marginTop: 7, marginLeft: 10}}>Booking Shares</Title>
          </Left>
          <Right style={{flex:1}}>
            {
                !Cartoff ? 
                      <CartBadge navigation={this.props.navigation} fromPlace={this.props.fromPlace} currency={this.props.currency}/> : null
            }
          </Right>
        </Header>
    )
  }
}

export default CustomHeader;