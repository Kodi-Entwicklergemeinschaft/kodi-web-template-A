import React, { useMemo } from 'react';

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageWindow?: number;
};

// how many page numbers to show before/after current page
const PAGE_WINDOW = 1;

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  pageWindow = PAGE_WINDOW,
}: PaginationProps) => {
  const handlePageClick = (page: number) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const startPage = useMemo(
    () => Math.max(1, currentPage - pageWindow),
    [currentPage, pageWindow]
  );

  const endPage = useMemo(
    () => Math.min(totalPages, currentPage + pageWindow),
    [currentPage, pageWindow, totalPages]
  );

  const pages = useMemo(
    () =>
      Array.from({ length: endPage - startPage + 1 }, (_, k) => k + startPage),
    [startPage, endPage]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 w-full flex justify-center">
      <ShadcnPagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePrev}
              className={
                currentPage === 1 ? 'pointer-events-none cursor-pointer' : ''
              }
            />
          </PaginationItem>

          {/* Show first page if not in visible range */}
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageClick(1)}
                  className={
                    currentPage === 1
                      ? 'bg-primary text-primary-foreground'
                      : 'cursor-pointer'
                  }
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Main visible pages */}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageClick(page)}
                className={cn(
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'cursor-pointer'
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show ellipsis and last page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageClick(totalPages)}
                  className={cn(
                    currentPage === totalPages
                      ? 'bg-primary text-primary-foreground'
                      : 'cursor-pointer'
                  )}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={cn(
                currentPage === totalPages
                  ? 'pointer-events-none'
                  : 'cursor-pointer'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
};

export default Pagination;
