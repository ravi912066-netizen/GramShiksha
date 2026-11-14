import React from "react";

export default function ProgressBar({
  value = 0, // 0 to 100
  showLabel = true,
  size = "md", // sm, md, lg
  color = "brand", // brand, rural, dynamic
  className = "",
}) {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getBarColor = () => {
    if (color === "dynamic") {
      if (clampedValue === 100) return "bg-emerald-500";
      if (clampedValue >= 50) return "bg-brand-600";
      return "bg-amber-500";
    }
    if (color === "rural") return "bg-rural-600";
    return "bg-brand-600";
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-900 font-bold">{clampedValue}%</span>
        </div>
      )}

      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${
          sizeClasses[size] || sizeClasses.md
        }`}
      >
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin="0"
          aria-valuemax="100"
          className={`${getBarColor()} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
