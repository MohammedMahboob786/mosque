// screens/MosqueLogin.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MosqueLogin({ navigation }) {
  const [formData, setFormData] = useState({
    admin_email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.107:8000/api/mosque/mosque-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        Alert.alert("Success", "Login successful");
        navigation.navigate("UpdateTimings");
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Network Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mosque Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Admin Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.admin_email}
        onChangeText={(text) => handleChange("admin_email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("RegisterMosque")}>
          Register
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    marginHorizontal: 'auto',
    padding: 20,
    flex: 1,
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
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  registerText: {
    marginTop: 15,
    fontSize: 14
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
});
