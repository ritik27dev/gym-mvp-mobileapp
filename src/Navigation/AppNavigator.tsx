// AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import SignUpScreen from "../screens/AuthScreens/SignUpScreen";
import HomePage from "../screens/HomeScreens/HomePage";
import Meals from "../screens/HomeScreens/Meals/Meals";
import Moods from "../screens/HomeScreens/Moods/Moods";
import MoodsResult from "../screens/HomeScreens/Moods/MoodsResult";
import Macros from "../screens/HomeScreens/Meals/Macros";
import MixUp from "../screens/HomeScreens/Meals/MixUp";

export type RootStackParamList = {
  SignUp: undefined;
  HomePage: undefined;
  MealPage: undefined;
  MixUp: undefined;
  Macros: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="MealPage" component={Meals} />
        <Stack.Screen name="MixUp" component={MixUp} />
        <Stack.Screen name="Macros" component={Macros} />
        <Stack.Screen name="Moods" component={Moods} />
        <Stack.Screen name="MoodsResult" component={MoodsResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
