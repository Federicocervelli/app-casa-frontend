import { useAuth, useUser } from "@clerk/clerk-expo";
import { Avatar, Button, Divider, Icon, Text } from "@rneui/themed";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Impostazioni = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();

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
        </>
      )}
    </SafeAreaView>
  );
};

export default Impostazioni;
