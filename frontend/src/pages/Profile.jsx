import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import userService from "../services/userService";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ProgressBar from "../components/dashboard/ProgressBar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Profile() {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileRes, progressRes] = await Promise.all([
        userService.getProfile().catch((e) => ({ user: authUser })),
        userService.getUserOverallProgress().catch((e) => null),
      ]);

      if (profileRes?.user) {
        setProfile(profileRes.user);
      } else {
        setProfile(authUser);
      }

      if (progressRes?.summary) {
        setProgressSummary({
          summary: progressRes.summary,
          courses: progressRes.courses || [],
        });
      }
    } catch (err) {
      console.error("Profile load error:", err);
      setError("Unable to load complete profile data. Showing cached user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const user = profile || authUser;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner size="lg" message="Loading your student profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <Card className="border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-rural-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0 uppercase">
            {user?.name ? user.name.charAt(0) : "S"}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <Badge variant={user?.role === "ADMIN" ? "brand" : "rural"} size="sm">
                <Shield className="w-3 h-3" />
                {user?.role === "ADMIN" ? "Administrator" : "Student Learner"}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user?.email}</span>
            </p>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined GramShiksha on {formatDate(user?.createdAt)}</span>
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/courses">
              <Button variant="outline" size="sm" icon={BookOpen}>
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Learning Progress Summary */}
      {progressSummary?.summary && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Academic Progress Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-black text-brand-600">
                {progressSummary.summary.totalCourses}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Enrolled Courses
              </div>
            </Card>

            <Card className="text-center p-4">
              <div className="text-2xl font-black text-rural-600">
                {progressSummary.summary.completedLessons}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Completed Lessons
              </div>
            </Card>

            <Card className="text-center p-4">
              <div className="text-2xl font-black text-slate-700">
                {progressSummary.summary.totalLessons}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Total Syllabus Lessons
              </div>
            </Card>

            <Card className="text-center p-4">
              <div className="text-2xl font-black text-indigo-600">
                {progressSummary.summary.overallPercentage}%
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Overall Syllabus Mastered
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Detailed Course Breakdown */}
      {progressSummary?.courses && progressSummary.courses.length > 0 && (
        <Card className="border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Enrolled Course Breakdown
          </h2>

          <div className="space-y-4 divide-y divide-slate-100">
            {progressSummary.courses.map((course) => (
              <div key={course.courseId} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {course.courseTitle}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {course.subject} • {course.completedLessons}/{course.totalLessons} lessons completed
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course.courseId}/learn`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Open Course <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <ProgressBar
                  value={course.completionPercentage}
                  showLabel={false}
                  size="sm"
                  color="dynamic"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Account Security Notice */}
      <Card className="bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">
              GramShiksha Privacy & Student Protection:
            </span>{" "}
            Your learning activity and registration credentials are strictly encrypted and confidential.
            No password hashes or sensitive personal records are ever displayed or shared publicly.
          </div>
        </div>
      </Card>
    </div>
  );
}
