// // screens/PreferredMosqueSelector.js

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet
// } from 'react-native';

// export default function PreferredMosqueSelector() {
//   const [userId, setUserId] = useState('');
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [preferredMosqueId, setPreferredMosqueId] = useState('');

//   const formatTime = (secondsStr) => {
//     if (!secondsStr) return '--:--';
//     const totalSeconds = parseInt(parseFloat(secondsStr));
//     const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
//     return `${h}:${m}`;
//   };

//   const fetchSubscriptions = async () => {
//     if (!userId) return;
//     try {
//       const res = await fetch(`http://192.168.0.107:8000/api/user/${userId}/subscriptions/`);
//       const data = await res.json();
//       if (res.ok) {
//         setSubscriptions(data);
//         const preferred = data.find((sub) => sub.preferred);
//         if (preferred) setPreferredMosqueId(preferred.mosque_id);
//       } else {
//         Alert.alert('Error', data.error || 'Failed to fetch subscriptions');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Network error: ' + err.message);
//     }
//   };

//   const updatePreferred = async (mosque_id) => {
//     try {
//       const res = await fetch(`http://192.168.0.107:8000/api/user/${userId}/set-preference/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mosque_id }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'Preferred mosque updated');
//         setPreferredMosqueId(mosque_id);
//       } else {
//         Alert.alert('Error', data.error || 'Failed to update preferred mosque');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Network error: ' + err.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Select Preferred Mosque</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter User ID"
//         value={userId}
//         onChangeText={setUserId}
//       />
//       <Button title="Fetch Subscriptions" onPress={fetchSubscriptions} />

//       {subscriptions.length > 0 && (
//         <View style={styles.subscriptionList}>
//           {subscriptions.map((sub) => (
//             <TouchableOpacity
//               key={sub.mosque_id}
//               style={[
//                 styles.mosqueCard,
//                 preferredMosqueId === sub.mosque_id && styles.selectedCard
//               ]}
//               onPress={() => updatePreferred(sub.mosque_id)}
//             >
//               <Text style={styles.mosqueName}>
//                 {preferredMosqueId === sub.mosque_id ? '✅ ' : '⬜ '}
//                 {sub.mosque_name}
//               </Text>

//               <Text style={styles.label}>Azan Timings:</Text>
//               {Object.entries(sub.azan_timings).map(([key, value]) => (
//                 <Text key={key} style={styles.timing}>
//                   {key}: {formatTime(value)}
//                 </Text>
//               ))}

//               <Text style={styles.label}>Namaz Timings:</Text>
//               {Object.entries(sub.namaz_timings).map(([key, value]) => (
//                 <Text key={key} style={styles.timing}>
//                   {key}: {formatTime(value)}
//                 </Text>
//               ))}
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f3f4f6',
//     flexGrow: 1
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center'
//   },
//   input: {
//     borderColor: '#d1d5db',
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10
//   },
//   subscriptionList: {
//     marginTop: 20
//   },
//   mosqueCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#d1d5db'
//   },
//   selectedCard: {
//     borderColor: '#10b981',
//     backgroundColor: '#ecfdf5'
//   },
//   mosqueName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8
//   },
//   label: {
//     marginTop: 10,
//     fontWeight: '600'
//   },
//   timing: {
//     fontSize: 14,
//     marginLeft: 10
//   }
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

function PreferredMosqueSelector() {
  const [userId, setUserId] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [preferredMosqueId, setPreferredMosqueId] = useState('');

  const formatTime = (secondsStr) => {
    if (!secondsStr) return '--:--';
    const totalSeconds = parseInt(parseFloat(secondsStr));
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const fetchSubscriptions = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/user/${userId}/subscriptions/`);
      const data = await res.json();
      if (res.ok) {
        setSubscriptions(data);
        // Optional: If backend gives preferred: true
        const preferred = data.find((sub) => sub.preferred);
        if (preferred) setPreferredMosqueId(preferred.mosque_id);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch subscriptions');
      }
    } catch (err) {
      Alert.alert('Network Error', err.message);
    }
  };

  const updatePreferred = async (mosque_id) => {
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/user/${userId}/set-preference/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mosque_id }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Preferred mosque updated');
        setPreferredMosqueId(mosque_id);
      } else {
        Alert.alert('Error', data.error || 'Failed to update preferred mosque');
      }
    } catch (err) {
      Alert.alert('Network Error', err.message);
    }
  };

  const RadioButton = ({ selected, onPress, children }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioCircle, selected && styles.radioSelected]} />
      <View style={styles.radioContent}>{children}</View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Preferred Mosque</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
      />
      
      <TouchableOpacity style={styles.button} onPress={fetchSubscriptions}>
        <Text style={styles.buttonText}>Fetch Subscriptions</Text>
      </TouchableOpacity>

      {Array.isArray(subscriptions) && subscriptions.length > 0 && (
        <View style={styles.subscriptionsList}>
          {subscriptions.map((sub) => (
            <View key={sub.mosque_id} style={styles.subscriptionItem}>
              <RadioButton
                selected={sub.mosque_id === preferredMosqueId}
                onPress={() => updatePreferred(sub.mosque_id)}
              >
                <Text style={styles.mosqueName}>{sub.mosque_name}</Text>
              </RadioButton>
              
              <View style={styles.timingsContainer}>
                <Text style={styles.timingsLabel}>Azan:</Text>
                <View style={styles.timingsRow}>
                  {Object.entries(sub.azan_timings).map(([key, value]) => (
                    <Text key={key} style={styles.timingItem}>
                      {key}: {formatTime(value)} |{' '}
                    </Text>
                  ))}
                </View>
              </View>
              
              <View style={styles.timingsContainer}>
                <Text style={styles.timingsLabel}>Namaz:</Text>
                <View style={styles.timingsRow}>
                  {Object.entries(sub.namaz_timings).map(([key, value]) => (
                    <Text key={key} style={styles.timingItem}>
                      {key}: {formatTime(value)} |{' '}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionsList: {
    marginTop: 10,
  },
  subscriptionItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioContent: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timingsContainer: {
    marginTop: 8,
  },
  timingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  timingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timingItem: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
});

export default PreferredMosqueSelector;