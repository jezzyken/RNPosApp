import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductRow from '../components/products/ProductRow';

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartData = await AsyncStorage.getItem('@cart_items');
        if (cartData !== null) {
          const cartItems = JSON.parse(cartData);
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    if (isFocused) {
      fetchCartCount();
    }
  }, [isFocused]);

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  const fetchCartCount = async () => {
    try {
      const cartData = await AsyncStorage.getItem('@cart_items');
      if (cartData !== null) {
        const cartItems = JSON.parse(cartData);
        setCartCount(cartItems.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
        />
        <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
          <MaterialCommunityIcons name="cart" size={24} color="black" />
          {cartCount > 0 && (
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ProductRow fetchCartCount={fetchCartCount}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  cartButton: {
    position: 'relative',
  },
  cartCountBadge: {
    position: 'absolute',
    top: 1,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Home;
