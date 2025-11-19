import { auth, db } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Student / Guardian registration
export async function registerUser(email, password, role, extraData = {}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "users", uid), {
    email,
    role, // "student" or "guardian"
    createdAt: serverTimestamp(),
    ...extraData,
  });

  return uid;
}

// Login + get role (Firestore or claims)
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  // Check role from Firestore
  const snap = await getDoc(doc(db, "users", uid));
  const role = snap.exists() ? snap.data().role : null;

  return { uid, role, user: cred.user };
}


export async function getCurrentUser() {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

export async function getUserRole() {
  return localStorage.getItem("userType"); // "admin" / "student"
}
