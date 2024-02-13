import React, { Component, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import SwipeableFlatList from "rn-gesture-swipeable-flatlist";

import {
  FlatList,
  RectButton,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler";

import GmailStyleSwipeableRow from "./SwipeableRow";
import { Avatar, Icon, Skeleton, useTheme } from "@rneui/themed";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Chore, User } from "../types/types";
import ChoreDetails from "./ChoreDetails";
import { Session } from "@supabase/supabase-js";

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

interface ListProps {
  houseUsers: User[];
  session: Session;
}

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

export default function List({ houseUsers, session }: ListProps) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [visibleChores, setVisibleChores] = useState<Chore[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingChoreDone, setLoadingChoreDone] = useState(false);
  const [openChoreDialog, setOpenChoreDialog] = useState<Chore | null>(null);

  // When user is loaded, fetch data
  useEffect(() => {
    fetchChoresFromApi();
  }, []);

  // When data changes, update visibleData
  useEffect(() => {
    const filteredByDone = chores.filter((chore) => !chore.is_done);
    const filteredByUser = filteredByDone.filter((chore) =>
      chore.users.includes(session.user.id)
    );
    setVisibleChores(filteredByUser);
  }, [chores]);

  // Fetch data from API
  const fetchChoresFromApi = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/house/chores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const apiResponse = await response.json();

      if (!response.ok) {
        console.error("Error fetching data:", apiResponse);
        setChores([]);
        setLoading(false);
        return;
      }

      setChores(apiResponse);
      setLoading(false);
    } catch (error) {
      console.error("Uncaught error fetching data:", error);
      setChores([]);
      setLoading(false);
      return;
    }
  };

  // Delete item from API and update data with response
  const deleteItem = useCallback(async (id: string) => {
    console.log("Deleting item with id: ", id);
    if (loadingChoreDone) {
      return;
    }
    setLoadingChoreDone(true);

    const result = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v2/chore/${id}/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!result.ok) {
      console.error("Error deleting item:", result);
    }

    const response = await result.json();
    const newChore = response[0];

    // Find the index of the chore with the same ID as newChore
    console.log(chores.map( (chore) => chore.id));
    const indexToUpdate = chores.findIndex((chore) => chore.id === id);

    if (indexToUpdate !== -1) {
      // If a chore with the same ID is found, update the array
      const updatedChores = [...chores];
      updatedChores[indexToUpdate] = newChore;
      setChores(updatedChores);
    } else {
      console.error("Chore with the same ID not found");
    }

    setLoadingChoreDone(false);
  }, []);

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChoresFromApi().then(() => setRefreshing(false));
  }, []);

  const handleItemPress = (item: Chore) => {
    //console.log("Item pressed:", item);
    setOpenChoreDialog(item);
  };

  const renderLeftAction = useCallback(
    (item: Chore) => (
      <TouchableOpacity
        onPress={() => deleteItem(item.id)}
        style={styles.leftAction}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: "auto",
          }}
        >
          {loadingChoreDone ? (
            <ActivityIndicator size={40} color="white" />
          ) : (
            <Icon name="check" size={40} color="white" />
          )}
        </View>
      </TouchableOpacity>
    ),
    [loadingChoreDone]
  );

  const renderItem = ({ item, index }: { item: Chore; index: number }) => (
    <>
      <Pressable
        onPress={() => handleItemPress(item)}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#222" : "#000",
          },
          styles.item,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {item.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View>
              <Icon
                name="time-outline"
                type="ionicon"
                color="white"
                size={20}
              />
            </View>
            <Text style={{ color: "white", marginTop: -2 }}>
              {formatTimestamp(item.end)}
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", marginTop: 10 }}>{item.desc}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: -10 }}
          >
            {item.users.map((user, index) => (
              <Avatar
                rounded={true}
                key={index}
                size={20}
                source={{ uri: getUserImage(user, houseUsers) }}
              />
            ))}
          </View>
        </View>
      </Pressable>
    </>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  const noItems: Chore = {
    id: "default-item-id",
    users: [],
    house: "",
    start: 0,
    end: 0,
    done_at: null,
    name: "Faccende Finite!",
    desc: "Prova a scorrere verso il basso per vedere se ci sono aggiornamenti.",
    is_done: false,
    is_periodic: false,
    cyclicality: "Giornaliera",
    day_of_week: null,
    day_of_month: null,
    created_by: "",
    created_at: 0,
  };

  return (
    <>
      <View style={styles.container}>
        <SwipeableFlatList
          swipeableProps={{
            friction: 3,
            leftThreshold: 100,
            overshootLeft: false,
            overshootRight: false,
          }}
          data={visibleChores.length > 0 ? visibleChores : [noItems]}
          keyExtractor={(item) => item.id}
          enableOpenMultipleRows={false}
          renderItem={renderItem}
          renderLeftActions={
            visibleChores.length > 0 ? renderLeftAction : undefined
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <ChoreDetails
        houseUsers={houseUsers}
        item={openChoreDialog}
        onClose={() => setOpenChoreDialog(null)}
      />
    </>
  );
}

const LoadingSkeleton: React.FC = () => {
  // Implement your loading skeleton component
  // You can use libraries like Shimmer to create loading skeletons
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <View
            style={[
              styles.item,
              { borderBottomWidth: 1, borderBottomColor: "#333" },
            ]}
            key={index}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Skeleton animation="wave" style={{ width: 100 }} />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View>
                  <Icon
                    name="time-outline"
                    type="ionicon"
                    color="white"
                    size={20}
                  />
                </View>
                <Skeleton animation="wave" style={{ width: 100 }} />
              </View>
            </View>
            <Skeleton animation="wave" style={{ width: 200, marginTop: 10 }} />
            <Skeleton animation="wave" style={{ width: 200, marginTop: 5 }} />
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  loadingContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#333", // Change the color to match your design
  },
  item: {
    width: "100%",
    padding: 20,
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
function getUserImage(item: string, houseUsers: User[]): string | undefined {
  const user = houseUsers?.find((user) => user.id === item);
  if (user) {
    return user.avatar_url;
  }
  return undefined;
}
