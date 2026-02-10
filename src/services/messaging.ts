import { Platform, PermissionsAndroid } from "react-native";
import { messaging, firestore } from "../config/firebase";

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

  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === 1 || authStatus === 2;

  if (!enabled) {
    console.log("Notification permission denied");
    return null;
  }

  const token = await messaging().getToken();

  await firestore().collection("users").doc(userId).update({
    fcmToken: token,
    notificationsEnabled: true,
  });

  return token;
}

/**
 * Listen for token refresh and update Firestore.
 */
export function onTokenRefresh(userId: string) {
  return messaging().onTokenRefresh(async (token) => {
    await firestore().collection("users").doc(userId).update({
      fcmToken: token,
    });
  });
}

/**
 * Handle foreground messages.
 */
export function onForegroundMessage(callback: (message: any) => void) {
  return messaging().onMessage(callback);
}
