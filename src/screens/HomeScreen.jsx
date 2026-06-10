import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";


// our stroage function
import { loadChats, deleteChat } from "../storage/chatStorage";

export default function HomeScreen({ navigation }) {

    // chats - array that stores all saved chats
    // setChats - function to update the chats array
    const [chats, setChats] = useState([]);

    // useEffect - runs automatically when screen first opens
    // [] at end means run only once when screen loads
    useFocusEffect( 
        useCallback(() => {
        loadChatsFromStroage();
    }, [])
    );

    // function to load chat from AsyncStroage
    const loadChatsFromStroage = async () => {
        const savedChats = await loadChats();   // await - wait for storage to give us the chats
        setChats(savedChats);  // update state with loaded chats
    };

    return(
        
        <View style={styles.container}>
            {/* Main Container - holds everything */}
            
            {/* header section - app title at top */}
            <View style={styles.header}>
                <Text style={styles.title}>POCKETMIND</Text>
            </View>
            
            {/* FlatList - scrollable list of all past chats */}
            {/* data={chats} - the array of chats to show */}
            {/* keyExtractor - gives each item a unique key */}
            <FlatList
            data={chats}
            keyExtractor={(item) => item.id}

             
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("Chat", {
                chatId: item.id,
                messages: item.messages
            })}>
                <Text style={styles.chatTitle}>
                    {item.title ? String(item.title) : "New Chat"}
                </Text>
                <Text style={styles.chatDate}>
                    {item.date ? String(item.date) : ""}
                    </Text>
            </TouchableOpacity>
            )}

            
            ListEmptyComponent={
                <Text style={styles.emptyText}>No chats yet</Text>
            }
            />


            {/* button - fixed at bottom to start new chat.. */}
            <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => navigation.navigate("Chat")}
            >
                <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>

        </View>
    )
}


// all styles grouped here at bottom
const styles = StyleSheet.create({

    // full screen dark background
    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
        padding: 20,
    },
    
    // pushes title down from status bar
    header: {
        marginTop: 50,
        marginBottom: 30,
    },

    // app name styling
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
    },

    // muted text when no chats
    emptyText: {
        color: "#888888",
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },

    // floating button fixed at bottom
    newChatButton: {
        backgroundColor: "#1a1a2e",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
    },

    // button text
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

// chat title text
chatTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
},

// chat date text
chatDate: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
},

}) 