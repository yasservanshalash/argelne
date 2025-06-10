// file: app/product/[id].tsx

import { COLORS, SIZES } from '@/constants/theme';
import { addItem } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductById } from '@/store/productsSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

// A simple Stepper component for the number of coals
const Stepper = ({ value, onIncrement, onDecrement }: { value: number; onIncrement: () => void; onDecrement: () => void }) => (
    <View style={styles.stepperContainer}>
        <TouchableOpacity style={styles.stepperButton} onPress={onDecrement}>
            <FontAwesome5 name="minus" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={onIncrement}>
            <FontAwesome5 name="plus" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
    </View>
);

const ProductDetailScreen = () => {
    const router = useRouter();
    // useLocalSearchParams gets the dynamic part of the URL, in this case, { id: "DA-01" }
    const { id } = useLocalSearchParams();

    const [quantity, setQuantity] = useState(1);
    const [headType, setHeadType] = useState('Clay'); // Default head type
    const [extraCoals, setExtraCoals] = useState(0);

    const dispatch = useAppDispatch();
    const { items: products, loading } = useAppSelector((state) => state.products);

    // Find the product from Redux store or fetch it if not found
    const product = products.find(p => p.id === id);

    useEffect(() => {
        if (!product && typeof id === 'string') {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id, product]);

    // Calculate total price dynamically. useMemo prevents recalculating on every render.
    const totalPrice = useMemo(() => {
        let price = product?.price || 0;
        // Add extra cost for premium heads
        if (headType === 'Silicone') price += 3;
        if (headType === 'Fruit') price += 8;
        // Add cost for extra coals
        price += extraCoals * 0.5; // 50 cents per extra coal
        return price * quantity;
    }, [product, quantity, headType, extraCoals]);

    const addToCart = () => {
        if (!product) return;

        const cartItem = {
            cartId: `${product.id}-${new Date().getTime()}`,
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            quantity,
            headType,
            extraCoals,
            price: totalPrice,
        };

        console.log('Dispatching addItem with:', cartItem); // Add this for debugging
        dispatch(addItem(cartItem)); // This should now work correctly

        router.push('/cart'); // Navigate to cart instead of going back
    };

    // Show loading state while fetching product
    if (loading && !product) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading product...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // If the product isn't found for some reason, show a message
    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Product not found!</Text>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={getImageSource(product.imageUrl)} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>

                    {/* -- Options Section -- */}
                    <Text style={styles.sectionTitle}>Choose your Head</Text>
                    <View style={styles.optionGroup}>
                        {['Clay', 'Silicone', 'Fruit'].map(head => (
                            <TouchableOpacity
                                key={head}
                                style={[styles.optionButton, headType === head && styles.optionButtonSelected]}
                                onPress={() => setHeadType(head)}
                            >
                                <Text style={[styles.optionText, headType === head && styles.optionTextSelected]}>
                                    {head} {head === 'Clay' ? '(Standard)' : head === 'Silicone' ? '(+$3)' : '(+$8)'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Extra Coals</Text>
                    <Stepper
                        value={extraCoals}
                        onIncrement={() => setExtraCoals(c => c + 1)}
                        onDecrement={() => setExtraCoals(c => Math.max(0, c - 1))}
                    />
                </View>
            </ScrollView>

            {/* -- Bottom Bar with Price and Add to Cart Button -- */}
            <View style={styles.bottomBar}>
                <Text style={styles.priceText}>${totalPrice.toFixed(2)}</Text>
                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// file: app/product/[id].tsx (at the bottom)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: SIZES.large
    },
    image: {
        width: '100%',
        height: 300,
    },
    detailsContainer: {
        padding: SIZES.large,
    },
    productName: {
        fontSize: SIZES.xxLarge,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    productDescription: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        marginTop: SIZES.small,
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.secondary,
        marginTop: SIZES.xLarge,
        marginBottom: SIZES.medium,
    },
    optionGroup: {
        flexDirection: 'row',
        gap: SIZES.small,
    },
    optionButton: {
        flex: 1,
        padding: SIZES.medium,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.tertiary,
        borderRadius: SIZES.small,
        alignItems: 'center',
    },
    optionButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.secondary,
    },
    optionText: {
        color: COLORS.secondary,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: COLORS.tertiary,
        alignSelf: 'flex-start',
    },
    stepperButton: {
        padding: SIZES.medium,
    },
    stepperValue: {
        fontSize: SIZES.large,
        fontWeight: '600',
        paddingHorizontal: SIZES.large,
        color: COLORS.secondary,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.medium,
        borderTopWidth: 1,
        borderTopColor: COLORS.tertiary,
        backgroundColor: COLORS.white,
    },
    priceText: {
        fontSize: SIZES.xLarge,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    addToCartButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.xLarge,
        borderRadius: SIZES.small,
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: SIZES.medium,
        color: COLORS.primary,
        marginTop: SIZES.small,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: SIZES.medium,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.small,
    },
    backButtonText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;