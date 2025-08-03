import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMeals } from "../../../../hooks/useMeals";

const { width: screenWidth } = Dimensions.get("window");

const NutritionTracker = ({ userId }) => {
  const [selectedMetric, setSelectedMetric] = useState("Calories");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    loading,
    error,
    selectedDate,
    getMealsForDate,
    getLastNDaysData,
    getMealsGroupedByType,
    nutritionTargets,
    getDailyProgress,
    refreshMeals,
  } = useMeals(userId);

  // Provide safe fallback for nutritionTargets
  const safeNutritionTargets = nutritionTargets || {
    water: 0,
    calories_kcal: 0,
    protein_g: 0,
    carbs_g: 0,
  };

  const metrics = {
    Water: {
      key: "water",
      unit: "L",
      color: "#7ED321",
      target: safeNutritionTargets.water,
    },
    Calories: {
      key: "calories_kcal",
      unit: "kcal",
      color: "#7ED321",
      target: safeNutritionTargets.calories_kcal,
    },
    Protein: {
      key: "protein_g",
      unit: "g",
      color: "#7ED321",
      target: safeNutritionTargets.protein_g,
    },
    Carbs: {
      key: "carbs_g",
      unit: "g",
      color: "#7ED321",
      target: safeNutritionTargets.carbs_g,
    },
  };

  // Prepare chart data safely
  const chartData = useMemo(() => {
    const last7DaysData = getLastNDaysData ? getLastNDaysData(7) || [] : [];
    const currentMetric = metrics[selectedMetric];
    const target = currentMetric.target || 0;

    const data = last7DaysData.map((dayData) => {
      const value = dayData.totals?.[currentMetric.key] || 0;
      return {
        value: Math.min(value, target),
        excess: Math.max(0, value - target),
        date: dayData.date,
        total: value,
      };
    });

    return {
      labels: last7DaysData.map((dayData) => {
        const day = dayData.date.toLocaleDateString("en", { weekday: "short" });
        const dayNum = dayData.date.getDate();
        const month = dayData.date.toLocaleDateString("en", { month: "short" });
        return [day, dayNum, month];
      }),
      datasets: [
        {
          data: data.map((d) => d.value),
          colors: data.map(() => () => currentMetric.color),
        },
      ],
      rawData: data,
    };
  }, [selectedMetric, getLastNDaysData, metrics]);

  // Calendar utility
  const getCalendarDates = () => {
    if (!selectedDate) return [];
    const dates = [];
    const currentDate = new Date(selectedDate);
    for (let i = -1; i <= 1; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatCalendarDate = (date) => {
    const day = date.toLocaleDateString("en", { weekday: "short" });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString("en", { month: "short" });
    return { day, dayNum, month };
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) getMealsForDate(date);
  };

  const renderCalendarDay = (date, index) => {
    const { day, dayNum, month } = formatCalendarDate(date);
    const meals = getMealsGroupedByType
      ? getMealsGroupedByType(date) || {}
      : {};
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toISOString().split("T")[0] === selectedDate;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isToday && styles.todayCalendar,
          isSelected && styles.selectedCalendar,
        ]}
        onPress={() => getMealsForDate(date)}
      >
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarDayText}>{day}</Text>
          <Text style={styles.calendarDateText}>
            {dayNum} {month}
          </Text>
        </View>

        <View style={styles.calendarMeals}>
          {Object.entries(meals).map(([mealType, mealList]) => (
            <View key={mealType} style={styles.mealTypeSection}>
              <Text style={styles.mealTypeLabel}>
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
              </Text>
              {mealList.slice(0, 2).map((meal, idx) => (
                <Text key={idx} style={styles.mealItem} numberOfLines={1}>
                  {meal.dishName}
                </Text>
              ))}
              {mealList.length > 2 && (
                <Text style={styles.moreItems}>
                  +{mealList.length - 2} more
                </Text>
              )}
            </View>
          ))}

          {Object.keys(meals).length === 0 && (
            <Text style={styles.noMealsText}>No meals</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const currentProgress = getDailyProgress ? getDailyProgress() || {} : {};
  const currentMetricProgress = currentProgress[metrics[selectedMetric]?.key];

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refreshMeals} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshMeals} />
      }
    >
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {Object.keys(metrics).map((metric) => (
          <TouchableOpacity
            key={metric}
            style={[styles.tab, selectedMetric === metric && styles.activeTab]}
            onPress={() => setSelectedMetric(metric)}
          >
            <Text
              style={[
                styles.tabText,
                selectedMetric === metric && styles.activeTabText,
              ]}
            >
              {metric}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date selector */}
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

      {/* {showDatePicker && selectedDate && ( */}
      <DateTimePicker
        value={new Date(selectedDate)}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
      {/* )} */}

      {/* Chart */}
      {chartData.labels?.length > 0 && (
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: chartData.labels.map((label) => label[0]),
              datasets: [{ data: chartData.datasets[0].data }],
            }}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: () => metrics[selectedMetric].color,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${1})`,
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#e3e3e3",
              },
            }}
            withCustomBarColorFromData={false}
            style={styles.chart}
            showValuesOnTopOfBars={false}
            fromZero
            yAxisLabel={""}
            yAxisSuffix={""}
          />
          <View style={styles.chartLabels}>
            {chartData.labels.map((label, index) => (
              <View key={index} style={styles.chartLabel}>
                <Text style={styles.chartLabelDate}>{label[1]}</Text>
                <Text style={styles.chartLabelMonth}>{label[2]}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarDays}>
          {getCalendarDates().map((date, index) =>
            renderCalendarDay(date, index)
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#28a745",
  },
  tabText: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#28a745",
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
  progressContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
    right: 50,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  chartLabel: {
    alignItems: "center",
  },
  chartLabelDay: {
    fontSize: 12,
    fontWeight: "600",
    color: "#343a40",
  },
  chartLabelDate: {
    fontSize: 11,
    color: "#6c757d",
  },
  chartLabelMonth: {
    fontSize: 10,
    color: "#6c757d",
  },
  chartValue: {
    fontSize: 10,
    color: "#495057",
    fontWeight: "500",
    marginTop: 2,
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarDateSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 15,
  },
  calendarDateSelectorText: {
    fontSize: 16,
    color: "#6c757d",
    marginRight: 10,
  },
  calendarDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarDay: {
    flex: 1,
    marginHorizontal: 3,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    minHeight: 200,
  },
  todayCalendar: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#28a745",
  },
  selectedCalendar: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  calendarHeader: {
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  calendarDayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#343a40",
  },
  calendarDateText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  calendarMeals: {
    flex: 1,
  },
  mealTypeSection: {
    marginBottom: 12,
  },
  mealTypeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 4,
  },
  mealItem: {
    fontSize: 11,
    color: "#6c757d",
    marginLeft: 5,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 10,
    color: "#6c757d",
    fontStyle: "italic",
    marginLeft: 5,
  },
  noMealsText: {
    fontSize: 12,
    color: "#adb5bd",
    textAlign: "center",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default NutritionTracker;
