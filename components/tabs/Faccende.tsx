import { FAB, useTheme, ListItem, Button } from "@rneui/themed";
import {  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import List from "../ChoresList";


const sampleData = [
  {
    id: 1,
    name: "Pulire Immondizia",
    desc: "Pulire immondizia",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: 0,
    day_of_month: 0,
    start: new Date(),
    end: new Date(),
    users: [],
    house: null,
  },
  {
    id: 2,
    name: "Pulire casa",
    desc: "Pulire casa",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: 0,
    day_of_month: 0,
    start: new Date(),
    end: new Date(),
    users: [],
    house: null,
  },
];

const Faccende = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <List/>
      
      <FAB
        color={theme.colors.primary}
        style={{ position: "absolute", bottom: 40, right: 40 }}
        icon={{ name: "add", color: "white" }}
      />
    </SafeAreaView>
  );
};

export default Faccende;
