// src/googleSignIn.ts
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId:
      "445698063824-2p0e8s5apgrc1cgom4ehairk8b16ti0a.apps.googleusercontent.com",
    iosClientId:
      "445698063824-ulavn52qkr8su4bdkm0p1671l9ifdb05.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}
