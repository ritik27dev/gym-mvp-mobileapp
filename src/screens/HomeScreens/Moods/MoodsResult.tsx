import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
  Text,
  RefreshControl,
} from "react-native";
import MoodChart from "./components/MoodChart";
import MoodEntries from "./components/MoodEntries";
import { useMoods } from "../../../hooks/useMoods";

export default function MoodsResult() {
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    allMoods,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    getTodaysMoodStatus,
    getMoodStats,
    getMoodTrends,
    getLastNDaysData,
    refreshMoods,
  } = useMoods(1);

  // Get last 7 days of data for the chart
  const getChartData = () => {
    const last7Days = getLastNDaysData(7);

    // Transform data for your MoodChart component
    return last7Days
      .map((day) => {
        const dayMoods = day.moods;

        // If you need the data in the same format as your original API call
        return dayMoods;
      })
      .flat(); // Flatten if needed
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMoods();
    } catch (error) {
      console.error("Refresh error:", error);
      Alert.alert("Error", "Unable to refresh mood data.");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle loading state
  if (loading && allMoods.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading mood data...</Text>
      </View>
    );
  }

  // Handle error state
  if (error && allMoods.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const chartData = getChartData();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#3498db"]}
          tintColor="#3498db"
        />
      }
    >
      {/* Mood Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Mood Trends (Last 7 Days)</Text>
        {chartData.length > 0 ? (
          <MoodChart data={allMoods} />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No mood data available for chart
            </Text>
          </View>
        )}
      </View>

      {/* Quick Stats Section */}
      {/* <QuickStatsSection
        getTodaysMoodStatus={getTodaysMoodStatus}
        getMoodStats={getMoodStats}
      /> */}

      {/* Mood Entries Section */}
      <View style={styles.entriesSection}>
        {allMoods.length > 0 ? (
          <MoodEntries
            moods={allMoods}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No mood entries found</Text>
            <Text style={styles.noDataSubtext}>
              Start logging your moods to see them here!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Quick Stats Component
const QuickStatsSection = ({ getTodaysMoodStatus, getMoodStats }) => {
  const todayStatus = getTodaysMoodStatus();

  // Get this week's stats
  const weekStats = getMoodStats(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    new Date().toISOString().split("T")[0]
  );

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>

      {/* Today's Progress */}
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>Today's Progress</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {todayStatus.completionCount}/{todayStatus.totalTypes} mood checks
            completed
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

        {todayStatus.allCompleted && (
          <Text style={styles.completedText}>
            🎉 All moods logged for today!
          </Text>
        )}
      </View>

      {/* This Week Stats */}
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>This Week</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weekStats.totalEntries}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weekStats.daysWithEntries}</Text>
            <Text style={styles.statLabel}>Active Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {weekStats.averageMoodScore.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg Mood Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weekStats.moodCounts.HAPPY}</Text>
            <Text style={styles.statLabel}>Happy Moods</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: "#3498db",
    textDecorationLine: "underline",
  },
  chartSection: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  entriesSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 16,
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 8,
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
  completedText: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "40%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3498db",
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
    textAlign: "center",
  },
});
