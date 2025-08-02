// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { Button, StyleSheet, Text, View, Alert } from "react-native";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { configureGoogleSignIn } from "./src/googleSignIn";
// import { auth } from "./firebase";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import AppNavigator from "./src/Navigation/AppNavigator";

// export default function App() {
//   useEffect(() => {
//     configureGoogleSignIn();
//   }, []);

//   async function onGoogleButtonPress() {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo: any = await GoogleSignin.signIn();

//       console.log("Google user info:", userInfo);

//       // const idToken = userInfo.idToken;
//       // if (!idToken) {
//       //   throw new Error(
//       //     "idToken is undefined. Check webClientId in configureGoogleSignIn."
//       //   );
//       // }

//       const googleCredential = GoogleAuthProvider.credential(idToken);
//       const userCredential = await signInWithCredential(auth, googleCredential);

//       console.log("Signed in user:", userCredential.user);
//       Alert.alert("Signed in", `Welcome ${userCredential.user.displayName}`);
//     } catch (err: any) {}
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Sign in with Google</Text>
//       <Button title="Google Sign-In" onPress={onGoogleButtonPress} />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

export default function App() {
  return <AppNavigator />;
}
