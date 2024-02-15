import { Avatar, Button, Dialog, Divider, Icon, Text, useTheme } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { DevSettings, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../InputField";
import { Session } from "@supabase/supabase-js";
import { House } from "../../types/types";
import { supabase } from "../../utils/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../hooks/AppCasaProvider";

interface ImpostazioniProps {
  handleHouseChange: () => void;
}

const Impostazioni: React.FC<ImpostazioniProps> = ({
  handleHouseChange
}) => {
  const [inputFieldHouseValue, setInputFieldHouseValue] = useState("");
  const [inputFieldSlugValue, setInputFieldSlugValue] = useState("");
  const [inputFieldJoinSlugValue, setInputFieldJoinSlugValue] = useState("");
  const [inputFieldEmailValue, setInputFieldEmailValue] = useState("");
  const [warningDialogVisible, setWarningDialogVisible] = useState(false);
  const [isLeavingHouse, setIsLeavingHouse] = useState(false);
  const {theme} = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { session,house, houseUsers } = state;
  

  async function createHouse() {
    if(!session) return console.error("You need to be logged in to create a house!");
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

    dispatch({ type: 'setHouse', payload: json[0] });
    handleHouseChange();
    console.log(json);
    setInputFieldHouseValue("");
    setInputFieldSlugValue("");
    return
  }

  async function leaveHouse() {
    if(!session) return console.error("You need to be logged in to create a house!");
    if (!house) {
      return;
    }
    console.log("Leaving " + house?.slug);
    if (session.user.id === house.created_by) {
      setWarningDialogVisible(true);
    }
  }


  async function confirmLeaveHouse(){
    if(!session) return console.error("You need to be logged in to create a house!");
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
    dispatch({ type: 'setHouse', payload: null });
    handleHouseChange();
  }

  async function joinHouse() {
    if(!session) return console.error("You need to be logged in to create a house!");
    console.log("Joining " + inputFieldJoinSlugValue);

    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house/join/${inputFieldJoinSlugValue}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        }
      }
    );
    const data = await result.json();

    if (!result.ok) {
      console.error(data);
      return;
    }

    console.log(data[0]);
    dispatch({ type: 'setHouse', payload: data[0] });
    handleHouseChange();
    setInputFieldJoinSlugValue("");
  }

  const logOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
      console.log(session)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgPrimary,
        alignItems: "center",
        height: "100%",
      }}
    >
      <ScrollView style={{ width: "100%", flex: 1 }} contentContainerStyle={{ alignItems: "center" }}>
      {session && (
        <>
          <Avatar
            size={"large"}
            rounded
            source={{ uri: session.user.user_metadata.avatar_url }}
            containerStyle={{ borderColor: theme.colors.accent, borderWidth: 2 }}
          />
          <View style={{ marginTop: 10 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text h4 style={{ color: theme.colors.onBgPrimary }}>
              {session.user.user_metadata.full_name}
            </Text>
            <Icon
              name="log-out"
              type="entypo"
              color={theme.colors.onBgPrimary}
              onPress={() => logOut()}
            />
          </View>
          {/* <Button onPress={() => getToken()}>Get Token</Button> */}
          <Text style={{ color: theme.colors.onBgSecondary }}>
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
                <Button containerStyle={{borderRadius: 20}} buttonStyle={{ padding: 15 }} color={theme.colors.accent} titleStyle={{ color: theme.colors.onBgPrimary }} onPress={createHouse}>Create House</Button>
                <View style={{ marginTop: 10 }} />
                <InputField
                  label="slug"
                  onInputChange={setInputFieldJoinSlugValue}
                />
                <Button containerStyle={{borderRadius: 20}} buttonStyle={{ padding: 15 }} color={theme.colors.accent} titleStyle={{ color: theme.colors.onBgPrimary }} onPress={joinHouse}>Join House</Button>
                <View style={{ marginTop: 10 }} />
              </>
            )}
            {house && (
              <>
                <Button containerStyle={{borderRadius: 20}} buttonStyle={{ padding: 15 }} color={theme.colors.accent} titleStyle={{ color: theme.colors.onBgPrimary }} onPress={() => leaveHouse()}>Leave House</Button>
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
            
            <Button containerStyle={{borderRadius: 20}} buttonStyle={{ padding: 15 }} color={theme.colors.accent} titleStyle={{ color: theme.colors.onBgPrimary }} onPress={async () => console.log(session.access_token)}>
              Get Token
            </Button>
          </View>
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Impostazioni;
