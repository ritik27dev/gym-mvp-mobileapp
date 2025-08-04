import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE_URL = "https://gym-mvp-server.onrender.com/api";

// Custom hook for managing moods with date filtering and analytics
export const useMoods = (userId) => {
  const [allMoods, setAllMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch moods with caching
  const fetchMoods = async (useCache = true) => {
    try {
      setLoading(true);
      const cacheKey = `moods_${userId}`;

      // Try to get from cache first
      if (useCache) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cache is still fresh (e.g., less than 5 minutes old)
          const cacheAge = Date.now() - parsed.timestamp;
          if (cacheAge < 5 * 60 * 1000) {
            // 5 minutes
            setAllMoods(parsed.moods);
            setLoading(false);
            return;
          }
        }
      }

      // Get date range for the last 30 days
      const getDateRange = () => {
        const toDateObj = new Date();
        const fromDateObj = new Date();
        fromDateObj.setDate(toDateObj.getDate() - 30); // Get last 30 days

        const toDatePlusOne = new Date(toDateObj);
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);

        const format = (d) => d.toISOString().split("T")[0];
        return { fromDate: format(fromDateObj), toDate: format(toDatePlusOne) };
      };

      const { fromDate, toDate } = getDateRange();

      // Use the same endpoint as your working API
      const response = await fetch(`${API_BASE_URL}/moods/getMoods`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fromDate,
          toDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllMoods(data);
      setError(null);

      // Cache the data
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          moods: data,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError("Failed to fetch moods");
      console.error("Error fetching moods:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchMoods();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchMoods(); // No cache
      }
    }, [userId])
  );

  // Get moods for a specific date
  const getMoodsForDate = (date) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];

    return allMoods.filter((mood) => {
      const moodDate = new Date(mood.createdAt).toISOString().split("T")[0];
      return moodDate === dateStr;
    });
  };

  // Get today's moods
  const getTodaysMoods = () => {
    const today = new Date().toISOString().split("T")[0];
    return getMoodsForDate(today);
  };

  // Check if a specific mood type has been recorded for a date
  const hasMoodForTypeAndDate = (type, date = selectedDate) => {
    const dateStr =
      typeof date === "string" ? date : date?.toISOString().split("T")[0];
    const moodsForDate = getMoodsForDate(dateStr);
    return moodsForDate.some((mood) => mood.type === type);
  };

  // Get mood for specific type and date
  const getMoodForTypeAndDate = (type, date = selectedDate) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    const moodsForDate = getMoodsForDate(dateStr);

    return moodsForDate.find((mood) => mood.type === type);
  };

  // Check today's mood completion status
  const getTodaysMoodStatus = () => {
    const todaysMoods = getTodaysMoods();
    const moodTypes = ["DAILY_CHECKIN", "POST_WORKOUT", "POST_MEDITATION"];

    const status = {};
    moodTypes.forEach((type) => {
      const mood = todaysMoods.find((m) => m.type === type);
      status[type] = {
        completed: !!mood,
        mood: mood?.mood || null,
        timestamp: mood?.createdAt || null,
      };
    });

    return {
      ...status,
      completionCount: Object.values(status).filter((s) => s.completed).length,
      totalTypes: moodTypes.length,
      allCompleted: Object.values(status).every((s) => s.completed),
    };
  };

  // Get mood statistics for date range
  const getMoodStats = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const stats = {
      totalEntries: 0,
      moodCounts: {
        ANGRY: 0,
        SAD: 0,
        STRESSED: 0,
        NEUTRAL: 0,
        CONTENT: 0,
        HAPPY: 0,
      },
      typeCounts: {
        DAILY_CHECKIN: 0,
        POST_WORKOUT: 0,
        POST_MEDITATION: 0,
      },
      averageMoodScore: 0,
      daysWithEntries: new Set(),
      streakDays: 0,
    };

    const moodToScore = {
      ANGRY: 0,
      SAD: 1,
      STRESSED: 2,
      NEUTRAL: 3,
      CONTENT: 4,
      HAPPY: 5,
    };

    const filteredMoods = allMoods.filter((mood) => {
      const moodDate = new Date(mood.createdAt);
      return moodDate >= start && moodDate <= end;
    });

    let totalScore = 0;
    filteredMoods.forEach((mood) => {
      stats.totalEntries++;
      stats.moodCounts[mood.mood]++;
      stats.typeCounts[mood.type]++;

      const moodDate = new Date(mood.createdAt).toISOString().split("T")[0];
      stats.daysWithEntries.add(moodDate);

      totalScore += moodToScore[mood.mood];
    });

    stats.averageMoodScore =
      stats.totalEntries > 0 ? totalScore / stats.totalEntries : 0;
    stats.daysWithEntries = stats.daysWithEntries.size;

    return stats;
  };

  // Get last N days of mood data
  const getLastNDaysData = (days = 7) => {
    const dateArray = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dateArray.push(date);
    }

    return dateArray.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const moodsForDate = getMoodsForDate(date);

      return {
        date,
        dateStr,
        moods: moodsForDate,
        moodCount: moodsForDate.length,
        hasAllMoods: ["DAILY_CHECKIN", "POST_WORKOUT", "POST_MEDITATION"].every(
          (type) => moodsForDate.some((mood) => mood.type === type)
        ),
      };
    });
  };

  // Get mood trends (improvement/decline over time)
  const getMoodTrends = (days = 30) => {
    const lastNDays = getLastNDaysData(days);
    const moodToScore = {
      ANGRY: 0,
      SAD: 1,
      STRESSED: 2,
      NEUTRAL: 3,
      CONTENT: 4,
      HAPPY: 5,
    };

    const trendData = lastNDays
      .map((day) => {
        const avgScore =
          day.moods.length > 0
            ? day.moods.reduce((sum, mood) => sum + moodToScore[mood.mood], 0) /
              day.moods.length
            : null;

        return {
          date: day.dateStr,
          averageMoodScore: avgScore,
          moodCount: day.moodCount,
        };
      })
      .filter((day) => day.averageMoodScore !== null);

    // Calculate trend direction
    if (trendData.length < 2)
      return { trend: "insufficient_data", data: trendData };

    const firstHalf = trendData.slice(0, Math.floor(trendData.length / 2));
    const secondHalf = trendData.slice(Math.floor(trendData.length / 2));

    const firstHalfAvg =
      firstHalf.reduce((sum, day) => sum + day.averageMoodScore, 0) /
      firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, day) => sum + day.averageMoodScore, 0) /
      secondHalf.length;

    const trend =
      secondHalfAvg > firstHalfAvg
        ? "improving"
        : secondHalfAvg < firstHalfAvg
        ? "declining"
        : "stable";

    return {
      trend,
      data: trendData,
      firstHalfAvg,
      secondHalfAvg,
      improvement: secondHalfAvg - firstHalfAvg,
    };
  };

  // Add a new mood entry (local state update)
  const addMoodEntry = (moodEntry) => {
    setAllMoods((prev) => [moodEntry, ...prev]);
  };

  // Refresh moods
  const refreshMoods = () => {
    fetchMoods(false); // Skip cache
  };

  // Get available dates that have mood entries
  const getAvailableDates = () => {
    const dates = [
      ...new Set(
        allMoods.map(
          (mood) => new Date(mood.createdAt).toISOString().split("T")[0]
        )
      ),
    ];
    return dates.sort().reverse(); // Most recent first
  };

  // Filtered moods based on selected date
  const filteredMoods = useMemo(() => {
    if (!selectedDate) return allMoods;
    return getMoodsForDate(selectedDate);
  }, [allMoods, selectedDate]);

  return {
    // State
    moods: filteredMoods,
    allMoods,
    loading,
    error,
    selectedDate,
    setSelectedDate,

    // Core functions
    fetchMoods,
    refreshMoods,
    addMoodEntry,

    // Date-specific functions
    getMoodsForDate,
    getTodaysMoods,
    hasMoodForTypeAndDate,
    getMoodForTypeAndDate,
    getTodaysMoodStatus,

    // Analytics functions
    getMoodStats,
    getLastNDaysData,
    getMoodTrends,
    getAvailableDates,

    // Utility functions
    moodToEmoji: (mood) => {
      const emojiMap = {
        ANGRY: "😠",
        SAD: "😢",
        STRESSED: "😰",
        NEUTRAL: "😐",
        CONTENT: "😊",
        HAPPY: "😄",
      };
      return emojiMap[mood] || "😐";
    },

    moodToScore: (mood) => {
      const scoreMap = {
        ANGRY: 0,
        SAD: 1,
        STRESSED: 2,
        NEUTRAL: 3,
        CONTENT: 4,
        HAPPY: 5,
      };
      return scoreMap[mood] || 3;
    },
  };
};
