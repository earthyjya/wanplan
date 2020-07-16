import firebase from "firebase";

  const Config = {
    apiKey: "AIzaSyCsu5b7hxz2L91C71SRLooslZI8Dhb_tYU",
    authDomain: "oneplan-803eb.firebaseapp.com",
    databaseURL: "https://oneplan-803eb.firebaseio.com",
    projectId: "oneplan-803eb",
    storageBucket: "oneplan-803eb.appspot.com",
    messagingSenderId: "501104765863",
    appId: "1:501104765863:web:fd41fcac0a4a59a4032482",
    measurementId: "G-J12YS1K8PJ"
  };
  const fire = firebase.initializeApp(Config);
  export default fire;