import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, BookOpen, Sparkles, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ProgressBar from "./ProgressBar";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

const RecommendationIcons = {
  CONTINUE_LESSON: PlayCircle,
  COURSE: Sparkles,
};

const RecommendationLabels = {
  CONTINUE_LESSON: "Continue Lesson",
  COURSE: "New Course",
};

export default function RecommendedCourses({ recommendations = [], loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <Card className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
              <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-6 w-full bg-slate-200 rounded"></div>
          </div>
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-rose-50 border-rose-200">
        <div className="flex items-center justify-center gap-3 p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
            <span className="text-xl">⚠</span>
          </div>
          <div>
            <p className="text-sm font-medium text-rose-800">Unable to load recommendations</p>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="border-dashed border-slate-300">
        <EmptyState
          icon={Sparkles}
          title="No recommendations available yet"
          description="Enroll in courses and complete lessons to get personalized recommendations based on your learning activity."
          actionLabel="Explore Courses"
          actionIcon={BookOpen}
          onAction={() => window.location.href = "/courses"}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          <p className="text-xs text-slate-500">
            Personalized suggestions based on your learning journey
          </p>
        </div>
        <Badge variant="rural" size="sm">
          <Sparkles className="w-3.5 h-3.5" />
          Personalized
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          const Icon = RecommendationIcons[rec.type] || Sparkles;
          const label = RecommendationLabels[rec.type] || "Recommendation";
          const isLessonRec = rec.type === "CONTINUE_LESSON";

          return (
            <Card
              key={rec.courseId + "-" + (rec.lessonId || index)}
              hoverable
              className="flex flex-col justify-between h-full border border-slate-200 hover:border-brand-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    {rec.subject}
                  </Badge>
                  <Badge variant="rural" size="sm" className="bg-rural-50 text-rural-700 border-rural-200/60">
                    <Icon className="w-3 h-3" />
                    {label}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                  <Link to={`/courses/${rec.courseId}`} className="hover:text-brand-600 transition-colors">
                    {rec.courseTitle}
                  </Link>
                </h3>

                {isLessonRec && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 px-2 py-1.5 rounded-lg">
                    <PlayCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium">{rec.lessonTitle}</span>
                    <span className="text-slate-400">•</span>
                    <span>Continue from {rec.progress}% completed</span>
                  </div>
                )}

                {!isLessonRec && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    Start learning this {rec.subject.toLowerCase()} course
                  </p>
                )}

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                    {rec.reason}
                  </span>
                  {isLessonRec && rec.progress > 0 && (
                    <div className="flex-1">
                      <ProgressBar value={rec.progress} showLabel={false} size="sm" color="dynamic" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                {isLessonRec ? (
                  <Link to={`/courses/${rec.courseId}/learn`}>
                    <Button variant="primary" size="sm" fullWidth icon={PlayCircle}>
                      Continue Lesson
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to={`/courses/${rec.courseId}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        View Course
                      </Button>
                    </Link>
                    <Link to={`/courses/${rec.courseId}/learn`}>
                      <Button variant="primary" size="sm" fullWidth icon={ArrowRight}>
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}