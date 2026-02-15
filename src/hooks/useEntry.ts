import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import type { DayEntry } from "../types/entry";
import {
  getEntry,
  getEntriesInRange,
  getTodayStatus,
  getDateStatus,
} from "../services/firestore";

export function useEntry(dateString: string) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getEntry(user.uid, dateString);
      setEntry(data);
    } finally {
      setLoading(false);
    }
  }, [user, dateString]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entry, loading, refresh };
}

export function useTodayStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState({
    morning: false,
    noon: false,
    evening: false,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getTodayStatus(user.uid);
      setStatus(result);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, loading, refresh };
}

export function useDateStatus(dateString: string) {
  const { user } = useAuth();
  const [status, setStatus] = useState({
    morning: false,
    noon: false,
    evening: false,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getDateStatus(user.uid, dateString);
      setStatus(result);
    } finally {
      setLoading(false);
    }
  }, [user, dateString]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, loading, refresh };
}

export function useEntryRange(startDate: string, endDate: string) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getEntriesInRange(user.uid, startDate, endDate);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, loading, refresh };
}
