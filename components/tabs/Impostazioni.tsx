import { Avatar, Button, Dialog, Divider, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { DevSettings, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../InputField";
import { Session } from "@supabase/supabase-js";
import { House } from "../../types/types";

interface ImpostazioniProps {
  house: House | null;
  setHouse: React.Dispatch<React.SetStateAction<House|null>>;
  session: Session;
  handleHouseChange: () => void;
}

const Impostazioni: React.FC<ImpostazioniProps> = ({
  house,
  setHouse,
  session,
  handleHouseChange
}) => {
  const [inputFieldHouseValue, setInputFieldHouseValue] = useState("");
  const [inputFieldSlugValue, setInputFieldSlugValue] = useState("");
  const [inputFieldJoinSlugValue, setInputFieldJoinSlugValue] = useState("");
  const [inputFieldEmailValue, setInputFieldEmailValue] = useState("");
  const [warningDialogVisible, setWarningDialogVisible] = useState(false);
  const [isLeavingHouse, setIsLeavingHouse] = useState(false);

  async function createHouse() {
    console.log("Creating", inputFieldHouseValue, inputFieldSlugValue);
    if (!inputFieldHouseValue || inputFieldHouseValue === "") {
      console.error("You need to specify a house name!");
      return;
    }

    if (!inputFieldSlugValue || inputFieldSlugValue === "") {
      console.error("You need to specify a house slug!");
      return;
    }

    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: inputFieldHouseValue,
          slug: inputFieldSlugValue,
        })
      }
    );

    const json = await result.json();

    if (!result.ok) {
      console.error(json);
      return
    }

    setHouse(json[0]);
    handleHouseChange();
    console.log(json);
    setInputFieldHouseValue("");
    setInputFieldSlugValue("");
    return
  }

  async function leaveHouse() {
    if (!house) {
      return;
    }
    console.log("Leaving " + house?.slug);
    if (session.user.id === house.created_by) {
      setWarningDialogVisible(true);
    }
  }


  async function confirmLeaveHouse(){
    setIsLeavingHouse(true);
    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        }
      }
    )

    const json = await result.json();

    if (!result.ok) {
      console.error(json);
      setIsLeavingHouse(false);
      return
    }

    setIsLeavingHouse(false);
    setHouse(null);
    handleHouseChange();
  }

  async function joinHouse() {
    console.log("Joining " + inputFieldJoinSlugValue);

    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house/join/${inputFieldJoinSlugValue}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
        }
      }
    );
    const data = await result.json();

    if (!result.ok) {
      console.error(data);
      return;
    }

    console.log(data[0]);
    setHouse(data[0]);
    handleHouseChange();
    setInputFieldJoinSlugValue("");
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
      {session && (
        <>
          <Avatar
            size={"large"}
            rounded
            source={{ uri: session.user.user_metadata.avatar_url }}
            containerStyle={{ borderColor: "white", borderWidth: 2 }}
          />
          <View style={{ marginTop: 10 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text h4 style={{ color: "white" }}>
              {session.user.user_metadata.full_name}
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
            Current House: {house?.name || "None"}
          </Text>
          <View style={{ marginTop: 20 }} />
          <View style={{ width: "90%", height: "100%" }}>
            {!house && (
              <>
                <InputField
                  label="House Name"
                  onInputChange={setInputFieldHouseValue}
                />
                <InputField
                  label="House Slug - a unique identifier"
                  
                  onInputChange={setInputFieldSlugValue}
                />
                <Button onPress={createHouse}>Create House</Button>
                <View style={{ marginTop: 10 }} />
                <InputField
                  label="slug"
                  onInputChange={setInputFieldJoinSlugValue}
                />
                <Button onPress={joinHouse}>Join House</Button>
                <View style={{ marginTop: 10 }} />
              </>
            )}
            {house && (
              <>
                <Button onPress={() => leaveHouse()}>Leave House</Button>
                <View style={{ marginTop: 10 }} />
              </>
            )}
            <Dialog
              isVisible={warningDialogVisible}
              onBackdropPress={() => setWarningDialogVisible(false)}
            >
              <Dialog.Title title="Are you sure?" />
              <Text>
                If you leave the house, it will be{" "}
                <Text style={{ fontWeight: "bold", color: "red" }}>
                  deleted
                </Text>{" "}
                because you are the owner.
              </Text>
              <Dialog.Actions>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%" }}>
                  <Dialog.Button
                    loading={isLeavingHouse}
                    loadingProps={{ color: "red" }}
                    titleStyle={{ color: "red" }}
                    title="Delete anyways"
                    onPress={() => confirmLeaveHouse().then(() => setWarningDialogVisible(false))}
                  />
                  <Dialog.Button
                    disabled={isLeavingHouse}
                    title="Never mind"
                    onPress={() => setWarningDialogVisible(false)}
                  />
                </View>
              </Dialog.Actions>
            </Dialog>
            
            <Button onPress={async () => console.log(session.access_token)}>
              Get Token
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Impostazioni;
