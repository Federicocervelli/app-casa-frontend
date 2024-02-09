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

const Faccende = () => {
  const { theme } = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  function handleNameChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <List />

      <FAB
        color={theme.colors.primary}
        style={{ position: "absolute", bottom: 40, right: 40 }}
        icon={{ name: "add", color: "white" }}
        onPress={() => setOpenDialog(!openDialog)}
      />

      <DialogForm
        isVisible={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </SafeAreaView>
  );
};

export default Faccende;
