import { StatusBar } from "expo-status-bar";
import { ThemeProvider, createTheme, useTheme } from "@rneui/themed";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MainPage from "./components/MainPage";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider >
          <SafeAreaProvider>
            <StatusBar style="light"/>
            <MainPage />
          </SafeAreaProvider>
        </ThemeProvider>
    </GestureHandlerRootView>
  );
}
