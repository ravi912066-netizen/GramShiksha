import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Fallback for other paths while being built */}
            <Route
              path="*"
              element={
                <div className="max-w-4xl mx-auto py-20 text-center px-4">
                  <h2 className="text-2xl font-bold text-slate-800">Page Under Construction</h2>
                  <p className="text-slate-500 mt-2">This route will be active in the next milestone.</p>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}
