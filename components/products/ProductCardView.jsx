import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image, Animated, Easing, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductCardView = ({ item, fetchCartCount  }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const slideAnim = useState(new Animated.Value(300))[0];
  const [cartItems, setCartItems] = useState([]);
  const [currentCartItem, setCurrentCartItem] = useState(null);

  useEffect(() => {
    if (selectedItem && selectedItem.prices.length > 0) {
      setSelectedVariant(selectedItem.prices[0].variant.name); 
      setSelectedPrice(selectedItem.prices[0].salePrice);
    }
  }, [selectedItem]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedCartItems = await AsyncStorage.getItem('@cart_items');
        if (storedCartItems !== null) {
          setCartItems(JSON.parse(storedCartItems));
        }
      } catch (error) {
        console.error('Error fetching cart items from AsyncStorage:', error);
      }
    };

    fetchCartItems();
  }, []); 

  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem('@cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items to AsyncStorage:', error);
    }
  };

  const handleButtonPress = () => {
    setSelectedItem(item);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedVariant(null);
    setSelectedPrice(null);
    setQuantity(1);
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleVariantPress = (variant, price) => {
    setSelectedVariant(variant);
    setSelectedPrice(price);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      const newItem = {
        id: selectedItem._id,
        name: selectedItem.name,
        variant: selectedVariant,
        price: selectedPrice,
        quantity: quantity,
      };

      try {
        const jsonValue = await AsyncStorage.getItem('@cart_items');
        let storedCartItems = [];
        if (jsonValue !== null) {
          storedCartItems = JSON.parse(jsonValue);
        }

        const existingItemIndex = storedCartItems.findIndex(
          (item) => item.id === newItem.id && item.variant === newItem.variant
        );

        if (existingItemIndex !== -1) {
          storedCartItems[existingItemIndex].quantity += quantity;
        } else {
          storedCartItems.push(newItem);
        }

        setCartItems(storedCartItems);
        await saveCartItems(storedCartItems);

        setCurrentCartItem(null);
        closeModal();
        fetchCartCount(); 
      } catch (error) {
        console.error('Error updating cart items in AsyncStorage:', error);
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { item })}>
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.description}</Text>
        <Button title="Press Me" onPress={handleButtonPress} />

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
          animationType="none"
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
                {selectedItem && (
                  <>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    <ScrollView horizontal={true} contentContainerStyle={styles.variantButtonContainer}>
                      {selectedItem.prices.map((price, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={[styles.variantButton, selectedVariant === price.variant.name && styles.variantButtonSelected]} 
                          onPress={() => handleVariantPress(price.variant.name, price.salePrice)}
                        >
                          <Text style={styles.variantButtonText}>{price.variant.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Quantity:</Text>
                      <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.selectedPrice}>Php {selectedPrice}</Text>
                  </>
                )}
                 <Button title="Confirm" onPress={handleConfirm} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  item: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalContent: {
    fontSize: 16,
    marginVertical: 10,
  },
  variantButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  variantButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginRight: 10,
  },
  variantButtonSelected: {
    backgroundColor: '#0056b3', 
  },
  variantButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  selectedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default ProductCardView;
