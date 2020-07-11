import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import App from "./App";
import TagManager from "react-gtm-module";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/fonts/NotoSansThai-Regular.ttf";
// import * as serviceWorker from "./serviceWorker";

const tagManagerArgs = {
	gtmId: "GTM-TZHMJ9Z"
};

TagManager.initialize(tagManagerArgs);
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
