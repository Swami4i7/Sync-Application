"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState, parseAsInteger } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaginationControl({
  totalPages,
  pageCount,
}: Readonly<{
  totalPages: number;
  pageCount: number;
}>) {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: false })
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0).withOptions({ shallow: false })
  );

  const currentPage = Math.floor(offset / limit) + 1;
  const pageWindowSize = 5;

  // Calculate visible page range
  const currentWindow = Math.ceil(currentPage / pageWindowSize);
  const startPage = (currentWindow - 1) * pageWindowSize + 1;
  const endPage = Math.min(currentWindow * pageWindowSize, totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setOffset((newPage - 1) * limit);
    }
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex items-center justify-between px-4">
        <span className="text-sm dark:text-white whitespace-nowrap">
          Page {currentPage} of {totalPages} • Showing {pageCount} items
        </span>
        <Pagination className="flex-1 flex justify-center">
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                disabled={currentPage === 1}
                className="dark:text-white"
              />
            </PaginationItem>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={page === currentPage}
                className="dark:text-white"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className="dark:text-white"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

        <div>
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-[100px] dark:text-white">
              <SelectValue placeholder={`Show ${limit}`} />
            </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                Show {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </div>  
    </div>
  );
}
