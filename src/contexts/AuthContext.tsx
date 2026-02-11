import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { getUserName } from "../services/auth";
import { registerForPushNotifications, onTokenRefresh } from "../services/messaging";

interface AuthContextData {
  user: any;
  userName: string;
  loading: boolean;
  refreshUserName: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  userName: "",
  loading: true,
  refreshUserName: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const name = await getUserName(firebaseUser.uid);
        setUserName(name);
        registerForPushNotifications(firebaseUser.uid).catch(console.error);
        unsubscribeTokenRefresh = onTokenRefresh(firebaseUser.uid);
      } else {
        setUserName("");
        if (unsubscribeTokenRefresh) {
          unsubscribeTokenRefresh();
          unsubscribeTokenRefresh = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubscribeTokenRefresh) {
        unsubscribeTokenRefresh();
      }
    };
  }, []);

  async function refreshUserName() {
    if (user) {
      const name = await getUserName(user.uid);
      setUserName(name);
    }
  }

  return (
    <AuthContext.Provider value={{ user, userName, loading, refreshUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
