// App.jsx
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");
  const [name, setName] = useState("");

  // スレッドを読み込み
  useEffect(() => {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setThreads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // スレッド追加
  const addThread = async () => {
    if (!newThread.trim() || !name.trim()) return;
    await addDoc(collection(db, "threads"), {
      title: newThread,
      author: name,
      createdAt: new Date()
    });
    setNewThread("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 みんなの提案ボード</h1>

      {/* 入力フォーム */}
      <div className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="新しいスレッド（例：遊び場所の案）"
          value={newThread}
          onChange={(e) => setNewThread(e.target.value)}
        />
        <button
          onClick={addThread}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          投稿
        </button>
      </div>

      {/* スレッド一覧 */}
      <ul>
        {threads.map((t) => (
          <li
            key={t.id}
            className="border p-3 rounded mb-2 shadow bg-white"
          >
            <div className="font-bold">{t.title}</div>
            <div className="text-sm text-gray-500">by {t.author}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}