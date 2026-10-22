import { auth } from "../../lib/firebase";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

export async function registerWithEmail(email, password) {
    const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    await sendEmailVerification(result.user);
    return result.user;
}

export async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return result.user;
}

export async function loginWithGoogle() {
    const result = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
    );

    return result.user;
}

export function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
}

export function logout() {
    return signOut(auth);
}