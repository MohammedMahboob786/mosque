// screens/RegisterMosque.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function RegisterMosque({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    admin_email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.0.107:8000/api/mosque/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('RegistrationSuccess', { mosqueId: data.mosque_id });
      } else {
        Alert.alert("Error", data.error || "Something went wrong.");
      }
    } catch (err) {
      Alert.alert("Network Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register Mosque</Text>

      <TextInput
        style={styles.input}
        placeholder="Mosque Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Admin Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.admin_email}
        onChangeText={(text) => handleChange('admin_email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  }
});
