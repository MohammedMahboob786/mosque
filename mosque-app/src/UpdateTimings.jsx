// UpdateTimings.jsx
import { useState } from "react";

function UpdateTimings() {
  const [formData, setFormData] = useState({
    fajr: "",
    zuhr: "",
    asr: "",
    maghrib: "",
    isha: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (endpoint) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in!");

      const response = await fetch(`http://localhost:8000/api/mosque/${endpoint}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Update Azan & Namaz Timings</h2>
      <form>
        <input type="time" name="fajr" placeholder="Fajr" onChange={handleChange} />
        <input type="time" name="zuhr" placeholder="Zuhr" onChange={handleChange} />
        <input type="time" name="asr" placeholder="Asr" onChange={handleChange} />
        <input type="time" name="maghrib" placeholder="Maghrib" onChange={handleChange} />
        <input type="time" name="isha" placeholder="Isha" onChange={handleChange} />

        <br /><br />
        <button type="button" onClick={() => handleUpdate("update-azan")}>
          Update Azan Timings
        </button>
        <button type="button" onClick={() => handleUpdate("update-namaz")}>
          Update Namaz Timings
        </button>
      </form>
    </div>
  );
}

export default UpdateTimings;
