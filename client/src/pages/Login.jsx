import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/admin");

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <h2
        style={{
          fontFamily: "'Changa One', cursive",
          marginBottom: "30px"
        }}
      >
        Admin Login
      </h2>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="full-btn"
          style={{
            backgroundColor: "#FFCA3A",
            marginTop: "10px"
          }}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
