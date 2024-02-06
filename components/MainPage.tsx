import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { useTheme } from "@rneui/themed";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import Login from "./Login";
import Home from "./home";

function MainPage() {
  const { isLoaded } = useAuth();
  const { theme } = useTheme();
  return (
    <>
      {isLoaded ? (
        <>
          <SignedIn>
            <Home />
          </SignedIn>
          <SignedOut>
            <Login />
          </SignedOut>
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
        
      )}
    </>
  );
}

export default MainPage;
