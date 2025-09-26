// components/TableSkeleton.tsx
"use client";
import React from "react";
// If you have a Skeleton component (shadcn/ui), use it.
// Otherwise the component falls back to simple div placeholders.
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
  shimmer?: boolean; // use animate-pulse if true
}

const PlaceholderCell: React.FC<{ width?: string; height?: string; shimmer?: boolean; className?: string }> = ({
  width = "w-full",
  height = "h-4",
  shimmer = true,
  className = "",
}) => {
  // Use Skeleton component if available
  if (typeof Skeleton !== "undefined") {
    return <Skeleton className={`${width} ${height} ${className}`} />;
  }

  return <div className={`${width} ${height} bg-gray-200 rounded ${shimmer ? "animate-pulse" : ""} ${className}`} />;
};

export default function TableSkeleton({
  rows = 6,
  cols = 5,
  compact = false,
  showHeader = true,
  className = "",
  shimmer = true,
}: TableSkeletonProps) {
  const rowHeight = compact ? "h-8" : "h-12";
  const cellPadding = compact ? "py-2" : "py-3";

  // create an array of columns to render placeholder widths
  const colWidths = Array.from({ length: cols }).map((_, i) => {
    // Give first column more width (for name/avatar), last column smaller (actions)
    if (i === 0) return "w-2/5";
    if (i === cols - 1) return "w-1/6";
    return `${Math.floor(100 / cols)}%`;
  });

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="min-w-[720px]">
        {showHeader && (
          <div className={`hidden md:grid grid-cols-${cols} gap-4 px-4 ${cellPadding} mb-2`}>
            {/* header placeholders */}
            {colWidths.map((w, i) => (
              <div key={i} className="px-2">
                <PlaceholderCell width={w} height="h-4" shimmer={shimmer} />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {Array.from({ length: rows }).map((_, r) => (
            <div
              key={r}
              className={`flex items-center gap-4 px-4 ${cellPadding} bg-white rounded-lg shadow-sm border border-transparent`}
            >
              {/* first cell: avatar + two lines */}
              <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                <div className={`rounded-full ${rowHeight} ${rowHeight} bg-transparent overflow-hidden`}>
                  <PlaceholderCell width="w-10" height={compact ? "h-8" : "h-10"} shimmer={shimmer} className="rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <PlaceholderCell width="w-2/3" height={compact ? "h-3" : "h-4"} shimmer={shimmer} className="mb-2" />
                  <PlaceholderCell width="w-1/2" height={compact ? "h-2" : "h-3"} shimmer={shimmer} />
                </div>
              </div>

              {/* remaining columns: simple lines */}
              <div className="hidden md:flex items-center gap-4 flex-1">
                {colWidths.slice(1).map((w, i) => (
                  <div key={i} className="flex-1 min-w-0 px-2">
                    <PlaceholderCell width="w-full" height={rowHeight} shimmer={shimmer} />
                  </div>
                ))}
              </div>

              {/* actions / small column on right (visible on all sizes) */}
              <div className="flex items-center gap-2">
                <PlaceholderCell width={compact ? "w-12" : "w-16"} height={compact ? "h-6" : "h-8"} shimmer={shimmer} className="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
