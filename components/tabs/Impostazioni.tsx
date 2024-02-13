import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
  useClerk
} from "@clerk/clerk-expo";
import { Avatar, Button, Divider, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { DevSettings, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../InputField";

interface ImpostazioniProps {
  currentMembership: string;
  setCurrentMembership: React.Dispatch<React.SetStateAction<string>>;
}

const Impostazioni: React.FC<ImpostazioniProps> = ({ currentMembership, setCurrentMembership }) => {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const {signOut} = useClerk();
  const [currentOrganizationDisplayName, setCurrentOrganizationDisplayName] =
    useState("");

  const [inputFieldHouseValue, setInputFieldHouseValue] = useState("");
  const [inputFieldEmailValue, setInputFieldEmailValue] = useState("");

  // When user is signed in, get membership from parent
  useEffect(() => {
    try {
      console.log("Memberships of user: " + currentMembership);
      setCurrentOrganizationDisplayName(currentMembership);
    } catch {
      console.error("User is not an organization member");
    }
  }, [isSignedIn]);

  // When membership changes, update display name
  useEffect(() => {
    if (!currentMembership || currentMembership === "") {
      setCurrentOrganizationDisplayName("None");
    } else {
      setCurrentOrganizationDisplayName(currentMembership);
    }
  }, [currentMembership]);

  async function createHouse() {
    console.log("Creating " + inputFieldHouseValue);
    if (!inputFieldHouseValue || inputFieldHouseValue === "") {
      console.error("You need to specify a house name!");
      return;
    }
    const result = await fetch(
      `https://app-casa-backend.federicocervelli01.workers.dev/api/v1/house/${inputFieldHouseValue}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (result.ok) {
      setCurrentMembership(inputFieldHouseValue);
    }

    console.log(await result.json());
  }

  async function leaveHouse() {
    console.log("Leaving " + currentMembership);
    if (!currentMembership || currentMembership === "") {
      console.error("You are not in an organization!");
      return;
    }
    const result = await fetch(
      "https://app-casa-backend.federicocervelli01.workers.dev/api/v1/user/house",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (!result.ok) {
      console.error(await result.json());
      return;
    }

    setCurrentMembership("");
  }

  async function inviteHouse() {
    console.log("Inviting " + inputFieldEmailValue);
    if (!inputFieldEmailValue || inputFieldEmailValue === "") {
      console.error("You need to specify a user email!");
      return;
    }

    const result = await fetch(
      `https://app-casa-backend.federicocervelli01.workers.dev/api/v1/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ email: inputFieldEmailValue }),
      }
    );
    const data = await result.json();

    if (!result.ok) {
      console.error(data);
      return;
    }

    console.log(data);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        height: "100%",
      }}
    >
      {isSignedIn && (
        <>
          <Avatar
            size={"large"}
            rounded
            source={{ uri: user?.imageUrl }}
            containerStyle={{ borderColor: "white", borderWidth: 2 }}
          />
          <View style={{ marginTop: 10 }} />
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
            Current House: {currentOrganizationDisplayName}
          </Text>
          <View style={{ marginTop: 20 }} />
          <View style={{ width: "90%", height: "100%" }}>
            <InputField
              label="House Name"
              onInputChange={setInputFieldHouseValue}
            />
            <Button onPress={createHouse}>Create House</Button>
            <View style={{ marginTop: 10 }} />
            <Button onPress={() => leaveHouse()}>Leave House</Button>
            <View style={{ marginTop: 10 }} />
            <InputField
              label="Email to Invite"
              onInputChange={setInputFieldEmailValue}
            />
            <Button onPress={() => inviteHouse()}>Invite to House</Button>
            <View style={{ marginTop: 10 }} />
            <Button
              onPress={async () =>
                console.log(await getToken({ template: "long-lived-token" }))
              }
            >
              Get Token
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Impostazioni;
