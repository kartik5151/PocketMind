// importing firebase authentication module
// auth() give us access to login, logout, current user etc.
import auth from '@react-native-firebase/auth';

//importing \google sign-in module
//GoogleSignIn handles the Google account popup
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// step-1 - Configure google sign-in
// This run before any sign-in attempt
//webClientId tell Firebase which google project this app belongs to
GoogleSignin.configure({
    webClientId: '782705124975-6qqdhmu2q1a6ktarpkh353fcf4frsgpt.apps.googleusercontent.com',
});

// step-2 - Sign-in Function
// async because it talks to google severs (takes time)
export const signInWithGoogle = async () => {
    try {
        // check if google Play Services is available on device
        // google sign-in won't work without Play Services
        await GoogleSignin.hasPlayServices();

        // open google account picker, user select google account
        // userInfo contains name, email, photo,idToke
        const userInfo = await GoogleSignin.signIn();

        // create a Firebase credential using Goggle's idToken
        // idToken is a secure key that proves user is real
        // Firebase use this to verify user
        const googleCredential = auth.GoogleAuthProvider.credential(
            userInfo.data.idToken
        );

        // sign-in to Firebase using Google Credential
        // Firebase knows who this user is
        // userCredential.user contains uid, email, displayName, photoURL
        const userCredential = await auth().signInWithCredential(googleCredential);

        //return the user object to whoever called this function
        return userCredential.user;
    } catch (error) {
        // if anything goes wrong print error and stop
        console.error('Google Sign-In error:', error);
        throw error;
    }
};

// step-3 - signOut function
// sign out from both google and firebase
// important to sign out from both otherwise user stays logged in
export const signOut = async() => {
    try {
        // sign out from google 
        await GoogleSignin.signOut();

        // sign out from firebase
        await auth().signOut();
    } catch (error) {
        console.error('Sign Out eroor:', error);
        throw error;
    }
};