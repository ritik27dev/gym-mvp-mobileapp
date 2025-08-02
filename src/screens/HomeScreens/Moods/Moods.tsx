import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MoodChart from "./MoodChart";

const sampleData = [
  {
    type: "DAILY_CHECKIN",
    mood: "ANGRY",
    createdAt: "2025-07-28T10:00:00.000Z",
  },
  {
    type: "POST_MEDITATION",
    mood: "ANGRY",
    createdAt: "2025-07-28T10:10:00.000Z",
  },
  {
    type: "POST_WORKOUT",
    mood: "CONTENT",
    createdAt: "2025-07-28T10:20:00.000Z",
  },
  {
    type: "DAILY_CHECKIN",
    mood: "STRESSED",
    createdAt: "2025-07-29T10:00:00.000Z",
  },
  {
    type: "POST_MEDITATION",
    mood: "HAPPY",
    createdAt: "2025-07-29T10:10:00.000Z",
  },
  {
    type: "POST_WORKOUT",
    mood: "NEUTRAL",
    createdAt: "2025-07-29T10:20:00.000Z",
  },
  {
    type: "DAILY_CHECKIN",
    mood: "HAPPY",
    createdAt: "2025-07-30T10:00:00.000Z",
  },
  {
    type: "POST_MEDITATION",
    mood: "CONTENT",
    createdAt: "2025-07-30T10:10:00.000Z",
  },
  {
    type: "POST_WORKOUT",
    mood: "STRESSED",
    createdAt: "2025-07-30T10:20:00.000Z",
  },
  {
    type: "DAILY_CHECKIN",
    mood: "HAPPY",
    createdAt: "2025-07-31T10:00:00.000Z",
  },
  {
    type: "POST_MEDITATION",
    mood: "HAPPY",
    createdAt: "2025-07-31T10:10:00.000Z",
  },
  {
    type: "POST_WORKOUT",
    mood: "STRESSED",
    createdAt: "2025-07-31T10:20:00.000Z",
  },
  {
    type: "POST_WORKOUT",
    mood: "CONTENT",
    createdAt: "2025-08-01T10:20:00.000Z",
  },
];

export default function Moods() {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Moods Page!</Text>
      <MoodChart data={sampleData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
