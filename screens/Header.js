import React, { Component } from 'react';
import {View, Image, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import {Container, Header , Left, Right,Body, Button, Title, Text, List, ListItem} from 'native-base';
import CartBadge from '../components/CartBadge';
import Feather from 'react-native-vector-icons/Feather'

class CustomHeader extends Component {
  render(){
      let {title, isHome, Cartoff} = this.props;
    return(


        
      <Header androidStatusBarColor="#2c3e50" style={{backgroundColor: '#396ba0'}}>
          <Left style={{flex:3, width: '70%'}}>
      <Title style={{color:'white', marginLeft: 20}}>KeyS</Title>
          </Left>
          <Body style={{flex: 3}}>
            
          </Body>
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