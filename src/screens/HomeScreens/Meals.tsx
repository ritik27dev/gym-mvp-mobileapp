import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Meals() {
  const navigation: any = useNavigation();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const response = await fetch(
        "https://gym-mvp-server.onrender.com/api/nutrition/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            userId: 1,
            date: "2025-07-05",
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      // Check for error in response
      if (data.error) {
        Alert.alert("Error", data.error, [{ text: "OK", style: "default" }]);
        return;
      }

      if (data.id && data.userId) {
        await AsyncStorage.setItem(
          "nutritionData",
          JSON.stringify({
            id: data.id,
            userId: data.userId,
          })
        );
        navigation.navigate("MixUp", {
          meal: data,
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.", [
        { text: "OK", style: "default" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navTabs}>
          <Text style={styles.navTab}>Body</Text>
          <Text style={styles.navTab}>Mind+ Rest</Text>
          <Text style={[styles.navTab, styles.activeTab]}>Fuel</Text>
          <Text style={styles.navTab}>Meds</Text>
          <Text style={styles.navTab}>Alerts</Text>
        </View>
      </View>

      {/* Hydration and Diet Section */}
      <Text style={styles.sectionTitle}>Hydration and Diet</Text>
      <View style={styles.chatContainer}>
        <View style={{ padding: 10 }}>
          <Text style={styles.chatLabel}>Chat GPT</Text>
          <Text style={styles.chatText}>What can I help with?</Text>

          <TextInput
            style={[
              styles.chatButtonText,
              {
                backgroundColor: "#e0e0e0",
                borderRadius: 12,
              },
            ]}
            onChangeText={(t) => setPrompt(t)}
            placeholder="Chat GPT"
            autoFocus={false}
          ></TextInput>
          <TouchableOpacity
            style={{
              backgroundColor: !prompt ? "#c0c0c0" : "#28A745",
              marginTop: 10,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              height: 50,
            }}
            onPress={handleProceed}
            disabled={!prompt || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  { textAlign: "center", fontWeight: "800" },
                  { color: "#fff" },
                ]}
              >
                Proceed
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navTabs: { flexDirection: "row", justifyContent: "space-around", flex: 1 },
  navTab: { fontSize: 16, color: "#666" },
  activeTab: { fontWeight: "bold", color: "#000" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
    marginLeft: 10,
  },
  chatContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
  },
  chatLabel: { fontSize: 16, fontWeight: "bold" },
  chatText: { fontSize: 14, color: "#666" },
  chatButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  chatButtonText: {
    textAlign: "center",

    borderRadius: 5,
    padding: 18,
    marginTop: 10,
  },
  trackButton: {
    backgroundColor: "#2E7D7D",
    borderRadius: 5,
    padding: 15,
    margin: 10,
  },
  trackButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  trendsContainer: { margin: 10 },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  trendsTable: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  tableHeader: { fontWeight: "bold" },
  showMore: { color: "#ff4500", textAlign: "right" },
  chartContainer: { marginTop: 10 },
  chartLabel: { fontSize: 14, fontWeight: "bold" },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bar: {
    width: 20,
    height: 100,
    backgroundColor: "#28A745",
    marginHorizontal: 5,
  }, // Placeholder bars
  mealLogContainer: { margin: 10 },
  mealTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  mealColumn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navIcon: { fontSize: 24, textAlign: "center" },
});

// {
//   {/* Track Water Intake Button */}
//       {/* <TouchableOpacity style={styles.trackButton}>
//         <Text style={styles.trackButtonText}>Track Water Intake</Text>
//       </TouchableOpacity> */}

//       {/* Nutrition Trends Section */}

//       <View style={styles.trendsContainer}>
//         <Text style={styles.sectionTitle}>Nutrition Trends</Text>
//         <View style={styles.datePicker}>
//           <Text>Today: 1 Feb 2025</Text>
//           <Text>▼</Text>
//         </View>
//         {/* <View style={styles.trendsTable}>
//           <View style={styles.tableRow}>
//             <Text> </Text>
//             <Text style={styles.tableHeader}>Goal</Text>
//             <Text style={styles.tableHeader}>Consumed</Text>
//             <Text style={styles.tableHeader}>Left</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text>Hydration (L)</Text>
//             <Text>2.2</Text>
//             <Text>1.2</Text>
//             <Text>1.0</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text>Calories (Kcal)</Text>
//             <Text>3000</Text>
//             <Text>4000</Text>
//             <Text>+1000</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text>Protein (g)</Text>
//             <Text>50</Text>
//             <Text>25</Text>
//             <Text>25</Text>
//           </View>
//           <TouchableOpacity>
//             <Text style={styles.showMore}>Show More ▼</Text>
//           </TouchableOpacity>
//         </View> */}
// }
