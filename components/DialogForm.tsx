// DialogForm.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions 
} from "react-native";
import InputField from "./InputField";
import { Avatar, Button, Dialog, Icon, useTheme } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@clerk/clerk-expo";

interface DialogFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const DialogForm: React.FC<DialogFormProps> = ({ isVisible, onClose }) => {

  const {getToken} = useAuth();

  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [houseUsers, setHouseUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const pickerRef = useRef();

  useEffect(() => {
    console.log("time:", time);
  },[time]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    if(mode === "date"){
      setDate(currentDate);
    } else {
      setTime(currentDate);
    }
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  }

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  const handleDescriptionChange = (value: string): void => {
    setDescription(value);
  };

  const fetchDataFromApi = async () => {
    try {
      setUsersLoading(true);
      // Assuming you have a function to get the bearer token
      const bearerToken = await getToken()

      const response = await fetch(
        "https://app-casa-backend.federicocervelli01.workers.dev/api/v1/user/house/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiResponse = await response.json();

      setHouseUsers(apiResponse);
      setUsersLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    // Call the function to fetch data when the component mounts
    fetchDataFromApi();
  }, []);

  // Add any other logic you need here, for example, handling form submission


  return (
    <Dialog
      overlayStyle={{ backgroundColor: "#111", width: "90%", borderColor: "#555", borderWidth: 1, borderRadius: 10 }}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      isVisible={isVisible}
      onBackdropPress={onClose}
      onDismiss={onClose}
    >
      <Dialog.Title
        titleStyle={{ color: "white" }}
        title="Aggiungi una nuova faccenda"
      />
      <ScrollView style={{ width: "100%" }}>
        <View
          style={{
            width: "100%",
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
              textColor="#fff"
              baseColor="#aaa"
              contentInset={{ left: 18 }}
              labelOffset={{ x1: 8 }}
            />
            <Button
              buttonStyle={{ borderRadius: 999, width: 50, height: 50 }}
              containerStyle={{ marginLeft: 10, marginTop: -7 }}
              icon={
                <Icon
                  name="calendar-month"
                  color="white"
                  
                />
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
              textColor="#fff"
              baseColor="#aaa"
              contentInset={{ left: 18 }}
              labelOffset={{ x1: 8 }}
            />
            <Button
              buttonStyle={{ borderRadius: 999, width: 50, height: 50 }}
              containerStyle={{ marginLeft: 10, marginTop: -7 }}
              icon={
                <AntDesign
                  name="clockcircle"
                  color="white"
                  size={20}
                />
              }
              onPress={showTimepicker}
            ></Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode={mode}
              display="default"
              onChange={onChange}
            />
          )}


          <View style={styles.container}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              activeColor={theme.colors.primary}
              alwaysRenderSelectedItem
              containerStyle={{ minWidth: "90%", borderRadius: 8, overflow: "hidden", backgroundColor: "#222", borderColor: "#555", borderWidth: 1 }}
              maxHeight={500}
              backgroundColor='rgba(0, 0, 0, 0.5)'
              iconStyle={styles.iconStyle}
              iconColor="white"
              mode="modal"
              data={houseUsers}
              labelField="label"
              valueField="value"
              placeholder="Seleziona utenti"
              key={"users"}
              value={selectedUsers}
              onChange={(item) => {
                setSelectedUsers(item);
              }}
              renderItem={( item ) => (
                <View style={styles.item}>
                  <Text style={styles.selectedTextStyle}>{item.name}</Text>
                  <Avatar rounded source={{ uri: item.image }} />
                </View>
              )}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Avatar rounded source={{ uri: item.image }} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </Dialog>
  );
};

export default DialogForm;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    width: "100%",
    height: 55,
    borderRadius: 5,
    padding: 12,
    borderColor: "#aaa",
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
    marginLeft: 5,
  },
  selectedTextStyle: {
    fontSize: 24,
    color: "white",
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
