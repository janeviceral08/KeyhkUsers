import React from 'react';
import { View, Text, ImageBackground, Image,Dimensions,Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {fcmService} from './FCM/FCMService'
import {Container, Header} from 'native-base';
import { Easing } from 'react-native-reanimated';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


class SplashScreen extends React.Component {
  constructor(props){
    super(props)
    this.Rotatevalue = new Animated.Value(0);
  }
  
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        400
      )
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    this.StartImageRotationFunction()

   
    const data = await this.performTimeConsumingTask();
    const isLoggedIn= await AsyncStorage.getItem('uid');
    
   if (data !== null) {
    setTimeout(() => {    this.props.navigation.reset({
      index: 0,
      routes: [{ name: isLoggedIn? 'Home' : 'Home2'}],})
  
  
  }, 2000);
    
    }

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

    const RotateData = this.Rotatevalue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '368deg']
    })

    const trans={
      opacity:this.Rotatevalue
    }
    return (
      <View style={styles.viewStyles}>
   <Header androidStatusBarColor="#ee4e4e"  style={{display: 'none'}}/>
         
   <Animated.Image 
   style={[{ width: SCREEN_WIDTH/2, height: SCREEN_HEIGHT/2, resizeMode:'contain',  opacity:this.Rotatevalue }]}  
   source={require('../assets/k5.png')}/>

       
      </View>
    );
  }
}

const styles = {

  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ee4e4e'
   
  },
 
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  backgroundImage: {
    resizeMode: 'cover', // or 'stretch'
  },
}

export default SplashScreen;