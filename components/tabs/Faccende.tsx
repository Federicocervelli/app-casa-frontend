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
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "../InputField";
import DialogForm from "../DialogForm";
import ChoreDetails from "../ChoreDetails";
import { Chore, House, User } from "../../types/types";
import { Session } from "@supabase/supabase-js";
import { IconNode } from "@rneui/base";

interface FaccendeProps {
  house: House;
  houseUsers: User[];
  session: Session;
}

const Faccende: React.FC<FaccendeProps> = ({ houseUsers, house, session }) => {
  const filterTypes = ["My Chores", "Created Chores", "All Chores"];
  const { theme } = useTheme();
  const [openNewChoreDialog, setOpenNewChoreDialog] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [filterType, setFilterType] = useState("My Chores");
  const [icon, setIcon] = useState<IconNode>({ name: "person", type: "ionicon", color: "#fff" });

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
        setIcon({ name: "person", type: "ionicon", color: "#fff" });
        break;
      case "Created Chores":
        setIcon({ name: "person-add", type: "ionicon", color: "#fff" });
        break;
      case "All Chores":
        setIcon({ name: "list", type: "ionicon", color: "#fff" });
        break;
      default:
        setIcon({ name: "person", type: "ionicon", color: "#fff" });
    }
  }, [filterType]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <List houseUsers={houseUsers} session={session} filterType={filterType} />

      <SpeedDial
        isOpen={speedDialOpen}
        color={theme.colors.primary}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setSpeedDialOpen(!speedDialOpen)}
        onClose={() => setSpeedDialOpen(!speedDialOpen)}
        overlayColor="rgba(0, 0, 0, 0.5)"
      >
        <SpeedDial.Action
          color={theme.colors.primary}
          icon={{ name: "add", color: "#fff" }}
          title="Add"
          onPress={() => {setOpenNewChoreDialog(!openNewChoreDialog); setSpeedDialOpen(false)}}
        />
        <SpeedDial.Action
          color={theme.colors.primary}
          icon={icon}
          title={`Filter: ${filterType}`}
          onPress={() => cycleFilters()}
        />
      </SpeedDial>

      <DialogForm
        isVisible={openNewChoreDialog}
        onClose={() => setOpenNewChoreDialog(false)}
        houseUsers={houseUsers}
        session={session}
      />

    </SafeAreaView>
  );
};

export default Faccende;
