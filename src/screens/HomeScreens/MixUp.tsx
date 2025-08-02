import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function MixUp({ navigation }) {
  const route: any = useRoute();
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (route.params?.meal?.meal?.ingredients) {
      setIngredients(route.params?.meal?.meal?.ingredients);
    }
  }, [route.params]);

  const handleQuantityChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity_g = parseInt(value) || 0;
    setIngredients(newIngredients);
  };

  const handleConfirm = () => {
    // navigation.navigate("Macros", { ingredients });
    navigation.navigate("Macros", {
      meal: {
        ...route.params?.meal,
        ingredients, // updated list
      },
    });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>B2C Step 1</Text>
      <View style={styles.card}>
        <Text style={styles.dish}>Dish</Text>
        <Text style={styles.dishName}>
          {route.params?.meal?.meal?.dishName || "Butter Chicken"}
        </Text>
        <Text style={styles.subtitle}>Mix It Up</Text>
        <Text style={styles.description}>
          Here's the usual recipe lineup. Tweak anything you like, then hit
          Confirm to cook things up.
        </Text>
        {ingredients?.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={ingredient.quantity_g?.toString() || ""}
              onChangeText={(value) => handleQuantityChange(index, value)}
            />
            <Text style={styles.unit}>gms</Text>
            <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
              <Text style={{ fontSize: 12 }}>❌</Text>
            </TouchableOpacity>
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navIcon: { fontSize: 24, textAlign: "center" },
});
