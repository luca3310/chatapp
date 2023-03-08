import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrQ_cQfo2X13s7FsA4geeGx3M_-8cGJQ8",
  authDomain: "chatapp-572cf.firebaseapp.com",
  projectId: "chatapp-572cf",
  storageBucket: "chatapp-572cf.appspot.com",
  messagingSenderId: "361880911667",
  appId: "1:361880911667:web:742289e4ff608f0f970846",
  measurementId: "G-PPZGZGGXYN",
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(firebaseApp);

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
