import { useEffect, useRef, useState, useCallback } from "react";

function SubscriberMosqueList() {
  const [userId, setUserId] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [azanTimings, setAzanTimings] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  
  const azanAudio = useRef(null);
  const azanTriggered = useRef({});
  const intervalRef = useRef(null);

  const testIntervalRef = useRef(null);
  const [testAzanTimings, setTestAzanTimings] = useState(null);


  const startTestAzanLoop = (timings) => {
      useEffect(() => {
      return () => {
        if (testIntervalRef.current) {
          clearInterval(testIntervalRef.current);
          addDebugLog("🧹 Cleaned up test interval");
        }
      };
    }, []);

    addDebugLog("🧪 Starting test azan loop (every 5 seconds)");

    testIntervalRef.current = setInterval(() => {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const timeStr = now.toLocaleTimeString();

      setDebugInfo(`🧪 [Test] ${timeStr} (${currentSeconds}s)`);

      Object.entries(timings).forEach(([prayer, targetSeconds]) => {
        const diff = Math.abs(currentSeconds - parseInt(targetSeconds));
        if (diff <= 30) {
          const today = new Date().toDateString();
          const triggerKey = `test-${prayer}-${today}`;
          if (!azanTriggered.current[triggerKey]) {
            addDebugLog(`🧪 Triggering test azan for ${prayer}`);
            playAzanNotification(prayer + " (Test)");
            azanTriggered.current[triggerKey] = true;
          }
        }
      });
    }, 5000);
  };


  // Add debug log helper
  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setDebugLogs(prev => [...prev.slice(-10), logEntry]); // Keep last 10 logs
  };

  // Enable audio on user interaction
  const enableAudio = useCallback(async () => {
    if (azanAudio.current && !audioEnabled) {
      try {
        addDebugLog("Attempting to enable audio...");
        await azanAudio.current.load();
        await azanAudio.current.play();
        azanAudio.current.pause();
        azanAudio.current.currentTime = 0;
        setAudioEnabled(true);
        addDebugLog("✅ Audio enabled successfully");
      } catch (err) {
        addDebugLog(`❌ Failed to enable audio: ${err.message}`);
        alert("Please click 'Enable Audio' to allow azan notifications");
      }
    }
  }, [audioEnabled]);

  // 🔁 Run on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      addDebugLog(`Loading stored user ID: ${storedUserId}`);
      fetchPreferredMosqueAndStartLoop(storedUserId);
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        addDebugLog("Cleaned up interval");
      }
    };
  }, []);

  const fetchPreferredMosqueAndStartLoop = async (storedUserId) => {
    try {
      addDebugLog("Fetching preferred mosque data...");
      const res = await fetch(`http://localhost:8000/api/user/${storedUserId}/preferred-mosque/`);
      const data = await res.json();

      if (res.ok && data.azan_timings) {
        addDebugLog(`✅ Got azan timings: ${JSON.stringify(data.azan_timings)}`);
        setAzanTimings(data.azan_timings);
        startAzanCheckLoop(data.azan_timings);
      } else {
        addDebugLog(`❌ Failed to get azan timings: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      addDebugLog(`❌ Network error: ${err.message}`);
    }
  };

  // 🔁 Check every 5 seconds for azan time match (very frequent for testing)
  const startAzanCheckLoop = (azanTimings) => {
    // Clear existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      addDebugLog("Cleared previous interval");
    }

    addDebugLog("🔄 Starting azan check loop (every 5 seconds)");

    intervalRef.current = setInterval(() => {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const timeStr = now.toLocaleTimeString();
      
      setDebugInfo(`⏰ ${timeStr} (${currentSeconds}s)`);
      
      let foundMatch = false;
      Object.entries(azanTimings).forEach(([prayer, timeInSeconds]) => {
        if (!timeInSeconds) return;
        
        const prayerSeconds = parseInt(timeInSeconds);
        const diff = Math.abs(currentSeconds - prayerSeconds);
        const prayerTime = formatTime(timeInSeconds);
        
        // More detailed logging
        if (diff <= 60) { // Log when we're within 1 minute
          addDebugLog(`🕐 ${prayer}: now=${currentSeconds}s, target=${prayerSeconds}s (${prayerTime}), diff=${diff}s`);
        }

        // Check if within 30 seconds (precise timing)
        const today = new Date().toDateString();
        const triggerKey = `${prayer}-${today}`;
        
        if (diff <= 30 && !azanTriggered.current[triggerKey]) {
          foundMatch = true;
          addDebugLog(`🔔 MATCH FOUND! Triggering azan for ${prayer}`);
          playAzanNotification(prayer);
          azanTriggered.current[triggerKey] = true;
        }
      });

      if (!foundMatch && Math.floor(Date.now() / 5000) % 12 === 0) { // Log every minute
        addDebugLog(`⏳ No matches found. Current time: ${timeStr}`);
      }
    }, 10000); // Check every 10 seconds for good balance
  };

  const playAzanNotification = async (prayer) => {
    try {
      addDebugLog(`🔊 Playing azan notification for ${prayer}`);
      
      // Browser notification (if permission granted)
      if (Notification.permission === "granted") {
        new Notification(`${prayer.toUpperCase()} Time`, {
          body: "It's time for prayer",
          icon: "/mosque-icon.png"
        });
        addDebugLog("✅ Browser notification sent");
      }

      // Audio notification with detailed debugging
      if (azanAudio.current && audioEnabled) {
        addDebugLog(`Audio check - Duration: ${azanAudio.current.duration}, Volume: ${azanAudio.current.volume}, Muted: ${azanAudio.current.muted}`);
        
        // Ensure volume is maximum and not muted
        azanAudio.current.volume = 1.0;
        azanAudio.current.muted = false;
        azanAudio.current.currentTime = 0;
        
        // Try to play with more detailed error handling
        const playPromise = azanAudio.current.play();
        await playPromise;
        
        addDebugLog("✅ Azan audio played successfully - Check your device volume!");
        
        // Additional check: See if audio is actually playing
        setTimeout(() => {
          if (azanAudio.current && !azanAudio.current.paused) {
            addDebugLog(`🔊 Audio is currently playing at ${azanAudio.current.currentTime.toFixed(1)}s`);
          } else {
            addDebugLog("⚠️ Audio stopped or paused unexpectedly");
          }
        }, 1000);
        
      } else {
        addDebugLog(`⚠️ Audio not available - audioEnabled: ${audioEnabled}, audioRef exists: ${!!azanAudio.current}`);
        alert(`🕌 ${prayer.toUpperCase()} Time - It's time for prayer!`);
      }
    } catch (err) {
      addDebugLog(`❌ Audio play failed: ${err.message}`);
      alert(`🕌 ${prayer.toUpperCase()} Time - It's time for prayer! (Audio failed: ${err.message})`);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      addDebugLog(`Notification permission: ${permission}`);
    }
  };

  const handleFetchSubscriptions = async () => {
  // Use entered userId if provided, else fallback to localStorage
  const finalUserId = userId.trim() || localStorage.getItem("user_id");

  if (!finalUserId) {
    return alert("Please enter your User ID or ensure it's saved in local storage.");
  }

  // Save resolved userId to localStorage and state (if not already set)
  localStorage.setItem("user_id", finalUserId);
  if (!userId.trim()) setUserId(finalUserId);

  setLoading(true);

  try {
    const res = await fetch(`http://localhost:8000/api/user/${finalUserId}/subscriptions/`);
    const data = await res.json();

    if (res.ok) {
      setSubscriptions(data);
      addDebugLog(`✅ Fetched ${data.length} subscriptions`);

      // ✅ Start Azan loop right after fetching
      fetchPreferredMosqueAndStartLoop(finalUserId);
    } else {
      alert(data.error || "Failed to fetch subscriptions");
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }

  setLoading(false);
};


  const formatTime = (seconds) => {
    if (!seconds) return "--:--";
    const total = parseInt(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const testAudio = async () => {
    try {
      addDebugLog("Testing audio playback...");
      if (azanAudio.current) {
        // Check if audio file exists and is loaded
        addDebugLog(`Audio duration: ${azanAudio.current.duration}`);
        addDebugLog(`Audio volume: ${azanAudio.current.volume}`);
        addDebugLog(`Audio muted: ${azanAudio.current.muted}`);
        addDebugLog(`Audio readyState: ${azanAudio.current.readyState}`);
        
        azanAudio.current.volume = 1.0; // Max volume
        azanAudio.current.currentTime = 0;
        await azanAudio.current.play();
        addDebugLog("✅ Audio test successful - you should hear sound now!");
      }
    } catch (err) {
      addDebugLog(`❌ Audio test failed: ${err.message}`);
      alert("Audio test failed: " + err.message);
    }
  };

  // Manual trigger for testing (triggers azan for next prayer in 10 seconds)
 const triggerTestAzan = () => {
  const now = new Date();
  const testTime = now.getTime() + 10000; // 10 seconds from now
  const testSeconds = Math.floor((testTime % (24 * 60 * 60 * 1000)) / 1000);

  const testPrayer = "test_prayer";
  const today = new Date().toDateString();
  const triggerKey = `${testPrayer}-${today}`;

  // Clear any previous flag
  azanTriggered.current[triggerKey] = false;

  addDebugLog("🧪 Scheduling test azan 10 seconds from now...");

  setTimeout(() => {
    if (!azanTriggered.current[triggerKey]) {
      addDebugLog("🔔 Triggering test azan now!");
      playAzanNotification(testPrayer);
      azanTriggered.current[triggerKey] = true;
    } else {
      addDebugLog("⚠️ Test azan was already triggered");
    }
  }, 10000); // Trigger after 10 seconds
};




  const getCurrentTimeInSeconds = () => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔊 Azan audio */}
      <audio 
        ref={azanAudio} 
        src="https://www.islamcan.com/audio/adhan/azan1.mp3"
        preload="auto"
        onError={(e) => addDebugLog(`Audio load error: ${e.target.error?.message || 'Unknown error'}`)}
        onLoadedData={() => addDebugLog("Audio loaded successfully")}
        onCanPlay={() => addDebugLog("Audio can play")}
      />

      <div style={{ background: "#f0f0f0", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
        <h3>🔔 Debug & Testing Panel</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <button onClick={enableAudio} disabled={audioEnabled} style={{ marginRight: "10px" }}>
            {audioEnabled ? "✅ Audio Enabled" : "🔊 Enable Audio"}
          </button>
          <button onClick={requestNotificationPermission} style={{ marginRight: "10px" }}>
            📱 Enable Browser Notifications
          </button>
          <button onClick={testAudio} disabled={!audioEnabled} style={{ marginRight: "10px", background: "#4CAF50", color: "white", padding: "8px 12px" }}>
            🎵 Test Audio (LOUD)
          </button>
          <button onClick={triggerTestAzan} style={{ background: "#ff6b6b", color: "white" }}>
            🧪 Test Azan (10s delay)
          </button>
        </div>

        <div style={{ fontSize: "14px", marginBottom: "10px" }}>
          <strong>Current Time:</strong> {debugInfo} | <strong>Seconds:</strong> {getCurrentTimeInSeconds()}
        </div>

        {azanTimings && (
          <div style={{ fontSize: "12px", marginBottom: "10px" }}>
            <strong>Loaded Azan Timings:</strong>
            {Object.entries(azanTimings).map(([prayer, seconds]) => (
              <span key={prayer} style={{ marginRight: "15px" }}>
                {prayer}: {formatTime(seconds)} ({seconds}s)
              </span>
            ))}
          </div>
        )}

        <div style={{ background: "white", padding: "10px", borderRadius: "3px", maxHeight: "200px", overflow: "auto" }}>
          <strong>Debug Log:</strong>
          {debugLogs.map((log, index) => (
            <div key={index} style={{ fontSize: "11px", fontFamily: "monospace", margin: "2px 0" }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <h2>Your Subscribed Mosques</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleFetchSubscriptions}>Fetch My Subscriptions</button>
      </div>

      {loading && <p>Loading...</p>}

      {subscriptions.map((mosque, index) => (
        <div
          key={index}
          style={{ 
            border: "1px solid #ccc", 
            marginTop: "20px", 
            padding: "15px",
            borderRadius: "5px"
          }}
        >
          <h3>{mosque.mosque_name || mosque.mosque_id}</h3>

          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <div>
              <h4>🔔 Azan Timings</h4>
              <ul>
                {Object.entries(mosque.azan_timings).map(([k, v]) =>
                  k !== "updated_at" ? (
                    <li key={k}>
                      <strong>{k.toUpperCase()}:</strong> {formatTime(v)} 
                      <span style={{ fontSize: "10px", color: "#666" }}> ({v}s)</span>
                      {Object.keys(azanTriggered.current).some(key => key.startsWith(k)) && 
                        <span style={{ color: "green", marginLeft: "10px" }}>✅</span>
                      }
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            <div>
              <h4>🕌 Namaz Timings</h4>
              <ul>
                {Object.entries(mosque.namaz_timings).map(([k, v]) =>
                  k !== "updated_at" ? (
                    <li key={k}>
                      <strong>{k.toUpperCase()}:</strong> {formatTime(v)}
                      <span style={{ fontSize: "10px", color: "#666" }}> ({v}s)</span>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriberMosqueList;