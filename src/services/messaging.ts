import { messaging, firestore } from "../config/firebase";

/**
 * Request notification permissions and register FCM token.
 */
export async function registerForPushNotifications(userId: string) {
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
