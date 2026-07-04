// firebase-config.js — Conexión con Firebase Authentication
// Este archivo SÍ es un módulo (por eso usa import). app.js sigue siendo normal.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMRzKUoNNxexApAjxvM8zird2NQTML4Dk",
    authDomain: "gestor-de-notas-avanzado.firebaseapp.com",
    projectId: "gestor-de-notas-avanzado",
    storageBucket: "gestor-de-notas-avanzado.firebasestorage.app",
    messagingSenderId: "580362721895",
    appId: "1:580362721895:web:6b67c6836195ea4d1a12c2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ====================== REGISTRO ======================
window.registrarConFirebase = function (email, password) {
    const errorDiv = document.getElementById('authErrorSignup');
    errorDiv.textContent = '';

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            cerrarModalLoginPreview();
        })
        .catch((error) => {
            errorDiv.textContent = traducirErrorFirebase(error.code);
        });
};

// ====================== LOGIN ======================
window.iniciarSesionConFirebase = function (email, password) {
    const errorDiv = document.getElementById('authErrorLogin');
    errorDiv.textContent = '';

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            cerrarModalLoginPreview();
        })
        .catch((error) => {
            errorDiv.textContent = traducirErrorFirebase(error.code);
        });
};

// ====================== LOGOUT ======================
window.cerrarSesionFirebase = function () {
    signOut(auth);
};

// ====================== ESTADO DE SESIÓN ======================
onAuthStateChanged(auth, (user) => {
    if (typeof window.actualizarUIAuth === 'function') {
        window.actualizarUIAuth(user);
    }
});

// ====================== TRADUCIR ERRORES DE FIREBASE AL ESPAÑOL ======================
function traducirErrorFirebase(code) {
    const mensajes = {
        'auth/email-already-in-use': 'Ese correo ya está registrado.',
        'auth/invalid-email': 'El correo no es válido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/user-not-found': 'No existe una cuenta con ese correo.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento e intenta de nuevo.'
    };
    return mensajes[code] || 'Ocurrió un error. Intenta de nuevo.';
}