import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export default function Toast({ id, type = "info", message, onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
    error: "border-rose-200 bg-rose-50/90 text-rose-900",
    warning: "border-amber-200 bg-amber-50/90 text-amber-900",
    info: "border-brand-200 bg-brand-50/90 text-brand-900",
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-card backdrop-blur-xs
        max-w-md w-full transition-all duration-300 animate-in slide-in-from-top-2
        ${borders[type] || borders.info}
      `}
    >
      {icons[type] || icons.info}
      <div className="flex-1 text-sm font-medium leading-snug">
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={() => onClose(id)}
          className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 rounded-md"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
