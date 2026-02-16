import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
    const res = await fetch(`${API}/api/events`);
    const data = await res.json();
    setEvents(data);
  };

  const fetchNotifications = async () => {
    const res = await fetch(`${API}/api/notifications`);
    const data = await res.json();
    setNotifications(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/users`, {
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

    const response = await fetch(`${API}/api/events`, {
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
    await fetch(`${API}/api/events/${id}`, {
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

    const response = await fetch(`${API}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: notification })
    });

    if (!response.ok) {
      alert("Failed");
      return;
    }

    setNotification("");
    fetchNotifications();
  };

  const handleDeleteNotification = async (id) => {
    await fetch(`${API}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchNotifications();
  };

  const handleBanUser = async (id) => {
    await fetch(`${API}/api/users/ban/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const handleRemoveUser = async (id) => {
    await fetch(`${API}/api/users/${id}`, {
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
      <h2>Admin Panel</h2>

      <div className="card" style={{ maxWidth: "450px", margin: "0 auto" }}>
        <h3>Add Event</h3>

        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <button className="full-btn" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>
    </div>
  );
}

export default Admin;
