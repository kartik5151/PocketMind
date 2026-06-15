import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useState, useEffect, useRef } from "react";
import { sendMessageToGemini } from "../api/gemini";
import { saveChats, loadChats } from "../storage/chatStorage";
import { saveChatsToCloud, loadChatsFromCloud } from "../storage/firestoreStorage";


export default function ChatScreen({route}) {

    // stores all messages in the chat
    const [messages, setMessages] = useState([]);

    // stores what user is currently typing
    const [inputText, setInputText] = useState("");

    // tracks when AI is thinking
    const [isLoading, setIsLoading] = useState(false);

    // get params from HomeScreen if opening old chat
    const existingChatId = route.params?.chatId;
    const existingMessages = route.params?.messages;

    // unique id for this chat session
    const [chatId] = useState(existingChatId || Date.now().toString());

    const flatListRef = useRef(null);

    // load old messages if opening existing chat
    useEffect(() => {
        if (existingMessages) {
            setMessages(existingMessages);
        }
    }, []);

    // runs when user taps send button
    const sendMessage = async () => {

        // don't send if empty or already loading
        if (inputText.trim() === "" || isLoading) return;

        // create user message object
        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
        };

        // add user message to list
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // clear input
        setInputText("");
        Keyboard.dismiss();

        // show loading - AI is thinking
        setIsLoading(true);

        // send to AI and wait for reply
        const reply = await sendMessageToGemini(inputText);

        // create AI message object
        const aiMessage = {
            id: Date.now().toString() + "ai",
            text: reply,
            sender: "ai",
        };

        // add AI reply to messages list
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        // hide loading
        setIsLoading(false);

        // save chat to AsyncStorage (local)
        const existingChats = await loadChats();
        
        // check if this chat already exists
        const chatIndex = existingChats.findIndex((c) => c.id === chatId);

        // create chat object to save
        const chatToSave = {
            id: chatId,
            title: newMessage.text.slice(0, 30),
            date: new Date().toLocaleDateString(),
            messages: finalMessages,
        };
        
        if (chatIndex >= 0) {
            // update existing chat
            existingChats[chatIndex] = chatToSave;
        } else {
            // add new chat
            existingChats.unshift(chatToSave);
        }
        
        // save to AsyncStorage (local backup)
        await saveChats(existingChats);
        
        // ALSO save to Firestore (cloud - per user)
        await saveChatsToCloud(existingChats);
    };

    return(

        
        <KeyboardAvoidingView style={styles.container}
         

            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={80}
            >

            {/* FlatList - scrollable list of chat messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                ref={flatListRef}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true})}
                onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
                renderItem={({ item }) => (
                    

                    <View style={[
                        styles.messageBubble,
                        item.sender === "user" ? styles.userBubble : styles.aiBubble
                    ]}>
                        <Text style={styles.messageText}>{String(item.text)}</Text>
                    </View>
                )}
            />

            {/* shows when AI is thinking */}
            {isLoading && (
                <Text style={styles.loadingText}>PocketMind is thinking...</Text>
            )}

            {/* input area at bottom */}
            <View style={styles.inputArea}>

                {/* where user types message */}
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#888888"
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                    onSubmitEditing={sendMessage}
                />

                {/* send button */}
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
    },

    messagesList: {
        flex: 1,
        padding: 15,
    },

    loadingText: {
        color: "#888888",
        fontSize: 14,
        paddingLeft: 15,
        paddingBottom: 5,
    },

    inputArea: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#222222",
        alignItems: "center",
    },

    input: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
    },

    sendButton: {
        backgroundColor: "#4f46e5",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },

    sendText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },

    messageBubble: {
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        maxWidth: "80%",
    },

    userBubble: {
        backgroundColor: "#4f46e5",
        alignSelf: "flex-end",
    },

    aiBubble: {
        backgroundColor: "#1a1a1a",
        alignSelf: "flex-start",
    },

    messageText: {
        color: "#ffffff",
        fontSize: 16,
    },

})