import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Apps/login';
import Main from './Apps/Main';
import SignIn from './Apps/signin'; 
import Review from './Apps/Review';
import Account from './Apps/Account';
import Activity from './Apps/Accounts/Activity';
import Help from './Apps/Accounts/Help'
import Settings from './Apps/Accounts/Settings'
import Resume from './Apps/Resume'
import Post from './Apps/Post'
import PostDetails from './Apps/PostDetails';
import Community from './Apps/Community';
import { useEffect } from 'react';


const Stack = createStackNavigator();

const App = () => {
  const checkAutoLogin = async () => {
    const token = await EncryptedStorage.getItem('access_token');
  
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/login/verify-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          navigation.navigate('Main'); // If token is valid, skip login
        } else {
          navigation.navigate('Login'); // If token is invalid, show login
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigation.navigate('Login'); // Show login on error
      }
    } else {
      navigation.navigate('Login'); // No token, show login
    }
  };
  
  useEffect(() => {
    checkAutoLogin();
  }, []);
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Review"
          component={Review}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Resume"
          component={Resume}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PostDetails" 
          component={PostDetails}
          options={{ headerShown: false }}  
         />
         <Stack.Screen 
          name="Community" 
          component={Community}
          options={{ headerShown: false }}  
         />
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Post" component={Post} />
        
      </Stack.Navigator>
    </NavigationContainer>
  
    
  );
};

export default App;
