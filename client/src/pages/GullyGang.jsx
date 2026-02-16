import { useEffect, useState } from "react";
import API_URL from "../api";

function GullyGang() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/users/public`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("User fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h2>GullyGang Members</h2>

      {users.length === 0 ? (
        <p>No members yet</p>
      ) : (
        users.map((user) => (
          <div key={user._id} style={{ marginBottom: "10px" }}>
            {user.username}
          </div>
        ))
      )}
    </div>
  );
}

export default GullyGang;
