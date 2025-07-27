// UserLoginScreen.js - Initial screen to collect User ID
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useUser } from './UserContext';

export default function UserLoginScreen({ navigation }) {
  const [inputUserId, setInputUserId] = useState('');
  const { loginUser } = useUser();

  const handleLogin = () => {
    if (!inputUserId.trim()) {
      Alert.alert('Error', 'Please enter your User ID');
      return;
    }
    
    loginUser(inputUserId.trim());
    // Navigate to main app or subscribe view
    navigation.navigate('SubscribeView');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mosque App</Text>
      <Text style={styles.subtitle}>Please enter your User ID to continue</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your User ID"
        value={inputUserId}
        onChangeText={setInputUserId}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}