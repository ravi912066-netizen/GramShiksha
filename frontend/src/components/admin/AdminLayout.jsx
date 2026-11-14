import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      label: "Manage Lessons",
      path: "/admin/lessons",
      icon: Layers,
    },
    {
      label: "Student Directory",
      path: "/admin/students",
      icon: Users,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-rural-500 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">
              Gram<span className="text-rural-400">Shiksha</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </Link>

        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin User Profile footer */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs uppercase border border-brand-500/30">
            {user?.name ? user.name.charAt(0) : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-1.5">
          <Link
            to="/courses"
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>View Public Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 shadow-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              Platform Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="brand" size="sm">
              <ShieldCheck className="w-3 h-3 text-brand-600" />
              Admin Verified
            </Badge>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
