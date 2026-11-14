import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Compass,
  ArrowRight,
  PlayCircle,
  AlertCircle,
  RefreshCw,
  Award,
  Sparkles,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import userService from "../services/userService";
import StatCard from "../components/dashboard/StatCard";
import ProgressBar from "../components/dashboard/ProgressBar";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await userService.getDashboard();
      if (res?.success && res?.dashboard) {
        setDashboardData(res.dashboard);
      } else {
        throw new Error(res?.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not load dashboard statistics. Please ensure server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner
          size="lg"
          message="Loading your learning statistics and courses..."
          className="min-h-[400px]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Unable to Load Dashboard
          </h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={fetchDashboard}
            icon={RefreshCw}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {
    totalEnrolledCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    pendingLessons: 0,
    overallProgressPercentage: 0,
  };

  const enrolledCourses = dashboardData?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-rural-700 text-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <Badge variant="rural" size="sm" className="bg-white/20 text-white border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-rural-200" />
            Rural Student Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {user?.name || "Student"}!
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Welcome back to your GramShiksha dashboard. Keep up the great work learning and expanding your horizons today!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/courses">
            <Button
              variant="outline"
              size="md"
              icon={Compass}
              className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-sm"
            >
              Explore More Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={summary.totalEnrolledCourses}
          subtitle="Active learning subjects"
          icon={BookOpen}
          color="brand"
        />

        <StatCard
          title="Completed Lessons"
          value={summary.completedLessons}
          subtitle="Study milestones reached"
          icon={CheckCircle2}
          color="rural"
        />

        <StatCard
          title="Pending Lessons"
          value={summary.pendingLessons}
          subtitle="Remaining to complete"
          icon={Clock}
          color="amber"
        />

        <StatCard
          title="Overall Progress"
          value={`${summary.overallProgressPercentage}%`}
          subtitle="Total syllabus completion"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Overall Progress Section Bar */}
      <Card className="border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Curriculum Learning Progress
            </h2>
            <p className="text-xs text-slate-500">
              {summary.completedLessons} of {summary.totalLessons} total lessons finished across all your courses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={summary.overallProgressPercentage === 100 ? "success" : "brand"}
              size="md"
            >
              {summary.overallProgressPercentage}% Completed
            </Badge>
          </div>
        </div>

        <ProgressBar
          value={summary.overallProgressPercentage}
          showLabel={false}
          size="lg"
          color="dynamic"
        />
      </Card>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Continue Learning
            </h2>
            <p className="text-xs text-slate-500">
              Jump right back into your enrolled courses
            </p>
          </div>

          {enrolledCourses.length > 0 && (
            <Link
              to="/my-learning"
              className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All Enrolled <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="You haven't enrolled in any courses yet"
            description="Explore our free curriculum in Mathematics, Science, English, and Technology to start your learning journey."
            actionLabel="Browse Available Courses"
            actionIcon={Compass}
            onAction={() => navigate("/courses")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card
                key={course.courseId}
                hoverable
                className="flex flex-col justify-between h-full border border-slate-200 hover:border-brand-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm">
                      {course.subject}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.completedLessons}/{course.totalLessons} Lessons
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2">
                    <ProgressBar
                      value={course.progressPercentage}
                      showLabel={true}
                      size="sm"
                      color="dynamic"
                    />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate max-w-[140px]">
                    {course.instructor || "Instructor"}
                  </span>

                  <Link to={`/courses/${course.courseId}/learn`}>
                    <Button
                      variant={course.progressPercentage === 100 ? "success" : "primary"}
                      size="sm"
                      icon={PlayCircle}
                    >
                      {course.progressPercentage === 100 ? "Review" : "Continue"}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation and Educational Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Daily Study Recommendation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consistency is key to mastering new concepts. Spend 20 to 30 minutes every day reviewing video lessons and study notes.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-rural-50/50 to-emerald-50/50 border-rural-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rural-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Offline Learning Readiness
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                GramShiksha is built as a Progressive Web App (PWA). You can install it on your mobile device to view saved lesson materials even when connection drops.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
