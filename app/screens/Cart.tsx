import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { CartContext } from '../context/CartContext';
import OrderSummary from './OrderSummary';
import { CartItem } from '../context/CartContext';

const Cart = () => {
    const {cartItems, increaseQuantity, decreaseQuantity, removeFromCart, proceedToCheckout } = useContext(CartContext)!;
    const [currentScreen, setCurrentScreen] = useState<"Cart" | "OrderSummary">("Cart");

    // Function to calculate the total price
    const calculateTotalPrice = () => {
        return cartItems.reduce((total: number, item: { quantity: number; book: { price: any; }; }) => total + (item.quantity * Number(item.book.price)), 0);
    };

    const handleProceedToCheckout = () => {
        const totalPrice = calculateTotalPrice(); // Calculate the total price
        setCurrentScreen("OrderSummary"); // Navigate to OrderSummary
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.book.id)}
            >
                <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
                source={{ uri: item.book.picture }}
                style={styles.bookImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.categoryText}>{item.book.category}</Text>
                <Text style={styles.titleText}>{item.book.title}</Text>
                <Text style={styles.authorText}>{item.book.author}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.squareButton} onPress={() => decreaseQuantity(item.book.id)}>
                        <Text style={styles.buttonTextSmall}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.squareButton} onPress={() => increaseQuantity(item.book.id)}>
                        <Text style={styles.buttonTextSmall}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.price}>{(item.quantity * Number(item.book.price))} ฿</Text>
        </View>
    );

    if (currentScreen === 'OrderSummary') {
        const totalPrice = calculateTotalPrice(); // Calculate total price again for Order Summary
        return (
            <OrderSummary totalPrice={totalPrice} onGoBack={() => setCurrentScreen('Cart')} onNavigateToCart={() => setCurrentScreen('Cart')}/>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shopping Cart</Text>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty!</Text>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.book.id.toString()}
                />
            )}
            {cartItems.length > 0 && (
                <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
                    <Text style={styles.buttonTextBig}>Proceed to Checkout</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyCartText: {
        fontSize: 18,
        color: "#0B0F4C",
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        padding: 40,
        fontSize: 20,
        fontWeight: "bold",
        color: "#0B0F4C",
        textAlign: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    categoryText: {
        fontSize: 14,
        color: "#DEDEDE",
        fontWeight: "300",
        paddingTop: 10,
    },
    titleText: {
        fontSize: 20,
        paddingVertical: 7,
        color: "#fff",
        fontWeight: "bold",
    },
    authorText: {
        fontSize: 14,
        color: "#fff",
        paddingBottom: 20,
    },
    cartItem: {
        padding: 0,
        backgroundColor: "#0B0F4B",
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%',
        height: 155,
        justifyContent: 'space-between',
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    removeButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    squareButton: {
        width: 25,
        height: 25,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        borderRadius: 5,
        bottom: 10,
    },
    buttonTextSmall: {
        color: "#0B0F4B",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonTextBig: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    quantity: {
        color: "white",
        fontSize: 20,
        paddingHorizontal: 10,
        bottom: 10,
    },
    price: {
        color: "white",
        fontSize: 25,
        fontWeight: "500",
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    checkoutButton: {
        backgroundColor: "#0B0F4C",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    bookImage: {
        width: '27.3%',
        height: '100%',
        resizeMode: 'contain',
        marginRight: 10,
    },
});

export default Cart;
