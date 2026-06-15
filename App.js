// NavigationContainer - wraps the whole app, manages navigation history
import { NavigationContainer } from "@react-navigation/native";

// createNativeStackNavigator - creates stack navigation (screens pile on top of each other)
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// importing all our screens
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import LoginScreen from "./src/screens/LoginScreen";

// firebase auth - lets us check who is logged in
import auth from '@react-native-firebase/auth';

// useState - stores data that can change (like current user)
// useEffect - runs code when app first starts
import { useState, useEffect } from "react";

import { LogBox } from "react-native";
// hide unnecessary warnings in console
LogBox.ignoreLogs(["Text strings must be rendered"]);

// Stack - our navigator object
// gives us Stack.Navigator and Stack.Screen components
const Stack = createNativeStackNavigator();

export default function App() {

  // user - stores the currently logged in Firebase user
  // null means nobody is logged in
  const [user, setUser] = useState(null);

  // initializing - true while we are checking login status on app start
  // prevents showing wrong screen before we know if user is logged in
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {

    // onAuthStateChanged - Firebase listener that fires automatically when:
    // 1. App starts (tells us current login state)
    // 2. User logs in (firebaseUser = user object)
    // 3. User logs out (firebaseUser = null)
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {

      // update user state - either user object or null
      setUser(firebaseUser);

      // we now know the auth state so stop the loading
      if (initializing) setInitializing(false);
    });

    // return subscriber - this CLEANS UP the listener when app closes
    // prevents memory leaks
    return subscriber;

  }, []); // [] means run only once when app first mounts

  // while checking login status - show nothing
  // this prevents a flash of wrong screen
  if (initializing) return null;

  return (
    <NavigationContainer>

      {/* screenOptions - applies to ALL screens unless overridden */}
      {/* headerShown: false - hides default header on all screens */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* SMART ROUTING - show different screens based on login status */}
        {user ? (

          // ✅ USER IS LOGGED IN - show Home and Chat screens
          <>
            {/* Home Screen - first screen after login */}
            {/* no header needed here - HomeScreen has its own custom header */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            {/* Chat Screen - opens when user starts or opens a chat */}
            {/* headerShown: true - overrides the global false above */}
            {/* this gives us the back arrow to go back to Home */}
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: true,
                headerTitle: "Chat",
                headerStyle: { backgroundColor: "#0f0f0f" }, // dark header
                headerTintColor: "#ffffff", // white back arrow and title
              }}
            />
          </>

        ) : (

          // ❌ USER IS NOT LOGGED IN - show Login screen only
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>

        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}