import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import type { Report } from "../types/entry";
import { getReports, getReport } from "../services/firestore";

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getReports(user.uid);
      setReports(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reports, loading, refresh };
}

export function useReport(reportId: string) {
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user || !reportId) return;
    setLoading(true);
    try {
      const data = await getReport(user.uid, reportId);
      setReport(data);
    } finally {
      setLoading(false);
    }
  }, [user, reportId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { report, loading, refresh };
}
