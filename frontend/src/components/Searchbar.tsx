"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useState } from "react";

interface ColumnOption {
  accessorKey: string;
  header: string;
}

interface SearchBarProps {
  columns: ColumnOption[];
}

const SearchBar: React.FC<SearchBarProps> = ({ columns }) => {
  const [searchTerm, setSearchTerm] = useQueryState(
    "searchTerm",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, throttleMs: 1000 })
  );

  const [selectedColumns, setSelectedColumns] = useQueryState(
    "searchColumns",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value || null);
  };

  const updateColumns = (newColumns: string[]) => {
    setSelectedColumns(newColumns.length > 0 ? newColumns : null);
  };

  const addColumn = (accessorKey: string) => {
    const updated = [...selectedColumns, accessorKey];
    updateColumns(updated);
  };

  const removeColumn = (accessorKey: string) => {
    const updated = selectedColumns.filter((col) => col !== accessorKey);
    updateColumns(updated);
  };

  const availableColumns = columns.filter(
    (col) => !selectedColumns.includes(col.accessorKey)
  );

  return (
    <div className="grid grid-cols-1 gap-2 md:flex border border-sm rounded-md py-1 md:py-0 bg-white dark:bg-gray-800 dark:border-gray-600 items-center w-full">
      {/* Column Selection Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center w-fit px-2">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-fit py-1 bg-transparent dark:bg-transparent hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none  transition duration-200 shadow-none"
            >
              <Plus size={16} />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 mt-1 overflow-y-auto bg-white dark:bg-gray-800 ">
            {availableColumns.length === 0 ? (
              <DropdownMenuItem
                disabled
                className="text-gray-500 dark:text-gray-400 cursor-default"
              >
                No more columns to add
              </DropdownMenuItem>
            ) : (
              availableColumns.map((column) => (
                <DropdownMenuItem
                  key={column.accessorKey}
                  onSelect={() => {
                    addColumn(column.accessorKey);
                    setIsDropdownOpen(false);
                  }}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 text-gray-800 dark:text-gray-100"
                >
                  {column.header}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected Columns as Tags */}
      <div className="h-fit md:h-8 flex flex-wrap md:flex-nowrap items-center gap-1 px-2 py-1">
        {selectedColumns.map((accessorKey) => {
          const column = columns.find((col) => col.accessorKey === accessorKey);
          return (
            <Badge
              key={accessorKey}
              className="flex items-center justify-center w-fit gap-1 bg-gray-200 hover:bg-gray-200 py-0.5 px-2 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full text-nowrap shadow-none"
            >
              <Label className="text-sm font-medium cursor-default flex items-center">
                {column?.header}
              </Label>
              <Button
                variant={"ghost"}
                onClick={() => removeColumn(accessorKey)}
                className="p-0 h-fit flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                aria-label={`Remove ${column?.header}`}
              >
                <X size={15} />
              </Button>
            </Badge>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex justify-between w-full">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full border-none shadow-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none transition duration-200 focus-visible:ring-0"
        />
        {searchTerm && (
          <Button
            variant={"ghost"}
            onClick={() => setSearchTerm(null)}
            aria-label="Clear search"
          >
            <X className="dark:text-white" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
