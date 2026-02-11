import { getFirestore } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getMessaging } from "@react-native-firebase/messaging";

export const db = getFirestore();
export const auth = getAuth();
export const messaging = getMessaging();
