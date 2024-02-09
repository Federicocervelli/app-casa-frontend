import React, { Component, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import SwipeableFlatList from "rn-gesture-swipeable-flatlist";

import {
  FlatList,
  RectButton,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler";

import GmailStyleSwipeableRow from "./SwipeableRow";
import { Icon, Skeleton, useTheme } from "@rneui/themed";
import { useAuth, useUser } from "@clerk/clerk-expo";

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
  const [data, setData] = useState<Chore[]>([]);
  const [visibleData, setVisibleData] = useState<Chore[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingChoreDone, setLoadingChoreDone] = useState(false);
  const { getToken } = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();

  // Set loading when component mounts
  useEffect(() => {
    setLoading(true);
  }, []);

  // When user is loaded, fetch data
  useEffect(() => {
    if (isLoaded && isSignedIn ) {
      onRefresh();
    } 
  }, [isLoaded]);

  // When data changes, update visibleData
  useEffect(() => {
    setVisibleData(data.filter((chore) => !chore.is_done));
  }, [data]);
  
  // Fetch data from API
  const fetchData = async () => {
    try {
      // Assuming you have a function to get the bearer token
      const bearerToken = await getToken();

      const response = await fetch(
        "https://app-casa-backend.federicocervelli01.workers.dev/api/v1/chores",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const apiResponse = await response.json();

      if (!response.ok) {
        console.error("Error fetching data:", apiResponse);
        setData([]);
        setLoading(false);
        return;
      }

      setData(apiResponse);
      setLoading(false);
    } catch (error) {
      console.error("Uncaught error fetching data:", error);
      setData([]);
      setLoading(false);
      return;
    }
  };

  // Delete item from API and update data with response
  const deleteItem = useCallback(async (id: string) => {
    if (loadingChoreDone) {
      return;
    }
    setLoadingChoreDone(true);

    const result = await fetch(
      `https://app-casa-backend.federicocervelli01.workers.dev/api/v1/chore/${id}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (!result.ok) {
      console.error("Error deleting item:", result);
    }

    setData(await result.json());
    setLoadingChoreDone(false);
  }, []);

  // Refresh data 
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

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

  const renderItem = useCallback(
    ({ item, index }: { item: Chore; index: number }) => (
      <>
        <View style={styles.item}>
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
              <Text style={{ color: "white", marginTop: -2 }}>
                {formatTimestamp(item.end)}
              </Text>
            </View>
          </View>
          <Text style={{ color: "white", marginTop: 10 }}>{item.desc}</Text>
        </View>
      </>
    ),
    []
  );

  if (loading) {
    // Show loading skeleton or any other loading indicator
    return <LoadingSkeleton />;
  }

  const noItems: Chore = {
    id: 'default-item-id',
    users: [],
    house: '',
    start: 0,
    end: 0,
    done_at: null,
    name: 'Faccende Finite!',
    desc: 'Prova a scorrere verso il basso per vedere se ci sono aggiornamenti.',
    is_done: false,
    is_periodic: false,
    cyclicality: 'Giornaliera',
    day_of_week: null,
    day_of_month: null,
  };

  return (
    <View style={styles.container}>
      <SwipeableFlatList
        swipeableProps={{
          friction: 3,
          leftThreshold: 100,
          overshootLeft: false,
          overshootRight: false,
        }}
        data={visibleData.length > 0 ? visibleData : [noItems]}
        keyExtractor={(item) => item.id}
        enableOpenMultipleRows={false}
        renderItem={renderItem}
        renderLeftActions={
          visibleData.length > 0 ? renderLeftAction : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const LoadingSkeleton: React.FC = () => {
  // Implement your loading skeleton component
  // You can use libraries like Shimmer to create loading skeletons
  return (
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
    backgroundColor: "#000",
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
