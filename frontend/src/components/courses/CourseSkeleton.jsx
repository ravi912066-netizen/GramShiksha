import React from "react";
import Card from "../common/Card";

export default function CourseSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse space-y-4 p-6 border-slate-200">
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-100 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-100 rounded"></div>
            <div className="h-3.5 w-5/6 bg-slate-100 rounded"></div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}
