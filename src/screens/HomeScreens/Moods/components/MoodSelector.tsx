import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const moodLevels = {
  ANGRY: 0,
  SAD: 1,
  STRESSED: 2,
  NEUTRAL: 3,
  CONTENT: 4,
  HAPPY: 5,
};

const moods = [
  { key: "HAPPY", label: "Happy", emoji: "😊" },
  { key: "CONTENT", label: "Content", emoji: "🙂" },
  { key: "NEUTRAL", label: "Neutral", emoji: "😐" },
  { key: "STRESSED", label: "Stressed", emoji: "😰" },
  { key: "SAD", label: "Sad", emoji: "😔" },
  { key: "ANGRY", label: "Angry", emoji: "😡" },
];

export default function MoodSelector({
  title = "workout",
  onSelect,
  selectedMoodKey,
  disabled = false,
}) {
  const [selectedMood, setSelectedMood] = useState(selectedMoodKey || null);

  useEffect(() => {
    setSelectedMood(selectedMoodKey || null);
  }, [selectedMoodKey]);

  const handleMoodPress = (mood) => {
    if (disabled) return;

    setSelectedMood(mood.key);
    if (onSelect) {
      onSelect(moodLevels[mood.key]); // returns numeric value
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Excellent!</Text>
      <Text style={styles.subHeader}>How are you feeling after {title}?</Text>

      <View style={styles.grid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            style={[
              styles.moodButton,
              selectedMood === mood.key && styles.selectedMood,
              disabled && { opacity: 0.5 },
            ]}
            onPress={() => handleMoodPress(mood)}
            disabled={disabled}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodButton: {
    width: "30%",
    backgroundColor: "#d4edda",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 15,
  },
  selectedMood: {
    backgroundColor: "#a5d6a7",
  },
  emoji: {
    fontSize: 28,
  },
  moodLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
});
