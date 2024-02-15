import {
  FAB,
  useTheme,
  ListItem,
  Button,
  Dialog,
  Input,
  Icon,
  SpeedDial,
} from "@rneui/themed";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import List from "../ChoresList";
import { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "../InputField";
import DialogForm from "../DialogForm";
import ChoreDetails from "../ChoreDetails";
import { Chore, House, User } from "../../types/types";
import { Session } from "@supabase/supabase-js";
import { IconNode } from "@rneui/base";
import { AppContext } from "../../hooks/AppCasaProvider";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Faccende = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="List"
      screenOptions={{ headerStyle: { backgroundColor: theme.colors.bgPrimary } }}
    >
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Add Chore"
        component={AddChoreScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

const ListScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const filterTypes = ["My Chores", "Created Chores", "All Chores"];
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [filterType, setFilterType] = useState("My Chores");
  const [icon, setIcon] = useState<IconNode>({
    name: "person",
    type: "ionicon",
    color: "#fff",
  });
  const { state, dispatch } = useContext(AppContext);
  const { session, houseUsers } = state;

  const cycleFilters = () => {
    // Find the index of the current filter type in the array
    const currentIndex = filterTypes.indexOf(filterType);
    // Calculate the index of the next filter type, cycling back to the beginning if needed
    const nextIndex = (currentIndex + 1) % filterTypes.length;
    // Set the next filter type and update the icon dynamically
    setFilterType(filterTypes[nextIndex]);
  };

  useEffect(() => {
    // Update the icon dynamically based on the current filterType
    switch (filterType) {
      case "My Chores":
        setIcon({
          name: "person",
          type: "ionicon",
          color: theme.colors.onBgPrimary,
        });
        break;
      case "Created Chores":
        setIcon({
          name: "person-add",
          type: "ionicon",
          color: theme.colors.onBgPrimary,
        });
        break;
      case "All Chores":
        setIcon({
          name: "list",
          type: "ionicon",
          color: theme.colors.onBgPrimary,
        });
        break;
      default:
        setIcon({
          name: "person",
          type: "ionicon",
          color: theme.colors.onBgPrimary,
        });
    }
  }, [filterType]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgPrimary,
        alignItems: "center",
      }}
    >
      <List filterType={filterType} />
      <SpeedDial
        isOpen={speedDialOpen}
        color={theme.colors.accent}
        icon={{ name: "edit", color: theme.colors.onBgPrimary }}
        openIcon={{ name: "close", color: theme.colors.onBgPrimary }}
        onOpen={() => setSpeedDialOpen(!speedDialOpen)}
        onClose={() => setSpeedDialOpen(!speedDialOpen)}
        overlayColor="rgba(0, 0, 0, 0.5)"
      >
        <SpeedDial.Action
          color={theme.colors.accent}
          icon={{ name: "add", color: theme.colors.onBgPrimary }}
          title="Add"
          onPress={() => {
            navigation.navigate("Add Chore");
            setSpeedDialOpen(false);
          }}
        />
        <SpeedDial.Action
          color={theme.colors.accent}
          icon={icon}
          title={`Filter: ${filterType}`}
          onPress={() => cycleFilters()}
        />
      </SpeedDial>
    </SafeAreaView>
  );
};

const AddChoreScreen = ({ navigation }: any) => {
  return <DialogForm />;
};

export default Faccende;
