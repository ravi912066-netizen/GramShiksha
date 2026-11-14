import React from "react";
import { FileText, Download, ExternalLink, AlertCircle } from "lucide-react";
import Button from "../common/Button";

export default function PdfViewer({ url, title }) {
  if (!url || !url.trim()) {
    return (
      <div className="min-h-[400px] w-full rounded-2xl bg-slate-100 text-slate-500 flex flex-col items-center justify-center p-8 text-center space-y-3 border border-dashed border-slate-300">
        <FileText className="w-12 h-12 text-slate-400" />
        <p className="text-sm font-medium">No PDF document attached to this lesson.</p>
        <p className="text-xs text-slate-400">The study material will be updated soon.</p>
      </div>
    );
  }

  const cleanUrl = url.trim();

  return (
    <div className="w-full space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-100 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
            PDF
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {title || "Study Material"}
            </h4>
            <span className="text-[11px] text-slate-500">Document Reader</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none"
          >
            <Button variant="outline" size="sm" icon={ExternalLink} fullWidth>
              Open in New Window
            </Button>
          </a>
        </div>
      </div>

      {/* Embedded PDF iframe */}
      <div className="w-full h-[650px] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-card">
        <iframe
          src={`${cleanUrl}#toolbar=1&navpanes=0`}
          title={title || "PDF Document Viewer"}
          className="w-full h-full border-0"
        >
          <div className="p-8 text-center text-sm text-slate-500">
            Your browser does not support embedded PDF frames.{" "}
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 font-semibold underline"
            >
              Click here to download or open the PDF.
            </a>
          </div>
        </iframe>
      </div>
    </div>
  );
}
