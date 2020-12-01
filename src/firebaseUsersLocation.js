import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAzgD0kXpjPIfhvWKOTTAPmM6nUKUH4tNI",
    authDomain: "ben-sarjeant-project-5.firebaseapp.com",
    databaseURL: "https://ben-sarjeant-project-5.firebaseio.com",
    projectId: "ben-sarjeant-project-5",
    storageBucket: "ben-sarjeant-project-5.appspot.com",
    messagingSenderId: "294499551721",
    appId: "1:294499551721:web:5cbbb09952bf2f8b72e378"
};

firebase.initializeApp(firebaseConfig);

export default firebase;