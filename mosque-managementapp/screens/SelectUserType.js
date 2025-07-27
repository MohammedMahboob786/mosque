// screens/SelectUserType.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectUserType = ({ navigation }) => {
  const handleSelect = async (role) => {
    await AsyncStorage.setItem('userType', role);
    if (role === 'admin') {
      navigation.replace('MosqueLogin');
    } else {
      navigation.replace('SubscriberView');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      <Button title="🕌 I'm a Mosque Admin" onPress={() => handleSelect('admin')} />
      <View style={{ marginVertical: 10 }} />
      <Button title="👤 I'm a Subscriber" onPress={() => handleSelect('subscriber')} />
    </View>
  );
};

export default SelectUserType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 40,
  },
});
