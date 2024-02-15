import React, { useContext, useEffect, useState } from "react";
import { Text, useTheme } from "@rneui/themed";
import Impostazioni from "./tabs/Impostazioni";
import History from "./tabs/History";
import Faccende from "./tabs/Faccende";
import { ActivityIndicator, View } from "react-native";
import { AppContext } from "../hooks/AppCasaProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

function home() {
  const { state, dispatch } = useContext(AppContext);
  const { session, house, houseLoaded } = state;
  const { theme } = useTheme();

  React.useEffect(() => {
    Promise.all([fetchHouseFromApi(), fetchHouseUsersFromApi()])
      .then(() => dispatch({ type: "setHouseLoaded", payload: true }))
      .catch((error) => console.error(error));
  }, []);

  const fetchHouseUsersFromApi = async () => {
    if (!session) {
      return console.error("You need to be logged in to fetch house users.");
    }
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
      const apiResponse = await response.json();

      if (!response.ok) {
        console.error("Error fetching users:", apiResponse);
        return;
      }

      console.log("Users: ", apiResponse);
      dispatch({ type: "setHouseUsers", payload: apiResponse });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchHouseFromApi = async () => {
    if (!session) {
      return console.error("You need to be logged in to fetch a house.");
    }
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

      const apiResponse = await response.json();

      if (!response.ok) {
        console.error("Error fetching data:", apiResponse);
        return;
      }

      console.log("House: ", apiResponse);
      dispatch({ type: "setHouse", payload: apiResponse });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Chores") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "History") {
              iconName = focused ? "time" : "time-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            // You can return any component that you like here!
            return <Icon name={iconName as string} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.onBgSecondary,
          tabBarInactiveTintColor: theme.colors.disabled,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.bgPrimary,
            borderTopColor: theme.colors.disabled,
            borderTopWidth: 0,
            elevation: 15,
            height: 70,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          }
          
          
        })}
        initialRouteName="Chores"
      >
        <Tab.Screen name="Chores" component={ChoresScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={ImpostazioniScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const ChoresScreen = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { session, house, houseLoaded } = state;
  return (
    <>
      {houseLoaded ? (
        house ? (
          <Faccende />
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: theme.colors.bgPrimary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.onBgPrimary,
                textAlign: "center",
                fontSize: 30,
              }}
            >
              Non hai nessuna casa. Per favore entra o crea una casa nelle
              impostazioni.
            </Text>
          </SafeAreaView>
        )
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </SafeAreaView>
      )}
    </>
  );
};

const HistoryScreen = () => {
  return <History />;
};

const ImpostazioniScreen = () => {
  const { state, dispatch } = useContext(AppContext);
  const { session } = state;

  const fetchHouseUsersFromApi = async () => {
    if (!session) {
      return console.error("You need to be logged in to fetch house users.");
    }
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
      const apiResponse = await response.json();

      if (!response.ok) {
        console.error("Error fetching users:", apiResponse);
        return;
      }

      console.log("Users: ", apiResponse);
      dispatch({ type: "setHouseUsers", payload: apiResponse });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleHouseChange = async () => {
    dispatch({ type: "setHouseLoaded", payload: false });
    await fetchHouseUsersFromApi();
    dispatch({ type: "setHouseLoaded", payload: true });
  };

  return <Impostazioni handleHouseChange={handleHouseChange} />;
};

export default home;
