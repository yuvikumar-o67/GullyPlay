import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userName", data.name);

      navigate("/home", { replace: true });

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2
        style={{
          marginBottom: "30px",
          fontFamily: "'Changa One', cursive"
        }}
      >
        Gully Login
      </h2>

      <div style={{ maxWidth: "320px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            backgroundColor: "#8AC926",
            color: "white",
            marginTop: "10px"
          }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "18px",
            cursor: "pointer",
            color: "#6A4C93",
            fontWeight: "bold",
            fontSize: "14px"
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

      </div>
    </div>
  );
}

export default UserLogin;
