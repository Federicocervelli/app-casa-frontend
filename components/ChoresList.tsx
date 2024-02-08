import React, { Component, useState } from "react";
import { StyleSheet, Text, View, I18nManager, ScrollView } from "react-native";
import SwipeableFlatList from "rn-gesture-swipeable-flatlist";

import { FlatList, RectButton } from "react-native-gesture-handler";

import GmailStyleSwipeableRow from "./SwipeableRow";
import { useTheme } from "@rneui/themed";

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

type Chore = {
  id: string; // UUID (Primary Key)
  users: string[]; // Array of UUIDs (Foreign Keys)
  house: string; // UUID (Foreign Key)
  start: number; // Timestamp
  end: number; // Timestamp
  done_at?: number | null; // Optional Timestamp
  name: string; // Required
  desc?: string | null; // Optional
  is_done: boolean;
  is_periodic: boolean; // Default: False
  cyclicality: "Giornaliera" | "Settimanale" | "Mensile"; // Enumerated Type
  day_of_week?: number | null; // Optional (0-6)
  day_of_month?: number | null; // Optional (0-31)
};

function formatTimestamp(timestampInSeconds: number): string {
  const currentDate = new Date();
  const targetDate = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds

  // Check if the timestamp is in the past
  if (targetDate < currentDate) {
    const timeDifference = currentDate.getTime() - targetDate.getTime();
    const millisecondsPerHour = 60 * 60 * 1000;
    const hoursDifference = Math.floor(timeDifference / millisecondsPerHour);

    if (hoursDifference < 24) {
      return `Late by ${hoursDifference} ${
        hoursDifference === 1 ? "hour" : "hours"
      }`;
    } else {
      const daysDifference = Math.floor(hoursDifference / 24);
      return `Late by ${daysDifference} ${
        daysDifference === 1 ? "day" : "days"
      }`;
    }
  }

  // Calculate time difference in milliseconds
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const millisecondsPerHour = 60 * 60 * 1000;
  const hoursDifference = Math.floor(timeDifference / millisecondsPerHour);

  if (hoursDifference < 1) {
    return "in less than an hour";
  } else if (hoursDifference === 1) {
    return "in 1 hour";
  } else if (
    hoursDifference < 24 &&
    targetDate.getDate() === currentDate.getDate()
  ) {
    return `today at ${targetDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (
    hoursDifference < 48 &&
    targetDate.getDate() === currentDate.getDate() + 1
  ) {
    return `tomorrow at ${targetDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    const daysDifference = Math.ceil(hoursDifference / 24);
    return `in ${daysDifference} days`;
  }
}

const Row = ({ item }: { item: Chore }) => {
  const handlePress = () => {
    // eslint-disable-next-line no-alert
    window.alert(item.id);
  };

  const { theme } = useTheme();

  return (
    <RectButton
      style={[styles.rectButton, { backgroundColor: "black" }]}
      onPress={handlePress}
    >
      <Text style={styles.fromText}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.messageText}>
        {item.desc}
      </Text>
      <Text style={styles.dateText}>{formatTimestamp(item.end)} ❭</Text>
    </RectButton>
  );
};

export default function List() {

  const [data, setData] = useState<Chore[]>(DATA);

  const {theme} = useTheme();

  const handleSwipeSignal = (id: string, direction: string) => {
    console.log(`Swiped ${direction} from ${id}`);
    // remove the item from the list
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <SwipeableFlatList
      data={data}
      ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.grey0 }]} />}
      renderItem={({ item }) => (
        <GmailStyleSwipeableRow onSwipe={handleSwipeSignal} id={item.id}>
          <Row item={item} />
        </GmailStyleSwipeableRow>
      )}
      keyExtractor={(_item, index) => `message ${index}`}
    />
  );
}

const styles = StyleSheet.create({
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "#fff",
  },
  messageText: {
    color: "#999",
    backgroundColor: "transparent",
  },
  dateText: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 20,
    top: 10,
    color: "#999",
    fontWeight: "bold",
  },
});

const DATA: Chore[] = [
  {
    id: "1",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Grocery Shopping",
    desc: "Purchase fresh produce, dairy products, and pantry essentials for the week.",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: null,
    day_of_month: null,
  },
  {
    id: "2",
    users: ["user3"],
    house: "house2",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Clean Living Room",
    desc: "Dust surfaces, vacuum carpets, and organize items in the living room.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Settimanale",
    day_of_week: 3, // Wednesday (0-6, Sunday to Saturday)
    day_of_month: null,
  },
  {
    id: "3",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Monthly Yard Work",
    desc: "Trim bushes, mow the lawn, and remove any debris from the yard.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Mensile",
    day_of_week: null,
    day_of_month: 15, // On the 15th day of the month
  },
  {
    id: "4",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Grocery Shopping",
    desc: "Purchase fresh produce, dairy products, and pantry essentials for the week.",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: null,
    day_of_month: null,
  },
  {
    id: "5",
    users: ["user3"],
    house: "house2",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Clean Living Room",
    desc: "Dust surfaces, vacuum carpets, and organize items in the living room.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Settimanale",
    day_of_week: 3, // Wednesday (0-6, Sunday to Saturday)
    day_of_month: null,
  },
  {
    id: "6",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Monthly Yard Work",
    desc: "Trim bushes, mow the lawn, and remove any debris from the yard.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Mensile",
    day_of_week: null,
    day_of_month: 15, // On the 15th day of the month
  },
  {
    id: "7",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Grocery Shopping",
    desc: "Purchase fresh produce, dairy products, and pantry essentials for the week.",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: null,
    day_of_month: null,
  },
  {
    id: "8",
    users: ["user3"],
    house: "house2",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Clean Living Room",
    desc: "Dust surfaces, vacuum carpets, and organize items in the living room.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Settimanale",
    day_of_week: 3, // Wednesday (0-6, Sunday to Saturday)
    day_of_month: null,
  },
  {
    id: "9",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Monthly Yard Work",
    desc: "Trim bushes, mow the lawn, and remove any debris from the yard.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Mensile",
    day_of_week: null,
    day_of_month: 15, // On the 15th day of the month
  },
  {
    id: "10",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Grocery Shopping",
    desc: "Purchase fresh produce, dairy products, and pantry essentials for the week.",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: null,
    day_of_month: null,
  },
  {
    id: "12",
    users: ["user3"],
    house: "house2",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Clean Living Room",
    desc: "Dust surfaces, vacuum carpets, and organize items in the living room.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Settimanale",
    day_of_week: 3, // Wednesday (0-6, Sunday to Saturday)
    day_of_month: null,
  },
  {
    id: "13",
    users: ["user1", "user2"],
    house: "house1",
    start: 1707612892, // Timestamp for a specific date and time
    end: 1707612892, // Timestamp for a specific date and time
    done_at: null,
    name: "Monthly Yard Work",
    desc: "Trim bushes, mow the lawn, and remove any debris from the yard.",
    is_done: false,
    is_periodic: true,
    cyclicality: "Mensile",
    day_of_week: null,
    day_of_month: 15, // On the 15th day of the month
  },
];
