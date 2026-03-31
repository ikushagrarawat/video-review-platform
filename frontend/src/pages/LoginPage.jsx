import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";

export default function LoginPage() {
  const { login, token } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("login");

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (form) => {
    try {
      setIsLoading(true);
      setError("");
      if (mode === "register") {
        await api.post("/auth/register", form);
        await login(form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (mode === "register" ? "Unable to register" : "Unable to login")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-copy">
        <p className="eyebrow">Assignment-ready demo app</p>
        <h1>Upload, review, and stream videos with live processing updates.</h1>
        <p>
          This MVP demonstrates authentication, tenant-aware video access, mock sensitivity
          processing, Socket.io progress updates, and HTTP range streaming.
        </p>
        <div className="mode-toggle">
          <button
            className={mode === "login" ? "" : "ghost-button"}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "" : "ghost-button"}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>
      </section>
      <AuthForm mode={mode} onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </main>
  );
}
