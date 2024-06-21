import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmationScreen = ({route}) => {
  const navigation = useNavigation();
  const {cartItems, totalPrice} = route.params;
  const parsedCartItems = JSON.parse(cartItems);
  const [delivery, setDelivery] = useState('yes');
  const [customerName, setCustomerName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const totalItems = parsedCartItems.length;
  const totalSalesAmount = totalPrice;
  let deliveryInfo = {};

  const handleConfirmOrder = async () => {
    const hasDelivery = delivery === 'yes' ? true : false;

    if (hasDelivery) {
      deliveryInfo = {
        address,
        notes,
        recipientName,
        contactNo,
        deliveryDate,
      };
    }

    const data = {
      customerName,
      paidAmount,
      change: paidAmount - totalSalesAmount,
      totalSalesAmount,
      totalItems,
      hasDelivery,
      saleItems: parsedCartItems,
      delivery: deliveryInfo,
    };

    try {
      const response = await axios.post(
        'https://inventory-epos-app.onrender.com/api/v1/node/sales',
        data,
      );
      await AsyncStorage.removeItem('@cart_items');
      navigation.navigate('Complete', {data});
    } catch (error) {
      console.error('Error saving order:', error);
    }
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
          placeholderTextColor="#000"
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
            value={recipientName}
            onChangeText={setRecipientName}
            placeholderTextColor="#000"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Contact"
              value={contactNo}
              onChangeText={setContactNo}
              placeholderTextColor="#000"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Datetime"
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholderTextColor="#000"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#000"
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#000"
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Info :</Text>
        <Text style={styles.infoText}>Total Items: {totalItems}</Text>
        <Text style={styles.infoText}>
          Total Amount: P{totalSalesAmount.toFixed(2)}
        </Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="PaidAmount"
            value={paidAmount}
            onChangeText={setPaidAmount}
            keyboardType="numeric"
            placeholderTextColor="#000"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Change"
            value={(paidAmount - totalSalesAmount).toFixed(2)}
            editable={false}
            placeholderTextColor="#000"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}>
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
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
    color: '#000',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 20,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
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
