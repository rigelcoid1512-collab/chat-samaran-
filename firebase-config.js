const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "chat-samaran.firebaseapp.com",
  projectId: "chat-samaran",
  storageBucket: "chat-samaran.appspot.com",
  messagingSenderId: "123456789",
  appId: "1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore & Auth
const db = firebase.firestore();
const auth = firebase.auth();
