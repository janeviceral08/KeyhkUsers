import React, { useEffect } from 'react';

import { Button, Text, View, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import HomeScreen2 from './screens/HomeScreen2';
import Stores from './screens/StoreScreen';
import ProductScreen from './screens/ProductScreen';
import Searchbar from './components/Searchbar';
import SearchProperty from './components/SearchProperty';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import Gateway1 from './screens/Gateway1';
import SignupNumber from './screens/SignupNumber';
import SignUpScreenGoogle from './screens/SignUpScreenGoogle';
import SignUpScreenFB from './screens/SignUpScreenFB';
import SignUpScreenNumber from './screens/SignUpScreenNumber';
import ForgotPassword from './screens/ForgotPassword';
import OrderScreen from './screens/OrderScreen';
import OrderDetails from './screens/OrderDetails';
import OrderDetailsTranspo from './screens/OrderDetailsTranspo';
import OrderDetailsRentals from './screens/OrderDetailsRentals';
import OrderDetailsHotels from './screens/OrderDetailsHotels';
import ProfileScreen from './screens/ProfileScreen';
import Profile from './screens/ProfileEdit';
import Address from './screens/AddressEdit';
import SplashScreen from './screens/SplashScreen';
import SettingsScreen from './screens/SettingsScreen';
import SupportScreen from './screens/SupportScreen';
import SideMenu from './screens/SideMenu';
import Cart from './screens/CartScreen';
import Checkout from './screens/CheckoutScreen';
import VoucherScreen from "./screens/VoucherScreen";
import MyVoucherScreen from './screens/MyVoucherScreen';
import 'react-native-gesture-handler';
import FastFoods from './screens/Fastfoods';
import ChatScreen from './screens/ChatScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchAll from './components/SearchAll';
import SearchRentals from './components/SearchRentals';
import SearchServices from './components/SearchServices';
import CheckoutTransport from './screens/CheckoutTransport';
import CheckoutScreenRentals from './screens/CheckoutScreenRentals';
import HotelsMap from './screens/HotelsMap';
import CheckoutScreenHotels from './screens/CheckoutScreenHotels';
import CheckoutScreenService from './screens/CheckoutScreenService';
import CheckoutScreenEquipment from './screens/CheckoutScreenEquipment';
import OrderDetailsService from './screens/OrderDetailsService';
import wallet from './screens/wallet';
import Gateway from './screens/Gateway';
import GatewayDetails from './screens/GatewayDetails';
import PropertyRent from './screens/PropertyRent';
import PropertyHotel from './screens/PropertyHotel';
import Pabili from './screens/Pabili';
import OrderDetailsPabili from './screens/OrderDetailsPabili';
import pabiliOrderDetails from './screens/pabiliOrderDetails';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTab=({children, onPress}) =>(
  <TouchableOpacity
  style={{
    top: -30,
    justifyContent: 'center',
  alignItems: 'center',...styles.shadow}}
  onPress={onPress}>
    <View
    style={{
      width: 50,
      height: 50,
      borderRadius: 35,
      backgroundColor: 'red'
    }}
    
    >
      {children}
    </View>
  </TouchableOpacity>
);

function SettingsStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="Edit" 
        component={Profile} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="Address" 
        component={Address} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="wallet" 
        component={wallet} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="MyVoucher" 
        component={MyVoucherScreen} 
        options={{headerShown:false}}
        /> 
       
          <Stack.Screen
          name="Gateway"
          component={Gateway}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="GatewayDetails"
          component={GatewayDetails}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}

