// RegisterMosque.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterMosque() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    admin_email: "",
    password: ""
  });

  const navigate = useNavigate(); // ✅ Initialize router

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mosque/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Redirect to success page with mosque_id
        navigate("/registered", { state: { mosqueId: data.mosque_id } });
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Register Mosque</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Mosque Name" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <input name="admin_email" placeholder="Admin Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterMosque;
