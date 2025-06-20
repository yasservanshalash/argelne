// file: components/home/ProductCard.tsx

import { COLORS, SHADOWS, SIZES } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the type for a single product to get nice autocompletion
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
};

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

// Helper function to resolve asset filenames to require() statements
const getImageSource = (imageUrl: string) => {
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith('http')) {
    return { uri: imageUrl };
  }
  
  // Map asset filenames to require() statements
  const assetMap: { [key: string]: any } = {
    'double apple.png': require('../../assets/images/double apple.png'),
    'grape and mint.png': require('../../assets/images/grape and mint.png'),
    'lemon and mint.png': require('../../assets/images/lemon and mint.png'),
    'blueberry passion.png': require('../../assets/images/blueberry passion.png'),
  };
  
  // Return the require() statement if found, otherwise try as URI
  return assetMap[imageUrl] || { uri: imageUrl };
};

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const imageSource = getImageSource(product.imageUrl);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
    borderRadius: SIZES.medium,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
    marginBottom: SIZES.medium,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.small,
    marginRight: SIZES.medium,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  category: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  price: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default ProductCard;