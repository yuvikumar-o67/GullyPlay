import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your email ✅");

    } catch (error) {
      alert("Something went wrong");
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
        Forgot Password
      </h2>

      <div style={{ maxWidth: "320px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="full-btn"
          style={{
            backgroundColor: "#FFCA3A",
            marginTop: "10px"
          }}
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
