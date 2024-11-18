import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from '../context/CartContext'; // Import CartContext
import { FIREBASE_DB } from '../../Firebaseconfig';
import { ref, update } from 'firebase/database';
import PurchaseComplete from './PurchaseComplete';

type OrderSummaryProps = {
    totalPrice: number;
    onGoBack: () => void;
    onNavigateToCart: () => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, onGoBack, onNavigateToCart }) => {
    const [currentScreen, setCurrentScreen] = useState<"OrderSummary" | "PurchaseComplete">("OrderSummary");
    const cartContext = useContext(CartContext);
    if (!cartContext) {
        return null; // or handle the error appropriately
    }
    const { cartItems, setCartItems } = cartContext;

    const handlePurchase = async () => {
        try {
            // Update stock in the database
            const updates: any = {};
            cartItems.forEach((item: { book: { id: any; stock: number; }; quantity: number; }) => {
                const bookRef = ref(FIREBASE_DB, `books/${item.book.id}`);
                updates[`books/${item.book.id}/stock`] = item.book.stock - item.quantity;
                console.log('Deleting stock item with ID:', item.book.id);
            });
            await update(ref(FIREBASE_DB), updates);

            // Clear the cart
            setCartItems([]);

            setCurrentScreen("PurchaseComplete");
        } catch (error) {
            Alert.alert('Purchase Failed', 'There was an error processing your purchase. Please try again.');
        }
    };

    if (currentScreen === "PurchaseComplete") {
        return (
            <PurchaseComplete
              onGoBack={onNavigateToCart}
            />
          );
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#0B0F4C" />
                </TouchableOpacity>
                <Text style={styles.header}>Checkout</Text>
            </View>
            <Text style={styles.OrderSummary}>Order Summary</Text>

            {/* SubTotal */}
            <View style={styles.priceRow}>
                <Text style={styles.label}>SubTotal</Text>
                <Text style={styles.price}>{totalPrice} ฿</Text>
            </View>

            {/* Shipping */}
            <View style={styles.priceRow}>
                <Text style={styles.label}>Shipping</Text>
                <Text style={styles.price}>50 ฿</Text>
            </View>

            {/* Line */}
            <View style={styles.line} />

            {/* Total */}
            <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{totalPrice + 50} ฿</Text>
            </View>

            <TouchableOpacity style={styles.Button} onPress={handlePurchase}>
                <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingTop: 30,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0B0F4C",
        flex: 1,
    },
    backButton: {
        padding: 10,
    },
    OrderSummary: {
        fontSize: 23,
        fontWeight: "500",
        color: '#0B0F4C',
        marginTop: 20,
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    label: {
        fontSize: 17,
        color: '#0B0F4C',
    },
    price: {
        fontSize: 17,
        color: '#0B0F4C',
    },
    totalLabel: {
        fontSize: 23,
        fontWeight: "500",
        color: '#0B0F4C',
    },
    totalPrice: {
        fontSize: 23,
        fontWeight: "500",
        color: '#0B0F4C',
    },
    line: {
        borderBottomColor: '#0B0F4C',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    Button: {
        backgroundColor: "#0B0F4C",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    message: {
        fontSize: 18,
        color: '#0B0F4C',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default OrderSummary;
