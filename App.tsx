import { ThemeProvider, createTheme, useTheme } from "@rneui/themed";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AppProvider } from "./hooks/AppCasaProvider";
import Authentication from "./components/Authentication";
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

GoogleSignin.configure({
  scopes: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  webClientId:
    "540194145698-dgo851sffuhd9dveq13h61d45sv9i2cn.apps.googleusercontent.com",
});

const theme = createTheme({
  lightColors: {
    bgPrimary: "#F8F9FB",
    bgSecondary: "#E4E9F1",
    onBgPrimary: "#141C24",
    onBgSecondary: "#405474",
    accent: "#F4C752",
    btnColor: "#F4C752",
    errorColor: "#FF5252",
    infoColor: "#FF9800",
    inactiveColor: "#BDBDBD",
    disabled: "#8aa3c1",
  },
  darkColors: {
    bgPrimary: "#131C24",
    bgSecondary: "#1D2A36",
    onBgPrimary: "#F8F9FB",
    onBgSecondary: "#8294B6",
    accent: "#F4C752",
    btnColor: "#F4C752",
    errorColor: "#FF5252",
    infoColor: "#FF9800",
    inactiveColor: "#757575",
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AppProvider>
            <Authentication />
          </AppProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
