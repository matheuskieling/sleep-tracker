import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "@react-native-firebase/firestore";
import { serverTimestamp } from "@react-native-firebase/firestore";
import type {
  DayEntry,
  MorningEntry,
  NoonEntry,
  EveningEntry,
  Report,
} from "../types/entry";
import { getTodayString } from "../utils/date";

function entriesCollection(userId: string) {
  return collection(db, "users", userId, "entries");
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
  const docSnap = await getDoc(doc(entriesCollection(userId), dateString));
  if (!docSnap.exists) return null;
  return docSnap.data() as DayEntry;
}

/**
 * Submit a morning form entry.
 */
export async function submitMorningEntry(
  userId: string,
  data: Omit<MorningEntry, "submittedAt">,
  dateString: string
) {
  const now = serverTimestamp();

  await setDoc(
    doc(entriesCollection(userId), dateString),
    {
      dateString,
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
  data: Omit<NoonEntry, "submittedAt">,
  dateString: string
) {
  const now = serverTimestamp();

  await setDoc(
    doc(entriesCollection(userId), dateString),
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
  data: Omit<EveningEntry, "submittedAt">,
  dateString: string
) {
  const now = serverTimestamp();

  await setDoc(
    doc(entriesCollection(userId), dateString),
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
  const q = query(
    entriesCollection(userId),
    where("dateString", ">=", startDate),
    where("dateString", "<=", endDate),
    orderBy("dateString", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => d.data() as DayEntry);
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

/**
 * Check which forms have been submitted for a specific date.
 */
export async function getDateStatus(
  userId: string,
  dateString: string
): Promise<{ morning: boolean; noon: boolean; evening: boolean }> {
  const entry = await getEntry(userId, dateString);
  return {
    morning: !!entry?.morning,
    noon: !!entry?.noon,
    evening: !!entry?.evening,
  };
}

// --- Reports ---

function reportsCollection(userId: string) {
  return collection(db, "users", userId, "reports");
}

export async function saveReport(
  userId: string,
  startDate: string,
  endDate: string,
  content: string
): Promise<string> {
  const docRef = await addDoc(reportsCollection(userId), {
    startDate,
    endDate,
    content,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getReports(userId: string): Promise<Report[]> {
  const q = query(reportsCollection(userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Report[];
}

export async function getReport(
  userId: string,
  reportId: string
): Promise<Report | null> {
  const docSnap = await getDoc(doc(reportsCollection(userId), reportId));
  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as Report;
}

export async function deleteReport(
  userId: string,
  reportId: string
): Promise<void> {
  await deleteDoc(doc(reportsCollection(userId), reportId));
}
