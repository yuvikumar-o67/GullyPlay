import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ textAlign: "center" }}>

      <h1
        style={{
          fontFamily: "'Changa One', cursive",
          fontSize: "44px",
          marginBottom: "10px",
          color: "#111",
          textShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        GullyPlay
      </h1>

      <p
        style={{
          fontFamily: "'Sue Ellen Francisco', cursive",
          fontSize: "22px",
          marginBottom: "50px",
          textShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        Play. Plan. Connect. Repeat.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        <button
          className="full-btn"
          style={{
            background: "#FFCA3A",
            color: "#111"
          }}
          onClick={() => navigate("/register")}
        >
          Join GullyGang
        </button>

        <button
          className="full-btn"
          style={{
            background: "#8AC926",
            color: "white"
          }}
          onClick={() => navigate("/user-login")}
        >
          Gully Login
        </button>

        <button
          className="full-btn"
          style={{
            background: "#6A4C93",
            color: "white"
          }}
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
      </div>

    </div>
  );
}

export default Landing;
