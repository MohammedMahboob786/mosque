// RegistrationSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";

function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const mosqueId = location.state?.mosqueId;

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Registration Successful!</h2>
      <p>Your Mosque ID is:</p>
      <div style={{ background: "#e0ffe0", padding: "1rem", marginTop: "1rem" }}>
        <strong>{mosqueId || "Unknown"}</strong>
      </div>

      <button style={{ marginTop: "1rem" }} onClick={handleLoginRedirect}>
        Go to Login
      </button>
    </div>
  );
}

export default RegistrationSuccess;
