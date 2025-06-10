import { COLORS, SIZES } from '@/constants/theme';
import { productsService, seedProducts } from '@/services/firebase';
import { useAppDispatch } from '@/store/hooks';
import { fetchProducts } from '@/store/productsSlice';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SeedData = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useAppDispatch();

  const handleCheckDatabase = async () => {
    setIsChecking(true);
    try {
      console.log('🔍 Checking Firebase database...');
      const products = await productsService.getAll();
      console.log(`📊 Found ${products.length} products in Firebase:`);
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.category} - $${product.price}`);
        console.log(`   Image: ${typeof product.imageUrl === 'object' ? 'Local Asset' : product.imageUrl}`);
      });
      
      Alert.alert(
        'Database Check', 
        `Found ${products.length} products in Firebase. Check console for details.`
      );
    } catch (error) {
      console.error('❌ Error checking database:', error);
      Alert.alert('Error', 'Failed to check database. Check console for details.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    try {
      console.log('🚀 Starting fresh seed process...');
      await seedProducts(true); // Force clear and re-seed
      
      // Refresh the products in the store
      console.log('🔄 Refreshing products...');
      await dispatch(fetchProducts());
      
      Alert.alert('Success', 'All products have been cleared and re-seeded to Firebase!');
    } catch (error) {
      Alert.alert('Error', 'Failed to seed products. Check console for details.');
      console.error('Seeding error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Data Management</Text>
      <Text style={styles.description}>
        Use the buttons below to check what&apos;s in your Firebase database or to clear and re-seed with fresh products.
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.checkButton, isChecking && styles.buttonDisabled]} 
        onPress={handleCheckDatabase}
        disabled={isChecking}
      >
        <Text style={styles.buttonText}>
          {isChecking ? 'Checking...' : 'Check Database'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isSeeding && styles.buttonDisabled]} 
        onPress={handleSeedProducts}
        disabled={isSeeding}
      >
        <Text style={styles.buttonText}>
          {isSeeding ? 'Clearing & Seeding...' : 'Clear & Seed Products'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    margin: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: SIZES.small,
  },
  description: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    minWidth: 200,
  },
  checkButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SeedData; 