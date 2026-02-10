import { auth, firestore } from "../config/firebase";

export async function signIn(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email: string, password: string) {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const user = credential.user;

  // Create user profile document
  await firestore().collection("users").doc(user.uid).set({
    email: user.email,
    createdAt: firestore.FieldValue.serverTimestamp(),
    notificationsEnabled: true,
    fcmToken: "",
  });

  return credential;
}

export async function signOut() {
  return auth().signOut();
}

export async function resetPassword(email: string) {
  return auth().sendPasswordResetEmail(email);
}
