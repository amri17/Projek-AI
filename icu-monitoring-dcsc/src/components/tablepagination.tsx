"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Pagination } from "@/lib/api";

type TablePaginationProps = {
  pagination: Pagination;
  basePath: string;
};

function pageHref(basePath: string, page: number, limit: number) {
  return `${basePath}?page=${page}&limit=${limit}`;
}

export default function TablePagination({
  pagination,
  basePath,
}: TablePaginationProps) {
  const router = useRouter();
  const totalPages = Math.max(pagination.total_pages, 1);
  const currentPage = Math.min(Math.max(pagination.page, 1), totalPages);
  const firstItem =
    pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const lastItem = Math.min(currentPage * pagination.limit, pagination.total);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const pageSizeOptions = [5, 10, 20, 50, 100];

  function handleLimitChange(event: ChangeEvent<HTMLSelectElement>) {
    router.push(pageHref(basePath, 1, Number(event.target.value)));
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {firstItem}-{lastItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {pagination.total}
          </span>{" "}
          records
        </p>

        <label className="flex items-center gap-2 text-slate-600">
          <span>Rows per page</span>
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        {canGoPrevious ? (
          <Link
            href={pageHref(basePath, currentPage - 1, pagination.limit)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700 shadow-sm transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-300">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}

        <span className="inline-flex h-9 min-w-28 items-center justify-center rounded-lg bg-slate-900 px-3 font-semibold text-white">
          {currentPage} / {totalPages}
        </span>

        {canGoNext ? (
          <Link
            href={pageHref(basePath, currentPage + 1, pagination.limit)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700 shadow-sm transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-300">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
