export default function getPageNumbers(
  currentPage: number,
  totalPages: number,
): number[] {
  const pageNumbers: number[] = [];

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
}
