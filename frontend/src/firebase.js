// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

// 복사한 설정 그대로 사용
const firebaseConfig = {
  apiKey: "AIzaSyAEO_2TBBePgMtjy2oBJVmB8Ck7BvAwmnw",
  authDomain: "invoice-tracker-6ca14.firebaseapp.com",
  projectId: "invoice-tracker-6ca14",
  storageBucket: "gs://invoice-tracker-6ca14.firebasestorage.app", // .app → .com (자동 교정됨)
  messagingSenderId: "101447392660",
  appId: "1:101447392660:web:6530fc1b3b0ede893cc381",
  measurementId: "G-W1XZ7B6SDX"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
export const db = getFirestore(app);