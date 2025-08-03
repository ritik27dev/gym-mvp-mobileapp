import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useMeals } from "../../../../hooks/useMeals";

const NutritionTrends = ({ userId }) => {
  const { selectedDate, calculateDailyTotals, nutritionTargets } =
    useMeals(userId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const totals = calculateDailyTotals(selectedDate);

  const macros = [
    {
      label: "Hydration (L)",
      key: "water",
      goal: nutritionTargets.water,
      consumed: totals.water,
    },
    {
      label: "Calories (Kcal)",
      key: "calories_kcal",
      goal: nutritionTargets.calories_kcal,
      consumed: totals.calories_kcal,
    },
    {
      label: "Protein (g)",
      key: "protein_g",
      goal: nutritionTargets.protein_g,
      consumed: totals.protein_g,
    },
    {
      label: "Carbs (g)",
      key: "carbs_g",
      goal: nutritionTargets.carbs_g,
      consumed: totals.carbs_g,
    },
    {
      label: "Fat (g)",
      key: "fat_g",
      goal: nutritionTargets.fat_g,
      consumed: totals.fat_g,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Trends</Text>

      <TouchableOpacity
        style={styles.dateSelector}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateSelectorText}>
          Today:{" "}
          {selectedDate &&
            new Date(selectedDate).toLocaleDateString("en", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Fuel</Text>
          <Text style={styles.headerCell}>Goal</Text>
          <Text style={styles.headerCell}>Consumed</Text>
          <Text style={[styles.headerCell, { left: 10 }]}>Left</Text>
        </View>

        {macros.map((macro) => {
          const left = macro.goal - macro.consumed;
          const leftDisplay =
            left < 0 ? `+${Math.abs(left).toFixed(0)}` : left.toFixed(0);
          const leftColor = left < 0 ? styles.leftOver : styles.left;

          return (
            <View style={styles.row} key={macro.key}>
              <Text style={styles.cell}>{macro.label}</Text>
              <Text style={styles.cell}>{macro.goal}</Text>
              <Text style={[styles.cell, { left: 10 }]}>
                {macro.consumed?.toFixed(0) ?? "0.0"}
              </Text>
              <Text style={[styles.cell, { left: 10 }, leftColor]}>
                {leftDisplay}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 12,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tableContainer: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingBottom: 4,
    marginBottom: 6,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    marginVertical: 1,
  },
  cell: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  left: {
    color: "green",
    fontWeight: "600",
  },
  leftOver: {
    color: "orange",
    fontWeight: "600",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  dateSelectorText: {
    fontSize: 16,
    color: "#6c757d",
    marginRight: 10,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6c757d",
  },
});

export default NutritionTrends;
