// // screens/UpdateTimings.js

// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwtDecode from 'jwt-decode';

// export default function UpdateTimings() {
//   const [formData, setFormData] = useState({
//     fajr: "",
//     zuhr: "",
//     asr: "",
//     maghrib: "",
//     isha: ""
//   });

//   const [currentTimings, setCurrentTimings] = useState(null);
//   const [mosqueId, setMosqueId] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       const storedToken = await AsyncStorage.getItem("token");
//       if (storedToken) {
//         setToken(storedToken);
//         const decoded = jwtDecode(storedToken);
//         setMosqueId(decoded.mosque_id);
//         fetchTimings(storedToken, decoded.mosque_id);
//       }
//     };
//     init();
//   }, []);

//   const fetchTimings = async (tk, mid) => {
//     try {
//       const res = await fetch(`http://192.168.0.107:8000/api/mosque/${mid}/timings/`, {
//         headers: {
//           Authorization: `Bearer ${tk}`
//         }
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCurrentTimings(data);
//       } else {
//         console.error("Failed to fetch timings", data);
//       }
//     } catch (err) {
//       console.error("Network error", err);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleUpdate = async (endpoint) => {
//     if (!token) return Alert.alert("Error", "You must be logged in!");

//     try {
//       const res = await fetch(`http://192.168.0.107:8000/api/mosque/${endpoint}/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });
//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert("Success", data.message);
//         fetchTimings(token, mosqueId);
//       } else {
//         Alert.alert("Failed", data.error || "Update failed");
//       }
//     } catch (err) {
//       Alert.alert("Error", "Network error: " + err.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.wrapper}>
//       <View style={styles.card}>
//         <Text style={styles.heading}>🕌 Update Azan & Namaz Timings</Text>

//         {currentTimings && (
//           <View style={styles.timingsBox}>
//             <Text style={styles.subheading}>Current Azan Timings</Text>
//             {Object.entries(currentTimings.azan_timings).map(
//               ([key, value]) =>
//                 key !== "updated_at" && (
//                   <Text key={key} style={styles.timeItem}>
//                     <Text style={styles.timeLabel}>{key.toUpperCase()}</Text>:{" "}
//                     <Text style={styles.timeValue}>{value || "N/A"}</Text>
//                   </Text>
//                 )
//             )}

//             <Text style={styles.subheading}>Current Namaz Timings</Text>
//             {Object.entries(currentTimings.namaz_timings).map(
//               ([key, value]) =>
//                 key !== "updated_at" && (
//                   <Text key={key} style={styles.timeItem}>
//                     <Text style={styles.timeLabel}>{key.toUpperCase()}</Text>:{" "}
//                     <Text style={styles.timeValue}>{value || "N/A"}</Text>
//                   </Text>
//                 )
//             )}
//           </View>
//         )}

//         {["fajr", "zuhr", "asr", "maghrib", "isha"].map((prayer) => (
//           <View key={prayer} style={styles.inputGroup}>
//             <Text style={styles.label}>{prayer.charAt(0).toUpperCase() + prayer.slice(1)}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="HH:MM"
//               value={formData[prayer]}
//               onChangeText={(text) => handleChange(prayer, text)}
//             />
//           </View>
//         ))}

//         <View style={styles.buttonGroup}>
//           <Button title="Update Azan Timings" onPress={() => handleUpdate("update-azan")} />
//           <View style={{ height: 10 }} />
//           <Button title="Update Namaz Timings" color="#3b82f6" onPress={() => handleUpdate("update-namaz")} />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     padding: 20,
//     backgroundColor: "#f3f4f6",
//     flexGrow: 1,
//     justifyContent: "center"
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     elevation: 4
//   },
//   heading: {
//     textAlign: "center",
//     fontSize: 22,
//     marginBottom: 20,
//     fontWeight: "bold",
//     color: "#2c3e50"
//   },
//   subheading: {
//     marginTop: 15,
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#34495e"
//   },
//   timingsBox: {
//     backgroundColor: "#fef9c3",
//     borderColor: "#fde68a",
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 20
//   },
//   timeItem: {
//     fontSize: 15,
//     marginBottom: 8
//   },
//   timeLabel: {
//     fontWeight: "bold",
//     color: "#6b7280"
//   },
//   timeValue: {
//     color: "#111827"
//   },
//   inputGroup: {
//     marginBottom: 15
//   },
//   label: {
//     marginBottom: 5,
//     fontWeight: "600",
//     color: "#374151"
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     padding: 10
//   },
//   buttonGroup: {
//     marginTop: 20
//   }
// });

