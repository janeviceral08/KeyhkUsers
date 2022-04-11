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
    this.startValue= new Animated.Value(0);
    this.startValueShares= new Animated.Value(0);
    this.startValueWidth= new Animated.Value(SCREEN_WIDTH/3);
    this.startValueHeight = new Animated.Value(SCREEN_HEIGHT/3);


    this.state = {
      startValue: new Animated.Value(0),
      endValue: SCREEN_HEIGHT/2,
      endValueShares: -(SCREEN_HEIGHT/2),
      duration: 2600,
    };
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
    this.startAnimationBooking()
    this.startAnimationShares()
    this.zoomInNow()
    this.zoomInNowHeight()
    const data = await this.performTimeConsumingTask();
    const isLoggedIn= await AsyncStorage.getItem('uid');
    
  if (data !== null) {
    setTimeout(() => {    this.props.navigation.reset({
      index: 0,
      routes: [{ name: isLoggedIn? 'Home' : 'Home2'}],
    })
  
  
  }, 2000);
    
    }

  }
  zoomInNow(){
    this.startValueWidth.setValue(SCREEN_WIDTH/4);
    Animated.timing(
      this.startValueWidth,
      {
        toValue: SCREEN_WIDTH/3,
        duration: 2600,
        useNativeDriver: false,
      },
    ).start(()=>this.zoomInNow());
   
  }

  zoomInNowHeight(){
    this.startValueHeight.setValue(SCREEN_HEIGHT/4);
    Animated.timing(
      this.startValueHeight,
      {
        toValue: SCREEN_HEIGHT/2,
        duration: 2600,
        useNativeDriver: false,
      },
    ).start(()=>this.zoomInNowHeight());
  }
  StartImageRotationFunction(){
    this.Rotatevalue.setValue(0);
    Animated.timing(this.Rotatevalue,{
      toValue:1,
      duration:2600,
      useNativeDriver: false // Add This line
    }).start(()=>this.StartImageRotationFunction());
  }

  startAnimationBooking() {
    this.startValue.setValue(0)
    Animated.timing(this.startValue, {
      toValue: this.state.endValue,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start(()=>this.startAnimationBooking());
  }
  
  startAnimationShares() {
    this.startValueShares.setValue(0)
    Animated.timing(this.startValueShares, {
      toValue: this.state.endValueShares,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start(()=>this.startAnimationShares());
  }
  render() {

    const RotateData = this.Rotatevalue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '368deg']
    })

    const trans={
      opacity:this.Rotatevalue
    }

    const animatedStyles = {
      transform: [
        { translateY: this.state.animationBooking }
      ]
    }

  
    return (
      <View style={styles.viewStyles}>
   <Header androidStatusBarColor="#ee4e4e"  style={{display: 'none'}}/>
   <Animated.Image 
   style={[{ width: SCREEN_WIDTH/2, height: SCREEN_HEIGHT/2.5, resizeMode:'contain', transform: [
    {
      translateY: this.startValue,
    },
  ],}]}  
   source={require('../assets/booking.png')}/>

   <Animated.Image 
   style={[{ width: this.startValueWidth, height: this.startValueHeight, resizeMode:'contain',  opacity:this.Rotatevalue }]}  
   source={require('../assets/bs.png')}/>
 <Animated.Image 
   style={[{ width: SCREEN_WIDTH/2, height: SCREEN_HEIGHT/2.5, resizeMode:'contain',transform: [
    {
      translateY: this.startValueShares,
    },
  ]}]}  
   source={require('../assets/shares.png')}/>
       
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