import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCp7hFFVEOTQhya1YTpmlDLXEzoBJ7HWzQ",
    authDomain: "sentensi-4aedd.firebaseapp.com",
    projectId: "sentensi-4aedd",
    storageBucket: "sentensi-4aedd.appspot.com",
    messagingSenderId: "927772530939",
    appId: "1:927772530939:web:eeb1d50bc68f48aa4b785e",
    measurementId: "G-CGTFDKKXDF"
});

function create(email, pass, Rpass){
    let err = document.getElementById('error');
    if (pass.length == 0){
        err.style.color = '#c00000';
        err.innerText = "You didn't give a password!";
        return 0;
    } else if (pass != Rpass){
        err.style.color = '#c00000';
        err.innerText = "The passwords don't match!";
        return 0;
    }

    createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
        setPersistence(auth, browserLocalPersistence).then(() => {
            window.location.href = '../home';
        });
    })
    .catch((error) => {
        err.style.color = '#c00000';
        switch (error.code){
            case "auth/invalid-email": err.innerText = "Your email is not valid!"; break;
            case "auth/weak-password": err.innerText = "Your password is too weak!"; break;
            case "auth/email-already-in-use": err.innerText = "The account you're trying to create already exists!"; break;
            case "auth/missing-email": err.innerText = "You didn't give an email!"; break;
        }
        return 0;
    });
}

function log(email, pass){
    let err = document.getElementById('error');
    if (pass.length == 0){
        err.style.color = '#c00000';
        err.innerText = "You didn't give a password!";
        return 0;
    }
    signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
        setPersistence(auth, browserLocalPersistence).then(() => {
            window.location.href = '../home';
        });
    })
    .catch((error) => {
        err.style.color = '#c00000';
        switch (error.code){
            case "auth/invalid-email": err.innerText = "Your email is not valid!"; break;
            case "auth/wrong-password": err.innerText = "The password you entered is wrong!"; break;
            case "auth/user-not-found": err.innerText = "The account you're trying to connect to doesn't exist!"; break;
            case "auth/missing-email": err.innerText = "You didn't give an email!"; break;
        }
        return 0;
    });
}

const auth = getAuth(firebaseApp);

document.getElementById('sign').onclick = function (e){
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
    let Rpass = document.getElementById('Rpass').value;
    create(email, pass, Rpass);
}

document.getElementById('log').onclick = function (e){
    let email = document.getElementById('email2').value;
    let pass = document.getElementById('pass2').value;
    log(email, pass);
}

auth.onAuthStateChanged(function (user){
    if (user != null){
        window.location.href = '../home';
    }
});