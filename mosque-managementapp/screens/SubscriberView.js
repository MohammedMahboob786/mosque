// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';

// const SubscriberView = () => {
//   const [mosqueId, setMosqueId] = useState('');
//   const [timings, setTimings] = useState(null);
//   const [userId, setUserId] = useState('');

//   const handleFetchTimings = async () => {
//     try {
//       const res = await fetch(`http://192.168.0.107:8000/api/mosque/${mosqueId}/timings/`);
//       const data = await res.json();
//       if (res.ok) {
//         setTimings(data);
//       } else {
//         Alert.alert('Error', data.error || 'Failed to fetch timings');
//       }
//     } catch (err) {
//       Alert.alert('Network error', err.message);
//     }
//   };

//   const handleSubscribe = async () => {
//     try {
//       const res = await fetch("http://192.168.0.107:8000/api/user/subscribe/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: userId, mosque_id: mosqueId })
//       });
//       const data = await res.json();
//       Alert.alert('Response', data.message || 'Subscription successful');
//     } catch (err) {
//       Alert.alert('Network error', err.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>View Mosque Timings</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Mosque ID"
//         value={mosqueId}
//         onChangeText={setMosqueId}
//       />

//       <Button title="Get Timings" onPress={handleFetchTimings} />

//       {timings && (
//         <View style={styles.timingBox}>
//           <Text style={styles.heading}>🕌 Mosque: {timings.mosque_name}</Text>

//           <Text style={styles.subheading}>Azan Timings</Text>
//           {Object.entries(timings.azan_timings).map(([k, v]) => (
//             <Text key={k}>{k.toUpperCase()}: {v}</Text>
//           ))}

//           <Text style={styles.subheading}>Namaz Timings</Text>
//           {Object.entries(timings.namaz_timings).map(([k, v]) => (
//             <Text key={k}>{k.toUpperCase()}: {v}</Text>
//           ))}

//           <Text style={styles.subheading}>Subscribe to this mosque</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Your ID (email/phone)"
//             value={userId}
//             onChangeText={setUserId}
//           />

//           <Button title="Subscribe" onPress={handleSubscribe} />
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   subheading: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 15,
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//   },
//   timingBox: {
//     marginTop: 20,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#f9f9f9',
//   },
// });

// export default SubscriberView;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';

const SubscriberView = ({ navigation }) => {
  const [mosqueId, setMosqueId] = useState('');
  const [timings, setTimings] = useState(null);
  const [userId, setUserId] = useState('');

  const handleFetchTimings = async () => {
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/mosque/${mosqueId}/timings/`);
      const data = await res.json();
      if (res.ok) {
        setTimings(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch timings');
      }
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch("http://192.168.0.107:8000/api/user/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, mosque_id: mosqueId })
      });
      const data = await res.json();
      Alert.alert('Response', data.message || 'Subscription successful');
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>View Mosque Timings</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Mosque ID"
        value={mosqueId}
        onChangeText={setMosqueId}
      />

      <Button title="Get Timings" onPress={handleFetchTimings} />

      {timings && (
        <View style={styles.timingBox}>
          <Text style={styles.heading}>🕌 Mosque: {timings.mosque_name}</Text>

          <Text style={styles.subheading}>Azan Timings</Text>
          {Object.entries(timings.azan_timings).map(([k, v]) => (
            <Text key={k}>{k.toUpperCase()}: {v}</Text>
          ))}

          <Text style={styles.subheading}>Namaz Timings</Text>
          {Object.entries(timings.namaz_timings).map(([k, v]) => (
            <Text key={k}>{k.toUpperCase()}: {v}</Text>
          ))}

          <Text style={styles.subheading}>Subscribe to this mosque</Text>

          <TextInput
            style={styles.input}
            placeholder="Your ID (email/phone)"
            value={userId}
            onChangeText={setUserId}
          />

          <Button title="Subscribe" onPress={handleSubscribe} />
        </View>
      )}

      {/* 🌟 Navigation Buttons */}
      <View style={styles.navSection}>
        <Text style={styles.subheading}>More Options</Text>
        <Button
          title="📋 My Subscribed Mosques"
          onPress={() => navigation.navigate('SubscriberMosqueList')}
        />
        <View style={{ marginVertical: 8 }} />
        <Button
          title="⭐ Select Preferred Mosque"
          onPress={() => navigation.navigate('PreferredMosqueSelector')}
        />
        <View style={{ marginVertical: 8 }} />
        <Button
          title="🕌 View Preferred Mosque Timings"
          onPress={() => navigation.navigate('SelectPreferredMosque')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  timingBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  navSection: {
    marginTop: 30,
  },
});

export default SubscriberView;
