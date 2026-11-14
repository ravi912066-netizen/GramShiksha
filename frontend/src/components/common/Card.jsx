import React from "react";

export default function Card({
  children,
  hoverable = false,
  className = "",
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card border border-slate-200/80 shadow-subtle p-5 sm:p-6
        ${hoverable ? "hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