function OrderStack() {
  return (
    <Stack.Navigator>
           <Stack.Screen 
        name="Orders" 
        component={OrderScreen} 
        options={{headerShown:false}}/>  
        <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{headerShown:false}}/> 
           <Stack.Screen 
        name="OrderDetailsTranspo" 
        component={OrderDetailsTranspo} 
        options={{headerShown:false}}/> 
         <Stack.Screen 
        name="OrderDetailsRentals" 
        component={OrderDetailsRentals} 
        options={{headerShown:false}}/> 
              <Stack.Screen 
        name="OrderDetailsHotels" 
        component={OrderDetailsHotels} 
        options={{headerShown:false}}/>
         <Stack.Screen 
        name="OrderDetailsService" 
        component={OrderDetailsService} 
        options={{headerShown:false}}/> 
          <Stack.Screen 
        name="OrderDetailsPabili" 
        component={OrderDetailsPabili} 
        options={{headerShown:false}}/> 
    </Stack.Navigator>
  );
}



function TabScreen() {
  return (
    <Stack.Navigator>
         <Stack.Screen 
            name="Home" 
            component={HomeStack}
            options={{headerShown:false}}
            />  
             
             <Stack.Screen 
            name="Orders" 
            component={OrderStack} 
            options={{headerShown:false}}
            
            />   
              <Stack.Screen 
          name="Vouchers" 
          component={VoucherScreen}
          options={{headerShown:false}}
        
        />  
             <Stack.Screen 
            name="Account" 
            component={SettingsStack} 
            options={{headerShown:false}}
            
            />   
             {/* <Tab.Navigator 
    screenOptions ={{
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: '#183c57',
      tabBarInactiveTintColor: 'gray',
    tabBarStyle: {   backgroundColor: 'white', }
    }}
    initialRouteName="Home"
    >
       
       
        
        <Tab.Screen 
            name="Home" 
            component={HomeStack}
            options={{headerShown:false,
              tabBarLabel: 'Home',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'isv'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
            }} 
            />  
             <Tab.Screen 
            name="Orders" 
            component={OrderStack} 
            options={{headerShown:false,
              tabBarLabel: 'Transactions',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'profile'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
              <Tab.Screen 
          name="Vouchers" 
          component={VoucherScreen}
          options={{headerShown:false,
            tabBarLabel: 'Vouchers',
            tabBarIcon: ({focused, color, size, tintColor}) => (
              <AntDesign name={'wallet'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
            ),
            
          }}
        
        />  
             <Tab.Screen 
            name="Account" 
            component={SettingsStack} 
            options={{headerShown:false,
              tabBarLabel: 'Account',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'user'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
          </Tab.Navigator>*/}
    </Stack.Navigator>
  
  );
}


