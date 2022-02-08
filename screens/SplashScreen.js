import React from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {fcmService} from './FCM/FCMService'


class SplashScreen extends React.Component {
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
    const data = await this.performTimeConsumingTask();
    const isLoggedIn= await AsyncStorage.getItem('uid');
    
    if (data !== null) {
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: isLoggedIn? 'Home' : 'Home2'}],})
    }

  }



  render() {
    return (
      <View style={styles.viewStyles}>

          <Image
            source={require('../assets/k.png')}
            style={{ width: 300, height: 300 }}
          />
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
   
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