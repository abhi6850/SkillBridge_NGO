import React, { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messaging.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const WS_BASE = process.env.REACT_APP_WS_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}

function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // backend puts id at payload.user.id
    return payload.user && (payload.user.id || payload.user._id) ? (payload.user.id || payload.user._id) : null;
  } catch (e) {
    return null;
  }
}

const Messaging = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const bottomRef = useRef(null);

  const myUserId = useMemo(() => getUserIdFromToken(), []);

  useEffect(() => {
    async function loadUsers() {
      const token = getToken();
      const res = await fetch(`${API_BASE}/messages/users`, {
        headers: { "x-auth-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (data.length && !selectedUserId) setSelectedUserId(data[0]._id);
      }
    }
    loadUsers();
  }, [selectedUserId]);

  const [search, setSearch] = useState("");
  async function handleSearch() {
    const q = search.trim();
    const token = getToken();
    if (!q) return;
    const res = await fetch(`${API_BASE}/messages/search?q=${encodeURIComponent(q)}`, {
      headers: { "x-auth-token": token },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  }

  useEffect(() => {
    if (!selectedUserId) return;
    async function loadMessages() {
      const token = getToken();
      const res = await fetch(`${API_BASE}/messages/${selectedUserId}`, {
        headers: { "x-auth-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    }
    loadMessages();
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current && bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!myUserId) return;
    const socket = io(WS_BASE, {
      query: { userId: myUserId },
      transports: ["websocket"],
      withCredentials: false,
    });

    socket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));
    socket.on("newMessage", (msg) => {
      if (
        (msg.senderId === selectedUserId && msg.receiverId === myUserId) ||
        (msg.senderId === myUserId && msg.receiverId === selectedUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setNotifications((prev) => [
          ...prev,
          { id: msg._id, type: "message", fromUserId: msg.senderId, text: msg.text || "New message" },
        ]);
      }
    });
    socket.on("notification", (n) => setNotifications((prev) => [...prev, { ...n, id: n.messageId || Date.now() }]));
    socket.on("messageDeleted", (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    });

    return () => socket.disconnect();
  }, [myUserId, selectedUserId]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || !selectedUserId) return;
    const token = getToken();
    const res = await fetch(`${API_BASE}/messages/send/${selectedUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ text: trimmed }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setInput("");
    }
  }

  const selectedUser = users.find((u) => u._id === selectedUserId);
  const isSelectedUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="messaging-container">
      <div className="chat-list">
        <div style={{ display: "flex", gap: 8, padding: "0 15px 10px" }}>
          <input
            style={{ flex: 1 }}
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {users.map((u) => {
          const unread = notifications.filter((n) => n.fromUserId === u._id).length;
          return (
            <div
              key={u._id}
              className={`chat-item ${selectedUserId === u._id ? "active" : ""}`}
              onClick={() => {
                setSelectedUserId(u._id);
                setNotifications((prev) => prev.filter((n) => n.fromUserId !== u._id));
              }}
            >
              <img src={u.avatar || "https://via.placeholder.com/40"} alt={u.name || u.email} className="chat-avatar" />
              <div className="chat-info">
                <h4>{u.name || u.email}</h4>
                {unread > 0 && <p>{unread} new message{unread > 1 ? "s" : ""}</p>}
              </div>
              {unread > 0 && <span className="chat-time">New</span>}
            </div>
          );
        })}
      </div>

      <div className="chat-window">
        <div className="chat-header">
          <img src={selectedUser?.avatar || "https://via.placeholder.com/40"} alt={selectedUser?.name || "User"} className="chat-avatar" />
          <div>
            <h4>{selectedUser?.name || selectedUser?.email || "Select a user"}</h4>
            {selectedUser && (
              <p className="online-status">{isSelectedUserOnline ? "🟢 Online" : "⚫ Offline"}</p>
            )}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m) => {
            const mine = m.senderId === myUserId;
            return (
              <div key={m._id} className={`message ${mine ? "sent" : "received"}`}>
                {m.image && (
                  <img src={m.image} alt="attachment" style={{ maxWidth: 240, borderRadius: 8, marginBottom: 6 }} />
                )}
                <p>{m.text}</p>
                <span className="time">{new Date(m.createdAt).toLocaleTimeString()}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>➤</button>
        </div>
      </div>

      {/* simple toast area */}
      {notifications.length > 0 && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "#333", color: "#fff", padding: 12, borderRadius: 8 }}>
          {notifications.slice(-3).map((n) => (
            <div key={n.id} style={{ marginBottom: 6 }}>{n.text}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messaging;