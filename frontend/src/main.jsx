import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DialogBoxProvider } from "./context/DialogBoxContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DialogBoxProvider>
      <App />
    </DialogBoxProvider>
  </StrictMode>
);
