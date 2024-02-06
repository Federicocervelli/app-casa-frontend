import React from 'react'
import SignInWithOAuth from "./SignInWithOAuth";
import { View } from 'react-native';

function Login() {
  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <SignInWithOAuth />
    </View>
    
  )
}

export default Login