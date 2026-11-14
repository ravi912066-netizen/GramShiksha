import React from "react";
import Card from "../common/Card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "brand", // brand, rural, amber, purple
  className = "",
}) {
  const colorSchemes = {
    brand: "text-brand-600 bg-brand-50 border-brand-100",
    rural: "text-rural-600 bg-rural-50 border-rural-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };

  return (
    <Card className={`border border-slate-200/80 shadow-xs hover:shadow-card transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
              colorSchemes[color] || colorSchemes.brand
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
