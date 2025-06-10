// file: app/(tabs)/index.tsx

import ProductCard from '@/components/home/ProductCard';
import { MOCK_PRODUCTS } from '@/constants/mock';
import { COLORS, SIZES } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItemsInCart = cartItems.length;
 
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
        <FlatList
          data={MOCK_PRODUCTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleCardPress(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
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
});

export default HomeScreen;