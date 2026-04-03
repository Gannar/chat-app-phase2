import React, { useState } from "react";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return isAuthenticated ? (
    <ChatPage />
  ) : (
    <AuthPage onAuth={() => setIsAuthenticated(true)} />
  );
}

export default App;