import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './Firebaseconfig';
import Login from './app/screens/Login';
import TabNavigation from './app/navigation/TabNavigation';
import Signup from './app/screens/SignUp';
import { LogBox } from 'react-native';
import CartProvider from './app/context/CartContext';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false); // Track if the user logged in from Login page

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User status changed:', user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {user && isLogin ? (
            // Only show Tabs if both user and isLogin are true
            <Stack.Screen
              name="Tabs"
              component={TabNavigation}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
              >
                {props => <Login {...props} setIsLogin={setIsLogin} />}
              </Stack.Screen>
              <Stack.Screen
                name="Signup"
                options={{ headerShown: false }}
              >
                {props => <Signup {...props} setIsLogin={setIsLogin} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;
