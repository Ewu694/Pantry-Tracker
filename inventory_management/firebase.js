// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxi5cG5ESZQ4ldgKt-mfBzQ0gov43oI-k",
  authDomain: "inventory-management-db301.firebaseapp.com",
  projectId: "inventory-management-db301",
  storageBucket: "inventory-management-db301.appspot.com",
  messagingSenderId: "732645632923",
  appId: "1:732645632923:web:304f7b6338131b7f050f3e",
  measurementId: "G-8HDSJ8F6T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);