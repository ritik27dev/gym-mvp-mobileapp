import { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../api/base";

// Custom hook for managing meals with date filtering and nutrition calculations
export const useMeals = (userId) => {
  const [allMeals, setAllMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch meals with caching
  const fetchMeals = async (useCache = true) => {
    try {
      setLoading(true);
      const cacheKey = `meals_${userId}`;

      // Try to get from cache first
      if (useCache) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cache is still fresh (e.g., less than 5 minutes old)
          const cacheAge = Date.now() - parsed.timestamp;
          if (cacheAge < 5 * 60 * 1000) {
            // 5 minutes
            setAllMeals(parsed.meals);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch from API
      const response = await fetch(
        `${API_BASE_URL}/nutrition/meals/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Add your auth headers here
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllMeals(data.meals);
      setError(null);

      // Cache the data
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          meals: data.meals,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError("Failed to fetch meals");
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchMeals();
    }
  }, [userId]);

  // Get meals for a specific date (works with your API structure)
  const getMealsForSpecificDate = (date) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    return allMeals[dateStr] || [];
  };

  // Filter meals based on selected date
  const filteredMeals = useMemo(() => {
    if (!selectedDate || !allMeals || Object.keys(allMeals).length === 0) {
      return {};
    }

    const mealsForDate = getMealsForSpecificDate(selectedDate);

    // Group meals by meal type (breakfast, lunch, dinner, snack)
    const grouped = mealsForDate.reduce((acc, meal) => {
      const mealType = meal.when || "other";
      if (!acc[mealType]) acc[mealType] = [];
      acc[mealType].push(meal);
      return acc;
    }, {});

    return grouped;
  }, [allMeals, selectedDate]);

  // Calculate daily nutrition totals for a specific date
  const calculateDailyTotals = (date) => {
    const mealsForDate = getMealsForSpecificDate(date);

    return mealsForDate.reduce(
      (totals, meal) => {
        const macros = meal.macronutrients || {};
        return {
          calories_kcal: totals.calories_kcal + (macros.calories_kcal || 0),
          protein_g: totals.protein_g + (macros.protein_g || 0),
          carbs_g: totals.carbs_g + (macros.carbs_g || 0),
          fat_g: totals.fat_g + (macros.fat_g || 0),
          water: totals.water + 0.5, // Assuming 0.5L per meal, adjust as needed
        };
      },
      { calories_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, water: 0 }
    );
  };

  // Get last N days of data for charts
  const getLastNDaysData = (days = 7) => {
    const dateArray = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dateArray.push(date);
    }

    return dateArray.map((date) => ({
      date,
      dateStr: date.toISOString().split("T")[0],
      totals: calculateDailyTotals(date),
      meals: getMealsForSpecificDate(date),
      mealCount: getMealsForSpecificDate(date).length,
    }));
  };

  // Get available dates that have meals
  const getAvailableDates = () => {
    return Object.keys(allMeals).sort().reverse(); // Most recent first
  };

  // Check if a specific date has meals
  const hasMetalsForDate = (date) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    return (allMeals[dateStr] || []).length > 0;
  };

  // Get meals grouped by meal type for a specific date
  const getMealsGroupedByType = (date) => {
    const mealsForDate = getMealsForSpecificDate(date);

    return mealsForDate.reduce((acc, meal) => {
      const mealType = meal.when || "other";
      if (!acc[mealType]) acc[mealType] = [];
      acc[mealType].push(meal);
      return acc;
    }, {});
  };

  // Get nutrition summary for multiple dates (useful for weekly/monthly views)
  const getNutritionSummary = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const summary = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalWater: 0,
      mealCount: 0,
      daysWithMeals: 0,
    };

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const totals = calculateDailyTotals(currentDate);
      const mealCount = getMealsForSpecificDate(currentDate).length;

      summary.totalCalories += totals.calories_kcal;
      summary.totalProtein += totals.protein_g;
      summary.totalCarbs += totals.carbs_g;
      summary.totalFat += totals.fat_g;
      summary.totalWater += totals.water;
      summary.mealCount += mealCount;

      if (mealCount > 0) {
        summary.daysWithMeals++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return summary;
  };

  // Helper functions (keeping your original ones)
  const getTodaysMeals = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  const getMealsForDate = (date) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
  };

  const getAllMeals = () => {
    setSelectedDate(null);
  };

  const refreshMeals = () => {
    fetchMeals(false); // Skip cache
  };

  // Get meals count for a specific date (updated to work with your API structure)
  const getMealsCountForDate = (date) => {
    return getMealsForSpecificDate(date).length;
  };

  // Get nutrition goals/targets (you can customize these)
  const nutritionTargets = {
    calories_kcal: 3000,
    protein_g: 50,
    carbs_g: 5,
    fat_g: 65,
    water: 2.5,
  };

  // Calculate progress towards daily goals
  const getDailyProgress = (date = selectedDate) => {
    const totals = calculateDailyTotals(date);
    const progress = {};

    Object.keys(nutritionTargets).forEach((key) => {
      const current = totals[key] || 0;
      const target = nutritionTargets[key];
      progress[key] = {
        current,
        target,
        percentage: Math.min((current / target) * 100, 100),
        remaining: Math.max(target - current, 0),
        exceeded: Math.max(current - target, 0),
      };
    });

    return progress;
  };

  return {
    // Original exports
    meals: filteredMeals,
    allMeals,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    getTodaysMeals,
    getMealsForDate,
    getAllMeals,
    refreshMeals,
    getMealsCountForDate,

    // New nutrition-focused exports
    calculateDailyTotals,
    getLastNDaysData,
    getAvailableDates,
    hasMetalsForDate,
    getMealsGroupedByType,
    getMealsForSpecificDate,
    getNutritionSummary,
    nutritionTargets,
    getDailyProgress,
  };
};
