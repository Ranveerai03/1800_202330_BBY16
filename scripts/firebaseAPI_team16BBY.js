//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyD_xdWMhpOtYh-dNmwim0boJzoDjNEj-1g",
    authDomain: "snowgo-553c1.firebaseapp.com",
    projectId: "snowgo-553c1",
    storageBucket: "snowgo-553c1.appspot.com",
    messagingSenderId: "929740227114",
    appId: "1:929740227114:web:58b22615215ba56236f953"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();