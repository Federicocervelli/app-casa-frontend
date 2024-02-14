import { Text } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <ScrollView>
        <Text style={{ color: "white" }}>History</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
