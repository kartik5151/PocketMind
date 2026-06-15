// importing firestore database
import firestore from '@react-native-firebase/firestore';

// importing auth to get current user's ID
import auth from '@react-native-firebase/auth';

// SAVE CHATS TO FIRESTORE
// saves all chats for the currently logged in user
export const saveChatsToCloud = async (chats) => {
    try {
        // get current user
        const user = auth().currentUser;

        // if no user logged in, do nothing
        if (!user) return;

        // save to Firestore
        // structure: users → userID → data → chats
        await firestore()
            .collection('users')
            .doc(user.uid)
            .set({ chats: chats });

    } catch (error) {
        console.error('Error saving chats to cloud:', error);
    }
};

// LOAD CHATS FROM FIRESTORE
// loads all chats for the currently logged in user
export const loadChatsFromCloud = async () => {
    try {
        // get current user
        const user = auth().currentUser;

        // if no user logged in, return empty array
        if (!user) return [];

        // get user's document from Firestore
        const doc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

        // if document exists return chats, otherwise empty array
        if (doc.exists) {
            const data = doc.data();
            // check if data AND chats exist before accessing
            return (data && data.chats) ? data.chats : [];
        }

        // no document found - new user, return empty array
        return [];

    } catch (error) {
        console.error('Error loading chats from cloud:', error);
        return [];
    }
};

// DELETE ONE CHAT FROM FIRESTORE
export const deleteChatFromCloud = async (chatId) => {
    try {
        const user = auth().currentUser;
        if (!user) return;

        // load all chats first
        const chats = await loadChatsFromCloud();

        // filter out the deleted chat
        const updatedChats = chats.filter((chat) => chat.id !== chatId);

        // save updated list back to Firestore
        await saveChatsToCloud(updatedChats);

    } catch (error) {
        console.error('Error deleting chat from cloud:', error);
    }
};