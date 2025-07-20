// SubscriberView.jsx
import { useState } from "react";

function SubscriberView() {
  const [mosqueId, setMosqueId] = useState("");
  const [timings, setTimings] = useState(null);
  const [userId, setUserId] = useState(""); // Can be email or phone

  const handleFetchTimings = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/mosque/${mosqueId}/timings/`);
      const data = await res.json();
      if (res.ok) {
        setTimings(data);
      } else {
        alert(data.error || "Failed to fetch timings");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/user/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, mosque_id: mosqueId })
      });
      const data = await res.json();
      alert(data.message || "Subscription successful");
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div>
      <h2>View Mosque Timings</h2>
      <input
        type="text"
        placeholder="Enter Mosque ID"
        value={mosqueId}
        onChange={(e) => setMosqueId(e.target.value)}
      />
      <button onClick={handleFetchTimings}>Get Timings</button>

      {timings && (
        <div>
          <h3>Azan Timings</h3>
          <ul>
            {Object.entries(timings.azan_timings).map(([k, v]) => (
              <li key={k}>{k.toUpperCase()}: {v}</li>
            ))}
          </ul>
          <h3>Namaz Timings</h3>
          <ul>
            {Object.entries(timings.namaz_timings).map(([k, v]) => (
              <li key={k}>{k.toUpperCase()}: {v}</li>
            ))}
          </ul>

          <h4>Subscribe to this mosque</h4>
          <input
            type="text"
            placeholder="Your ID (email/phone)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      )}
    </div>
  );
}

export default SubscriberView;
