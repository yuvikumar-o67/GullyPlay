import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Chat() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("userToken");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("message", text);
    if (image) formData.append("image", image);

    await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    setText("");
    setImage(null);
    fetchMessages();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        padding: "15px",
        background: "#1B1B2F",
        color: "white",
        display: "flex",
        alignItems: "center"
      }}>
        <button onClick={() => navigate("/home")} style={{ marginRight: "10px" }}>
          ←
        </button>
        <h3 style={{ margin: 0 }}>Gully Chat</h3>
      </div>

      {/* Chat Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
        {messages.map((msg) => {
          const isMine = msg.userId?.username === userName;

          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div style={{
                background: isMine ? "#8AC926" : "#FFCA3A",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "70%"
              }}>
                {msg.message && <p>{msg.message}</p>}

                {msg.image && (
                  <img
                    src={`${API_URL}/uploads/${msg.image}`}
                    alt=""
                    style={{ width: "150px", borderRadius: "10px" }}
                  />
                )}

                <small style={{ display: "block", marginTop: "5px" }}>
                  {msg.userId?.username}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div style={{
        padding: "10px",
        display: "flex",
        gap: "10px"
      }}>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          style={{ flex: 1 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}

export default Chat;
