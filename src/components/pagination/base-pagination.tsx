'use client';

import type React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import ItemPagination from './item-pagination';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type BasePaginationProps = {
  pages: number;
  changeData: (i: number) => void;
  currentPage?: number;
  className?: string;
};

export default function BasePagination({
  pages,
  changeData,
  currentPage = 1,
  className,
}: BasePaginationProps) {
  const [page, setPage] = useState<number>(currentPage);

  const calculateThresholds = useCallback(
    (current: number) => {
      const low = Math.max(current - 2, 1);
      const up = Math.min(current + 2, pages);
      return { lower: low, upper: up };
    },
    [pages]
  );

  const [thresholds, setThresholds] = useState<{ lower: number; upper: number }>(
    calculateThresholds(currentPage)
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      changeData(newPage);
      setThresholds(calculateThresholds(newPage));
    },
    [changeData, calculateThresholds]
  );

  const handlePrevious = useCallback(() => {
    const prevPage = page - 1 === 0 ? pages : page - 1;
    handleChangePage(prevPage);
  }, [page, pages, handleChangePage]);

  const handleNext = useCallback(() => {
    const nextPage = page + 1 > pages ? 1 : page + 1;
    handleChangePage(nextPage);
  }, [page, pages, handleChangePage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    },
    [handlePrevious, handleNext]
  );

  useEffect(() => {
    setPage(currentPage);
    setThresholds(calculateThresholds(currentPage));
  }, [currentPage, pages, calculateThresholds]);

  if (pages <= 0) return null;

  if (pages <= 3) {
    return (
      <Pagination className={cn('p-2', className)}>
        <PaginationContent>
          <ItemPagination
            index={page - 1 === 0 ? pages : page - 1}
            onClick={handlePrevious}
            aria-label='Go to previous page'
          >
            <ChevronLeft className='h-4 w-4' />
          </ItemPagination>

          {Array.from({ length: pages }, (_, i) => (
            <ItemPagination
              key={i + 1}
              index={i + 1}
              onClick={handleChangePage}
              active={page === i + 1}
              aria-label={`Page ${i + 1}`}
              aria-current={page === i + 1 ? 'page' : undefined}
            />
          ))}

          <ItemPagination
            index={page + 1 > pages ? 1 : page + 1}
            onClick={handleNext}
            aria-label='Go to next page'
          >
            <ChevronRight className='h-4 w-4' />
          </ItemPagination>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Pagination className={cn('p-2', className)} onKeyDown={handleKeyDown} tabIndex={0}>
      <PaginationContent className='flex-wrap gap-1'>
        <ItemPagination
          index={page - 1 === 0 ? pages : page - 1}
          onClick={handlePrevious}
          aria-label='Go to previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </ItemPagination>

        <ItemPagination
          index={1}
          onClick={handleChangePage}
          active={page === 1}
          aria-label='Page 1'
          aria-current={page === 1 ? 'page' : undefined}
        />

        {thresholds.lower > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {Array.from({ length: pages }, (_, i) => {
          const pageIndex = i + 1;

          if (pageIndex === 1 || pageIndex === pages) return null;

          if (pageIndex >= thresholds.lower && pageIndex <= thresholds.upper) {
            return (
              <ItemPagination
                key={pageIndex}
                index={pageIndex}
                onClick={handleChangePage}
                active={page === pageIndex}
                aria-label={`Page ${pageIndex}`}
                aria-current={page === pageIndex ? 'page' : undefined}
              />
            );
          }

          return null;
        })}

        {thresholds.upper < pages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages > 1 && (
          <ItemPagination
            index={pages}
            onClick={handleChangePage}
            active={page === pages}
            aria-label={`Page ${pages}`}
            aria-current={page === pages ? 'page' : undefined}
          />
        )}

        <ItemPagination
          index={page + 1 > pages ? 1 : page + 1}
          onClick={handleNext}
          aria-label='Go to next page'
        >
          <ChevronRight className='h-4 w-4' />
        </ItemPagination>
      </PaginationContent>
    </Pagination>
  );
}
