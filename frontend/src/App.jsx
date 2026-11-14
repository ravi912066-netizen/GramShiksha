import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Public Only (Unauthenticated) Routes */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />

              {/* Placeholder for Upcoming Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
                      <h2 className="text-2xl font-bold text-slate-800">Student Dashboard</h2>
                      <p className="text-slate-500 mt-2">Connecting to student learning APIs in Milestone 4...</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
                      <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
                      <p className="text-slate-500 mt-2">Connecting to admin APIs in Milestone 8...</p>
                    </div>
                  </AdminRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route
                path="*"
                element={
                  <div className="max-w-4xl mx-auto py-20 text-center px-4">
                    <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                    <p className="text-slate-500 mt-2">The page you requested does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
