import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();
  return token && user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
