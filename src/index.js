import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProviderWrapper } from "./settings/ThemeContext";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "./settings/i18n";
import { LanguageProvider } from "./settings/LanguageContext";
import { StoreProvider } from "./components/store/StoreContext"; // اضافه کردن StoreProvider
import '@fortawesome/fontawesome-free/css/all.min.css';

const setContentSecurityPolicy = () => {
  const csp = "connect-src 'self' http://localhost:5000 https://api.stripe.com";
  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = csp;
  document.head.appendChild(meta);
  console.log("CSP meta tag added to head:", meta); // Log to check if the meta tag is added
};

setContentSecurityPolicy();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <LanguageProvider>
        <ThemeProviderWrapper>
          <App />
        </ThemeProviderWrapper>
      </LanguageProvider>
    </StoreProvider>
  </React.StrictMode> 
);

reportWebVitals();
