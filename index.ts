import { getMessaging, setBackgroundMessageHandler } from "@react-native-firebase/messaging";

// Must be registered before app mounts (headless task for quit-state notifications)
setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("Background message received:", remoteMessage.messageId);
});

import "expo-router/entry";
