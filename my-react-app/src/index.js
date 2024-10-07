import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <Auth0Provider
  //   domain="dev-c7ap44czi23i7ka6.us.auth0.com"
  //   clientId="rfSZVd2Iw8bjiJ8NMYvN4ss4Mdn0FkLC"
  //   authorizationParams={{
  //     redirect_uri: window.location.origin,
  //   }}
  // >
  <Auth0Provider
    domain="dev-c7ap44czi23i7ka6.us.auth0.com"
    clientId="tNoLJgic8eDGLWCIyhHAkqiPaoT4XGUQ"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>
);
