import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "md", // sm, md, lg, xl
  message = "Loading...",
  fullScreen = false,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <Loader2
        className={`${sizeClasses[size] || sizeClasses.md} text-brand-600 animate-spin`}
      />
      {message && (
        <p className="text-sm text-slate-500 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
