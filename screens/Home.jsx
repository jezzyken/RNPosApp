import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import ProductRow from '../components/products/ProductRow';

const Home = () => {
  return (
    <SafeAreaView>
      <ProductRow />
    </SafeAreaView>
  );
};

export default Home;
