import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

const ConfirmationScreen = ({route}) => {
  const { cartItems, totalPrice  } = route.params;
  const parsedCartItems = JSON.parse(cartItems);
  const [delivery, setDelivery] = useState('yes');
  const [customerName, setCustomerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cash, setCash] = useState('');
  const totalItems = parsedCartItems.length; // Example value
  // const totalItems = 2 // Example value
  const totalAmount = totalPrice
  const handleConfirmOrder = () => {
    // Handle order confirmation logic
    console.log('Order confirmed');
    console.log('Delivery:', delivery);
    console.log('items:', parsedCartItems);


    if (delivery === 'yes') {
      console.log('Address:', address);
      console.log('Notes:', notes);
      console.log('Customer Name:', customerName);
      console.log('Contact Name:', contactName);
      console.log('Contact Number:', contactNumber);
      console.log('Delivery Date Time:', deliveryDateTime);
    }
    console.log('Cash:', cash);
    console.log('Total Items:', totalItems);
    console.log('Total Amount:', totalAmount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="Name"
          value={customerName}
          onChangeText={setCustomerName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Delivery:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="yes"
            status={delivery === 'yes' ? 'checked' : 'unchecked'}
            onPress={() => setDelivery('yes')}
          />
          <Text style={styles.radioLabel}>YES</Text>
          <RadioButton
            value="no"
            status={delivery === 'no' ? 'checked' : 'unchecked'}
            onPress={() => setDelivery('no')}
          />
          <Text style={styles.radioLabel}>NO</Text>
        </View>
      </View>

      {delivery === 'yes' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Info</Text>
          <TextInput 
            style={styles.input}
            placeholder="Name"
            value={contactName}
            onChangeText={setContactName}
          />
          <View style={styles.row}>
            <TextInput 
              style={[styles.input, styles.halfInput]}
              placeholder="Contact"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
            <TextInput 
              style={[styles.input, styles.halfInput]}
              placeholder="Datetime"
              value={deliveryDateTime}
              onChangeText={setDeliveryDateTime}
            />
          </View>
          <TextInput 
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput 
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Info :</Text>
        <Text style={styles.infoText}>Total Items: {totalItems}</Text>
        <Text style={styles.infoText}>Total Amount: P{totalAmount.toFixed(2)}</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, styles.halfInput]}
            placeholder="Cash"
            value={cash}
            onChangeText={setCash}
            keyboardType="numeric"
          />
          <TextInput 
            style={[styles.input, styles.halfInput]}
            placeholder="Change"
            value={(cash - totalAmount).toFixed(2)}
            editable={false}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 
    20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
