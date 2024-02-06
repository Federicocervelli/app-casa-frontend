import { FAB, Text, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

const Faccende = () => {

  const {theme} = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <Text h1 style={{ color: "white", textAlign: "center" }}>
        Faccende
      </Text>
      <FAB color={theme.colors.primary} style={{ position: "absolute", bottom: 40, right: 40}} icon={{ name: 'add', color: 'white' }} />
    </SafeAreaView>
  );
};

export default Faccende;
