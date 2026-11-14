import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, User, ArrowRight } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function CourseCard({
  course,
  isEnrolled = false,
  onEnroll,
  enrolling = false,
  showEnrollBtn = true,
}) {
  const {
    id,
    title,
    description,
    subject,
    createdBy,
    _count,
  } = course;

  const lessonsCount = _count?.lessons ?? course.lessons?.length ?? 0;
  const enrollmentsCount = _count?.enrollments ?? 0;
  const instructorName = createdBy?.name || "GramShiksha Instructor";

  return (
    <Card
      hoverable
      className="flex flex-col justify-between h-full border border-slate-200/90 hover:border-brand-300 transition-all"
    >
      <div className="space-y-3">
        {/* Header badges */}
        <div className="flex items-center justify-between">
          <Badge variant="brand" size="sm">
            {subject}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-brand-600 transition-colors">
          <Link to={`/courses/${id}`}>{title}</Link>
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
        {/* Meta row: Instructor and Enrollment count */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{instructorName}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{enrollmentsCount} {enrollmentsCount === 1 ? "student" : "students"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link to={`/courses/${id}`} className="flex-1">
            <Button variant="outline" size="sm" fullWidth>
              Course Details
            </Button>
          </Link>

          {showEnrollBtn && (
            <div className="flex-1">
              {isEnrolled ? (
                <Link to={`/courses/${id}/learn`}>
                  <Button variant="success" size="sm" fullWidth icon={ArrowRight}>
                    Learn Now
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  loading={enrolling}
                  onClick={() => onEnroll && onEnroll(id)}
                >
                  Enroll Free
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
