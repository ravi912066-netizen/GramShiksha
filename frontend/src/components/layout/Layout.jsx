import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OfflineBanner from "../common/OfflineBanner";
import useAuth from "../../hooks/useAuth";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <OfflineBanner />
      <Navbar user={user} onLogout={logout} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
