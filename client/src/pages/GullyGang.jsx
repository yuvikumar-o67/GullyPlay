import { useEffect, useState } from "react";

function GullyGang() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>GullyGang Members</h2>

      {users.map((user) => (
        <div key={user._id}>
          {user.name} (@{user.username})
        </div>
      ))}
    </div>
  );
}

export default GullyGang;
