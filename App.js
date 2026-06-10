// NavigationContainer - that wraps whole app, manage navigation state
import { NavigationContainer } from "@react-navigation/native";

// createNativeStackNavigator - gives us Stack.Navigator and Stack.Screen
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// importing our screens - these are the pages of our app
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Text strings must be rendered"]);

// Stack - the navigator object, gives access to Stack.Navigator and Stack.Screen
const Stack = createNativeStackNavigator();

export default function App() {
  return(

    // NavigationContainer - must wrap everything, manages navigation history
    <NavigationContainer>

      {/* Stack.Navigator - holds all the screens of our app */}
      <Stack.Navigator>

        {/* Stack.Screen - registers a screen with a name and component */}
        {/* name="Home" - used to navigate to this screen */}
        {/* component={HomeScreen} - the actual screen to show */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Chat screen - will open when user starts a chat */}
        <Stack.Screen name="Chat" component={ChatScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  )
}