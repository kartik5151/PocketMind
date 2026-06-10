// this file will handle all saving and loading of chats

// AsyncStroage - stored data locally on device ( like database )
import AsyncStorage from "@react-native-async-storage/async-storage";

// key used to store chat in device stroage
const CHATS_KEY = "pocketmind_chat";

// save all chat to device stroage
export const saveChats = async (chats) => {
    try {
        // convert chat array to string - stroage only save strings
        const jsonValue = JSON.stringify(chats);
        await AsyncStorage.setItem(CHATS_KEY, jsonValue);
    } catch (error) {
        console.error("Error saving chats:", error);
    }
};

// load all chats from device storage
export const loadChats = async () => {
    try {
        // get chat string from stroage
        const jsonValue = await AsyncStorage.getItem(CHATS_KEY);
        // convert string back to array and return
        return jsonValue !=null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error("Error loading chats:", error);
    }
};

// delete single chat by its id
export const deleteChat = async (chatID) => {
    try {
        // load all chat first
        const chats = await loadChats();
        // filter out the chat we want to delete
        const updateChats = chats.filter((chat) => chat.id !==chatID);
        // save updated list back
        await saveChats(updateChats);
    } catch (error) {
        console.error("Error deleting chats:", error);
    }
};