import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator, // Import the ActivityIndicator for loading state
} from "react-native";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { Entypo } from "@expo/vector-icons";
import BookDetails from "./BookDetails";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native"; // Import the hook

const { width, height } = Dimensions.get("window");

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  ISBN: string;
  stock: number;
  price: string;
  description: string;
  picture: string;
};

const categories = [
  { id: "1", name: "Non-Fiction" },
  { id: "2", name: "Classics" },
  { id: "3", name: "Romance" },
  { id: "4", name: "Adventure" },
  { id: "5", name: "Philosophical" },
  { id: "6", name: "Historical" },
  { id: "7", name: "Sci-Fi" },
  { id: "8", name: "Drama" },
  { id: "9", name: "Horror" },
  { id: "10", name: "Others" },
];

const Categories = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [currentScreen, setCurrentScreen] = useState<"Home" | "BookDetails">(
    "Home"
  ); // State to manage current screen
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // State to hold selected book
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track data fetch

  const fetchBooks = async () => {
    setLoading(true); // Set loading to true when fetching data
    const booksRef = ref(FIREBASE_DB, "books");
    onValue(booksRef, async (snapshot) => {
      const data = snapshot.val();
      const booksArray = await Promise.all(
        Object.keys(data).map(async (key) => {
          const book = data[key];
          const pictureRef = storageRef(FIREBASE_STORAGE, book.picture);
          const pictureUrl = await getDownloadURL(pictureRef);
          return { id: key, ...book, picture: pictureUrl };
        })
      );
      setBooks(booksArray);
      setFilteredBooks(booksArray);
      setLoading(false); // Set loading to false once data is fetched
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks(); // Refetch books when the screen comes back into focus
      console.log('Tab focused, reload data!');
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.publisher.toLowerCase().includes(query.toLowerCase()) ||
        book.ISBN.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(results);
  };

  const handleCategorySelect = (category: string) => {
    const results = books.filter(
      (book) => book.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredBooks(results);
  };

  const handleBookDetail = (book: Book) => {
    setSelectedBook(book);
    setCurrentScreen("BookDetails");
  };

  const renderCategoryItem = ({
    item,
  }: {
    item: { id: string; name: string };
  }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategorySelect(item.name)}
    >
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/bookstore.jpg?alt=media&token=affa209b-0612-442f-b51e-004e38b9055a",
        }}
        style={styles.imageBackground}
        imageStyle={styles.imageBackgroundStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)"]}
          style={styles.gradient}
        >
          <Text style={styles.categoryText}>{item.name}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookDetail(item)}
    >
      <Image source={{ uri: item.picture }} style={styles.bookImage} />
      <View style={styles.bookDetailsCon}>
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          <Text style={styles.bookPublisher}>{item.publisher}</Text>
        </View>
        <View style={styles.stockContain}>
          <Text style={styles.bookPrice}>{item.price} ฿</Text>
          <Text style={styles.bookStock}>Stock: {item.stock} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (currentScreen === "BookDetails" && selectedBook) {
    return (
      <BookDetails
        book={selectedBook}
        onGoBack={() => {
          setCurrentScreen("Home");
          fetchBooks(); // Refetch books when going back to home
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Entypo
          name="magnifying-glass"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search title/publisher/author/ISBN"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : searchQuery ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No results found.</Text>}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={styles.categoryList}
          key="CATEGORIES"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 16,
  },  
  bookDetailsCon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  bookDetails: {
    flex: 1,
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#111",
  },
  bookPublisher: {
    fontSize: 12,
    color: "#666",
  },
  stockContain: {
    
    flexDirection: "column",
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookStock: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#252f90",
  },
  categoryList: {
    paddingBottom: 16,
  },
  categoryRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryCard: {
    width: width * 0.6,
    height: height * 0.15,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 10,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackgroundStyle: {
    borderRadius: 10,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    marginTop: 50,
  },
});

export default Categories;