import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureGoogleSignIn } from "../../googleSignIn";
import { auth } from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import GoogleIcon from "../../assets/svg/GoogleIcon";

export default function SignUpScreen({ navigation }: any) {
  useEffect(() => {
    configureGoogleSignIn();
  }, [navigation]);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;

      // Save token to AsyncStorage
      await AsyncStorage.setItem("userToken", idToken);

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);

      // Navigate to HomePage after successful sign-in
      navigation.replace("HomePage");
    } catch (err: any) {
      console.log("Error", err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Welcome! Let’s customize Wellvantage for your Goals.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.replace("HomePage")}
        style={[
          styles.googleButton,
          { backgroundColor: "#28A745", marginTop: "30%" },
        ]}
      >
        <Text style={styles.greenButtonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={onGoogleButtonPress}
      >
        <View style={styles.googleButtonContent}>
          <GoogleIcon style={{ marginRight: 8 }} />
          <Text style={[styles.greenButtonText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.privacyText}>
        I agree to the collection and processing of my data as outlined in the{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: "40%",
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30 },

  orText: { fontSize: 14, marginVertical: 10, fontWeight: "600" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // center content horizontally
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    elevation: 2,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  greenButtonText: {
    color: "#fff",
    fontSize: 16,
    // Remove width: "100%" here, as it can cause alignment issues
    textAlign: "center",
    fontWeight: "600",
  },
  icon: { width: 20, height: 20, marginRight: 10 },
  socialButtonText: { fontSize: 16 },
  privacyText: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    alignSelf: "center",
  },
  link: { color: "blue", textDecorationLine: "underline" },
});
