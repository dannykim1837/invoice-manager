import { useState, useEffect } from 'react';

export function usePaginationList(list, itemsPerPage, searchKeyword, filterFn) {
  const [currentPage, setCurrentPage] = useState(1);

  // 검색/필터
  const filteredList = list
    .slice()
    .sort((a, b) => new Date(b.date || b.due_date) - new Date(a.date || a.due_date))
    .filter(filterFn);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pagedList = filteredList.slice(startIdx, endIdx);

  // 검색어 바뀌면 페이지 1로
  useEffect(() => { setCurrentPage(1); }, [searchKeyword]);

  return { pagedList, totalPages, currentPage, setCurrentPage, filteredList };
}
