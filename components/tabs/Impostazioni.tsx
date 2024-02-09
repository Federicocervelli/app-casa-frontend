import { useAuth, useUser } from "@clerk/clerk-expo";
import { Avatar, Button, Divider, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../InputField";

const Impostazioni = () => {
  const [houseCode, setHouseCode] = useState<string>("");
  const [fetchedHouseCode, setFetchedHouseCode] = useState<string>("");
  const [showHouseCodeField, setShowHouseCodeField] = useState<string>("");
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, sessionId, getToken } = useAuth();

  useEffect(() => {
    setFetchedHouseCode(user?.organizationMemberships[0]?.organization.slug || "");
  },[]);

  useEffect(() => {
    if (fetchedHouseCode !== "") {
      setShowHouseCodeField(fetchedHouseCode);
    } else {
      setShowHouseCodeField("None");
    }
    console.log(fetchedHouseCode);
    console.log(showHouseCodeField);
  }, [fetchedHouseCode]);

  const handleHouseCodeChange = (value: string): void => {
    setHouseCode(value);
  };

  async function createHouse() {
    console.log("Creating " + houseCode);
    const result = await fetch(`https://app-casa-backend.federicocervelli01.workers.dev/api/v1/house/${houseCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      }
    })

    if (result.ok) {
      setFetchedHouseCode(houseCode);
    }

    console.log(result.status);
    console.log(await result.json());
  }

  async function leaveHouse() {
    console.log("leaving " + fetchedHouseCode);
    const result = await fetch("https://app-casa-backend.federicocervelli01.workers.dev/api/v1/user/house", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      }
    })

    if (result.ok) {
      setFetchedHouseCode("")
    } 


    console.log(await result.json());
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      {isLoaded && isSignedIn && (
        <>
          <Avatar
            size={"large"}
            rounded
            source={{ uri: user?.imageUrl }}
            containerStyle={{ borderColor: "white", borderWidth: 2 }}
          />
          <Divider style={{ marginTop: 10 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text h4 style={{ color: "white" }}>
              {user.fullName}
            </Text>
            <Icon
              name="log-out"
              type="entypo"
              color={"white"}
              onPress={() => signOut()}
            />
          </View>
          {/* <Button onPress={() => getToken()}>Get Token</Button> */}
          <Text style={{ color: "white" }}>
            Current House: {showHouseCodeField}
          </Text>
          <Divider style={{ marginTop: 20 }} />
          <View style={{ width: "90%" }}>
            <InputField
              label="House Code"
              onInputChange={handleHouseCodeChange}
            />
            <Button onPress={createHouse}>Create House</Button>
            <Divider style={{ marginTop: 10 }} />
            <Button onPress={() =>leaveHouse()}>Leave House</Button>
            <Divider style={{ marginTop: 10 }} />
            <Button onPress={async () => console.log(await getToken({template: "long-lived-token"})) }>Get Token</Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Impostazioni;
