// screens/RegistrationSuccess.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function RegistrationSuccess({ route, navigation }) {
  const mosqueId = route.params?.mosqueId || "Unknown";

  const handleLoginRedirect = () => {
    navigation.navigate("MosqueLogin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registration Successful!</Text>
      <Text style={styles.text}>Your Mosque ID is:</Text>
      <View style={styles.idContainer}>
        <Text style={styles.mosqueId}>{mosqueId}</Text>
      </View>
      <Button title="Go to Login" onPress={handleLoginRedirect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  idContainer: {
    backgroundColor: '#e0ffe0',
    padding: 16,
    marginVertical: 20,
    borderRadius: 8,
  },
  mosqueId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006600',
  }
});
