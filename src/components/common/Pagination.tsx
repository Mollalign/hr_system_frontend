"use client"
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const pages: number[] = [];

  // Show up to 5 pages centered around currentPage
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);

  const showEllipsisLeft = currentPage > 2;
  const showEllipsisRight = currentPage < totalPages - 1;

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Prev */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Left Ellipsis */}
      {showEllipsisLeft && <span className="px-1 text-gray-500">...</span>}

      {/* Pages */}
      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "default" : "ghost"}
          className={`rounded-full ${
            page === currentPage
              ? "bg-[#353535] text-white"
              : "text-gray-700 hover:bg-[#231942]/10"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Right Ellipsis */}
      {showEllipsisRight && <span className="px-1 text-gray-500">...</span>}

      {/* Next */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationComponent;
