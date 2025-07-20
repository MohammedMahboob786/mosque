import { useState } from "react";

function SelectPreferredMosque() {
  const [userId, setUserId] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [preferredMosqueId, setPreferredMosqueId] = useState("");

  const formatSecondsToTime = (secStr) => {
    if (!secStr) return "--:--";
    const totalSeconds = parseInt(parseFloat(secStr));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/${userId}/preferred-mosque/`);
      const data = await res.json();
      if (res.ok) {
        setSubscriptions([data]); // ✅ Wrap the single object in an array
        setPreferredMosqueId(data.mosque_id); // ✅ Set preferred ID
      } else {
        alert(data.error || "Could not fetch preferred mosque");
        setSubscriptions([]);
      }
    } catch (err) {
      alert("Network error: " + err.message);
      setSubscriptions([]);
    }
  };

  const setPreferred = async (mosque_id) => {
    try {
      const res = await fetch("http://localhost:8000/api/user/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          mosque_id,
          preferred: true
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Preferred mosque updated");
        setPreferredMosqueId(mosque_id);
        fetchSubscriptions(); // 🔄 Refresh after update
      } else {
        alert(data.error || "Failed to set preference");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Set Preferred Mosque</h2>
      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchSubscriptions}>Fetch Preferred Mosque</button>

      {subscriptions.length > 0 && (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.mosque_id} style={{ margin: "1rem 0" }}>
              <strong>{sub.mosque_name}</strong><br />
              Azan Timings:
              {["fajr", "zuhr", "asr", "maghrib", "isha"].map((key) => (
                <span key={key}> {key}: {formatSecondsToTime(sub.azan_timings[key])} |</span>
              ))}
              <br />
              Namaz Timings:
              {["fajr", "zuhr", "asr", "maghrib", "isha"].map((key) => (
                <span key={key}> {key}: {formatSecondsToTime(sub.namaz_timings[key])} |</span>
              ))}
              <br />
              <button
                onClick={() => setPreferred(sub.mosque_id)}
                disabled={sub.mosque_id === preferredMosqueId}
              >
                {sub.mosque_id === preferredMosqueId ? "Preferred" : "Set as Preferred"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelectPreferredMosque;
