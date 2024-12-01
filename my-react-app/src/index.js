import { BrowserRouter as Router } from "react-router-dom";
// import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./contextapi/userContext";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    {/* <Auth0Provider
      domain="dev-c7ap44czi23i7ka6.us.auth0.com"
      clientId="rfSZVd2Iw8bjiJ8NMYvN4ss4Mdn0FkLC" // iiitkresourcesv2
      // clientId="tNoLJgic8eDGLWCIyhHAkqiPaoT4XGUQ" // local host 3000
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    > */}
      <Router>
        <App />
      </Router>
    {/* </Auth0Provider> */}
  </UserProvider>
);
