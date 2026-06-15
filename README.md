# PocketMind 🤖

An AI-powered chat app built with React Native and Expo.
Sign in with Google, chat with AI, and access your conversations from anywhere — all saved securely in the cloud.

---

## ✨ Features

- 💬 **AI Chat** — powered by OpenRouter API with real-time responses
- 🔐 **Google Sign-In** — secure authentication via Firebase Auth
- ☁️ **Cloud Storage** — chats saved to Firestore, accessible from any device
- 👤 **Per-user History** — every user sees only their own chats
- 💾 **Offline Backup** — chats also saved locally via AsyncStorage
- 📋 **Multiple Chat Sessions** — create, open, and manage chats
- 🗑️ **Long Press to Delete** — delete chats with confirmation popup
- ⌨️ **Keyboard Handling** — smooth input experience on Android
- 🌙 **Dark Theme UI** — clean, minimal dark interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native |
| Platform | Expo SDK 54 |
| Language | JavaScript |
| Authentication | Firebase Auth (Google Sign-In) |
| Database | Firebase Firestore (cloud) |
| Local Storage | AsyncStorage |
| AI Integration | OpenRouter API |
| Navigation | React Navigation |
| State Management | React Hooks (useState, useEffect) |

---

## 🏗️ Project Structure
PocketMind/

├── src/

│   ├── screens/

│   │   ├── LoginScreen.jsx      → Google Sign-In UI

│   │   ├── HomeScreen.jsx       → Chat list + user profile

│   │   └── ChatScreen.jsx       → AI chat interface

│   ├── services/

│   │   └── auth.js              → Firebase auth functions

│   ├── storage/

│   │   ├── chatStorage.js       → AsyncStorage (local)

│   │   └── firestoreStorage.js  → Firestore (cloud)

│   └── api/

│       └── gemini.js            → OpenRouter API integration

├── App.js                       → Navigation + auth state

└── app.json                     → Expo config

---

## ⚙️ Setup

### 1. Clone the repo
git clone https://github.com/kartik5151/PocketMind.git
cd PocketMind

### 2. Install dependencies
npm install

### 3. Add your OpenRouter API key
Rename src/api/gemini.example.js to src/api/gemini.js and add your OpenRouter API key inside.

### 4. Setup Firebase
- Create a Firebase project at console.firebase.google.com
- Enable Google Sign-In in Authentication
- Enable Firestore Database in test mode
- Download google-services.json and place it in the project root

### 5. Run the app
npx expo run:android

---

## 🔐 Security Notes

- google-services.json is in .gitignore — never pushed to GitHub
- src/api/gemini.js is in .gitignore — API key stays local
- Firebase Auth handles all user authentication securely
- Each user's data is stored under their unique Firebase UID

---

## 🔧 What I Built & Learned

- Integrated Google Sign-In with Firebase Auth from scratch
- Built Firestore cloud storage with per-user data isolation
- Implemented JWT-based authentication flow with auto-login on app restart
- Set up dual storage — AsyncStorage for offline + Firestore for cloud sync
- Handled Android keyboard behavior with KeyboardAvoidingView
- Managed navigation guards — unauthenticated users auto-redirected to login
- Built real-time auth state management using onAuthStateChanged

---

## Author

Kartik Sedha
- GitHub: github.com/kartik5151
- Email: kartiksedha56@gmail.com
