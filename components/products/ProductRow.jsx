import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import ProductCardView from './ProductCardView';
import useFetch from '../../hook/useFetch';

const ProductRow = () => {
  const {data, isLoading, error} = useFetch();

  console.log(data)
  console.log(error)


  return (
    <View View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={40} color="red" />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => <ProductCardView item={item}/>}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    marginBottom: 50
  },
});