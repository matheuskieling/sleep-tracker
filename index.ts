import messaging from "@react-native-firebase/messaging";

// Must be registered before app mounts (headless task for quit-state notifications)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background message received:", remoteMessage.messageId);
});

import "expo-router/entry";
