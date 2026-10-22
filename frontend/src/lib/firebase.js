import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAAsIUti7-oxfYGtBKESIO_gHS9YP4kko0",
    authDomain: "nailhq-9e96f.firebaseapp.com",
    projectId: "nailhq-9e96f",
    storageBucket: "nailhq-9e96f.firebasestorage.app",
    messagingSenderId: "902833882576",
    appId: "1:902833882576:web:85867f4961b0384eefe5d5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);