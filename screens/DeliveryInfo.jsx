import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DeliveryInfo = ({ route, navigation }) => {
  const { delivery } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Status</Text>
      <Text style={delivery.status === 'PENDING' ? styles.pending : styles.delivered}>{delivery.status}</Text>
      <Text>Recipient: {delivery.recipient}</Text>
      <Text>Address: {delivery.address}</Text>
      <Text>Delivery Date: {delivery.date}</Text>
      <Button
        title="Mark as Delivered"
        onPress={() => alert('Marked as Delivered')}
        color="#FF4500"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pending: {
    color: 'orange',
  },
  delivered: {
    color: 'green',
  },
});

export default DeliveryInfo;
