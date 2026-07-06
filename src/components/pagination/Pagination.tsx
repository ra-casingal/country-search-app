import getPageNumbers from "../../utils/get-page-numbers/getPageNumbers";
import BouncingCirclesSvgIcon from "../../utils/get-converted-bouncing-circle-svg/get-converted-bouncing-circle-svg";

export default function Pagination({
  page,
  setPage,
  totalPage,
  loading,
  setSearchParams,
}: {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  totalPage: number;
  loading: boolean;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
}) {
  const currentPage = parseInt(page);
  const totalPages = Math.ceil(totalPage / 10); // Assuming 10 items per page
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const inputBoxStyle =
    "p-2.5 rounded-md border-black border-2 hover:bg-blue-700 hover:text-white transition-colors duration-300";

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  return (
    <div className="p-5 max-w-xs flex flex-row gap-2 justify-center items-center">
      {currentPage > 3 && (
        <button
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle
          }
          onClick={() => handlePageChange(1)}
          disabled={loading}
        >
          First
        </button>
      )}
      {currentPage > 1 && (
        <button
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle
          }
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading}
        >
          Previous
        </button>
      )}
      {currentPage > 1 && (
        <button
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle
          }
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading}
        >
          Previous
        </button>
      )}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle +
                (pageNumber === currentPage
                  ? " bg-blue-500 text-white"
                  : " hover:bg-blue-700 hover:text-white transition-colors duration-300")
          }
          disabled={pageNumber === currentPage || loading}
          onClick={() => handlePageChange(pageNumber)}
        >
          {loading && pageNumber === currentPage ? (
            <BouncingCirclesSvgIcon />
          ) : (
            pageNumber
          )}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle
          }
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading}
        >
          Next
        </button>
      )}
      {currentPage < totalPages - 2 && (
        <button
          className={
            loading
              ? inputBoxStyle + " opacity-50 cursor-not-allowed"
              : inputBoxStyle
          }
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
        >
          Last
        </button>
      )}
    </div>
  );
}
