import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomePage() {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Home Page!</Text>
      <TouchableOpacity
        style={{ backgroundColor: "#28A745", borderRadius: 12, marginTop: 20 }}
        onPress={() => navigation.navigate("MealPage")}
      >
        <Text
          style={{
            padding: 20,
            fontWeight: "800",
            color: "#fff",
          }}
        >
          Navigate to meals sections
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#224a2dff",
          borderRadius: 12,
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("Moods")}
      >
        <Text
          style={{
            padding: 20,
            fontWeight: "800",
            color: "#fff",
          }}
        >
          Navigate to moods sections
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
