import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "@react-native-firebase/auth";
import { doc, setDoc, getDoc } from "@react-native-firebase/firestore";
import { serverTimestamp } from "@react-native-firebase/firestore";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, name: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Create user profile document
  await setDoc(doc(db, "users", user.uid), {
    name,
    email: user.email,
    createdAt: serverTimestamp(),
    notificationsEnabled: true,
    fcmToken: "",
  });

  return credential;
}

export async function getUserName(userId: string): Promise<string> {
  const docSnap = await getDoc(doc(db, "users", userId));
  return docSnap.data()?.name || "";
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}
