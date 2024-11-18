import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH } from '../../Firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const navigation1 = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setIsLogin(true);
      Alert.alert('Login successful!', 'Welcome to Book Shelf Store. Enjoy Shopping!', [{ text: 'OK', onPress: () => navigation.navigate('Tabs') }]);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Login failed!', 'Please Try Again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/MENU%20(2)_0.png?alt=media&token=60a18526-4926-494a-ad01-5179090988c7",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>Please fill your details to login</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to Signup');
                navigation.navigate('Signup');
              }}
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>Create an account</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
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
    backgroundColor: "#121764",
    paddingVertical: 15,
    borderRadius: 4,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#007bff",
    fontSize: 16,
  },
});
function setFromLogin(arg0: boolean) {
  throw new Error('Function not implemented.');
}

