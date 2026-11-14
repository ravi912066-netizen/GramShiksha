import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import Button from "../common/Button";

export default function NoteViewer({ contentUrl, description, title }) {
  const isUrl =
    contentUrl &&
    (contentUrl.startsWith("http://") || contentUrl.startsWith("https://"));

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-10 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-semibold text-rural-600 uppercase tracking-wider">
          Study Reading Note
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          {title}
        </h2>
      </div>

      {/* Main note body */}
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
        {description ? (
          <div className="whitespace-pre-line text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
            {description}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No detailed summary note provided for this lesson. Please refer to the study reference below.
          </p>
        )}

        {/* If contentUrl is a reference link */}
        {isUrl && (
          <div className="pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Additional Learning Material
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    External study guide provided for this topic
                  </p>
                </div>
              </div>

              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" icon={ExternalLink}>
                  Open Resource Link
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* If contentUrl contains raw text rather than a web link */}
        {contentUrl && !isUrl && (
          <div className="pt-4 mt-4 border-t border-slate-100 p-4 rounded-xl bg-slate-50 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap">
            {contentUrl}
          </div>
        )}
      </div>
    </div>
  );
}
