import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";

// Initialize Firebase app
import "./firebase";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function App() {
  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        "445698063824-2p0e8s5apgrc1cgom4ehairk8b16ti0a.apps.googleusercontent.com", // from Firebase console (OAuth 2.0 Client IDs)
      iosClientId:
        "445698063824-ulavn52qkr8su4bdkm0p1671l9ifdb05.apps.googleusercontent.com", // optional but recommended
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get user info
      const { idToken } = await GoogleSignin.signIn();
      if (!idToken) throw new Error("No ID token returned from Google Sign-In");

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      const user = userCredential.user;
      Alert.alert("Signed in", `Welcome ${user.displayName || "User"}`);
      console.log("Signed in user:", user);
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      Alert.alert("Error", error.message || "Sign in failed");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Google Auth</Text>
      <Button title="Sign in with Google" onPress={onGoogleButtonPress} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
});
