import { Dialog, Text, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Chore, User } from "../types/types";
import { View } from "react-native";

interface ChoreDetailsProps {
  item: Chore | null;
  onClose: () => void;
  houseUsers: User[];
}

function formatTimestamp(timestamp: number | undefined | null): string {
  if (timestamp === 0 || timestamp === null || timestamp === undefined) {return "N/A"}
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  if (isNaN(date.getTime())) {
    return "N/A"; // Handle invalid date
  }
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
}

function getUserName(created_by: string | undefined, houseUsers: User[]): string {
  if (created_by === "" || created_by === undefined) {
    return "N/A";
  }
  if ( !houseUsers ){
    return "N/A";
  }
  const user = houseUsers.find((user) => user.id === created_by);
  if (user === undefined) {
    return "N/A";
  }
  return user.display_name;
}


function ChoreDetails({ item, onClose, houseUsers }: ChoreDetailsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (item !== null) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [item]);

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={{ backgroundColor: theme.colors.bgPrimary }}
    >
      <Dialog.Title title={item?.name} titleStyle={{ color: theme.colors.onBgPrimary }} />
      <Text style={{ color: theme.colors.onBgSecondary }}>{item?.desc}</Text>
      <View style={{marginTop: 10}}/>
      <Text style={{ color: theme.colors.onBgSecondary }}>created at {formatTimestamp(item?.created_at)} by {getUserName(item?.created_by, houseUsers)}</Text>
    </Dialog>
  );
}

export default ChoreDetails;
