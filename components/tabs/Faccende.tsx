import {
  FAB,
  useTheme,
  ListItem,
  Button,
  Dialog,
  Input,
  Icon,
} from "@rneui/themed";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import List from "../ChoresList";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "../InputField";
import DialogForm from "../DialogForm";
import ChoreDetails from "../ChoreDetails";
import { Chore, User } from "../../types/types";
import { Session } from "@supabase/supabase-js";

interface FaccendeProps {
  house: string;
  houseUsers: User[];
  session: Session;
}

const Faccende: React.FC<FaccendeProps> = ({ houseUsers, house, session }) => {
  const { theme } = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <List houseUsers={houseUsers} session={session} />

      <FAB
        color={theme.colors.primary}
        style={{ position: "absolute", bottom: 40, right: 40 }}
        icon={{ name: "add", color: "white" }}
        onPress={() => setOpenDialog(!openDialog)}
      />

      <DialogForm
        isVisible={openDialog}
        onClose={() => setOpenDialog(false)}
        houseUsers={houseUsers}
        session={session}
      />
    </SafeAreaView>
  );
};

export default Faccende;
