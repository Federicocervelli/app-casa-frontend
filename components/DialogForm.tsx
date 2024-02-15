// DialogForm.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import InputField from "./InputField";
import { Avatar, Button, Dialog, Icon, useTheme } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { User } from "../types/types";
import { Session } from "@supabase/supabase-js";
import { AppContext } from "../hooks/AppCasaProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const DialogFormScreen = ({navigation} : any) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { state, dispatch } = useContext(AppContext);
  const { session, houseUsers } = state;

  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    if (mode === "date") {
      setDate(currentDate);
    } else {
      setTime(currentDate);
    }
  };
  const showMode = (currentMode: "date" | "time") => {
    setShowDatePicker(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const showTimepicker = () => {
    showMode("time");
  };
  const handleNameChange = (value: string): void => {
    setName(value);
  };
  const handleDescriptionChange = (value: string): void => {
    setDescription(value);
  };
  async function handleSubmit() {
    if (!session)
      return console.error("You need to be logged in to create a house");
    //validate fields
    if (!name || !description || !date || !time || !selectedUsers) {
      console.error("Missing fields");
      return;
    }
    // Extract components from date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const combinedDateTime = new Date(year, month, day, hour, minute);
    const timestamp = combinedDateTime.getTime() / 1000;
    // Send data to API
    console.log("name:", name);
    console.log("desc:", description);
    console.log("end:", timestamp);
    console.log("users:", selectedUsers);
    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/chores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name,
          desc: description,
          end: timestamp,
          users: selectedUsers,
        }),
      }
    );
    if (result.ok) {
      console.log("Chore created successfully");
    } else {
      console.error("Error creating chore:", await result.json());
    }
    // reset fields
    setName("");
    setDescription("");
    setDate(new Date());
    setTime(new Date());
    setSelectedUsers([]);
    // Close the dialog
    navigation.goBack();
    
  }
  // Add any other logic you need here, for example, handling form submission
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        backgroundColor: theme.colors.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "90%",
          flexDirection: "column",
          flex: 1,
          gap: 10,
          marginTop: 20,
        }}
      >
        <InputField label="Nome Faccenda" onInputChange={handleNameChange} />
        <InputField
          label="Descrizione"
          onInputChange={handleDescriptionChange}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <OutlinedTextField
            label="Data"
            value={`${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`}
            editable={false}
            containerStyle={{
              flex: 1,
            }}
            textColor={theme.colors.onBgPrimary}
            baseColor={theme.colors.onBgSecondary}
            contentInset={{ left: 18 }}
            labelOffset={{ x1: 8 }}
          />
          <Button
            color={theme.colors.accent}
            buttonStyle={{ borderRadius: 999, width: 50, height: 50 }}
            containerStyle={{ marginLeft: 10, marginTop: -7 }}
            icon={
              <Icon name="calendar-month" color={theme.colors.onBgPrimary} />
            }
            onPress={showDatepicker}
          ></Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <OutlinedTextField
            label="Ora"
            value={`${time.getHours()}:${time.getMinutes()}`}
            editable={false}
            containerStyle={{
              flex: 1,
            }}
            textColor={theme.colors.onBgPrimary}
            baseColor={theme.colors.onBgSecondary}
            contentInset={{ left: 18 }}
            labelOffset={{ x1: 8 }}
          />
          <Button
            buttonStyle={{ borderRadius: 999, width: 50, height: 50 }}
            color={theme.colors.accent}
            containerStyle={{ marginLeft: 10, marginTop: -7 }}
            icon={
              <AntDesign
                name="clockcircle"
                color={theme.colors.onBgPrimary}
                size={20}
              />
            }
            onPress={showTimepicker}
          ></Button>
        </View>
        {showDatePicker && (
          <DateTimePicker
            accentColor={theme.colors.accent}
            testID="datePicker"
            value={date}
            mode={mode === "date" ? "date" : "time"}
            display="default"
            onChange={onChange as any}
          />
        )}
        <View style={styles.container}>
          <MultiSelect
            style={[
              styles.dropdown,
              { borderColor: theme.colors.onBgSecondary },
            ]}
            placeholderStyle={{
              color: theme.colors.onBgSecondary,
              marginLeft: 5,
              fontSize: 16,
            }}
            selectedTextStyle={{ color: theme.colors.onBgPrimary }}
            activeColor={theme.colors.accent}
            alwaysRenderSelectedItem
            containerStyle={{
              minWidth: "90%",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: theme.colors.bgPrimary,
              borderColor: theme.colors.onBgSecondary,
            }}
            maxHeight={500}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            iconStyle={styles.iconStyle}
            iconColor={theme.colors.onBgPrimary}
            mode="modal"
            data={houseUsers}
            labelField="display_name"
            valueField="id"
            placeholder="Seleziona utenti"
            value={selectedUsers}
            onChange={(items) => {
              console.log("Selected items: ", items);
              // Extract user ids from selected items
              setSelectedUsers(items);
            }}
            renderItem={(item) => (
              <View style={styles.item}>
                <Text style={{ color: theme.colors.onBgPrimary, fontSize: 24 }}>
                  {item.display_name}
                </Text>
                <Avatar rounded source={{ uri: item.avatar_url }} />
              </View>
            )}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Avatar rounded source={{ uri: item.avatar_url }} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <View style={{ width: "90%", alignSelf: "center", marginBottom: 20 }}>
        <Button
          icon={<Icon name="add" color={theme.colors.onBgPrimary} />}
          iconPosition="left"
          title="Crea Faccenda"
          containerStyle={{ borderRadius: 20 }}
          buttonStyle={{ padding: 15 }}
          color={theme.colors.accent}
          titleStyle={{ color: theme.colors.onBgPrimary }}
          onPress={() => handleSubmit()}
        />
      </View>
    </View>
  );
};
export default DialogFormScreen;
const styles = StyleSheet.create({
  container: {},
  dropdown: {
    width: "100%",
    height: 55,
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginRight: 12,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
