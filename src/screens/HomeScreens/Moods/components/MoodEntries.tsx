import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const MoodEntries = ({ moods = [], onDateChange, selectedDate }) => {
  // Group moods by date
  const groupMoodsByDate = (moodsList) => {
    const grouped = {};

    moodsList.forEach((mood) => {
      const date = new Date(mood.createdAt).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(mood);
    });

    return grouped;
  };

  const groupedMoods = groupMoodsByDate(moods);
  const sortedDates = Object.keys(groupedMoods).sort().reverse(); // Most recent first

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      ANGRY: "😠",
      SAD: "😢",
      STRESSED: "😰",
      NEUTRAL: "😐",
      CONTENT: "😊",
      HAPPY: "😄",
    };
    return emojiMap[mood] || "😐";
  };

  const getMoodTypeLabel = (type) => {
    const typeMap = {
      DAILY_CHECKIN: "Daily Check-In",
      POST_WORKOUT: "Post Workout",
      POST_MEDITATION: "Post Meditation",
    };
    return typeMap[type] || type;
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      ANGRY: "#FF6B6B",
      SAD: "#4ECDC4",
      STRESSED: "#FFE66D",
      NEUTRAL: "#95A5A6",
      CONTENT: "#98D8C8",
      HAPPY: "#F7DC6F",
    };
    return colorMap[mood] || "#95A5A6";
  };

  if (sortedDates.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No mood entries found</Text>
        <Text style={styles.emptySubtext}>
          Start logging your moods to see them here!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Mood Entries</Text>

      {sortedDates.map((date) => {
        const dayMoods = groupedMoods[date];
        const isSelected = selectedDate === date;

        return (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateSection,
              isSelected && styles.selectedDateSection,
            ]}
            onPress={() => onDateChange && onDateChange(date)}
            activeOpacity={0.7}
          >
            {/* <View style={styles.dateHeader}>
              <Text
                style={[styles.dateText, isSelected && styles.selectedDateText]}
              >
                {formatDate(date)}
              </Text>
              <Text
                style={[
                  styles.dateSubtext,
                  isSelected && styles.selectedDateSubtext,
                ]}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View> */}

            <View style={styles.moodsList}>
              {dayMoods.map((mood, index) => (
                <View key={mood.id || index} style={styles.moodItem}>
                  <View style={styles.moodTypeContainer}>
                    <Text style={styles.moodTypeText}>
                      {getMoodTypeLabel(mood.type)}
                      {" : "}
                      <Text style={styles.moodText}>
                        {mood.mood.charAt(0) + mood.mood.slice(1).toLowerCase()}
                      </Text>
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.moodTime}>
                        {formatTime(mood.createdAt)}
                      </Text>

                      <Text style={styles.moodTime}>
                        {"  "}{" "}
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>

                  <View
                  // style={[
                  //   styles.moodBadge,
                  //   { backgroundColor: getMoodColor(mood.mood) },
                  // ]}
                  >
                    <Text style={styles.moodEmoji}>
                      {getMoodEmoji(mood.mood)}
                    </Text>
                    {/* <Text style={styles.moodText}>
                      {mood.mood.charAt(0) + mood.mood.slice(1).toLowerCase()}
                    </Text> */}
                  </View>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    marginHorizontal: 10,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
  dateSection: {
    backgroundColor: "white",
    marginHorizontal: 1,
    marginBottom: 12,
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
  selectedDateSection: {
    borderWidth: 2,
    borderColor: "#3498db",
    backgroundColor: "#f8fbff",
  },
  dateHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 2,
  },
  selectedDateText: {
    color: "#3498db",
  },
  dateSubtext: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  selectedDateSubtext: {
    color: "#3498db",
  },
  moodsList: {
    gap: 8,
  },
  moodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  moodTypeContainer: {
    flex: 1,
  },
  moodTypeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 2,
  },
  moodTime: {
    fontSize: 12,
    color: "#95a5a6",
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 90,
    justifyContent: "center",
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  moodText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2c3e50",
  },
});

export default MoodEntries;
