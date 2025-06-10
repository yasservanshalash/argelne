// file: app/cart.tsx

import { COLORS, SIZES } from '@/constants/theme';
import { CartItem, removeItem } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Helper function to resolve asset filenames to require() statements
const getImageSource = (imageUrl: string) => {
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith('http')) {
    return { uri: imageUrl };
  }
  
  // Map asset filenames to require() statements
  const assetMap: { [key: string]: any } = {
    'double apple.png': require('../assets/images/double apple.png'),
    'grape and mint.png': require('../assets/images/grape and mint.png'),
    'lemon and mint.png': require('../assets/images/lemon and mint.png'),
    'blueberry passion.png': require('../assets/images/blueberry passion.png'),
  };
  
  // Return the require() statement if found, otherwise try as URI
  return assetMap[imageUrl] || { uri: imageUrl };
};

const CartScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const handleRemoveItem = (cartId: string) => {
        dispatch(removeItem(cartId));
    };

    // Calculate totals using useMemo for performance
    const { subtotal, deliveryFee, total } = useMemo(() => {
        const sub = cartItems.reduce((acc, item) => acc + item.price, 0);
        const fee = sub > 0 ? 5.00 : 0; // Example: $5 delivery fee if cart is not empty
        return {
            subtotal: sub,
            deliveryFee: fee,
            total: sub + fee,
        };
    }, [cartItems]);

    // Component to render a single item in the cart list
    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.itemContainer}>
            <Image source={getImageSource(item.imageUrl)} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemOptions}>Head: {item.headType}</Text>
                <Text style={styles.itemOptions}>Extra Coals: {item.extraCoals}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.cartId)} style={styles.removeButton}>
                <FontAwesome5 name="trash-alt" size={20} color={COLORS.gray} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: 'My Cart' }} />

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="shopping-bag" size={80} color={COLORS.gray2} />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity style={styles.shopButton} onPress={() => router.back()}>
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.cartId}
                        contentContainerStyle={{ padding: SIZES.medium }}
                    />
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Subtotal</Text>
                            <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Delivery Fee</Text>
                            <Text style={styles.summaryText}>${deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRowTotal}>
                            <Text style={styles.summaryTotalText}>Total</Text>
                            <Text style={styles.summaryTotalText}>${total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton}
                        onPress={() => router.push('/checkout')} 
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    // Item styles
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        borderRadius: SIZES.small,
        marginBottom: SIZES.medium,
        alignItems: 'center',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: SIZES.small,
    },
    itemDetails: {
        flex: 1,
        marginLeft: SIZES.medium,
    },
    itemName: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    itemOptions: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginTop: 4,
    },
    itemPrice: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.primary,
        marginTop: 8,
    },
    removeButton: {
        padding: SIZES.small,
    },
    // Summary styles
    summaryContainer: {
        padding: SIZES.medium,
        borderTopWidth: 1,
        borderTopColor: COLORS.tertiary,
        backgroundColor: COLORS.white,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    summaryText: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    },
    summaryRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SIZES.small,
        marginBottom: SIZES.medium,
    },
    summaryTotalText: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
    // Empty cart styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: SIZES.medium,
        fontSize: SIZES.large,
        color: COLORS.gray,
    },
    shopButton: {
        marginTop: SIZES.large,
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.large,
        borderRadius: SIZES.small,
    },
    shopButtonText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
});

export default CartScreen;