import { useState, useCallback } from "react";

export interface UsePaginationProps {
  initialPage?: number;
  initialPerPage?: number;
}

export interface UsePaginationReturn {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: (lastPage: number) => void;
  canGoNext: (lastPage: number) => boolean;
  canGoPrev: boolean;
  reset: () => void;
}

export function usePagination({ initialPage = 1, initialPerPage = 10 }: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback((lastPage: number) => {
    setPage(lastPage);
  }, []);

  const canGoNext = useCallback(
    (lastPage: number) => {
      return page < lastPage;
    },
    [page]
  );

  const canGoPrev = page > 1;

  const reset = useCallback(() => {
    setPage(initialPage);
    setPerPage(initialPerPage);
  }, [initialPage, initialPerPage]);

  const handleSetPerPage = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  return {
    page,
    perPage,
    setPage,
    setPerPage: handleSetPerPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrev,
    reset,
  };
}
