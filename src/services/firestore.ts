import { firestore } from "../config/firebase";
import type {
  DayEntry,
  MorningEntry,
  NoonEntry,
  EveningEntry,
} from "../types/entry";
import { getTodayString } from "../utils/date";

function entriesCollection(userId: string) {
  return firestore().collection("users").doc(userId).collection("entries");
}

/**
 * Get or create today's entry document.
 */
export async function getOrCreateTodayEntry(
  userId: string
): Promise<DayEntry | null> {
  const dateString = getTodayString();
  return getEntry(userId, dateString);
}

/**
 * Get an entry for a specific date.
 */
export async function getEntry(
  userId: string,
  dateString: string
): Promise<DayEntry | null> {
  const doc = await entriesCollection(userId).doc(dateString).get();
  if (!doc.exists) return null;
  return doc.data() as DayEntry;
}

/**
 * Submit a morning form entry.
 */
export async function submitMorningEntry(
  userId: string,
  data: Omit<MorningEntry, "submittedAt">
) {
  const dateString = getTodayString();
  const now = firestore.FieldValue.serverTimestamp();

  await entriesCollection(userId)
    .doc(dateString)
    .set(
      {
        dateString,
        createdAt: now,
        updatedAt: now,
        morning: {
          ...data,
          submittedAt: now,
        },
      },
      { merge: true }
    );
}

/**
 * Submit a noon form entry.
 */
export async function submitNoonEntry(
  userId: string,
  data: Omit<NoonEntry, "submittedAt">
) {
  const dateString = getTodayString();
  const now = firestore.FieldValue.serverTimestamp();

  await entriesCollection(userId)
    .doc(dateString)
    .set(
      {
        dateString,
        updatedAt: now,
        noon: {
          ...data,
          submittedAt: now,
        },
      },
      { merge: true }
    );
}

/**
 * Submit an evening form entry.
 */
export async function submitEveningEntry(
  userId: string,
  data: Omit<EveningEntry, "submittedAt">
) {
  const dateString = getTodayString();
  const now = firestore.FieldValue.serverTimestamp();

  await entriesCollection(userId)
    .doc(dateString)
    .set(
      {
        dateString,
        updatedAt: now,
        evening: {
          ...data,
          submittedAt: now,
        },
      },
      { merge: true }
    );
}

/**
 * Get entries for a date range (inclusive).
 */
export async function getEntriesInRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DayEntry[]> {
  const snapshot = await entriesCollection(userId)
    .where("dateString", ">=", startDate)
    .where("dateString", "<=", endDate)
    .orderBy("dateString", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as DayEntry);
}

/**
 * Check which forms have been submitted today.
 */
export async function getTodayStatus(
  userId: string
): Promise<{ morning: boolean; noon: boolean; evening: boolean }> {
  const entry = await getOrCreateTodayEntry(userId);
  return {
    morning: !!entry?.morning,
    noon: !!entry?.noon,
    evening: !!entry?.evening,
  };
}
