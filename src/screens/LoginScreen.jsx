import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";

//importing our sign in function
import { signInWithGoogle } from "../services/auth";

export default function LoginScreen({ navigation }) {
    
    // track when sign-in is happening show loading spinner
    const[isLoading, setIsLoading] = useState(false);

    // track if error happens during sign-in
    const[error, setError] = useState(null);

    // runs when user taps "Sign-in with Goggle" Button
    const handleGoogleSignIn = async() => {
        try {
            // show loading spinner
            setIsLoading(true);

            // clear any old errors
            setError(null);

            // call our sign in function from auth.js
            const user = await signInWithGoogle();

            
        } catch (error) {
            // show error message if sign in fails
            setError("Sign in failed, Please try again.");
            console.error(error);
        } finally {
            // always hide loading spinner when done
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {/* app logo / title section*/}
            <View style={styles.logoSection}>
                <Text style={styles.appName}>POCKETMIND</Text>
                <Text style={styles.tagline}>Your personal AI assistant</Text>
            </View>

            {/* middle section */}
            <View style={styles.middleSection}>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.subText}>
                    Sign in to save your chat and access them anywhere
                </Text>
            </View>

            {/* error message - only show  if sign in fails */}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {/* sign in button */}
            <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            >
                {/* show spinner when loading, text when not */}
                {isLoading ? (
                    <ActivityIndicator color="#000000" />
                ) : (
                    <Text style={styles.googleButtonText}>
                        Sign in with google
                    </Text>
                )}
            
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create( {

    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
        padding: 30,
        justifyContent: "center",
    },

    logoSection: {
        alignItems: "center",
        marginBottom: 60,
    },

    appName: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: 4,
    },

    tagline: {
        fontSize: 14,
        color: "#888888",
        marginTop: 8,
    },

    middleSection: {
        marginBottom: 40,
    },

    welcomeText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 10,
    },

    subText: {
        fontSize: 16,
        color: "#888888",
        lineHeight: 24,
    },

    errorText: {
        color: "#ff4444",
        fontSize: 14,
        marginBottom: 15,
        textAlign: "center",
    },

    googleButton: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    googleButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
});