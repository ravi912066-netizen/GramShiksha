import React from "react";
import {
  CheckCircle2,
  Circle,
  Video,
  FileText,
  BookOpen,
  X,
  ChevronRight,
} from "lucide-react";
import Badge from "../common/Badge";
import ProgressBar from "../dashboard/ProgressBar";

export default function LessonSidebar({
  lessons = [],
  currentLessonId,
  onSelectLesson,
  isOpen = false,
  onClose,
  courseTitle = "Course Lessons",
}) {
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const totalCount = lessons.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getTypeIcon = (type) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-3.5 h-3.5 text-blue-500" />;
      case "PDF":
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case "NOTE":
      default:
        return <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Course Curriculum
          </h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <ProgressBar
          value={progressPercent}
          showLabel={true}
          size="sm"
          color="dynamic"
        />

        <p className="text-[11px] text-slate-500 font-medium">
          {completedCount} of {totalCount} lessons completed
        </p>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === currentLessonId;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => {
                onSelectLesson(lesson.id);
                if (onClose) onClose();
              }}
              className={`
                w-full text-left p-3 rounded-xl transition-all flex items-start gap-3
                ${
                  isActive
                    ? "bg-brand-50/90 text-brand-900 font-bold border border-brand-200/80 shadow-xs"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              {/* Checkmark or Index */}
              <div className="mt-0.5 shrink-0">
                {lesson.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </div>

              {/* Title & Type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs">
                  {getTypeIcon(lesson.type)}
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Lesson {idx + 1}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium truncate mt-0.5">
                  {lesson.title}
                </p>
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-brand-600 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-xs">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
