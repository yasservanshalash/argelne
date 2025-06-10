// file: app/checkout.tsx

import { COLORS, SIZES } from '@/constants/theme';
import { clearCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addOrder } from '@/store/orderSlice'; // <-- IMPORT THE NEW ACTION
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';

const CheckoutScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { items: cartItems, total } = useAppSelector((state) => {
        const sub = state.cart.items.reduce((acc, item) => acc + item.price, 0);
        return {
            items: state.cart.items,
            total: sub > 0 ? sub + 5.00 : 0, // Recalculate total with delivery fee
        };
    });

    const [mapRegion, setMapRegion] = useState(null);
    const [addressNotes, setAddressNotes] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default payment method

    useEffect(() => {
        // This function runs when the component mounts to get user location
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission Denied', 'Please enable location services to use the map feature.');
                // Set a default location (e.g., a city center) if permission is denied
                setMapRegion({
                    latitude: 31.963158, // Amman, Jordan as a default
                    longitude: 35.930359,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({});
                setMapRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01, // Zoomed-in view
                    longitudeDelta: 0.01,
                });
            } catch (error) {
                setErrorMsg('Could not fetch location. Please try again.');
                console.error(error);
            }
        })();
    }, []);

    // --- THIS FUNCTION HAS BEEN UPDATED ---
    const handlePlaceOrder = () => {
        if (!mapRegion) {
            Alert.alert("Location not set", "Please wait for the map to load or set your location.");
            return;
        }

        const newOrder = {
            orderId: `order-${new Date().getTime()}`, // Create a unique ID
            items: cartItems,
            totalPrice: total,
            deliveryLocation: {
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
            },
            addressNotes: addressNotes,
            paymentMethod: paymentMethod,
            orderDate: new Date().toISOString(),
            status: 'Pending' as const, // Set initial status, 'as const' helps TypeScript
        };

        // Dispatch the action to save the order in the Redux store
        dispatch(addOrder(newOrder));

        // Show a success message and navigate the user
        Alert.alert(
            "Order Successful!",
            "Your order has been placed. You can view its status in the Orders tab.",
            [{ text: "OK", onPress: () => {
                dispatch(clearCart());
                // Go to the orders tab and clear navigation history
                router.replace('/(tabs)/orders'); 
            }}]
        );
    };

    if (!mapRegion) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Finding your location...</Text>
                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: "Checkout" }} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>1. Confirm Delivery Location</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={mapRegion}
                        onRegionChangeComplete={setMapRegion} // Update region when user moves the map
                    >
                        {/* The Marker is now optional as the center icon is the source of truth */}
                    </MapView>
                    <View style={styles.mapMarkerFixed}>
                         <FontAwesome5 name="map-marker-alt" size={40} color={COLORS.red} />
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Apt, Building, or any delivery notes"
                    value={addressNotes}
                    onChangeText={setAddressNotes}
                    placeholderTextColor={COLORS.gray}
                />

                <Text style={styles.sectionTitle}>2. Payment Method</Text>
                <View style={styles.optionGroup}>
                    {['Cash', 'Card on Delivery'].map(method => (
                         <TouchableOpacity
                            key={method}
                            style={[styles.optionButton, paymentMethod === method && styles.optionButtonSelected]}
                            onPress={() => setPaymentMethod(method)}
                        >
                            <Text style={[styles.optionText, paymentMethod === method && styles.optionTextSelected]}>{method}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                 <Text style={styles.disclaimer}>Online payment coming soon!</Text>
            </ScrollView>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalText}>Total</Text>
                    <Text style={styles.summaryTotalText}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <Text style={styles.placeOrderButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightWhite },
    loadingText: { marginTop: 10, fontSize: SIZES.medium, color: COLORS.secondary },
    errorText: { marginTop: 20, color: COLORS.red, fontSize: SIZES.medium, textAlign: 'center', paddingHorizontal: 20 },
    container: { flex: 1, backgroundColor: COLORS.lightWhite },
    scrollContainer: { paddingBottom: 120 }, // Padding to not hide content behind the summary
    sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.secondary, margin: SIZES.medium },
    mapContainer: { height: 300, backgroundColor: COLORS.gray2, justifyContent: 'center', alignItems: 'center' },
    map: { ...StyleSheet.absoluteFillObject },
    mapMarkerFixed: { position: 'absolute' }, // This places the marker icon in the center of the map view
    input: {
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.medium,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        fontSize: SIZES.medium,
        borderWidth: 1,
        borderColor: COLORS.tertiary,
    },
    optionGroup: { flexDirection: 'row', gap: SIZES.medium, marginHorizontal: SIZES.medium },
    optionButton: { flex: 1, padding: SIZES.medium, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.tertiary, borderRadius: SIZES.small, alignItems: 'center' },
    optionButtonSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.secondary },
    optionText: { color: COLORS.secondary, fontWeight: '500' },
    optionTextSelected: { color: COLORS.white, fontWeight: 'bold' },
    disclaimer: { textAlign: 'center', color: COLORS.gray, fontSize: SIZES.small, margin: SIZES.medium },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SIZES.medium,
        paddingBottom: 34, // Extra padding for home bar area on iOS
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.tertiary,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.medium },
    summaryTotalText: { fontSize: SIZES.xLarge, fontWeight: 'bold', color: COLORS.secondary },
    placeOrderButton: { backgroundColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.small, alignItems: 'center' },
    placeOrderButtonText: { color: COLORS.white, fontSize: SIZES.large, fontWeight: 'bold' },
});

export default CheckoutScreen;