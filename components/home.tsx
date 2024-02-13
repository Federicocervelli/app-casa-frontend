import React, { useEffect, useState } from "react";
import { Tab, Text, TabView, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Impostazioni from "./tabs/Impostazioni";
import Calendario from "./tabs/Calendario";
import Faccende from "./tabs/Faccende";
import { ActivityIndicator, View } from "react-native";
import { useUser, useOrganizationList, useAuth } from "@clerk/clerk-expo";
import { supabase } from "../utils/supabase";

import { User } from "../types/types";
import { Session } from "@supabase/supabase-js";

function home({ session }: { session: Session }) {
  const [index, setIndex] = React.useState(0);
  const { theme } = useTheme();
  const [loaded, setLoaded] = React.useState(false);
  const [house, setHouse] = useState(null);
  const [houseUsers, setHouseUsers] = useState<User[]>([]);

  React.useEffect(() => {
    fetchHouseFromApi();
    fetchHouseUsersFromApi();
    setLoaded(true);
  }, []);

  const fetchHouseUsersFromApi = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching users:", await response.json());
      }

      const apiResponse = await response.json();
      console.log("Users: ", apiResponse );
      setHouseUsers(apiResponse)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const fetchHouseFromApi = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching data:", await response.json());
      }

      const apiResponse = await response.json();
      console.log("House: ", apiResponse);
      setHouse(apiResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        disableSwipe={true}
      >
        <TabView.Item style={{ width: "100%" }}>
          {loaded ? (
            house ? (
              <Faccende
                house={house}
                houseUsers={houseUsers}
                session={session}
              />
            ) : (
              <SafeAreaView
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", textAlign: "center", fontSize: 30 }}
                >
                  Non hai nessuna casa. Perfavore entra in una casa nelle
                  impostazioni.
                </Text>
              </SafeAreaView>
            )
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Calendario />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Impostazioni
            house={house}
            setHouse={setHouse}
          />
        </TabView.Item>
      </TabView>

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        containerStyle={{
          backgroundColor: "black",
          borderTopColor: theme.colors.grey0,
          borderTopWidth: 1,
        }}
        buttonStyle={{
          height: 60,
        }}
        disableIndicator
        variant="primary"
      >
        <Tab.Item
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: "home",
            type: "ionicon",
            color: index === 0 ? "white" : theme.colors.grey3,
          }}
        />
        <Tab.Item
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: "calendar",
            type: "ionicon",
            color: index === 1 ? "white" : theme.colors.grey3,
          }}
        />
        <Tab.Item
          titleStyle={{ fontSize: 12 }}
          icon={{
            name: "settings",
            type: "ionicon",
            color: index === 2 ? "white" : theme.colors.grey3,
          }}
        />
      </Tab>
    </View>
  );
}

export default home;