function TabScreen2() {
  return (
    <Stack.Navigator>
         
              <Stack.Screen 
            name="Home2" 
            component={HomeStack2}
            options={{headerShown:false}}
            />  
             <Stack.Screen 
            name="Orders" 
            component={OrderStack} 
            options={{headerShown:false}}
            
            />   
              <Stack.Screen 
          name="Vouchers" 
          component={VoucherScreen}
          options={{headerShown:false}}
        
        />  
             <Stack.Screen 
            name="Account" 
            component={SettingsStack} 
            options={{headerShown:false}}
            
            />   
             {/* <Tab.Navigator 
    screenOptions ={{
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: '#183c57',
      tabBarInactiveTintColor: 'gray',
    tabBarStyle: {   backgroundColor: 'white', }
    }}
    initialRouteName="Home"
    >
       
       
        
        <Tab.Screen 
            name="Home" 
            component={HomeStack}
            options={{headerShown:false,
              tabBarLabel: 'Home',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'isv'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
            }} 
            />  
             <Tab.Screen 
            name="Orders" 
            component={OrderStack} 
            options={{headerShown:false,
              tabBarLabel: 'Transactions',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'profile'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
              <Tab.Screen 
          name="Vouchers" 
          component={VoucherScreen}
          options={{headerShown:false,
            tabBarLabel: 'Vouchers',
            tabBarIcon: ({focused, color, size, tintColor}) => (
              <AntDesign name={'wallet'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
            ),
            
          }}
        
        />  
             <Tab.Screen 
            name="Account" 
            component={SettingsStack} 
            options={{headerShown:false,
              tabBarLabel: 'Account',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <AntDesign name={'user'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
          </Tab.Navigator>*/}
    </Stack.Navigator>
  
  );
}
function CheckoutStack() {
  return (
    <Stack.Navigator>
           <Stack.Screen 
        name="Checkout" 
        component={Checkout} 
        options={{headerShown:false}}/>  
           <Stack.Screen 
        name="CheckoutTransport" 
        component={CheckoutTransport} 
        options={{headerShown:false}}/>  
   <Stack.Screen 
        name="CheckoutScreenRentals" 
        component={CheckoutScreenRentals} 
        options={{headerShown:false}}/>  
         <Stack.Screen 
        name="HotelsMap" 
        component={HotelsMap} 
        options={{headerShown:false}}/> 
           <Stack.Screen 
        name="CheckoutScreenHotels" 
        component={CheckoutScreenHotels} 
        options={{headerShown:false}}/>  
         <Stack.Screen 
        name="CheckoutScreenService" 
        component={CheckoutScreenService} 
        options={{headerShown:false}}/>  
         <Stack.Screen 
        name="CheckoutScreenEquipment" 
        component={CheckoutScreenEquipment} 
        options={{headerShown:false}}/>  
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={HomeScreen}
        options={{headerShown:false}}
      />
       <Stack.Screen
        name="Stores"
        component={Stores}
        options={{
          headerShown:false,
          tabBarVisible:false,
        }}
        tabBarOptions={{
          tabStyle: {height: 0},
          style: {backgroundColor: 'transparent'}
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Fastfood"
        component={FastFoods}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Search"
        component={Searchbar}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="SearchAll"
        component={SearchAll}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen
        name="SearchRentals"
        component={SearchRentals}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen
        name="SearchServices"
        component={SearchServices}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="SearchProperty"
        component={SearchProperty}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen 
        name="Address" 
        component={Address} 
        options={{headerShown:false}}
        /> 
          <Stack.Screen 
        name="MyVoucher" 
        component={MyVoucherScreen} 
        options={{headerShown:false}}
        /> 
              <Stack.Screen 
        name="Checkout" 
        component={Checkout} 
        options={{headerShown:false}}/>  
                  <Stack.Screen 
        name="CheckoutTransport" 
        component={CheckoutTransport} 
        options={{headerShown:false}}/>
           <Stack.Screen 
        name="CheckoutScreenRentals" 
        component={CheckoutScreenRentals} 
        options={{headerShown:false}}/>  
         <Stack.Screen 
        name="HotelsMap" 
        component={HotelsMap} 
        options={{headerShown:false}}/> 
        <Stack.Screen 
        name="CheckoutScreenHotels" 
        component={CheckoutScreenHotels} 
        options={{headerShown:false}}/> 
              <Stack.Screen 
        name="CheckoutScreenService" 
        component={CheckoutScreenService} 
        options={{headerShown:false}}/>  
               <Stack.Screen 
        name="PropertyRent" 
        component={PropertyRent} 
        options={{headerShown:false}}/>
            <Stack.Screen 
        name="PropertyHotel" 
        component={PropertyHotel} 
        options={{headerShown:false}}/>  
        <Stack.Screen 
        name="Pabili" 
        component={Pabili} 
        options={{headerShown:false}}/> 
         <Stack.Screen 
        name="pabiliOrderDetails" 
        component={pabiliOrderDetails} 
        options={{headerShown:false}}/> 
         <Stack.Screen 
        name="CheckoutScreenEquipment" 
        component={CheckoutScreenEquipment} 
        options={{headerShown:false}}/>  
    </Stack.Navigator>
  );
}


function HomeStack2() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={HomeScreen2}
        options={{headerShown:false}}
      />
       <Stack.Screen
        name="Stores"
        component={Stores}
        options={{
          headerShown:false,
          tabBarVisible:false,
        }}
        tabBarOptions={{
          tabStyle: {height: 0},
          style: {backgroundColor: 'transparent'}
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Fastfood"
        component={FastFoods}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Search"
        component={Searchbar}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="SearchAll"
        component={SearchAll}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen
        name="SearchRentals"
        component={SearchRentals}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen
        name="SearchServices"
        component={SearchServices}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="SearchProperty"
        component={SearchProperty}
        options={{headerShown:false,tabBarVisible:false,}}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown:false,tabBarVisible:false,}}
      />
       <Stack.Screen 
        name="Address" 
        component={Address} 
        options={{headerShown:false}}
        /> 
          <Stack.Screen 
        name="MyVoucher" 
        component={MyVoucherScreen} 
        options={{headerShown:false}}
        /> 
              <Stack.Screen 
        name="Checkout" 
        component={Checkout} 
        options={{headerShown:false}}/>  
                  <Stack.Screen 
        name="CheckoutTransport" 
        component={CheckoutTransport} 
        options={{headerShown:false}}/>
           <Stack.Screen 
        name="CheckoutScreenRentals" 
        component={CheckoutScreenRentals} 
        options={{headerShown:false}}/>  
         <Stack.Screen 
        name="HotelsMap" 
        component={HotelsMap} 
        options={{headerShown:false}}/> 
        <Stack.Screen 
        name="CheckoutScreenHotels" 
        component={CheckoutScreenHotels} 
        options={{headerShown:false}}/> 
              <Stack.Screen 
        name="CheckoutScreenService" 
        component={CheckoutScreenService} 
        options={{headerShown:false}}/>  
               <Stack.Screen 
        name="PropertyRent" 
        component={PropertyRent} 
        options={{headerShown:false}}/>
            <Stack.Screen 
        name="PropertyHotel" 
        component={PropertyHotel} 
        options={{headerShown:false}}/>  
        <Stack.Screen 
        name="Pabili" 
        component={Pabili} 
        options={{headerShown:false}}/> 
         <Stack.Screen 
        name="pabiliOrderDetails" 
        component={pabiliOrderDetails} 
        options={{headerShown:false}}/> 
         <Stack.Screen 
        name="CheckoutScreenEquipment" 
        component={CheckoutScreenEquipment} 
        options={{headerShown:false}}/>  
    </Stack.Navigator>
  );
}

