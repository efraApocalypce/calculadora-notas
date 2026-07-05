// firebase-config.js — Conexión con Firebase Authentication + Firestore

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
const db = getFirestore(app);

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

// ====================== GUARDAR EN LA NUBE ======================
window.sincronizarConFirestore = function (datos) {
    const user = auth.currentUser;
    if (!user) return; // Si no hay sesión, no hay nada que sincronizar

    setDoc(doc(db, "usuarios", user.uid), datos).catch((error) => {
        console.error("Error guardando en la nube:", error);
    });
};

// ====================== ESTADO DE SESIÓN + DESCARGAR DATOS AL INICIAR SESIÓN ======================
onAuthStateChanged(auth, async (user) => {
    if (typeof window.actualizarUIAuth === 'function') {
        window.actualizarUIAuth(user);
    }

    if (user) {
        try {
            const refDoc = doc(db, "usuarios", user.uid);
            const snap = await getDoc(refDoc);

            if (snap.exists()) {
                // Ya existían datos en la nube: los bajamos y reemplazan lo local
                if (typeof window.cargarDatosDesdeNube === 'function') {
                    window.cargarDatosDesdeNube(snap.data());
                }
            } else {
                // Primera vez que este usuario inicia sesión: subimos lo que tenía local como punto de partida
                const datosLocales = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
                await setDoc(refDoc, datosLocales);
            }
        } catch (error) {
            console.error("Error sincronizando con Firestore:", error);
        }
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