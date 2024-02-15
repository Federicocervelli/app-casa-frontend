import { Text, useTheme } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bgPrimary, alignItems: "center" }}
    >
      <ScrollView>
        <Text style={{ color: "white" }}>History</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
