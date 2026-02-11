import { Platform, PermissionsAndroid } from "react-native";
import { messaging, db } from "../config/firebase";
import {
  requestPermission,
  getToken,
  onTokenRefresh as fcmOnTokenRefresh,
  onMessage as fcmOnMessage,
} from "@react-native-firebase/messaging";
import { doc, updateDoc } from "@react-native-firebase/firestore";

/**
 * Request notification permissions and register FCM token.
 */
export async function registerForPushNotifications(userId: string) {
  // Android 13+ requires explicit runtime permission request
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("POST_NOTIFICATIONS permission denied");
      return null;
    }
  }

  const authStatus = await requestPermission(messaging);
  const enabled = authStatus === 1 || authStatus === 2;

  if (!enabled) {
    console.log("Notification permission denied");
    return null;
  }

  const token = await getToken(messaging);

  await updateDoc(doc(db, "users", userId), {
    fcmToken: token,
    notificationsEnabled: true,
  });

  return token;
}

/**
 * Listen for token refresh and update Firestore.
 */
export function onTokenRefresh(userId: string) {
  return fcmOnTokenRefresh(messaging, async (token) => {
    await updateDoc(doc(db, "users", userId), {
      fcmToken: token,
    });
  });
}

/**
 * Handle foreground messages.
 */
export function onForegroundMessage(callback: (message: any) => void) {
  return fcmOnMessage(messaging, callback);
}
