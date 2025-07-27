import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const SubscriberMosqueList = () => {
  const [userId, setUserId] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [azanTimings, setAzanTimings] = useState(null);

  const azanSound = useRef(null);
  const azanTriggered = useRef({});
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadUserId = async () => {
      const stored = await AsyncStorage.getItem('user_id');
      if (stored) {
        setUserId(stored);
        fetchPreferredMosqueAndStartLoop(stored);
      }
    };
    loadUserId();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (azanSound.current) azanSound.current.unloadAsync();
    };
  }, []);

  const enableAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.islamcan.com/audio/adhan/azan1.mp3' },
        { shouldPlay: false }
      );
      azanSound.current = sound;
      setAudioEnabled(true);
      Alert.alert('Audio Enabled');
    } catch (err) {
      Alert.alert('Error', 'Please allow audio permissions.');
    }
  };

  const fetchPreferredMosqueAndStartLoop = async (uid) => {
    try {
      const res = await fetch(`http:///192.168.0.107:8000/api/user/${uid}/preferred-mosque/`);
      const data = await res.json();
      if (res.ok && data.azan_timings) {
        setAzanTimings(data.azan_timings);
        startAzanCheckLoop(data.azan_timings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startAzanCheckLoop = (timings) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const secondsNow = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      Object.entries(timings).forEach(([prayer, time]) => {
        if (!time) return;
        const diff = Math.abs(secondsNow - parseInt(time));
        const today = new Date().toDateString();
        const key = `${prayer}-${today}`;
        if (diff <= 30 && !azanTriggered.current[key]) {
          triggerAzan(prayer);
          azanTriggered.current[key] = true;
        }
      });
    }, 10000);
  };

  const triggerAzan = async (prayer) => {
    Alert.alert(`${prayer.toUpperCase()} Time`, "It's time for prayer");
    if (audioEnabled && azanSound.current) {
      await azanSound.current.replayAsync();
    }
  };

  const handleFetchSubscriptions = async () => {
    const finalId = userId.trim();
    if (!finalId) return Alert.alert('Error', 'Please enter User ID');

    await AsyncStorage.setItem('user_id', finalId);
    setLoading(true);

    try {
      const res = await fetch(`http://192.168.0.107:8000/api/user/${finalId}/subscriptions/`);
      const data = await res.json();
      if (res.ok) {
        setSubscriptions(data);
        fetchPreferredMosqueAndStartLoop(finalId);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
  };

  const formatTime = (sec) => {
    if (!sec) return '--:--';
    const total = parseInt(sec);
    const h = Math.floor(total / 3600).toString().padStart(2, '0');
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Button title={audioEnabled ? '✅ Audio Enabled' : 'Enable Audio'} onPress={enableAudio} disabled={audioEnabled} />
      <TextInput
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />
      <Button title="Fetch Subscriptions" onPress={handleFetchSubscriptions} />
      {loading && <Text>Loading...</Text>}

      {azanTimings && (
        <View style={styles.block}>
          <Text style={styles.subHeading}>Active Azan Timings:</Text>
          {Object.entries(azanTimings).map(([prayer, time]) => (
            <Text key={prayer}>{prayer}: {formatTime(time)}</Text>
          ))}
        </View>
      )}

      {subscriptions.map((mosque, i) => (
        <View key={i} style={styles.block}>
          <Text style={styles.heading}>{mosque.mosque_name || mosque.mosque_id}</Text>
          <Text style={styles.subHeading}>Azan Timings:</Text>
          {Object.entries(mosque.azan_timings).map(([k, v]) => (
            <Text key={k}>{k.toUpperCase()}: {formatTime(v)}</Text>
          ))}
          <Text style={styles.subHeading}>Namaz Timings:</Text>
          {Object.entries(mosque.namaz_timings).map(([k, v]) => (
            <Text key={k}>{k.toUpperCase()}: {formatTime(v)}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subHeading: { fontWeight: '600', marginTop: 10 },
  block: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default SubscriberMosqueList;
