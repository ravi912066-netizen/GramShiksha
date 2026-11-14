import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Users,
  Video,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Sparkles,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import courseService from "../services/courseService";
import useAuth from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseRes, enrollStatusRes] = await Promise.all([
        courseService.getCourseById(id),
        isAuthenticated
          ? courseService.getEnrollmentStatus(id).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (courseRes?.success && courseRes?.course) {
        setCourse(courseRes.course);
      } else {
        throw new Error(courseRes?.message || "Course not found");
      }

      if (enrollStatusRes?.isEnrolled) {
        setIsEnrolled(true);
      }
    } catch (err) {
      console.error("Course fetch error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not load course details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in or register to enroll in courses.");
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      const res = await courseService.enrollInCourse(id);
      if (res?.success) {
        setIsEnrolled(true);
        toast.success(res.message || "Successfully enrolled in this course!");
        navigate(`/courses/${id}/learn`);
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setIsEnrolled(true);
        toast.info("You are already enrolled!");
        navigate(`/courses/${id}/learn`);
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Enrollment failed. Please try again.";
        toast.error(msg);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const getLessonTypeIcon = (type) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4 text-blue-600" />;
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "NOTE":
      default:
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <LoadingSpinner size="lg" message="Loading course curriculum..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Course Unavailable</h2>
          <p className="text-sm text-slate-600">{error || "Course could not be found."}</p>
          <div className="flex justify-center gap-3">
            <Link to="/courses">
              <Button variant="outline" size="sm">
                Back to Courses
              </Button>
            </Link>
            <Button variant="primary" size="sm" onClick={fetchCourseData} icon={RefreshCw}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const enrollmentsCount = course._count?.enrollments ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to All Courses
      </Link>

      {/* Hero Overview Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Main Info */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="md">
              {course.subject}
            </Badge>
            <Badge variant="rural" size="sm">
              <Sparkles className="w-3 h-3 text-rural-600" />
              Free Access
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                Instructor: <strong className="text-slate-700">{course.createdBy?.name || "GramShiksha Faculty"}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{enrollmentsCount} {enrollmentsCount === 1 ? "Learner Enrolled" : "Learners Enrolled"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Action Card */}
        <div className="lg:col-span-4">
          <Card className="border-2 border-brand-100 shadow-card p-6 space-y-5 sticky top-24">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrollment Tier
              </span>
              <div className="text-3xl font-black text-slate-900">
                100% Free
              </div>
              <p className="text-xs text-rural-600 font-medium">
                No charges or subscriptions required
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full access to video lectures and notes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Personalized lesson progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mobile & offline PWA friendly</span>
              </div>
            </div>

            <div className="pt-2">
              {isEnrolled ? (
                <Link to={`/courses/${id}/learn`}>
                  <Button variant="success" size="lg" fullWidth icon={PlayCircle}>
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={enrolling}
                  onClick={handleEnroll}
                  icon={ArrowRight}
                >
                  Enroll in Course
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Curriculum Outline Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Curriculum Syllabus
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lessons.length} lessons designed in sequential learning order.
          </p>
        </div>

        {lessons.length === 0 ? (
          <Card className="text-center py-10 text-slate-500 text-sm">
            No lessons have been published for this course yet.
          </Card>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <Card
                key={lesson.id}
                className="flex items-start sm:items-center justify-between gap-4 p-4 hover:border-brand-200 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                    {idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getLessonTypeIcon(lesson.type)}
                      <h3 className="text-sm font-bold text-slate-900">
                        {lesson.title}
                      </h3>
                      <Badge variant="gray" size="sm">
                        {lesson.type}
                      </Badge>
                    </div>

                    {lesson.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </div>

                {isEnrolled ? (
                  <Link to={`/courses/${id}/learn?lesson=${lesson.id}`}>
                    <Button variant="ghost" size="sm" icon={PlayCircle}>
                      Start
                    </Button>
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 font-medium shrink-0">
                    Enroll to view
                  </span>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
