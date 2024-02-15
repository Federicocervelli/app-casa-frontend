import React, { useContext, useEffect } from "react";
import { useTheme } from "@rneui/themed";
import { ActivityIndicator, View } from "react-native";
import Home from "./home";
import Auth from "./Auth";
import { supabase } from "../utils/supabase";
import { AppContext } from "../hooks/AppCasaProvider"; // replace with the actual path
import { StatusBar } from "expo-status-bar";

function Authentication() {
  const { theme } = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { session } = state;

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        dispatch({ type: "setSession", payload: session });
      })
      .catch((error: any) => {
        console.log("Error while fetching user session:", error);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: "setSession", payload: session });
    });
  }, [dispatch]);

  useEffect(() => {
    console.log(session?.access_token);
  }, [session]);

  if (!session) {
    // Loading Session
    return (
      <>
        <StatusBar style="dark" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.bgPrimary,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </>
    );
  } else {
    return session.user ? (
      // Logged in
      <>
        <StatusBar style="dark" />
        <Home />
      </>
    ) : (
      <>
        <StatusBar style="dark" />
        // Logged out
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.bgPrimary,
          }}
        >
          <Auth />
        </View>
      </>
    );
  }
}

export default Authentication;
