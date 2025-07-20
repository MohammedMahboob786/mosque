import { useState } from "react";

function PreferredMosqueSelector() {
  const [userId, setUserId] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [preferredMosqueId, setPreferredMosqueId] = useState("");

  const formatTime = (secondsStr) => {
    if (!secondsStr) return "--:--";
    const totalSeconds = parseInt(parseFloat(secondsStr));
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const fetchSubscriptions = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8000/api/user/${userId}/subscriptions/`);
      const data = await res.json();
      if (res.ok) {
        setSubscriptions(data); // ✅ directly set the array
        // Optional: If backend gives preferred: true
        const preferred = data.find((sub) => sub.preferred);
        if (preferred) setPreferredMosqueId(preferred.mosque_id);
      } else {
        alert(data.error || "Failed to fetch subscriptions");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const updatePreferred = async (mosque_id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/${userId}/set-preference/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mosque_id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Preferred mosque updated");
        setPreferredMosqueId(mosque_id);
      } else {
        alert(data.error || "Failed to update preferred mosque");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Select Preferred Mosque</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchSubscriptions}>Fetch Subscriptions</button>

      {Array.isArray(subscriptions) && subscriptions.length > 0 && (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.mosque_id} style={{ margin: "1rem 0" }}>
              <label>
                <input
                  type="radio"
                  name="preferredMosque"
                  value={sub.mosque_id}
                  checked={sub.mosque_id === preferredMosqueId}
                  onChange={() => updatePreferred(sub.mosque_id)}
                />
                <strong>{sub.mosque_name}</strong>
              </label>
              <div>
                Azan: {Object.entries(sub.azan_timings).map(([key, value]) =>
                  <span key={key}>{key}: {formatTime(value)} | </span>
                )}
              </div>
              <div>
                Namaz: {Object.entries(sub.namaz_timings).map(([key, value]) =>
                  <span key={key}>{key}: {formatTime(value)} | </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreferredMosqueSelector;
