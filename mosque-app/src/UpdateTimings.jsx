import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function UpdateTimings() {
  const [formData, setFormData] = useState({
    fajr: "",
    zuhr: "",
    asr: "",
    maghrib: "",
    isha: ""
  });

  const [currentTimings, setCurrentTimings] = useState(null);

  const token = localStorage.getItem("token");
  const mosque_id = token ? jwtDecode(token).mosque_id : null;

  const fetchTimings = async () => {
    if (!token || !mosque_id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/mosque/${mosque_id}/timings/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentTimings(data);
      } else {
        console.error("Failed to fetch timings", data);
      }
    } catch (err) {
      console.error("Network error", err);
    }
  };

  useEffect(() => {
    fetchTimings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (endpoint) => {
    if (!token) return alert("You must be logged in!");

    try {
      const response = await fetch(`http://localhost:8000/api/mosque/${endpoint}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchTimings();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🕌 Update Azan & Namaz Timings</h2>

        {currentTimings && (
          <div style={styles.timingsBox}>
            <h3 style={styles.subheading}>Current Azan Timings</h3>
            <ul>
              {Object.entries(currentTimings.azan_timings).map(
                ([key, value]) =>
                  key !== "updated_at" && (
                    <li key={key} style={styles.timeItem}>
                      <span style={styles.timeLabel}>{key.toUpperCase()}</span>:{" "}
                      <span style={styles.timeValue}>{value || "N/A"}</span>
                    </li>
                  )
              )}
            </ul>

            <h3 style={styles.subheading}>Current Namaz Timings</h3>
            <ul>
              {Object.entries(currentTimings.namaz_timings).map(
                ([key, value]) =>
                  key !== "updated_at" && (
                    <li key={key} style={styles.timeItem}>
                      <span style={styles.timeLabel}>{key.toUpperCase()}</span>:{" "}
                      <span style={styles.timeValue}>{value || "N/A"}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

        <form style={styles.form}>
          {["fajr", "zuhr", "asr", "maghrib", "isha"].map((prayer) => (
            <div key={prayer} style={styles.inputGroup}>
              <label style={styles.label}>
                {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
              </label>
              <input
                type="time"
                name={prayer}
                value={formData[prayer]}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          ))}

          <div style={styles.buttonGroup}>
            <button type="button" onClick={() => handleUpdate("update-azan")} style={styles.buttonPrimary}>
              Update Azan Timings
            </button>
            <button type="button" onClick={() => handleUpdate("update-namaz")} style={styles.buttonSecondary}>
              Update Namaz Timings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3f4f6, #d1d5db)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  },
  card: {
    maxWidth: "700px",
    width: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "30px 40px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    fontFamily: "'Segoe UI', sans-serif"
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
    color: "#2c3e50"
  },
  subheading: {
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "18px",
    color: "#34495e"
  },
  timingsBox: {
    backgroundColor: "#fef9c3",
    border: "1px solid #fde68a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px"
  },
  timeItem: {
    fontSize: "16px",
    marginBottom: "8px"
  },
  timeLabel: {
    fontWeight: "600",
    color: "#6b7280"
  },
  timeValue: {
    color: "#111827"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontWeight: "600",
    marginBottom: "5px",
    color: "#374151"
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  buttonPrimary: {
    flex: 1,
    padding: "12px 20px",
    marginRight: "10px",
    backgroundColor: "#10b981",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  },
  buttonSecondary: {
    flex: 1,
    padding: "12px 20px",
    marginLeft: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }
};

export default UpdateTimings;
