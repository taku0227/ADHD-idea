public/
  └── index.html
src/
  ├── App.jsx
  ├── main.jsx
  └── firebase.js

  <!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>みんなの案掲示板</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// Firebase v9 モジュラー構文
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "YOUR_APP_ID"
};

// 初期化
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

function App() {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState({}); // 各スレッドのコメント入力状態

  // スレッドをリアルタイム取得
  useEffect(() => {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(list);
    });
    return () => unsub();
  }, []);

  // スレッド追加
  const addThread = async () => {
    if (!newThread.trim() || !username.trim()) return;
    await addDoc(collection(db, "threads"), {
      text: newThread,
      user: username,
      createdAt: serverTimestamp(),
      comments: []
    });
    setNewThread("");
  };

  // コメント追加
  const addComment = async (threadId) => {
    if (!comments[threadId]?.trim() || !username.trim()) return;

    const thread = threads.find((t) => t.id === threadId);
    const updatedComments = [
      ...(thread.comments || []),
      { user: username, text: comments[threadId], createdAt: new Date() }
    ];

    await addDoc(collection(db, "threads"), {
      ...thread,
      comments: updatedComments
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>みんなの案掲示板</h1>

      <input
        placeholder="名前"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "10px", display: "block", width: "100%" }}
      />

      <textarea
        placeholder="新しい案を書く"
        value={newThread}
        onChange={(e) => setNewThread(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={addThread}>案を投稿</button>

      <hr />

      <div>
        {threads.map((thread) => (
          <div key={thread.id} style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
            <p><b>{thread.user}</b> : {thread.text}</p>

            {/* コメント一覧 */}
            <div style={{ marginLeft: "20px" }}>
              {(thread.comments || []).map((c, idx) => (
                <p key={idx} style={{ fontSize: "14px" }}>
                  <b>{c.user}</b> : {c.text}
                </p>
              ))}

              {/* コメント入力 */}
              <input
                placeholder="コメントを書く"
                value={comments[thread.id] || ""}
                onChange={(e) =>
                  setComments({ ...comments, [thread.id]: e.target.value })
                }
                style={{ width: "80%", marginRight: "5px" }}
              />
              <button onClick={() => addComment(thread.id)}>送信</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
