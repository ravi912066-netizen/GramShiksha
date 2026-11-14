import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  AlertCircle,
  PlayCircle,
  ArrowLeft,
  RefreshCw,
  Lock,
} from "lucide-react";
import lessonService from "../services/lessonService";
import courseService from "../services/courseService";
import { useToast } from "../hooks/useToast";
import VideoPlayer from "../components/lessons/VideoPlayer";
import PdfViewer from "../components/lessons/PdfViewer";
import NoteViewer from "../components/lessons/NoteViewer";
import LessonSidebar from "../components/lessons/LessonSidebar";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function LessonPage() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [error, setError] = useState("");
  const [notEnrolled, setNotEnrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course metadata and protected lessons
  const fetchCurriculum = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setNotEnrolled(false);

      const [courseRes, lessonsRes] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getProtectedLessons(courseId),
      ]);

      if (courseRes?.course) {
        setCourse(courseRes.course);
      }

      const fetchedLessons = lessonsRes?.lessons || [];
      setLessons(fetchedLessons);

      if (fetchedLessons.length > 0) {
        // Select requested lesson or first incomplete or first lesson
        const paramLessonId = parseInt(searchParams.get("lesson"), 10);
        let selected = fetchedLessons.find((l) => l.id === paramLessonId);

        if (!selected) {
          selected = fetchedLessons.find((l) => !l.isCompleted) || fetchedLessons[0];
        }

        setCurrentLesson(selected);
      }
    } catch (err) {
      console.error("Lesson page fetch error:", err);
      if (err?.response?.status === 403) {
        setNotEnrolled(true);
      } else {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Could not load course lessons."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, searchParams]);

  useEffect(() => {
    if (courseId) {
      fetchCurriculum();
    }
  }, [courseId, fetchCurriculum]);

  // Handle lesson selection
  const handleSelectLesson = (lessonId) => {
    const found = lessons.find((l) => l.id === lessonId);
    if (found) {
      setCurrentLesson(found);
      setSearchParams({ lesson: lessonId.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Toggle lesson completion state with backend
  const handleToggleCompletion = async () => {
    if (!currentLesson) return;

    try {
      setUpdatingProgress(true);
      const newStatus = !currentLesson.isCompleted;

      const res = await lessonService.updateLessonProgress(
        currentLesson.id,
        newStatus
      );

      if (res?.success) {
        // Update local lesson state
        setLessons((prev) =>
          prev.map((l) =>
            l.id === currentLesson.id ? { ...l, isCompleted: newStatus } : l
          )
        );
        setCurrentLesson((prev) => ({ ...prev, isCompleted: newStatus }));

        if (newStatus) {
          toast.success("Lesson marked as completed!");
        } else {
          toast.info("Lesson marked as incomplete.");
        }
      }
    } catch (err) {
      console.error("Progress update error:", err);
      toast.error("Failed to update progress. Please check connection.");
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Handle enrollment if not enrolled yet
  const handleEnrollNow = async () => {
    try {
      const res = await courseService.enrollInCourse(courseId);
      if (res?.success) {
        toast.success("Enrolled successfully! Loading lessons...");
        fetchCurriculum();
      }
    } catch (err) {
      toast.error("Enrollment failed. Please try again.");
    }
  };

  // Previous and Next navigation
  const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <LoadingSpinner size="lg" message="Loading lesson classroom..." />
      </div>
    );
  }

  // Enrollment Required Guard Screen
  if (notEnrolled) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Enrollment Required
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You must be enrolled in this course to access protected video lectures, study PDFs, and notes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={`/courses/${courseId}`}>
              <Button variant="outline" size="md">
                Course Details
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={handleEnrollNow}
              icon={CheckCircle2}
            >
              Enroll Free Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error || !course) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Unable to Load Lesson</h2>
          <p className="text-sm text-slate-600">{error || "Lesson not found."}</p>
          <Button variant="primary" size="sm" onClick={fetchCurriculum} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      {/* Top Learning Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-16 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/my-learning"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider block">
              {course.subject}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-sm sm:max-w-md md:max-w-lg">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Mobile Sidebar Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Menu className="w-4 h-4" />
            <span>Lessons ({lessons.length})</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lesson Sidebar */}
        <LessonSidebar
          lessons={lessons}
          currentLessonId={currentLesson?.id}
          onSelectLesson={handleSelectLesson}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          courseTitle={course.title}
        />

        {/* Center Main Stage Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6 max-w-5xl">
          {currentLesson ? (
            <>
              {/* Lesson Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" size="sm">
                      {currentLesson.type} LESSON
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">
                      Lesson {currentIndex + 1} of {lessons.length}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {currentLesson.title}
                  </h2>
                </div>

                {/* Mark as Completed Button */}
                <div className="shrink-0">
                  <Button
                    variant={currentLesson.isCompleted ? "success" : "primary"}
                    size="md"
                    loading={updatingProgress}
                    onClick={handleToggleCompletion}
                    icon={CheckCircle2}
                  >
                    {currentLesson.isCompleted
                      ? "Completed (Click to Undo)"
                      : "Mark as Completed"}
                  </Button>
                </div>
              </div>

              {/* Lesson Media Viewer */}
              <div className="w-full">
                {currentLesson.type === "VIDEO" && (
                  <VideoPlayer
                    url={currentLesson.contentUrl}
                    title={currentLesson.title}
                  />
                )}

                {currentLesson.type === "PDF" && (
                  <PdfViewer
                    url={currentLesson.contentUrl}
                    title={currentLesson.title}
                  />
                )}

                {currentLesson.type === "NOTE" && (
                  <NoteViewer
                    contentUrl={currentLesson.contentUrl}
                    description={currentLesson.description}
                    title={currentLesson.title}
                  />
                )}
              </div>

              {/* Lesson Description & Notes (if video/pdf has description) */}
              {currentLesson.type !== "NOTE" && currentLesson.description && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Lesson Overview
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {currentLesson.description}
                  </p>
                </div>
              )}

              {/* Bottom Previous / Next Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div>
                  {prevLesson ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectLesson(prevLesson.id)}
                      icon={ChevronLeft}
                    >
                      <span className="hidden sm:inline">Previous:</span> {prevLesson.title}
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>

                <div>
                  {nextLesson && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectLesson(nextLesson.id)}
                    >
                      <span>
                        <span className="hidden sm:inline">Next:</span> {nextLesson.title}
                      </span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">
              No lessons available for this course yet.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
