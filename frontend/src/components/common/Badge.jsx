import React from "react";

export default function Badge({
  children,
  variant = "brand", // brand, rural, gray, success, warning, danger
  size = "md", // sm, md
  className = "",
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  const variantClasses = {
    brand: "bg-brand-50 text-brand-700 border border-brand-200/60",
    rural: "bg-rural-50 text-rural-700 border border-rural-200/60",
    gray: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.brand}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
