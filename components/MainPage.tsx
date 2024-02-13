import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { useTheme, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Login from "./Login";
import Home from "./home";
import Auth from "./Auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

function MainPage() {
  const { isLoaded } = useAuth();
  const { theme } = useTheme();
  const [ session, setSession ] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    console.log(session?.access_token)
  },[session])

  return (
    <>
      {session && session.user ? (
        <>
          <Home session={session} />
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
          <Auth />
        </View>
      )}
    </>
  );
}

export default MainPage;