const App = () => {

    useEffect(() => {

     /* messaging()
  .subscribeToTopic('NewOrderWithRider')
  .then(() => console.log('Subscribed to topic!'));*/


    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage: ', remoteMessage)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'notif',
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
          sound: 'notif',
        },
      });
    });

    return unsubscribe;
  }, []);
  return (
      <NavigationContainer>
        <Stack.Navigator>
           <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown:false}}
          />
          <Stack.Screen
            name="Login"
            component={SignInScreen}
            options={{headerShown:false}}
          />
           <Stack.Screen
            name="Signup"
            component={SignUpScreen}
            options={{ title: "UserInfo"}}
          />
            <Stack.Screen
            name="Gateway1"
            component={Gateway1}
          options={{ title: "Entrepreneur Registration"}}
          />
            <Stack.Screen
            name="SignUpScreenGoogle"
            component={SignUpScreenGoogle}
            options={{ title: "Fill in User Info"}}
          />
          <Stack.Screen
            name="SignUpScreenFB"
            component={SignUpScreenFB}
            options={{ title: "Fill in User Info"}}
          />
              <Stack.Screen
            name="SignUpScreenNumber"
            component={SignUpScreenNumber}
            options={{ title: "Fill in User Info"}}
          />
             <Stack.Screen
            name="SignupNumber"
            component={SignupNumber}
            options={{headerShown:false}}
          />
             <Stack.Screen
            name="ForgotPass"
            component={ForgotPassword}
            options={{headerShown:false}}
          />
           <Stack.Screen
          name="Home"
          component={TabScreen}
          options={{ headerShown: false }}
        />
         
         <Stack.Screen
          name="Home2"
          component={TabScreen2}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  shadow:{
    shadowColor: '#7f5df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius:3.5,
    elevation:5
  }
})

export default App;
