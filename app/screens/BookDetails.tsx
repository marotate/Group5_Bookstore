import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { Book } from '../../type';
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from '../context/CartContext';

const { width, height } = Dimensions.get("window");

interface BookDetailsProps {
  book: Book;
  onGoBack: () => void;
}

  const BookDetails: React.FC<BookDetailsProps> = ({ book, onGoBack }) => {
  const { addToCart }  = useContext(CartContext)!;

  const handleAddToCart = () => {
    addToCart(book);
    Alert.alert('Success!', 'The book has been added to your cart.', [{ text: 'OK' }]);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0B0F4C" />
        </TouchableOpacity>
        <Text style={styles.header}>Book Details</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{book.title}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Image source={{ uri: book.picture }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.infoText}>Author: {book.author}</Text>
          <Text style={styles.infoText}>Category: {book.category}</Text>
          <Text style={styles.infoText}>Publisher: {book.publisher}</Text>
          <Text style={styles.infoText}>ISBN: {book.ISBN}</Text>
          <Text style={styles.infoText}>Stock: {book.stock} Books</Text>
          <Text style={styles.price}>Pricing: {book.price} ฿</Text>
          <TouchableOpacity 
            style={styles.addToCartButton} 
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{book.description}</Text>
      </View>
      <View style={styles.footerSpace} />
    </ScrollView>
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
  titleContainer: {
    backgroundColor: "#0B0F4C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#fff",
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookImage: {
    width: width * 0.4,
    height: height * 0.3,
    resizeMode: 'cover',
    marginRight: 20,
    borderRadius: 10,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  infoText: {
    fontSize: 13,
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B0F4C',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#0B0F4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  descriptionTitle: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
    lineHeight: 20,
  },
  footerSpace: {
    height: 50, // Add space at the end of the page
  },
});

export default BookDetails;
