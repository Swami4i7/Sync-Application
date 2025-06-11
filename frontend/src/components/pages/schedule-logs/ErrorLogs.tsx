// src/components/pages/schedule-logs/ErrorLogs.tsx
"use client";

import { getErrorLogsColumns } from "@/app/(protected)/schedule-logs/[scheduleListId]/error-logs/columns";
import { DataTable } from "@/components/DataTable";
import SearchBar from "@/components/Searchbar";
import { ErrorLogs } from "@/types/scheduleLogs";
import { useMemo } from "react";

interface ErrorLogsClientProps {
  data: ErrorLogs[];           // or your ScheduleError[] type
  pageCount: number;
  totalPages: number;
}

interface ColumnOption {
  accessorKey: string;
  header: string;
}

export default function ErrorLogsClient({
  data,
  pageCount,
  totalPages,
}: Readonly<ErrorLogsClientProps>) {
  const columns = getErrorLogsColumns();
  const searchableColumns = useMemo<ColumnOption[]>(() => {
          return columns
            .filter((col) => {
              const accessor = (col as ColumnOption).accessorKey;
              return (
                typeof accessor === "string" &&
                (col as ColumnOption).header !== "actions"
              );
            })
            .map((col) => ({
              accessorKey: (col as ColumnOption).accessorKey,
              header: (col as ColumnOption).header,
            }));
        }, [columns]);
  return (
    <div>
      <div className="py-2 flex justify-between items-center">
        <SearchBar
          columns={searchableColumns}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        totalPages={totalPages}
        pagination={true}
      />
    </div>
  );
}
