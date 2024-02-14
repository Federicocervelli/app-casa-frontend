import { useTheme, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Home from "./home";
import Auth from "./Auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

function MainPage() {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log("Error while fetching user session:", error);
        setLoading(false);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    console.log(session?.access_token);
  }, [session]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  } else {
    return session && session.user ? (
      <>
        <Home session={session} />
      </>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Auth />
      </View>
    );
  }
}

export default MainPage;
