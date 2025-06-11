/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { ErrorLogs } from "@/types/scheduleLogs";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

// Assuming you have an Error type, replace 'any' with your actual type

const columnHelper = createColumnHelper<ErrorLogs>();

export const getErrorColumns = (): ColumnDef<ErrorLogs, any>[] => [
  columnHelper.accessor("SCHEDULE_LIST_ID", {
    header: "Schedule List ID",
    cell: (info) => (
      <p className="w-full flex place-self-center">{info.getValue()}</p>
    ),
  }),
  columnHelper.accessor("TABLE_NAME", {
    header: "Table Name",
    cell: (info) => (
      <p className="w-full flex place-self-center">{info.getValue()}</p>
    ),
  }),
  columnHelper.accessor("MERGE_QUERY", {
    header: "Merge Query",
    cell: (info) => (
      <Input
        value={info.getValue()}
        readOnly
        className="w-full min-w-32 border-none shadow-none p-0"
      />
    ),
    size: 200,
  }),
  columnHelper.accessor("ERR_MSG", {
    header: "Error Message",
    cell: (info) => (
      <p className="w-full flex place-self-center">{info.getValue()}</p>
    ),
  }),
  columnHelper.accessor("ERR_STATUS", {
    header: "Error Status",
    cell: (info) => (
      <p className="w-full flex place-self-center">{info.getValue()}</p>
    ),
  }),
];
