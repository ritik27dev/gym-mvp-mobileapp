// AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import SignUpScreen from "../screens/AuthScreens/SignUpScreen";
import HomePage from "../screens/HomeScreens/HomePage";
import Meals from "../screens/HomeScreens/Meals";
import MixUp from "../screens/HomeScreens/MixUp";
import Macros from "../screens/HomeScreens/Macros";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
