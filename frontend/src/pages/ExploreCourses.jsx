import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, BookOpen, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import courseService from "../services/courseService";
import useAuth from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import CourseCard from "../components/courses/CourseCard";
import CourseFilter from "../components/courses/CourseFilter";
import CourseSkeleton from "../components/courses/CourseSkeleton";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";

export default function ExploreCourses() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  // Filters and pagination state
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  // Track enrolled course IDs for the logged-in student
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await courseService.getAllCourses({
        search,
        subject,
        page,
        limit: 9,
      });

      if (res?.success && res?.data) {
        setCourses(res.data.courses || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        throw new Error(res?.message || "Failed to load courses");
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not load courses from backend server."
      );
    } finally {
      setLoading(false);
    }
  }, [search, subject, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle enrollment directly from card
  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      toast.info("Please log in or register to enroll in courses.");
      navigate("/login", { state: { from: { pathname: `/courses/${courseId}` } } });
      return;
    }

    try {
      setEnrollingId(courseId);
      const res = await courseService.enrollInCourse(courseId);
      if (res?.success) {
        toast.success(res.message || "Successfully enrolled in course!");
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
        // Navigate directly to course learning page
        navigate(`/courses/${courseId}/learn`);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Enrollment failed. Please try again.";
      if (err?.response?.status === 409) {
        // Already enrolled
        toast.info("You are already enrolled in this course!");
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
        navigate(`/courses/${courseId}/learn`);
      } else {
        toast.error(msg);
      }
    } finally {
      setEnrollingId(null);
    }
  };

  // Distinct subjects for filter bar
  const availableSubjects = Array.from(
    new Set(courses.map((c) => c.subject).filter(Boolean))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Curriculum Directory
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            {pagination.total} Available {pagination.total === 1 ? "Course" : "Courses"}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Free Rural Courses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Select any course to study structured video lessons, reading notes, and reference materials prepared for rural students.
        </p>
      </div>

      {/* Search and Subject Filters */}
      <CourseFilter
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedSubject={subject}
        onSubjectChange={(sub) => {
          setSubject(sub);
          setPage(1);
        }}
        availableSubjects={availableSubjects}
      />

      {/* Error View */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Failed to Load Courses</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchCourses} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && <CourseSkeleton count={6} />}

      {/* Course Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourseIds.has(course.id)}
                onEnroll={handleEnroll}
                enrolling={enrollingId === course.id}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <p className="text-xs sm:text-sm text-slate-600">
                Showing page <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
                <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            search || subject
              ? "We couldn't find any courses matching your filters. Try clearing your search or subject selection."
              : "No courses are currently published. Check back soon!"
          }
          actionLabel={search || subject ? "Reset Filters" : undefined}
          onAction={() => {
            setSearch("");
            setSubject("");
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
