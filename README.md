<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>友達の案掲示板</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ここを自分のSupabaseプロジェクトの値に変更
const supabaseUrl = "https://xxxx.supabase.co"; 
const supabaseKey = "YOUR_ANON_KEY"; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  // 投稿取得
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    let { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPosts(data);
  }

  // 投稿追加
  async function addPost(e) {
    e.preventDefault();
    if (!author || !content) return;

    await supabase.from("posts").insert([{ author, content }]);
    setAuthor("");
    setContent("");
    fetchPosts();
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>友達の案掲示板</h1>

      <form onSubmit={addPost}>
        <input
          type="text"
          placeholder="名前"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="案を書く"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">投稿</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {posts.map((post) => (
          <div key={post.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <p><b>{post.author}</b>: {post.content}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
