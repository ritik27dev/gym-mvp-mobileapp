import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { configureGoogleSignIn } from "../../googleSignIn";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export default function SignUpScreen({ navigation }: any) {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      console.log("Google user info:", userInfo);

      const idToken = userInfo?.data?.idToken;
      navigation.navigate("HomePage");
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);

      console.log("Signed in user:", userCredential.user);
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

      <TouchableOpacity style={styles.greenButton}>
        <Text style={styles.greenButtonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={onGoogleButtonPress}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
          }}
          style={styles.icon}
        />
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30 },
  greenButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 20,
  },
  greenButtonText: { color: "#fff", fontSize: 16 },
  orText: { fontSize: 14, marginVertical: 10, fontWeight: "600" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    marginBottom: 10,
    elevation: 2,
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    marginBottom: 20,
    elevation: 2,
  },
  icon: { width: 20, height: 20, marginRight: 10 },
  socialButtonText: { fontSize: 16 },
  privacyText: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
  link: { color: "blue", textDecorationLine: "underline" },
});
