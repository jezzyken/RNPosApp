// screens/DeliveryListScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Delivery = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:3001/api/v1/node/deliveries');
      setDeliveries(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchDeliveries();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DeliveryInfo', { delivery: item })}
    >
      <Text style={styles.recipient}>{item.recipientName}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={item.status === 'pending' ? styles.pending : styles.delivered}>{item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={deliveries}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipient: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  pending: {
    color: 'orange',
  },
  delivered: {
    color: 'green',
  },
});

export default Delivery;
