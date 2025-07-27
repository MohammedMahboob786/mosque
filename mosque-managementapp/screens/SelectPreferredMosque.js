// screens/SelectPreferredMosque.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet
} from 'react-native';

export default function SelectPreferredMosque() {
  const [userId, setUserId] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [preferredMosqueId, setPreferredMosqueId] = useState('');

  const formatSecondsToTime = (secStr) => {
    if (!secStr) return '--:--';
    const totalSeconds = parseInt(parseFloat(secStr));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/user/${userId}/preferred-mosque/`);
      const data = await res.json();
      if (res.ok) {
        setSubscriptions([data]);
        setPreferredMosqueId(data.mosque_id);
      } else {
        Alert.alert('Error', data.error || 'Could not fetch preferred mosque');
        setSubscriptions([]);
      }
    } catch (err) {
      Alert.alert('Error', 'Network error: ' + err.message);
      setSubscriptions([]);
    }
  };

  const setPreferred = async (mosque_id) => {
    try {
      const res = await fetch("http://192.168.0.107:8000/api/user/subscribe/", {
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
        Alert.alert("Success", "Preferred mosque updated");
        setPreferredMosqueId(mosque_id);
        fetchSubscriptions();
      } else {
        Alert.alert("Error", data.error || "Failed to set preference");
      }
    } catch (err) {
      Alert.alert("Error", "Network error: " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Set Preferred Mosque</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your User ID"
        value={userId}
        onChangeText={setUserId}
      />
      <Button title="Fetch Preferred Mosque" onPress={fetchSubscriptions} />

      {subscriptions.length > 0 && (
        <View style={styles.subscriptions}>
          {subscriptions.map((sub) => (
            <View key={sub.mosque_id} style={styles.mosqueCard}>
              <Text style={styles.mosqueName}>{sub.mosque_name}</Text>

              <Text style={styles.label}>Azan Timings:</Text>
              {["fajr", "zuhr", "asr", "maghrib", "isha"].map((key) => (
                <Text key={key}>
                  {key}: {formatSecondsToTime(sub.azan_timings[key])}
                </Text>
              ))}

              <Text style={styles.label}>Namaz Timings:</Text>
              {["fajr", "zuhr", "asr", "maghrib", "isha"].map((key) => (
                <Text key={key}>
                  {key}: {formatSecondsToTime(sub.namaz_timings[key])}
                </Text>
              ))}

              <Button
                title={
                  sub.mosque_id === preferredMosqueId
                    ? "Preferred"
                    : "Set as Preferred"
                }
                onPress={() => setPreferred(sub.mosque_id)}
                disabled={sub.mosque_id === preferredMosqueId}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  subscriptions: {
    marginTop: 20
  },
  mosqueCard: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 20
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937"
  },
  label: {
    marginTop: 10,
    fontWeight: "600"
  }
});
