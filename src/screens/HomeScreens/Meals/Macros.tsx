import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Macros({ navigation }) {
  const route: any = useRoute();
  const outerMeal = route.params?.meal;
  const meal = route.params?.meal?.meal;

  const { ingredients } = meal || {};

  const [macros, setMacros] = useState({});

  useEffect(() => {
    if (meal?.macronutrients) {
      setMacros(meal.macronutrients);
    }
  }, [meal]);

  const handleMacroChange = (field, value) => {
    setMacros({ ...macros, [field]: parseInt(value) || 0 });
  };

  const handleConfirm = async () => {
    if (!outerMeal?.id) {
      Alert.alert("Error", "Meal ID not found.");
      return;
    }

    const mealData = {
      userId: 1,
      when: meal?.when,
      ingredients: ingredients,
      macronutrients: macros,
    };

    try {
      const response = await fetch(
        `https://gym-mvp-server.onrender.com/api/nutrition/meals/${outerMeal.id}`,
        {
          method: "PUT", // use PUT for updates
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mealData),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Meal data updated successfully!");
        navigation.replace("MealPage");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        Alert.alert("Error", "Failed to update meal data.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "An error occurred while updating.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>B2C Step 2</Text>
      <View style={styles.card}>
        <Text style={styles.dish}>Dish</Text>
        <Text style={styles.dishName}>{meal?.dishName || "Your Dish"}</Text>

        <Text style={styles.subtitle}>Crunch the Numbers</Text>
        <Text style={styles.description}>
          Here's your nutrition breakdown. All looks good? Hit Confirm to log
          this delicious crime.
        </Text>

        {Object.entries(macros).map(([key, value]) => (
          <View key={key} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>
              {key.replace("_", " ").replace(/g|kcal/, "")}
            </Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={value.toString()}
              onChangeText={(val) => handleMacroChange(key, val)}
            />
            <Text style={styles.unit}>
              {key.includes("kcal") ? "kcal" : key.includes("g") ? "gms" : ""}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
  card: { padding: 15, backgroundColor: "#fff", margin: 10, borderRadius: 5 },
  dish: { fontSize: 16, fontWeight: "bold" },
  dishName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  description: { fontSize: 14, color: "#666", marginBottom: 10 },

  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  ingredientName: { flex: 1, fontSize: 14 },
  quantityInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "#28A745",
    borderRadius: 5,
    textAlign: "center",
    padding: 5,
  },
  unit: { marginLeft: 5, fontSize: 14, padding: 5 },

  confirmButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
  },
  confirmButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
