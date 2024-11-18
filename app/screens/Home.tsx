import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../../Firebaseconfig";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import BooksList from "./BookList"; // Import the new BooksList component
import BookDetails from "./BookDetails";
import { Book } from "../../type";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");


const Home = () => {
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [upcomingBooks, setUpcomingBooks] = useState<Book[]>([]);
  const [showMoreType, setShowMoreType] = useState<
    null | "Top Books" | "Latest Books" | "Upcoming Books"
  >(null);
  const [booksToShow, setBooksToShow] = useState<Book[]>([]); // State to hold books to show in BooksList
  const [currentScreen, setCurrentScreen] = useState<"Home" | "BookDetails">(
    "Home"
  ); // State to manage current screen
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // State to hold selected book
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBooks = useCallback(() => {
    if (topBooks.length && latestBooks.length && upcomingBooks.length) return;
    const booksRef = ref(FIREBASE_DB, "books");
    onValue(booksRef, async (snapshot) => {
      setLoading(true);
      const data = snapshot.val();
      const booksArray = await Promise.all(
        Object.keys(data).map(async (key) => {
          const book = data[key];
          const pictureRef = storageRef(FIREBASE_STORAGE, book.picture);
          const pictureUrl = await getDownloadURL(pictureRef);
          return { id: key, ...book, picture: pictureUrl };
        })
      );

      const shuffledBooks = booksArray.sort(() => 0.5 - Math.random());
      setTopBooks(shuffledBooks.slice(0, 15));
      setLatestBooks(shuffledBooks.slice(15, 30));
      setUpcomingBooks(shuffledBooks.slice(30, 45));
      setLoading(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      setCurrentScreen("Home");
    }, [fetchBooks])
  );

  const handleSeeMore = (
    type: "Top Books" | "Latest Books" | "Upcoming Books"
  ) => {
    setShowMoreType(type);
    switch (type) {
      case "Top Books":
        setBooksToShow(topBooks);
        break;
      case "Latest Books":
        setBooksToShow(latestBooks);
        break;
      case "Upcoming Books":
        setBooksToShow(upcomingBooks);
        break;
      default:
        break;
    }
  };

  if (showMoreType) {
    return (
      <BooksList
        books={booksToShow}
        category={showMoreType}
        onGoBack={() => setShowMoreType(null)} // Reset showMoreType to go back to home
      />
    );
  }

  const handleBookDetail = (book: Book) => {
    setSelectedBook(book);
    setCurrentScreen("BookDetails");
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookDetail(item)}
    >
      <Image source={{ uri: item.picture }} style={styles.bookImage} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookPrice}>{item.price} ฿</Text>
      </View>
    </TouchableOpacity>
  );

  if (currentScreen === "BookDetails" && selectedBook) {
    return (
      <BookDetails
        book={selectedBook}
        onGoBack={() => setCurrentScreen("Home")}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {loading ? ( // Display loading indicator while data is loading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b0f4c" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>WELCOME TO BOOKSHELF STORE</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Books</Text>
            <TouchableOpacity onPress={() => handleSeeMore("Top Books")}>
              <Text style={styles.seeMore}>See More</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topBooks.slice(0, 5)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.bookList}
            windowSize={2}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Books</Text>
            <TouchableOpacity onPress={() => handleSeeMore("Latest Books")}>
              <Text style={styles.seeMore}>Show More</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={latestBooks.slice(0, 5)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.bookList}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Books</Text>
            <TouchableOpacity onPress={() => handleSeeMore("Upcoming Books")}>
              <Text style={styles.seeMore}>Show More</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingBooks.slice(0, 5)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.bookList}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: width * 0.05,
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    height: height,
  },
  loginMessageContainer: {
    backgroundColor: "#d0d4fa",
    marginBottom: 10,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.08,
    paddingTop: 20,
  },
  loginMessageText: {
    color: "#0b04fc",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: height * 0.04,
    paddingBottom: height * 0.02,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B0F4C",
    paddingRight: width * 0.06,
  },
  icon: {
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#0B0F4C",
  },
  bookList: {
    paddingVertical: 10,
  },
  bookItem: {
    width: width * 0.5,
    height: height * 0.38,
    marginRight: 15,
    backgroundColor: "#d0d4fa",
    overflow: "hidden",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center", // Centers content horizontally
  },
  bookImage: {
    width: width * 0.3,
    height: height * 0.24,
    resizeMode: "contain",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  bookCategory: {
    fontSize: 10,
    fontWeight: "light",
    color: "#fff",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  bookAuthor: {
    fontSize: 11,
    color: "#fff",
  },
  bookPrice: {
    paddingTop: 10,
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  seeMore: {
    color: "#0B0F4C",
    fontWeight: "bold",
  },
  seeMoreButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  seeMoreText: {
    color: "#0B0F4C",
    fontWeight: "bold",
  },
  bookDetails: {
    width: width * 0.5,
    height: height * 0.5,
    paddingTop: 15,
    padding: 10,
    backgroundColor: "#0B0F4C",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
});

export default Home;