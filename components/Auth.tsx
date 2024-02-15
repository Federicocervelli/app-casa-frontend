import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utils/supabase";
import { useTheme, Text } from "@rneui/themed";

export default function () {
  const {theme} = useTheme();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info: " + JSON.stringify(userInfo, null, 2));
      if(userInfo.idToken){
        const {data, error} = await supabase.auth.signInWithIdToken({'provider': 'google', 'token': userInfo.idToken});
        console.log(error, data)
      } else{
        throw new Error("No idToken");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  GoogleSignin.configure({
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    webClientId: "540194145698-dgo851sffuhd9dveq13h61d45sv9i2cn.apps.googleusercontent.com"
  });

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.bgPrimary }}>
      <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold", fontSize: 20 }}>Please sign in to use this app.</Text>
      <Text style={{ color: theme.colors.onBgPrimary, fontSize: 16, marginBottom: 20 }}>For now only google sign in is supported.</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
      />
    </SafeAreaView>
  );
}
