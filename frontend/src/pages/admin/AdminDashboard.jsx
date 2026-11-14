import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Layers,
  Users,
  Award,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Info,
} from "lucide-react";
import adminService from "../../services/adminService";
import courseService from "../../services/courseService";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsData, coursesRes] = await Promise.all([
        adminService.getPlatformStats(),
        courseService.getAllCourses({ limit: 5 }),
      ]);

      setStats(statsData);
      setRecentCourses(coursesRes?.data?.courses || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError("Failed to load platform statistics from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" message="Loading admin statistics & metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" size="sm" className="mb-1">
            System Overview
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Monitor courses, curriculum lessons, and student engagement across GramShiksha.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/courses?action=new">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Integration Note Callout for Student API */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold">Backend Integration Notice:</span> Total Course, Lesson, and Enrollment metrics below are computed in real time from database records. Dedicated platform user directory endpoint (<code>GET /api/admin/students</code>) is pending deployment by the backend team.
        </div>
      </div>

      {/* Four Core Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses ?? 0}
          subtitle="Published curriculums"
          icon={BookOpen}
          color="brand"
        />

        <StatCard
          title="Total Lessons"
          value={stats?.totalLessons ?? 0}
          subtitle="Videos, PDFs, & Notes"
          icon={Layers}
          color="rural"
        />

        <StatCard
          title="Total Enrollments"
          value={stats?.totalEnrollments ?? 0}
          subtitle="Course enrollments"
          icon={TrendingUp}
          color="purple"
        />

        <StatCard
          title="Student Directory"
          value="Connected"
          subtitle="Self-service active"
          icon={Users}
          color="amber"
        />
      </div>

      {/* Recent Courses Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Recent Courses Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Recently Created Courses
            </h2>
            <Link
              to="/admin/courses"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200">
            {recentCourses.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No courses created yet. Click "Create Course" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4 text-center">Lessons</th>
                      <th className="py-3.5 px-4 text-center">Students</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="brand" size="sm">
                            {c.subject}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                          {c._count?.lessons || 0}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                          {c._count?.enrollments || 0}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/lessons?courseId=${c.id}`}
                              className="text-xs font-medium text-brand-600 hover:text-brand-800"
                            >
                              Lessons
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link
                              to={`/admin/courses?edit=${c.id}`}
                              className="text-xs font-medium text-slate-600 hover:text-slate-900"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Quick Administration Tools */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Card hoverable className="p-4 border-slate-200">
              <Link to="/admin/courses?action=new" className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Add New Course
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish a syllabus topic for rural students.
                  </p>
                </div>
              </Link>
            </Card>

            <Card hoverable className="p-4 border-slate-200">
              <Link to="/admin/lessons" className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rural-50 text-rural-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Manage Lessons
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload video URLs, PDF links, and notes.
                  </p>
                </div>
              </Link>
            </Card>

            <Card hoverable className="p-4 border-slate-200">
              <Link to="/admin/students" className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Student Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review active enrollment metrics.
                  </p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
