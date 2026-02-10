import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

// Use the modular API to avoid deprecation warnings and crash issues
export { auth, firestore, messaging };
export default firebase;
