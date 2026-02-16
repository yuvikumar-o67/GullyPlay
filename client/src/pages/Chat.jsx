import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
    const res = await fetch("http://localhost:3001/api/chat");
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("message", text);
    if (image) formData.append("image", image);

    await fetch("http://localhost:3001/api/chat", {
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

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/home")} style={styles.back}>
          ←
        </button>
        <h3 style={{ margin: 0 }}>GullyChat</h3>
      </div>

      {/* CHAT BODY */}
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
                      src={`http://localhost:3001/uploads/${msg.image}`}
                      alt=""
                      style={{
                        width: "180px",
                        borderRadius: "10px",
                        marginTop: "5px"
                      }}
                    />
                  )}
                </div>

                {/* NAME + TIME BELOW */}
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

      {/* INPUT AREA */}
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

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0F0F1B",
    fontFamily: "monospace"
  },
  header: {
    padding: "15px",
    backgroundColor: "#1B1B2F",
    color: "#00FF90",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    borderBottom: "2px solid #FF2BF1"
  },
  back: {
    background: "none",
    border: "none",
    color: "#00FF90",
    fontSize: "20px",
    cursor: "pointer"
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px"
  },
  bubble: {
    padding: "12px",
    borderRadius: "15px",
    boxShadow: "0 0 8px rgba(255, 0, 255, 0.6)"
  },
  inputBar: {
    display: "flex",
    padding: "12px",
    backgroundColor: "#1B1B2F",
    alignItems: "center",
    gap: "10px",
    borderTop: "2px solid #00FF90"
  },
  plus: {
    fontSize: "22px",
    color: "#FF2BF1",
    cursor: "pointer"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    backgroundColor: "#2C2C54",
    color: "white"
  },
  send: {
    backgroundColor: "#00FF90",
    border: "none",
    color: "black",
    padding: "10px 15px",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Chat;
