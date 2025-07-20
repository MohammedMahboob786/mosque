// MosqueLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MosqueLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    admin_email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mosque/mosque-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        navigate("/update-timings");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Mosque Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="admin_email"
          placeholder="Admin Email"
          value={formData.admin_email}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Login
        </button>
      </form>

      {/* Register link */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default MosqueLogin;
