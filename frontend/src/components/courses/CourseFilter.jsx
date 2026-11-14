import React from "react";
import { Search, X, Filter } from "lucide-react";

export default function CourseFilter({
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  availableSubjects = [],
}) {
  const defaultSubjects = [
    "ALL",
    "Mathematics",
    "Science",
    "Technology",
    "English",
    "Social Science",
  ];

  // Merge default subjects with any dynamic subjects found from backend courses
  const subjects = Array.from(
    new Set(["ALL", ...defaultSubjects.slice(1), ...availableSubjects.filter(Boolean)])
  );

  return (
    <div className="bg-white rounded-card border border-slate-200/90 shadow-subtle p-4 sm:p-5 space-y-4">
      {/* Search Input Row */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses by title or topic..."
          className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3" />
          Subject:
        </span>

        {subjects.map((sub) => {
          const isSelected =
            sub === "ALL"
              ? !selectedSubject || selectedSubject === "ALL"
              : selectedSubject?.toLowerCase() === sub.toLowerCase();

          return (
            <button
              key={sub}
              type="button"
              onClick={() => onSubjectChange(sub === "ALL" ? "" : sub)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors
                ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }
              `}
            >
              {sub === "ALL" ? "All Subjects" : sub}
            </button>
          );
        })}
      </div>
    </div>
  );
}
