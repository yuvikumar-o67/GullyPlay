import API_URL from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/notifications`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.location.replace("/");
  };

  return (
    <div className="page">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Hey {userName || "Gully Member"} 👋</h2>

          <button
            onClick={handleLogout}
            className="small-btn"
            style={{ backgroundColor: "#FF595E", color: "white" }}
          >
            Logout
          </button>
        </div>

        {notifications.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              background: "#c4c4c4",
              padding: "10px",
              borderRadius: "10px",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                display: "inline-block",
                animation: "scrollLeft 15s linear infinite",
              }}
            >
              {notifications.map((n) => n.message).join("  •  ")}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <button
            className="full-btn"
            style={{ backgroundColor: "#FFCA3A" }}
            onClick={() => navigate("/events")}
          >
            Upcoming Events
          </button>

          <button
            className="full-btn"
            style={{ backgroundColor: "#8AC926", color: "white" }}
            onClick={() => navigate("/gullygang")}
          >
            GullyGang
          </button>

          <button
            className="full-btn"
            style={{ backgroundColor: "#6A4C93", color: "white" }}
            onClick={() => navigate("/live")}
          >
            Live Sports
          </button>

          <button
            className="full-btn"
            style={{ backgroundColor: "#6A4C93", color: "white" }}
            onClick={() => navigate("/chat")}
          >
            Gully Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
