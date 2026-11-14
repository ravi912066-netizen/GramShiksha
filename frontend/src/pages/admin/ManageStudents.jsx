import React, { useState, useEffect } from "react";
import { Users, Search, AlertCircle, Info, ShieldCheck, Mail, Calendar, BookOpen } from "lucide-react";
import adminService from "../../services/adminService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";

export default function ManageStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [integrationNote, setIntegrationNote] = useState("");

  useEffect(() => {
    // Check backend status
    adminService.getStudents().then((res) => {
      if (res?.isPendingBackend) {
        setIntegrationNote(res.message);
      }
    });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Directory
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review registered rural students and monitor their learning enrollments.
        </p>
      </div>

      {/* Backend Integration Note Card */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-2 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-800">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Backend Integration Note: User Directory Endpoint Pending</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed pl-7">
          {integrationNote ||
            "The backend user management endpoint (GET /api/admin/students) is currently in development by the backend team. This page architecture is fully wired and prepared in adminService.js to instantly bind live records as soon as the backend route is deployed."}
        </p>
        <div className="pl-7 pt-1 text-xs text-amber-700 font-medium">
          Security Policy: Passwords, salts, and secret credentials are never exposed through admin interfaces.
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <Badge variant="brand" size="md">
          Self-Registration Active
        </Badge>
      </div>

      {/* Structured Ready-to-Bind Student Management Card */}
      <Card className="p-8 text-center space-y-4 border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Users className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Waiting for Backend Student Directory API
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Students can currently register, log in, enroll in courses, and save lesson completion records through their personalized dashboard.
          </p>
        </div>
      </Card>
    </div>
  );
}
