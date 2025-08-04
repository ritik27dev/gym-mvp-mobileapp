import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const moodLevels = {
  ANGRY: 0,
  SAD: 1,
  STRESSED: 2,
  NEUTRAL: 3,
  CONTENT: 4,
  HAPPY: 5,
};

const moodText = {
  0: "Angry",
  1: "Sad",
  2: "Stressed",
  3: "Neutral",
  4: "Content",
  5: "Happy",
};

const moodEmojis = {
  0: "😡",
  1: "😢",
  2: "😰",
  3: "😐",
  4: "🙂",
  5: "😄",
};

// Helper function to convert UTC date to local date string
const getLocalDateString = (utcDateString) => {
  const date = new Date(utcDateString);
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMoodSeries = (data, type) => {
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    // Use local date string instead of ISO date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;

    const label = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 1);
    last7Days.push({ date: localDate, label, index: i });
  }

  const result = last7Days.map(({ date, label, index }) => {
    const moodEntry = data.find((m) => {
      const moodLocalDate = getLocalDateString(m.createdAt);
      const matches = m.type === type && moodLocalDate === date;

      if (matches) {
        console.log(`Found match for ${type} on ${date}:`, {
          mood: m.mood,
          createdAt: m.createdAt,
          moodLocalDate,
        });
      }

      return matches;
    });

    return {
      label,
      value: moodEntry ? moodLevels[moodEntry.mood] : null,
      hasData: !!moodEntry,
      index: 6 - index, // Convert to 0-6 index for chart positioning
    };
  });

  const chartValues = result.map((r) => {
    if (r.hasData) {
      return r.value;
    }
    // For missing data, we'll use a value that's outside our range
    // and handle it in the chart configuration
    return undefined;
  });

  const finalResult = {
    labels: result.map((r) => r.label),
    values: chartValues,
    actualData: result.filter((r) => r.hasData), // Only points with real data
  };

  // console.log(`Final result for ${type}:`, finalResult);
  return finalResult;
};

const MoodChart = ({ data = [] }) => {
  console.log("MoodChart received data:", data);

  const daily = getMoodSeries(data, "DAILY_CHECKIN");
  const meditation = getMoodSeries(data, "POST_MEDITATION");
  const workout = getMoodSeries(data, "POST_WORKOUT");

  const chartHeight = 320;
  const emojiColumnWidth = 50;
  const rightLabelsWidth = 70;
  const chartWidth = screenWidth;

  // Create sanitized datasets - only include series that have at least one data point
  const datasets = [];

  if (daily.actualData.length > 0) {
    // Convert to format expected by chart: replace undefined with 0 but track which ones are real
    const processedDaily = daily.values.map((v) => (v !== undefined ? v : 0));
    datasets.push({
      data: processedDaily,
      color: () => "green",
      strokeWidth: 2,
    });
  }

  if (meditation.actualData.length > 0) {
    const processedMeditation = meditation.values.map((v) =>
      v !== undefined ? v : 0
    );
    datasets.push({
      data: processedMeditation,
      color: () => "orange",
      strokeWidth: 2,
    });
  }

  if (workout.actualData.length > 0) {
    const processedWorkout = workout.values.map((v) =>
      v !== undefined ? v : 0
    );
    datasets.push({
      data: processedWorkout,
      color: () => "teal",
      strokeWidth: 2,
    });
  }

  // If no data at all, show empty chart
  if (datasets.length === 0) {
    datasets.push({
      data: [0, 0, 0, 0, 0, 0, 0], // All zeros, but we'll make them invisible
      color: () => "transparent",
      strokeWidth: 0,
    });
  }

  console.log(
    "Chart datasets:",
    datasets.map((d) => d.data)
  );

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 50 }}
      >
        <View
          style={{
            width: emojiColumnWidth - 20,
            justifyContent: "space-between",
            height: chartHeight - 25,
            paddingVertical: 15,
            position: "absolute",
            zIndex: 1,
            bottom: 35,
          }}
        >
          {Object.keys(moodEmojis)
            .sort((a, b) => b - a)
            .map((level) => (
              <Text key={level} style={{ fontSize: 18, textAlign: "center" }}>
                {moodEmojis[level]}
              </Text>
            ))}
        </View>

        <LineChart
          data={{
            labels: daily.labels, // consistent X-axis
            datasets: datasets,
          }}
          xLabelsOffset={10}
          width={chartWidth - 15}
          height={chartHeight}
          fromZero={false}
          yAxisInterval={1}
          chartConfig={{
            // backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            fillShadowGradient: "#fff",
            fillShadowGradientOpacity: 0,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#fff",
            },
            propsForBackgroundLines: {
              strokeWidth: 2,
              stroke: "#ccc",

              rightLabelsWidth: 100,
            },
          }}
          bezier={false}
          segments={6}
          yLabelsOffset={10}
          style={{ borderRadius: 8, right: 30 }}
          formatYLabel={() => ""} // suppress y-axis labels
        />

        {/* Right Text Labels */}
        <View
          style={{
            width: "98%",
            justifyContent: "space-between",
            height: chartHeight - 30,
            paddingVertical: 15,
            bottom: 40,
            position: "absolute",
          }}
        >
          {Object.keys(moodText)
            .sort((a, b) => b - a)
            .map((level) => (
              <Text key={level} style={{ fontSize: 12, textAlign: "right" }}>
                {moodText[level]}
              </Text>
            ))}
        </View>
      </View>

      {/* Custom legend below chart */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 8,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "green",
              marginRight: 5,
            }}
          />
          <Text>Daily Check-in</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 8,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "orange",
              marginRight: 5,
            }}
          />
          <Text>After Meditation</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 8,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "teal",
              marginRight: 5,
            }}
          />
          <Text>After Workout</Text>
        </View>
      </View>
    </View>
  );
};

export default MoodChart;
