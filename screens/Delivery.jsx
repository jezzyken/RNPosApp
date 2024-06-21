import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

const Delivery = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('https://inventory-epos-app.onrender.com/api/v1/node/deliveries');
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

  const renderItem = ({ item, index }) => (
    <View style={styles.rowFront}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('DeliveryInfo', { delivery: item })}
      >
        <Text style={styles.recipient}>{item.recipientName}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={item.status === 'pending' ? styles.pending : styles.delivered}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => console.log("Delete action")}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SwipeListView
      data={deliveries}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      swipeToOpenPercent={0}
    />
  );

};

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: '#FFF',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 100,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  item: {
    padding: 20,
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    marginRight: -12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Delivery;
