import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// あなたの Supabase プロジェクトURLとAPIキーを設定
const SUPABASE_URL = "https://odklxdlsqkucrqamdpnc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka2x4ZGxzcWt1Y3JxYW1kcG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjczMTIsImV4cCI6MjA3MTIwMzMxMn0.Ya5m6WMeGmb40tZvRuGJMAWdcPJKgfDauX9JpBtB8RE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState("");
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  // アイデア取得
  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    const { data, error } = await supabase.from("ideas").select("*").order("id", { ascending: false });
    if (!error) setIdeas(data);
  }

  // アイデア追加
  async function addIdea() {
    if (!newIdea.trim()) return;
    await supabase.from("ideas").insert([{ text: newIdea }]);
    setNewIdea("");
    fetchIdeas();
  }

  // コメント取得
  async function fetchComments(ideaId) {
    const { data, error } = await supabase.from("comments").select("*").eq("idea_id", ideaId).order("id");
    if (!error) {
      setComments((prev) => ({ ...prev, [ideaId]: data }));
    }
  }

  // コメント追加
  async function addComment(ideaId) {
    if (!newComment[ideaId]) return;
    await supabase.from("comments").insert([{ idea_id: ideaId, text: newComment[ideaId] }]);
    setNewComment((prev) => ({ ...prev, [ideaId]: "" }));
    fetchComments(ideaId);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>💡 アイデア掲示板</h1>

      <div>
        <input
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="新しいアイデアを入力"
        />
        <button onClick={addIdea}>投稿</button>
      </div>

      <ul>
        {ideas.map((idea) => (
          <li key={idea.id} style={{ marginTop: "20px" }}>
            <p>📝 {idea.text}</p>

            <button onClick={() => fetchComments(idea.id)}>💬 コメントを見る</button>

            <div>
              {(comments[idea.id] || []).map((c) => (
                <p key={c.id} style={{ marginLeft: "20px" }}>➡ {c.text}</p>
              ))}
            </div>

            <div style={{ marginLeft: "20px" }}>
              <input
                value={newComment[idea.id] || ""}
                onChange={(e) => setNewComment({ ...newComment, [idea.id]: e.target.value })}
                placeholder="コメントを書く"
              />
              <button onClick={() => addComment(idea.id)}>送信</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
