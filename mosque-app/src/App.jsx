// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterMosque from "./RegisterMosque";
import RegistrationSuccess from "./RegistrationSuccess";
import MosqueLogin from "./MosqueLogin";
import UpdateTimings from "./UpdateTimings";
import SubscriberView from "./SubscriberView";
import SubscriberMosqueList from "./SubscriberMosqueList";
import SelectPreferredMosque from "./SelectPreferredMosque";
import PreferredMosqueSelector from "./PreferredMosqueSelector";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterMosque />} />
        <Route path="/registered" element={<RegistrationSuccess />} />
        <Route path="/" element={<MosqueLogin />} />
        <Route path="/update-timings" element={<UpdateTimings />} />
        <Route path="/subscriber-view" element={<SubscriberView />} />
        <Route path="/subscriber-mosque" element={<SubscriberMosqueList />} />
        <Route path="/preferred-mosque" element={<SelectPreferredMosque />} />
        <Route path="/set-preference" element={<PreferredMosqueSelector />} />
        {/* Optional: Add a fallback route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
