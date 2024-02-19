import {
  FAB,
  useTheme,
  ListItem,
  Button,
  Dialog,
  Input,
  Icon,
  SpeedDial,
  Text,
  Avatar,
} from "@rneui/themed";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import List from "../ChoresList";
import { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import InputField from "../InputField";
import DialogForm from "../DialogForm";
import { Chore, House, User } from "../../types/types";
import { Session } from "@supabase/supabase-js";
import { IconNode } from "@rneui/base";
import { AppContext } from "../../hooks/AppCasaProvider";
import { createStackNavigator } from "@react-navigation/stack";
import EditForm from "../EditForm";

const Stack = createStackNavigator();

const Faccende = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { selectedChore, session } = state;
  return (
    <Stack.Navigator
      initialRouteName="List"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bgPrimary },
      }}
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
      <Stack.Screen
        name="Edit Chore"
        component={EditChoreScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Chore Details"
        component={ChoreDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerRight: () => (
            selectedChore?.created_by === session?.user.id && (
              <TouchableOpacity


                onPress={() => {
                  navigation.navigate("Edit Chore");
                }}
                style={{ marginRight: 20 }}
              >
                <Icon name="pencil-outline" type="material-community" color={theme.colors.onBgPrimary} />

              </TouchableOpacity>
            )
          ),
        })}
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
      <List filterType={filterType} navigation={navigation} />
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
  return <DialogForm navigation={navigation} />;
};

const ChoreDetailsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { houseUsers, selectedChore, session } = state;

  function formatTimestamp(timestamp: number | undefined | null): string {
    if (timestamp === 0 || timestamp === null || timestamp === undefined) {
      return "N/A";
    }
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    if (isNaN(date.getTime())) {
      return "N/A"; // Handle invalid date
    }
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  }

  function getUserName(
    created_by: string | undefined,
    houseUsers: User[]
  ): string {
    if (created_by === "" || created_by === undefined) {
      return "N/A";
    }
    if (!houseUsers) {
      return "N/A";
    }
    const user = houseUsers.find((user) => user.id === created_by);
    if (user === undefined) {
      return "N/A";
    }
    return user.display_name;
  }

  function getUserImage(item: string, houseUsers: User[]): string | undefined {
    const user = houseUsers?.find((user) => user.id === item);
    if (user) {
      return user.avatar_url;
    }
    return undefined;
  }

  useEffect(() => {
    console.log("selectedChore:", selectedChore);
  }, [selectedChore]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{  flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
        <View>
          <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold", fontSize: 30 }}>
            {selectedChore?.name}
          </Text>
          <Text style={{ color: theme.colors.onBgSecondary, marginTop: 20, fontSize: 18 }}>
            {selectedChore?.desc}
          </Text>
          {/** Assigned To */}
          <View style={{ marginTop: 20, flexDirection: "column", gap: 10 }}>
            {selectedChore?.users.map((user, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar
                  rounded={true}
                  key={index}
                  size={50}
                  source={{ uri: getUserImage(user, houseUsers) }}
                />
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                  <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold" }}>Assigned to</Text>
                  <Text style={{ color: theme.colors.onBgSecondary, fontSize: 16 }}>{getUserName(user, houseUsers)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20, flexDirection: "column", gap: 10 }}>
          {/** Due Date */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: theme.colors.bgSecondary, borderRadius: 5 }}>
              <Icon name="calendar-clear-outline" type="ionicon" size={30} color={theme.colors.onBgSecondary} />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 10 }}>
              <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold" }}>Due date</Text>
              <Text style={{ color: theme.colors.onBgSecondary }}>{formatTimestamp(selectedChore?.end)}</Text>
            </View>
          </View>
          {/**Status */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: theme.colors.bgSecondary, borderRadius: 5 }}>
              <Icon name={selectedChore?.is_done === true ? "checkmark-circle-outline" : "close-circle-outline"} type="ionicon" size={30} color={theme.colors.onBgSecondary} />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 10 }}>
              <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold" }}>Status</Text>
              <Text style={{ color: theme.colors.onBgSecondary }}>{selectedChore?.is_done === true ? "Done" : "Not done"}</Text>
            </View>
          </View>
          {/** Created By */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                rounded={true}
                size={50}
                source={{ uri: getUserImage(selectedChore?.created_by || "", houseUsers) }}
              />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 10 }}>
              <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold" }}>Created by</Text>
              <Text style={{ color: theme.colors.onBgSecondary }}>{getUserName(selectedChore?.created_by, houseUsers)}</Text>
            </View>
          </View>
          {/** Created At */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: theme.colors.bgSecondary, borderRadius: 5 }}>
              <Icon name="calendar-clear-outline" type="ionicon" size={30} color={theme.colors.onBgSecondary} />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 10 }}>
              <Text style={{ color: theme.colors.onBgPrimary, fontWeight: "bold" }}>Created at</Text>
              <Text style={{ color: theme.colors.onBgSecondary }}>{formatTimestamp(selectedChore?.created_at)}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EditChoreScreen = ({ navigation }: { navigation: any; }) => {
  const { state, dispatch } = useContext(AppContext);
  return <EditForm navigation={navigation} />;
}

export default Faccende;
