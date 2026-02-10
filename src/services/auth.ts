import { auth, firestore } from "../config/firebase";

export async function signIn(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email: string, password: string, name: string) {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const user = credential.user;

  // Create user profile document
  await firestore().collection("users").doc(user.uid).set({
    name,
    email: user.email,
    createdAt: firestore.FieldValue.serverTimestamp(),
    notificationsEnabled: true,
    fcmToken: "",
  });

  return credential;
}

export async function getUserName(userId: string): Promise<string> {
  const doc = await firestore().collection("users").doc(userId).get();
  return doc.data()?.name || "";
}

export async function signOut() {
  return auth().signOut();
}

export async function resetPassword(email: string) {
  return auth().sendPasswordResetEmail(email);
}
