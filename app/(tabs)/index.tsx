// file: app/(tabs)/index.tsx

import ProductCard from '@/components/home/ProductCard';
import SeedData from '@/components/SeedData';
import { COLORS, SIZES } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/productsSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { items: products, loading, error } = useAppSelector((state) => state.products);
  const totalItemsInCart = cartItems.length;

  useEffect(() => {
    console.log('🏠 HomeScreen: Fetching products...');
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log(`🏠 HomeScreen: Products state updated - ${products.length} products`);
    console.log('🏠 Products:', products.map(p => `${p.name} (${p.id})`));
    if (loading) console.log('🏠 Loading products...');
    if (error) console.log('🏠 Error:', error);
  }, [products, loading, error]);
 
  const handleCardPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "Choose Your Flavor",
          headerTitleStyle: {
            fontSize: SIZES.xxLarge,
            fontWeight: 'bold',
            color: COLORS.secondary,
          },
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginRight: SIZES.medium }}>
              <FontAwesome5 name="shopping-bag" size={22} color={COLORS.secondary} />
              {totalItemsInCart > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{totalItemsInCart}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => dispatch(fetchProducts())}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View>
            <Text style={styles.emptyText}>No products found. Seed some data first!</Text>
            <SeedData />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => handleCardPress(item.id)}
                />
              )}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
            {/* Always show debug buttons at the bottom */}
            {/* <SeedData /> */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
});

export default HomeScreen;