import React, { useEffect } from "react";
import { Tab, Text, TabView, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Impostazioni from "./tabs/Impostazioni";
import Calendario from "./tabs/Calendario";
import Faccende from "./tabs/Faccende";
import { View } from "react-native";
import { useUser, useOrganizationList  } from "@clerk/clerk-expo";

function home() {
  const [index, setIndex] = React.useState(0);
  const { theme } = useTheme();
  const { isLoaded: isOrganizationListLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [currentMembership, setCurrentMembership] = React.useState("");

  // Effect to update userExternalId when user's externalId changes
  React.useEffect(() => {
    if (!isOrganizationListLoaded) return;
    const membershipData = userMemberships?.data;
    if (!membershipData) return;
    const singleMembership = membershipData?.[0];
    if (!singleMembership) return;
    const membership = singleMembership.organization.slug;
    setCurrentMembership(membership as string);
  }, [isOrganizationListLoaded]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <TabView value={index} onChange={setIndex} animationType="spring" disableSwipe={true}>
        <TabView.Item style={{ width: "100%" }}>
          {isOrganizationListLoaded && currentMembership !== "" && currentMembership !== null && currentMembership !== undefined ? (
            <Faccende currentMembership={currentMembership} setCurrentMembership={setCurrentMembership} />
          ) : (
            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "white", textAlign: "center", fontSize: 30 }}>
                Non hai nessuna casa. Perfavore entra in una casa nelle impostazioni.
              </Text>
            </SafeAreaView>
          )}
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Calendario />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Impostazioni currentMembership={currentMembership} setCurrentMembership={setCurrentMembership} />
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
          icon={{ name: "home", type: "ionicon", color: index === 0 ? "white" : theme.colors.grey3 }}
        />
        <Tab.Item
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "calendar", type: "ionicon", color: index === 1 ? "white" : theme.colors.grey3 }}
        />
        <Tab.Item
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "settings", type: "ionicon", color: index === 2 ? "white" : theme.colors.grey3 }}
        />
      </Tab>
    </View>
  );
}

export default home;
