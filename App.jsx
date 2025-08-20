import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");

  useEffect(() => {
    fetchThreads();
  }, []);

  async function fetchThreads() {
    const { data, error } = await supabase.from("threads").select("*").order("id", { ascending: false });
    if (error) console.error(error);
    else setThreads(data);
  }

  async function addThread() {
    if (!newThread.trim()) return;
    const { error } = await supabase.from("threads").insert([{ title: newThread }]);
    if (error) console.error(error);
    else {
      setNewThread("");
      fetchThreads();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>みんなの案</h1>
      <input
        value={newThread}
        onChange={(e) => setNewThread(e.target.value)}
        placeholder="新しい案を入力"
      />
      <button onClick={addThread}>追加</button>

      <ul>
        {threads.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
