import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCp7hFFVEOTQhya1YTpmlDLXEzoBJ7HWzQ",
    authDomain: "sentensi-4aedd.firebaseapp.com",
    projectId: "sentensi-4aedd",
    storageBucket: "sentensi-4aedd.appspot.com",
    messagingSenderId: "927772530939",
    appId: "1:927772530939:web:eeb1d50bc68f48aa4b785e",
    measurementId: "G-CGTFDKKXDF"
});

const auth = getAuth(firebaseApp);

auth.onAuthStateChanged(function (user){
    if (user == null){
        window.location.href = '../logup';
    }
});