import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@cart_items');
      if (jsonValue !== null) {
        setCartItems(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Error loading cart items from AsyncStorage:', error);
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('@cart_items');
      console.log('Cart cleared');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  const renderItem = ({item}) => (
    <View style={styles.cartItem}>
      <Text style={styles.items}>{item.name}</Text>
      <Text style={styles.items}>{item.variant}</Text>
      <Text style={styles.items}>Price per item: {item.price}</Text>
      <Text style={styles.items}>Quantity: {item.quantity}</Text>
      <Text style={styles.items}>Subtotal: {item.price * item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={clearCart}>
        <Text style={styles.btnText}>Clear Cart</Text>
      </TouchableOpacity>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.cartList}
      />
      <Text style={styles.totalPrice}>
        Total Price: Php {calculateTotalPrice()}
      </Text>

      <TouchableOpacity style={styles.addBtn}   onPress={() =>
          navigation.navigate('Confirmation', {
            cartItems: JSON.stringify(cartItems),
            totalPrice: calculateTotalPrice(),
          })
        }>
        <Text style={styles.btnText}>proceed</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartList: {
    flexGrow: 1,
  },
  cartItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    color: 'red',
  },
  items: {
    color: '#000',
  },
  totalPrice: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  addBtn: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5733',
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CartScreen;
