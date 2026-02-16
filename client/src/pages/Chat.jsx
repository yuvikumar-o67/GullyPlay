import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
      const res = await fetch(`${API}/api/chat`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  const sendMessage = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("message", text);
    if (image) formData.append("image", image);

    await fetch(`${API}/api/chat`, {
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/home")} style={styles.back}>
          ←
        </button>
        <h3 style={{ margin: 0 }}>GullyChat</h3>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg) => {
          const isMine = msg.senderName === userName;

          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: "15px"
              }}
            >
              <div style={{ maxWidth: "75%" }}>
                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor: isMine ? "#00FF90" : "#FF2BF1",
                    color: "black",
                    borderTopRightRadius: isMine ? "0px" : "15px",
                    borderTopLeftRadius: isMine ? "15px" : "0px"
                  }}
                >
                  {msg.message && <p style={{ margin: 0 }}>{msg.message}</p>}

                  {msg.image && (
                    <img
                      src={`${API}/uploads/${msg.image}`}
                      alt=""
                      style={{
                        width: "180px",
                        borderRadius: "10px",
                        marginTop: "5px"
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    textAlign: isMine ? "right" : "left",
                    color: "#FFD700"
                  }}
                >
                  {msg.senderName} • {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <div style={styles.inputBar}>
        <label style={styles.plus}>
          +
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <input
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={sendMessage} style={styles.send}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;