// screens/UpdateTimings.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export default function UpdateTimings() {
  const [formData, setFormData] = useState({
    fajr: "",
    zuhr: "",
    asr: "",
    maghrib: "",
    isha: ""
  });

  const [currentTimings, setCurrentTimings] = useState(null);
  const [mosqueId, setMosqueId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log('Stored token:', storedToken ? 'Found' : 'Not found');
        
        if (storedToken) {
          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          console.log('Decoded token:', decoded);
          
          setMosqueId(decoded.mosque_id);
          await fetchTimings(storedToken, decoded.mosque_id);
        } else {
          setError("No authentication token found");
        }
      } catch (err) {
        console.error('Init error:', err);
        setError("Failed to initialize: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchTimings = async (tk, mid) => {
    try {
      console.log(`Fetching timings for mosque ID: ${mid}`);
      
      // Replace with your actual server URL
      const serverUrl = __DEV__ 
        ? 'http://192.168.0.107:8000' // Android emulator
        : 'https://your-production-server.com';
      
      const res = await fetch(`${serverUrl}/api/mosque/${mid}/timings/`, {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        setCurrentTimings(data);
        setError(null);
        
        // Pre-populate form with current timings if available
        if (data.azan_timings || data.namaz_timings) {
          const timings = data.azan_timings || data.namaz_timings;
          setFormData({
            fajr: timings.fajr || "",
            zuhr: timings.zuhr || "",
            asr: timings.asr || "",
            maghrib: timings.maghrib || "",
            isha: timings.isha || ""
          });
        }
      } else {
        const errorMsg = data.error || data.detail || "Failed to fetch timings";
        console.error("API Error:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: " + err.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (endpoint) => {
    if (!token) {
      Alert.alert("Error", "You must be logged in!");
      return;
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const [prayer, time] of Object.entries(formData)) {
      if (time && !timeRegex.test(time)) {
        Alert.alert("Invalid Format", `Please enter ${prayer} time in HH:MM format`);
        return;
      }
    }

    try {
      const serverUrl = __DEV__ 
        ? 'http://192.168.0.107:8000' // Android emulator
        : 'https://your-production-server.com';

      const res = await fetch(`${serverUrl}/api/mosque/${endpoint}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      console.log('Update response:', data);
      
      if (res.ok) {
        Alert.alert("Success", data.message || "Timings updated successfully");
        await fetchTimings(token, mosqueId); // Refresh timings
      } else {
        Alert.alert("Failed", data.error || data.detail || "Update failed");
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert("Error", "Network error: " + err.message);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    
    // If it's in seconds format, convert to HH:MM
    if (typeof timeStr === 'number' || /^\d+$/.test(timeStr)) {
      const totalSeconds = parseInt(timeStr);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return timeStr;
  };

  if (loading) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading timings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <Button 
          title="Retry" 
          onPress={() => {
            setLoading(true);
            setError(null);
            // Re-run initialization
            const init = async () => {
              try {
                const storedToken = await AsyncStorage.getItem("token");
                if (storedToken) {
                  setToken(storedToken);
                  const decoded = jwtDecode(storedToken);
                  setMosqueId(decoded.mosque_id);
                  await fetchTimings(storedToken, decoded.mosque_id);
                }
              } catch (err) {
                setError("Failed to initialize: " + err.message);
              } finally {
                setLoading(false);
              }
            };
            init();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.heading}>🕌 Update Azan & Namaz Timings</Text>

        {currentTimings && (
          <View style={styles.timingsBox}>
            {currentTimings.azan_timings && (
              <>
                <Text style={styles.subheading}>📢 Current Azan Timings</Text>
                {Object.entries(currentTimings.azan_timings).map(
                  ([key, value]) =>
                    key !== "updated_at" && (
                      <Text key={key} style={styles.timeItem}>
                        <Text style={styles.timeLabel}>{key.toUpperCase()}</Text>:{" "}
                        <Text style={styles.timeValue}>{formatTime(value)}</Text>
                      </Text>
                    )
                )}
              </>
            )}

            {currentTimings.namaz_timings && (
              <>
                <Text style={styles.subheading}>🕌 Current Namaz Timings</Text>
                {Object.entries(currentTimings.namaz_timings).map(
                  ([key, value]) =>
                    key !== "updated_at" && (
                      <Text key={key} style={styles.timeItem}>
                        <Text style={styles.timeLabel}>{key.toUpperCase()}</Text>:{" "}
                        <Text style={styles.timeValue}>{formatTime(value)}</Text>
                      </Text>
                    )
                )}
              </>
            )}

            {currentTimings.updated_at && (
              <Text style={styles.updatedAt}>
                Last updated: {new Date(currentTimings.updated_at).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.formHeading}>📝 Update Timings</Text>

        {["fajr", "zuhr", "asr", "maghrib", "isha"].map((prayer) => (
          <View key={prayer} style={styles.inputGroup}>
            <Text style={styles.label}>
              {prayer.charAt(0).toUpperCase() + prayer.slice(1)} Time
            </Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM (e.g., 05:30)"
              value={formData[prayer]}
              onChangeText={(text) => handleChange(prayer, text)}
              keyboardType="numeric"
            />
          </View>
        ))}

        <View style={styles.buttonGroup}>
          <Button 
            title="📢 Update Azan Timings" 
            onPress={() => handleUpdate("update-azan")} 
            color="#e74c3c"
          />
          <View style={{ height: 10 }} />
          <Button 
            title="🕌 Update Namaz Timings" 
            color="#3b82f6" 
            onPress={() => handleUpdate("update-namaz")} 
          />
        </View>

        {mosqueId && (
          <Text style={styles.mosqueInfo}>Mosque ID: {mosqueId}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#2c3e50"
  },
  formHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 15,
    marginTop: 10,
  },
  subheading: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 10,
  },
  timingsBox: {
    backgroundColor: "#fef9c3",
    borderColor: "#fde68a",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20
  },
  timeItem: {
    fontSize: 15,
    marginBottom: 6,
    paddingLeft: 10,
  },
  timeLabel: {
    fontWeight: "bold",
    color: "#6b7280"
  },
  timeValue: {
    color: "#111827",
    fontWeight: "600",
  },
  updatedAt: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 10,
    fontStyle: "italic",
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#374151"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 20,
  },
  mosqueInfo: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 15,
  },
});