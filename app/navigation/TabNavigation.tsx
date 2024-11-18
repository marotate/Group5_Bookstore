// TabNavigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Account from '../screens/Account';
import Cart from '../screens/Cart'; 
import Categories from '../screens/Categories'; 
import { StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';  // Import the hook


const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#FFFFFF'; // Color for the active icon
const INACTIVE_COLOR = '#0B0F4C'; // Color for inactive icons
const BACKGROUND = '#0B0F4C'; // Background color when the icon is focused
const TEXT_COLOR = '#0B0F4C'; // Always navy color for text

// Function to determine the icon based on the route
const getTabBarIcon = (route: { name: string }, focused: boolean, size: number) => {
    let iconName: keyof typeof MaterialIcons.glyphMap;

    switch (route.name) {
        case 'Home':
            iconName = 'home';
            break;
        case 'Account':
            iconName = 'account-box';
            break;
        case 'Cart':
            iconName = 'shopping-cart';
            break;
        case 'Categories':
            iconName = 'grid-view';
            break;
        default:
            iconName = 'circle';
            break;
    }
    
    return (
        <View style={[styles.icon, focused && styles.focusedIcon]}>
            <MaterialIcons name={iconName} size={size} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
        </View>
    );
};

const TabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size }) => getTabBarIcon(route, focused, size),
                tabBarActiveTintColor: ACTIVE_COLOR,
                tabBarInactiveTintColor: INACTIVE_COLOR,
                tabBarStyle: {
                    height: 70,
                    paddingTop: 10,
                    paddingBottom: 7, // Additional padding for better spacing
                    backgroundColor: '#e6e6e6', // Background color for the tab bar
                },
                tabBarLabelStyle: {
                    color: TEXT_COLOR, // Always navy color for text
                    fontSize: 12,
                },
                tabBarItemStyle: {
                    padding: 0, // No additional padding
                },
            })}
        >
                   <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{ headerShown: false }} 
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // You can use navigation to trigger a refresh
                        e.preventDefault();  // Prevent default navigation behavior
                        navigation.navigate('Home');  // Trigger refresh manually
                    }
                })}
            />
            <Tab.Screen 
                name="Categories" 
                component={Categories} 
                options={{ headerShown: false }}  
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Categories');
                    }
                })}
            />
            <Tab.Screen 
                name="Cart" 
                component={Cart} 
                options={{ headerShown: false }} 
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Cart');
                    }
                })}
            />
            <Tab.Screen 
                name="Account" 
                component={Account} 
                options={{ headerShown: false }} 
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Account');
                    }
                })}
            />
        </Tab.Navigator>
    );
};



const styles = StyleSheet.create({
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 35,
        borderRadius: 20,
    },
    focusedIcon: {
        backgroundColor: BACKGROUND,
    },
    focusedLabel: {
        color: ACTIVE_COLOR, 
    },
});

export default TabNavigation;
