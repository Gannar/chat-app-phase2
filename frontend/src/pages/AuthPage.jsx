import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/auth.css";

const AuthPage = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm onLogin={onAuth} />
      ) : (
        <RegisterForm onRegister={() => setIsLogin(true)} />
      )}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create account" : "Already have an account?"}
      </button>
    </div>
  );
};

export default AuthPage;