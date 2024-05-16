import {StyleSheet, Text, View, SafeAreaView, Image, Button,Alert} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

const ProductDetails = () => {
  const route = useRoute();
  const {item} = route.params;
  return (
    <SafeAreaView>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.description}</Text>
      <Button
        title="Print"
        onPress={() => Alert.alert('yeah')}
        color="#841584" // Optional: specify custom color
        accessibilityLabel="Press this button"
      />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  item: {
    flex: 1, 
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000', // Text color (black)
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
});
