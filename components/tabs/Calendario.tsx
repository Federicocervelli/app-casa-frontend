import { Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

const Calendario = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <Text h1 style={{ color: "white", textAlign: "center" }}>
        Calendario
      </Text>
    </SafeAreaView>
  );
};

export default Calendario;
