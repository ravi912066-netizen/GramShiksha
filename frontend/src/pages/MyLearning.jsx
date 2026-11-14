import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Clock,
  Compass,
  Search,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import userService from "../services/userService";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ProgressBar from "../components/dashboard/ProgressBar";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function MyLearning() {
  const navigate = useNavigate();

  const [enrolledList, setEnrolledList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, IN_PROGRESS, COMPLETED

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch progress and dashboard data to get comprehensive enrollment progress
      const [progressRes, dashboardRes] = await Promise.all([
        userService.getUserOverallProgress().catch(() => null),
        userService.getDashboard().catch(() => null),
      ]);

      let courses = [];

      if (dashboardRes?.dashboard?.enrolledCourses) {
        courses = dashboardRes.dashboard.enrolledCourses;
      } else if (progressRes?.courses) {
        courses = progressRes.courses.map((c) => ({
          courseId: c.courseId,
          title: c.courseTitle,
          description: "",
          subject: c.subject,
          totalLessons: c.totalLessons,
          completedLessons: c.completedLessons,
          progressPercentage: c.completionPercentage,
        }));
      }

      setEnrolledList(courses);
    } catch (err) {
      console.error("MyLearning fetch error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not load your enrolled courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, []);

  // Filter courses by search and active tab
  const filteredCourses = enrolledList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.subject?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "COMPLETED") {
      return course.progressPercentage === 100;
    }
    if (activeTab === "IN_PROGRESS") {
      return course.progressPercentage < 100;
    }
    return true;
  });

  const completedCount = enrolledList.filter((c) => c.progressPercentage === 100).length;
  const inProgressCount = enrolledList.filter((c) => c.progressPercentage < 100).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              My Student Workspace
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Learning
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Continue studying your enrolled courses and track your lesson progress.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="outline" size="sm" icon={Compass}>
            Explore More Courses
          </Button>
        </Link>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "ALL"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Courses ({enrolledList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "IN_PROGRESS"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            In Progress ({inProgressCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "COMPLETED"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enrolled courses..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingSpinner
          size="lg"
          message="Loading your enrolled courses..."
          className="min-h-[300px]"
        />
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Failed to Load Learning Records
          </h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchLearningData} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State: Never enrolled */}
      {!loading && !error && enrolledList.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="You haven't enrolled in any courses yet"
          description="Browse our free catalogue of courses in Mathematics, Science, and Digital Literacy to get started."
          actionLabel="Explore Free Courses"
          actionIcon={Compass}
          onAction={() => navigate("/courses")}
        />
      )}

      {/* Empty State: Filter mismatch */}
      {!loading && !error && enrolledList.length > 0 && filteredCourses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No courses match your filter"
          description="Try selecting a different status tab or clearing your search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setActiveTab("ALL");
          }}
        />
      )}

      {/* Enrolled Courses Grid */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isFinished = course.progressPercentage === 100;

            return (
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
                    <Badge variant={isFinished ? "success" : "rural"} size="sm">
                      {isFinished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-rural-600" />
                          In Progress
                        </>
                      )}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    <Link to={`/courses/${course.courseId}/learn`} className="hover:text-brand-600 transition-colors">
                      {course.title}
                    </Link>
                  </h3>

                  {course.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  <div className="pt-2">
                    <ProgressBar
                      value={course.progressPercentage}
                      showLabel={true}
                      size="sm"
                      color="dynamic"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
                      <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                      <span>{course.pendingLessons ?? Math.max(0, course.totalLessons - course.completedLessons)} pending</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate max-w-[140px]">
                    {course.instructor || "GramShiksha"}
                  </span>

                  <Link to={`/courses/${course.courseId}/learn`}>
                    <Button
                      variant={isFinished ? "outline" : "primary"}
                      size="sm"
                      icon={PlayCircle}
                    >
                      {isFinished ? "Review Course" : "Continue Learning"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
