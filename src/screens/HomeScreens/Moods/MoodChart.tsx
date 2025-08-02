import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { LineChart, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import Svg, { Defs, Pattern, Rect, Circle } from "react-native-svg";

const moodLevels = {
  ANGRY: 0,
  SAD: 1,
  STRESSED: 2,
  NEUTRAL: 3,
  CONTENT: 4,
  HAPPY: 5,
};

const moodLabels = {
  0: "😡",
  1: "😢",
  2: "😰",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const moodText = {
  5: "Angry",
  4: "Sad",
  3: "Stressed",
  2: "Neutral",
  1: "Content",
  0: "Happy",
};

const getMoodSeries = (data, type) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const map = {};

  data
    .filter((d) => d.type === type && d.mood in moodLevels)
    .forEach((d) => {
      const date = new Date(d.createdAt);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      map[day] = moodLevels[d.mood];
    });

  return days.map((day) => {
    const value = map[day];
    return typeof value === "number" ? value : null; // Use null for missing data to break lines
  });
};

const Background = ({ width, height, columns = 7, rows = 6 }) => {
  const spacingX = width / columns - 1;
  const spacingY = height / rows - 8;

  const dots = [];

  for (let i = 0; i <= columns; i++) {
    for (let j = 0; j <= rows; j++) {
      dots.push(
        <Circle
          key={`${i}-${j}`}
          cx={i * spacingX}
          cy={j * spacingY}
          r={3}
          fill="#000"
          // stroke="blue"
          // strokeWidth={2}
        />
      );
    }
  }

  return (
    <Svg style={[StyleSheet.absoluteFill, { top: 15, left: 4 }]}>{dots}</Svg>
  );
};

const MoodChart = ({ data = [] }) => {
  const daily = getMoodSeries(data, "DAILY_CHECKIN");
  const meditation = getMoodSeries(data, "POST_MEDITATION");
  const workout = getMoodSeries(data, "POST_WORKOUT");

  const colors = {
    daily: "green",
    meditation: "orange",
    workout: "teal",
  };

  const chartHeight = 300;
  const chartWidth = 300;

  return (
    <>
      <View style={{ flexDirection: "row", height: 300, padding: 20 }}>
        <YAxis
          data={[0, 1, 2, 3, 4, 5]}
          style={{ marginTop: 10 }}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 16, fill: "black" }}
          formatLabel={(value) => moodLabels[value] ?? ""}
        />
        <View style={{ flex: 1, marginLeft: 10, marginTop: 15 }}>
          <Background width={chartWidth} height={chartHeight} />
          <LineChart
            style={{ flex: 1 }}
            data={daily}
            svg={{ stroke: colors.daily, strokeWidth: 4 }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveLinear}
            svgData={{ strokeDasharray: [0] }} // Ensure continuous lines
          ></LineChart>
          <LineChart
            style={StyleSheet.absoluteFill}
            data={meditation}
            svg={{ stroke: colors.meditation, strokeWidth: 4 }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveLinear}
            svgData={{ strokeDasharray: [0] }} // Ensure continuous lines
          />
          <LineChart
            style={StyleSheet.absoluteFill}
            data={workout}
            svg={{ stroke: colors.workout, strokeWidth: 4 }}
            contentInset={{ top: 20, bottom: 20, marginRight: 10 }}
            curve={shape.curveLinear}
            svgData={{ strokeDasharray: [0] }} // Ensure continuous lines
          />
          <XAxis
            style={{ marginTop: 10, right: 15, top: 15, width: 295 }}
            data={[0, 1, 2, 3, 4, 5, 6]}
            formatLabel={(value) => ["M", "T", "W", "T", "F", "S", "S"][value]}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 12, fill: "grey" }}
          />
        </View>
        <View
          style={{
            justifyContent: "space-between",
            height: chartHeight / 7,
            marginTop: 20,
            marginLeft: 10,
          }}
        >
          {Object.keys(moodText)
            .sort((a: any, b: any) => a - b)
            .map((level) => (
              <Text
                key={level}
                style={{ fontSize: 12, height: chartHeight / 7 }}
              >
                {moodText[level]}
              </Text>
            ))}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "green",
              marginRight: 6,
            }}
          />
          <Text>Daily Check-in</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "orange",
              marginRight: 6,
            }}
          />
          <Text>After Meditation</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "teal",
              marginRight: 6,
            }}
          />
          <Text>After Workout</Text>
        </View>
      </View>
    </>
  );
};

export default MoodChart;
