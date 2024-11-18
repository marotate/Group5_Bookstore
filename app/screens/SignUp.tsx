import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebaseconfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { ref, set } from 'firebase/database';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;


const Signup = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);  // To handle loading state


  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true); // Set loading to true when starting the signup process

    try {
      
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User created:', response.user);

      const db = ref(FIREBASE_DB, 'users/' + response.user.uid);

      await set(db, {
        username: username,
        email: email,
        address: address,
        createAt: Date.now(),
      });

      const cartRef = ref(FIREBASE_DB, 'carts/' + response.user.uid);
      await set(cartRef, {
        items: [], // Start with an empty cart
      });

      Alert.alert('Success', 'Account created successfully');
      console.log('Staying at the register page');

      try {
        // If sign-up is successful
        setIsLogin(false);
        navigation.navigate('Login'); // This will work if 'Login' is correctly defined in RootStackParamList
      } catch (error: any) {
        Alert.alert('Sign Up Failed', error.message);
      }

    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    }
    finally {
      setLoading(false); // Set loading to false after the process completes
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/MENU%20(2)_0.png?alt=media&token=60a18526-4926-494a-ad01-5179090988c7",
        }}
        style={styles.image} 
      />
      <Text style={styles.title}>Please fill your details to signup</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
      <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => {
          console.log('Navigating to Login');
          navigation.navigate('Login');
        }} 
        style={styles.gobackButton}
      >
        <Text style={styles.gobackText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: '#121764',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gobackButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  gobackText: {
    color: '#007bff',
    fontSize: 16,
  },
});
