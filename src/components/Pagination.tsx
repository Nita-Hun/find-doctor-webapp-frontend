import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [inputPage, setInputPage] = useState<string>("");

  if (totalPages === 0) return null;

  const handleGoClick = () => {
    const pageNumber = Number(inputPage);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
      return;
    }
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
    setInputPage("");
  };

  return (
    <nav className="flex justify-center gap-2 py-4 items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 text-sm"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 text-sm"
      >
        Next
      </button>

      {/* Optional input + Go */}
      <div className="flex items-center gap-2 ml-4 text-sm">
        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder="Page #"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGoClick();
            }
          }}
          className="w-20 p-1 border border-gray-300 rounded"
        />
        <button
          onClick={handleGoClick}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          Go
        </button>
      </div>
    </nav>
  );
}
