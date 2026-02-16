import { useEffect, useState } from "react";
import API_URL from "../api";

function GullyGang() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>GullyGang Members</h2>

      {users.map((user) => (
        <div key={user._id}>
          {user.username}
        </div>
      ))}
    </div>
  );
}

export default GullyGang;
