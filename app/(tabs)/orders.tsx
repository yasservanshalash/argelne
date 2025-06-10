// file: app/(tabs)/orders.tsx

import { COLORS, SIZES } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { Order } from '@/store/orderSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// A component to display the status with a nice badge
const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const style = {
        backgroundColor: status === 'Delivered' ? COLORS.green : status === 'Out for Delivery' ? COLORS.primary : COLORS.gray,
    };
    return (
        <View style={[styles.statusBadge, style]}>
            <Text style={styles.statusText}>{status}</Text>
        </View>
    );
};

const OrdersScreen = () => {
    const orderHistory = useAppSelector((state) => state.orders.history);

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{item.orderId.slice(-6)}</Text>
                <StatusBadge status={item.status} />
            </View>
            <Text style={styles.orderDate}>
                {new Date(item.orderDate).toLocaleDateString()} - {new Date(item.orderDate).toLocaleTimeString()}
            </Text>
            <View style={styles.itemSummary}>
                <Text style={styles.itemText}>{item.items[0].name} {item.items.length > 1 ? `and ${item.items.length - 1} more` : ''}</Text>
                <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.reorderButton}>
                <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: "My Orders" }} />
            {orderHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="receipt" size={80} color={COLORS.gray2} />
                    <Text style={styles.emptyText}>No past orders yet.</Text>
                    <Text style={styles.emptySubText}>Place your first order to see it here!</Text>
                </View>
            ) : (
                <FlatList
                    data={orderHistory}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.orderId}
                    contentContainerStyle={{ padding: SIZES.medium }}
                />
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.lightWhite },
    // Order Card styles
    orderCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.small,
        padding: SIZES.medium,
        marginBottom: SIZES.medium,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    orderId: { fontSize: SIZES.medium, fontWeight: 'bold', color: COLORS.secondary },
    orderDate: { fontSize: SIZES.small, color: COLORS.gray, marginBottom: SIZES.medium },
    itemSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.tertiary, paddingTop: SIZES.medium },
    itemText: { flex: 1, fontSize: SIZES.medium, color: COLORS.secondary },
    totalPrice: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary },
    reorderButton: { backgroundColor: COLORS.tertiary, padding: SIZES.small, borderRadius: SIZES.small, alignSelf: 'flex-start', marginTop: SIZES.medium },
    reorderButtonText: { color: COLORS.secondary, fontWeight: 'bold' },
    // Status Badge styles
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: COLORS.white, fontSize: SIZES.small, fontWeight: 'bold' },
    // Empty state styles
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.large },
    emptyText: { marginTop: SIZES.medium, fontSize: SIZES.xLarge, fontWeight: 'bold', color: COLORS.secondary },
    emptySubText: { marginTop: SIZES.small, fontSize: SIZES.medium, color: COLORS.gray, textAlign: 'center' },
});

export default OrdersScreen;