import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebaseconfig";
import { updateProfile, updateEmail, User } from "firebase/auth";
import { ref, onValue, update } from "firebase/database";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Account = ({ navigation }: RouterProps) => {
    const user = FIREBASE_AUTH.currentUser as User | null;
    const [username, setUsername] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            const userRef = ref(FIREBASE_DB, `users/${user.uid}`);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUsername(data.username || "");
                    setEmail(data.email || "");
                    setAddress(data.address || "");
                }
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
    
        try {
            // Update the user's display name and email in Firebase Authentication
            await updateProfile(user, { displayName: username });
            await updateEmail(user, email);
    
            // Save username, email, and address to Firebase Realtime Database
            const userRef = ref(FIREBASE_DB, `users/${user.uid}`);
            await update(userRef, {
                username: username,
                email: email,
                address: address,
                createAt: Date.now(), // Optionally add a timestamp for the profile update
            });
    
            Alert.alert('Edit Successful', 'Please check your information', [{ text: 'OK' }]);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    
        setIsEditing(false);
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Account</Text>
            <Image
                source={{
                    uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/user%20icon.png?alt=media&token=10bbb6ea-4f1f-42d4-87c2-9214032acfd2",
                }}
                style={styles.image} 
            />
            <View style={styles.row}>
                <Text style={styles.label}>Username:</Text>
                {isEditing ? (
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                ) : (
                    <Text style={styles.text}>
                        {username ? username : <Text style={styles.placeholder}>Not specified</Text>}
                    </Text>
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                {isEditing ? (
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                ) : (
                    <Text style={styles.text}>{email}</Text>
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                {isEditing ? (
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />
                ) : (
                    <Text style={styles.text}>
                        {address ? address : <Text style={styles.placeholder}>Not specified</Text>}
                    </Text>
                )}
            </View>

            <View style={styles.buttonRow}>
                {isEditing ? (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.logoutButton} onPress={() => FIREBASE_AUTH.signOut()}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#0b0f4c',
        letterSpacing: 1,
    },
    image: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#0b0f4c',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        width: 90,
        color: '#005f8d',
    },
    input: {
       
        borderRadius: 8,
        paddingHorizontal: 12,
        flex: 1,
        height: 40,
        backgroundColor: "#f0f8ff",
        color: '#005f8d',
    },
    text: {
        fontSize: 16,
        flex: 1,
        color: '#005f8d',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#0b0f4c',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
        shadowColor: '#007acc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    logoutButton: {
        backgroundColor: '#ff4d4f',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
        shadowColor: '#ff4d4f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    saveButton: {
        backgroundColor: '#16207B',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
        shadowColor: '#52c41a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    placeholder: {
        fontSize: 16,
        color: '#aaa',
        fontStyle: 'italic',
    },
});