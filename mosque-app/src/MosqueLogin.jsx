// MosqueLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function MosqueLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    admin_email: "",
    password: ""
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
        body: JSON.stringify(formData)
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
    <div>
      <h2>Mosque Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          name="admin_email"
          placeholder="Admin Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default MosqueLogin;