import firebase from "firebase";

  const Config = {
    apiKey: "Firebase api key",
    authDomain: "Firebase auth domain",
    databaseURL: "Firebase database URL",
    projectId: "Firebase Project ID",
    storageBucket: "Firebase Storage Bucket",
    messagingSenderId: "501104765863",
    appId: "1:501104765863:web:fd41fcac0a4a59a4032482",
    measurementId: "G-J12YS1K8PJ"
  };
  const fire = firebase.initializeApp(Config);
  export default fire;
