import React, { Component, useCallback, useState } from "react";
import { StyleSheet, Text, View, I18nManager, ScrollView } from "react-native";
import SwipeableFlatList from "rn-gesture-swipeable-flatlist";

import {
  FlatList,
  RectButton,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler";

import GmailStyleSwipeableRow from "./SwipeableRow";
import { Icon, useTheme } from "@rneui/themed";

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

export default function List() {
  const [data, setData] = useState<Chore[]>(DATA);
  const [refreshing, setRefreshing] = useState(false);

  const deleteItem = useCallback((id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  }, []);

  const editItem = useCallback((id: string) => {
    alert(`Editing item with id ${id}`);
  }, []);

  const renderRightAction = useCallback(
    (item: Chore) => (
      <TouchableOpacity
        onPress={() => deleteItem(item.id)}
        style={styles.rightAction}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    ),
    [deleteItem]
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Fetch updated data or perform any necessary async operations

    // Simulate fetching data by delaying the reset of refreshing state
    setTimeout(() => {
      setData(DATA); // Replace with your actual refreshed data
      setRefreshing(false);
    }, 1000); // Adjust the delay as needed
  }, []);

  const renderLeftAction = useCallback(
    (item: Chore) => (
      <TouchableOpacity
        onPress={() => editItem(item.id)}
        style={styles.leftAction}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: "auto",
          }}
        >
          <Icon name="check" size={40} color="white" />
        </View>
      </TouchableOpacity>
    ),
    [editItem]
  );

  const renderItem = useCallback(
    ({ item }: { item: Chore }) => (
      <View style={styles.item}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{item.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View><Icon name="time-outline" type="ionicon" color="white" size={20} /></View>
            <Text style={{ color: "white", marginTop: -2 }}>{formatTimestamp(item.end)}</Text>
            
          </View>
        </View>
        <Text style={{ color: "white", marginTop: 10 }}>{item.desc}</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <SwipeableFlatList
        swipeableProps={{
          friction: 3,
          leftThreshold: 100,

          overshootLeft: false,
          overshootRight: false,
        }}
        data={data}
        keyExtractor={(item) => item.id}
        enableOpenMultipleRows={false} //make sure to refresh the list once you alter this
        renderItem={renderItem}
        renderLeftActions={renderLeftAction}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        //renderRightActions={renderRightAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  item: {
    padding: 20,
    backgroundColor: "#000",
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  rightAction: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  leftAction: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    height: "100%",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
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
    id: "11",
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
    id: "12",
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
