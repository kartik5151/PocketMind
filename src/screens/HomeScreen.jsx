import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { loadChatsFromCloud, deleteChatFromCloud } from "../storage/firestoreStorage";

// our storage functions
import { loadChats, deleteChat } from "../storage/chatStorage";

// sign out function
import { signOut } from "../services/auth";

// firebase auth to get current user
import auth from '@react-native-firebase/auth';

export default function HomeScreen({ navigation }) {

    // chats array
    const [chats, setChats] = useState([]);

    // get current logged in user from Firebase
    const user = auth().currentUser;

    // load chats when screen opens
    useFocusEffect(
        useCallback(() => {
            loadChatsFromStorage();
        }, [])
    );

    // load chats from AsyncStorage / cloud
    const loadChatsFromStorage = async () => {
    const savedChats = await loadChatsFromCloud();
    setChats(savedChats);
};

    // handle sign out
    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        // App.js onAuthStateChanged will auto redirect to Login
                    }
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    // long press delete
    const handleLongPress = (chatId, chatTitle) => {
        Alert.alert(
            "Chat Options",
            `What do you want to do with "${chatTitle || "this chat"}"?`,
            [
                {
                    text: "Delete Chat",
                    style: "destructive",
                    onPress: async () => {
                        await deleteChatFromCloud(chatId);
                        loadChatsFromStorage();
                    }
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>

            {/* header - app title + user info */}
            <View style={styles.header}>

                {/* top row - title and sign out button */}
                <View style={styles.headerTop}>
                    <Text style={styles.title}>POCKETMIND</Text>
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                {/* user info row - photo + name + email */}
                {user && (
                    <View style={styles.userInfo}>
                        {/* user profile photo */}
                        {user.photoURL && (
                            <Image
                                source={{ uri: user.photoURL }}
                                style={styles.userPhoto}
                            />
                        )}
                        <View>
                            <Text style={styles.userName}>
                                {user.displayName || "User"}
                            </Text>
                            <Text style={styles.userEmail}>
                                {user.email}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* chat list */}
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => navigation.navigate("Chat", {
                            chatId: item.id,
                            messages: item.messages
                        })}
                        onLongPress={() => handleLongPress(item.id, item.title)}
                    >
                        <Text style={styles.chatTitle}>
                            {item.title ? String(item.title) : "New Chat"}
                        </Text>
                        <Text style={styles.chatDate}>
                            {item.date ? String(item.date) : ""}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No chats yet. Start a new chat!</Text>
                }
            />

            {/* new chat button */}
            <TouchableOpacity
                style={styles.newChatButton}
                onPress={() => navigation.navigate("Chat")}
            >
                <Text style={styles.newChatText}>+ New Chat</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
        padding: 20,
    },

    header: {
        marginTop: 50,
        marginBottom: 20,
    },

    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
    },

    signOutButton: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },

    signOutText: {
        color: "#ff4444",
        fontSize: 14,
        fontWeight: "bold",
    },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },

    userPhoto: {
        width: 45,
        height: 45,
        borderRadius: 22,
        marginRight: 12,
    },

    userName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    userEmail: {
        color: "#888888",
        fontSize: 13,
        marginTop: 2,
    },

    emptyText: {
        color: "#888888",
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },

    newChatButton: {
        backgroundColor: "#4f46e5",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
    },

    newChatText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    chatItem: {
        backgroundColor: "#1a1a1a",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },

    chatTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    chatDate: {
        color: "#888888",
        fontSize: 12,
        marginTop: 4,
    },
});