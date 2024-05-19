import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TransactionInfo = ({route}) => {
  const {transaction} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Info</Text>
      <Text>Transaction No: {transaction.id}</Text>
      <Text>Date: {transaction.date}</Text>
      <Text style={styles.amount}>Amount: {transaction.amount}</Text>
      <Text style={styles.title}>Purchased Items</Text>
      <Text>Lorem ipsum dolor sit amet...</Text>
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
    marginTop: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 5,
  },
});

export default TransactionInfo;
