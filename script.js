const googleLogin = document.getElementById("google-login");
const phoneLogin = document.getElementById("phone-login");
const phoneNumberInput = document.getElementById("phone-number");
const sendOtpBtn = document.getElementById("send-otp");
const otpInput = document.getElementById("otp");
const verifyOtpBtn = document.getElementById("verify-otp");
const chatContainer = document.getElementById("chat-container");
const authContainer = document.getElementById("auth-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const logoutBtn = document.getElementById("logout");
const userNameSpan = document.getElementById("user-name");

let currentUser = null;
let displayName = "";
let verificationId = null;

// Generate anonymous username
function generateUsername() {
  return "User_" + Math.floor(1000 + Math.random() * 9000);
}

// Google Login
googleLogin.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Phone Login
phoneLogin.addEventListener("click", () => {
  phoneNumberInput.style.display = "block";
  sendOtpBtn.style.display = "block";
});

sendOtpBtn.addEventListener("click", () => {
  const phoneNumber = phoneNumberInput.value;
  const appVerifier = new firebase.auth.RecaptchaVerifier('send-otp', {
    'size': 'invisible'
  });
  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      verificationId = confirmationResult.verificationId;
      otpInput.style.display = "block";
      verifyOtpBtn.style.display = "block";
    })
    .catch(console.error);
});

verifyOtpBtn.addEventListener("click", () => {
  const code = otpInput.value;
  const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
  auth.signInWithCredential(credential);
});

// Set user on login
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    displayName = user.displayName || user.phoneNumber || generateUsername();
    userNameSpan.textContent = displayName;

    authContainer.style.display = "none";
    chatContainer.style.display = "block";

    loadMessages();
  } else {
    chatContainer.style.display = "none";
    authContainer.style.display = "block";
  }
});

// Load messages from Firestore
function loadMessages() {
  db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("message");
      div.classList.add(data.uid === currentUser.uid ? "sent" : "received");
      div.textContent = `${data.username}: ${data.text}`;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Send message
sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (text && currentUser) {
    db.collection("messages").add({
      text,
      uid: currentUser.uid,
      username: displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = "";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});
        
