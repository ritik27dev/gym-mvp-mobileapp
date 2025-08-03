import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MoodSelector from "./components/MoodSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMoods } from "../../../hooks/useMoods";

const API_URL = "https://gym-mvp-server.onrender.com/api/moods/addMoods";

// Simple debounce helper
function useDebounce(fn: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function Moods() {
  const navigation: any = useNavigation();
  const userId = 1; // Replace with actual user ID

  // Use the new mood hook
  const {
    getTodaysMoodStatus,
    hasMoodForTypeAndDate,
    getMoodForTypeAndDate,
    addMoodEntry,
    moodToEmoji,
  } = useMoods(userId);

  // Get today's completion status
  const todayStatus = getTodaysMoodStatus();

  async function submitMood(userId: number, type: string, mood: string) {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `mood_${type}_${today}`;

    try {
      const existing = await AsyncStorage.getItem(storageKey);
      if (existing) {
        return { skipped: true };
      }

      const payload = { userId, type, mood };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("API error:", res.status, data);
        throw new Error("Failed to submit mood");
      }

      await AsyncStorage.setItem(storageKey, JSON.stringify(payload));

      // Add to local state
      const newMoodEntry = {
        id: Date.now().toString(), // Temporary ID
        userId,
        type,
        mood,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addMoodEntry(newMoodEntry);

      return { success: true };
    } catch (err) {
      console.error("Error submitting mood:", err);
      return { error: true };
    }
  }

  const handleMoodSelect = async (type: string, level: number) => {
    const levelToMood: Record<number, string> = {
      0: "ANGRY",
      1: "SAD",
      2: "STRESSED",
      3: "NEUTRAL",
      4: "CONTENT",
      5: "HAPPY",
    };

    const mood = levelToMood[level];
    const result = await submitMood(userId, type, mood);

    if (result?.success) {
      Alert.alert("Success", `${type} mood submitted successfully`);
    } else if (result?.skipped) {
      Alert.alert("Info", `Mood for ${type} already recorded today`);
    } else {
      Alert.alert("Error", `Could not submit mood for ${type}`);
    }
  };

  const debouncedHandleMoodSelect = useDebounce(handleMoodSelect, 500);

  // Get completion status for each mood type
  const getMoodSelectorProps = (type: string, title: string) => {
    const isCompleted = todayStatus[type]?.completed || false;
    const currentMood = todayStatus[type]?.mood;

    return {
      title,
      isCompleted,
      currentMood,
      completedEmoji: currentMood ? moodToEmoji(currentMood) : null,
      onSelect: (level) => debouncedHandleMoodSelect(type, level),
    };
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>How are you feeling today?</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {todayStatus.completionCount}/{todayStatus.totalTypes} completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (todayStatus.completionCount / todayStatus.totalTypes) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <EnhancedMoodSelector
        {...getMoodSelectorProps("DAILY_CHECKIN", "Daily Check-In")}
      />

      <EnhancedMoodSelector
        {...getMoodSelectorProps("POST_WORKOUT", "After Workout")}
      />

      <EnhancedMoodSelector
        {...getMoodSelectorProps("POST_MEDITATION", "After Meditation/Yoga")}
      />

      <TouchableOpacity
        style={[
          styles.navigateButton,
          todayStatus.allCompleted && styles.navigateButtonCompleted,
        ]}
        onPress={() => navigation.navigate("MoodsResult")}
      >
        <Text style={styles.navigateButtonText}>
          {todayStatus.allCompleted ? "✓ " : ""}View Mood Analytics
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Enhanced MoodSelector component that shows completion status
const EnhancedMoodSelector = ({
  title,
  isCompleted,
  currentMood,
  completedEmoji,
  onSelect,
}) => {
  return (
    <View
      style={[
        styles.moodSelectorContainer,
        isCompleted && styles.completedContainer,
      ]}
    >
      <View style={styles.titleContainer}>
        <Text
          style={[styles.selectorTitle, isCompleted && styles.completedTitle]}
        >
          {title}
        </Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedEmoji}>{completedEmoji}</Text>
            <Text style={styles.completedText}>
              {currentMood?.charAt(0) + currentMood?.slice(1).toLowerCase()}
            </Text>
          </View>
        )}
      </View>

      <MoodSelector
        title=""
        onSelect={onSelect}
        selectedMoodKey={currentMood}
        disabled={isCompleted}
      />

      {isCompleted && (
        <View style={styles.completedOverlay}>
          <Text style={styles.completedOverlayText}>
            Already recorded for today
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ecf0f1",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
    borderRadius: 3,
  },
  moodSelectorContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
  },
  completedTitle: {
    color: "#27ae60",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  completedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  disabledSelector: {
    opacity: 0.5,
  },
  completedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedOverlayText: {
    color: "#27ae60",
    fontSize: 14,
    fontWeight: "600",
  },
  navigateButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 20,
    padding: 20,
  },
  navigateButtonCompleted: {
    backgroundColor: "#27ae60",
  },
  navigateButtonText: {
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
