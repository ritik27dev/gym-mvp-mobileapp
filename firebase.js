// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyDvwyE-hwDwFlmhct-RGEWu4L0vV1mwAOw",
//   authDomain: "gym-well-app.firebaseapp.com",
//   projectId: "gym-well-app",
//   storageBucket: "gym-well-app.firebasestorage.app",
//   messagingSenderId: "445698063824",
//   appId: "1:445698063824:web:849b7af73e607a54ee0dd5",
//   measurementId: "G-73VF04018E"
// };

// const app = initializeApp(firebaseConfig);


import { firebase } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDvwyE-hwDwFlmhct-RGEWu4L0vV1mwAOw",
  authDomain: "gym-well-app.firebaseapp.com",
  projectId: "gym-well-app",
  storageBucket: "gym-well-app.firebasestorage.app",
  messagingSenderId: "445698063824",
  appId: "1:445698063824:web:849b7af73e607a54ee0dd5",
  measurementId: "G-73VF04018E"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };