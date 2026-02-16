import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [notification, setNotification] = useState("");

  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:3001/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const fetchNotifications = async () => {
    const res = await fetch("http://localhost:3001/api/notifications");
    const data = await res.json();
    setNotifications(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3001/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const handleAddEvent = async () => {
    if (!title || !location || !time) {
      alert("Fill all fields");
      return;
    }

    const response = await fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, location, time })
    });

    if (!response.ok) {
      alert("Not authorized");
      return;
    }

    setTitle("");
    setLocation("");
    setTime("");
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    await fetch(`http://localhost:3001/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchEvents();
  };

  const handleSendNotification = async () => {
    if (!notification) {
      alert("Write a message");
      return;
    }

    const response = await fetch("http://localhost:3001/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: notification })
    });

    if (!response.ok) {
      alert("Failed to send notification");
      return;
    }

    setNotification("");
    fetchNotifications();
  };

  const handleDeleteNotification = async (id) => {
    await fetch(`http://localhost:3001/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchNotifications();
  };

  /* =========================
     USER MANAGEMENT
  ========================= */

  const handleBanUser = async (id) => {
    await fetch(`http://localhost:3001/api/users/ban/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const handleRemoveUser = async (id) => {
    await fetch(`http://localhost:3001/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "25px" }}>Admin Panel</h2>

      <div className="card" style={{ maxWidth: "450px", margin: "0 auto" }}>

        {/* ADD EVENT */}
        <h3>Add Upcoming Event</h3>

        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          className="full-btn"
          style={{ backgroundColor: "#6A4C93", color: "white", marginTop: "10px" }}
          onClick={handleAddEvent}
        >
          Add Event
        </button>

        <hr style={{ margin: "30px 0" }} />

        {/* NOTIFICATIONS */}
        <h3>Send Notification</h3>

        <input
          placeholder="Notification message"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
        />

        <button
          className="full-btn"
          style={{ backgroundColor: "#FFCA3A", marginTop: "10px" }}
          onClick={handleSendNotification}
        >
          Send Notification
        </button>

        {notifications.map((n) => (
          <div key={n._id} className="event-card">
            <p>{n.message}</p>

            <button
              onClick={() => handleDeleteNotification(n._id)}
              className="small-btn"
              style={{ backgroundColor: "#D62828", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))}

        <hr style={{ margin: "30px 0" }} />

        {/* MANAGE EVENTS */}
        <h3>Manage Events</h3>

        {events.map((event) => (
          <div key={event._id} className="event-card">
            <strong>{event.title}</strong>
            <p>{event.location} • {event.time}</p>

            <button
              onClick={() => handleDeleteEvent(event._id)}
              className="small-btn"
              style={{ backgroundColor: "#D62828", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))}

        <hr style={{ margin: "30px 0" }} />

        {/* MANAGE USERS */}
        <h3>Manage Users</h3>

        {users.map((user) => (
          <div key={user._id} className="event-card">
            <strong>{user.name}</strong>
            <p>{user.email}</p>

            {user.isBanned && (
              <p style={{ color: "red" }}>🚫 BANNED</p>
            )}

            {!user.isBanned && (
              <button
                onClick={() => handleBanUser(user._id)}
                className="small-btn"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  marginRight: "5px"
                }}
              >
                Ban
              </button>
            )}

            <button
              onClick={() => handleRemoveUser(user._id)}
              className="small-btn"
              style={{
                backgroundColor: "#D62828",
                color: "white"
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="small-btn"
          style={{ marginTop: "25px", backgroundColor: "#FF595E", color: "white" }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Admin;
