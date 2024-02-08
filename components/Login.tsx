import React from 'react'
import SignInWithOAuth from "./SignInWithOAuth";
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function Login() {
  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light"  />
        <SignInWithOAuth />
    </View>
    
  )
}

export default Login