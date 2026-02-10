import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();

const db = admin.firestore();
const fcm = admin.messaging();

type FormType = "morning" | "noon" | "evening";

interface NotificationConfig {
  formType: FormType;
  title: string;
  body: string;
}

const NOTIFICATION_CONFIGS: Record<FormType, NotificationConfig> = {
  morning: {
    formType: "morning",
    title: "Bom dia! ☀️",
    body: "Como foi sua noite de sono? Preencha o formulário da manhã.",
  },
  noon: {
    formType: "noon",
    title: "Meio-dia! 🕛",
    body: "Como foi sua manhã? Preencha o formulário do meio-dia.",
  },
  evening: {
    formType: "evening",
    title: "Boa noite! 🌙",
    body: "Como foi sua tarde? Preencha o formulário da noite.",
  },
};

function getTodayString(): string {
  const now = new Date();
  const brDate = now.toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
  return brDate; // returns YYYY-MM-DD
}

async function sendNotifications(formType: FormType) {
  const config = NOTIFICATION_CONFIGS[formType];
  const today = getTodayString();

  // Get all users with notifications enabled (filter token in code to avoid composite index)
  const usersSnapshot = await db
    .collection("users")
    .where("notificationsEnabled", "==", true)
    .get();

  const sendPromises: Promise<void>[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const token = userData.fcmToken as string;

    if (!token) {
      continue;
    }

    // Check if the user already submitted this form today
    const entryDoc = await db
      .collection("users")
      .doc(userId)
      .collection("entries")
      .doc(today)
      .get();

    const entry = entryDoc.data();
    if (entry && entry[formType]) {
      // Already submitted, skip
      continue;
    }

    // Send push notification
    const promise = fcm
      .send({
        token,
        notification: {
          title: config.title,
          body: config.body,
        },
        data: {
          formType: config.formType,
        },
        android: {
          priority: "high",
          notification: {
            channelId: "sleep-tracker",
            priority: "high",
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: config.title,
                body: config.body,
              },
              sound: "default",
            },
          },
        },
      })
      .then(() => {
        console.log(`Notification sent to user ${userId} for ${formType}`);
      })
      .catch((error) => {
        console.error(
          `Failed to send notification to user ${userId}:`,
          error.message
        );
        // If token is invalid, clear it
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          return db.collection("users").doc(userId).update({ fcmToken: "" });
        }
        return;
      });

    sendPromises.push(promise as Promise<void>);
  }

  await Promise.all(sendPromises);
  console.log(
    `Processed ${sendPromises.length} notifications for ${formType}`
  );
}

export const morningNotification = onSchedule(
  {
    schedule: "0 8 * * *",
    timeZone: "America/Sao_Paulo",
    retryCount: 1,
  },
  async () => {
    await sendNotifications("morning");
  }
);

export const noonNotification = onSchedule(
  {
    schedule: "0 12 * * *",
    timeZone: "America/Sao_Paulo",
    retryCount: 1,
  },
  async () => {
    await sendNotifications("noon");
  }
);

export const eveningNotification = onSchedule(
  {
    schedule: "0 20 * * *",
    timeZone: "America/Sao_Paulo",
    retryCount: 1,
  },
  async () => {
    await sendNotifications("evening");
  }
);
