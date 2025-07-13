// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterMosque from "./RegisterMosque";
import RegistrationSuccess from "./RegistrationSuccess";
import MosqueLogin from "./MosqueLogin";
import UpdateTimings from "./UpdateTimings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterMosque />} />
        <Route path="/registered" element={<RegistrationSuccess />} />
        <Route path="/login" element={<MosqueLogin />} />
        <Route path="/update-timings" element={<UpdateTimings />} />
      </Routes>
    </Router>
  );
}

export default App;
