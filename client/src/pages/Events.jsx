import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (eventId, status) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await fetch(`http://localhost:3001/api/events/${eventId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "30px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#eee",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: "25px" }}>Upcoming Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        events.map((event) => {
          const coming = event.reactions.filter(r => r.status === "coming");
          const notComing = event.reactions.filter(r => r.status === "not_coming");

          return (
            <div
              key={event._id}
              style={{
                background: "#ffffff",
                padding: "20px",
                marginBottom: "25px",
                borderRadius: "16px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{event.title}</h3>
              <p style={{ margin: "4px 0" }}>📍 {event.location}</p>
              <p style={{ margin: "4px 0 15px 0" }}>🕒 {event.time}</p>

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button
                  onClick={() => handleReaction(event._id, "coming")}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: "20px"
                  }}
                >
                  Coming ({coming.length})
                </button>

                <button
                  onClick={() => handleReaction(event._id, "not_coming")}
                  style={{
                    backgroundColor: "#F44336",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: "20px"
                  }}
                >
                  Not Coming ({notComing.length})
                </button>
              </div>

              {coming.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <strong>Coming:</strong>
                  <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                    {coming.map((r, i) => (
                      <li key={i}>{r.userId?.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {notComing.length > 0 && (
                <div>
                  <strong>Not Coming:</strong>
                  <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                    {notComing.map((r, i) => (
                      <li key={i}>{r.userId?.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Events;
