/* eslint-disable @typescript-eslint/no-explicit-any */
//src/app/(protected)/schedule-logs/columns.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleLogs } from "@/types/scheduleLogs";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
 
const columnHelper = createColumnHelper<ScheduleLogs>();

export const getScheduleLogsColumns= (
  {onView,}: {onView: (id: number) => void;}
): ColumnDef<ScheduleLogs, any>[] => [
  columnHelper.accessor("SCHEDULE_LIST_ID", {
    header: "Schedule List ID",
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor("SCHEDULE_NAME", {
    header: "Schedule Name",
    cell: (info) => (
      <Input value={info.getValue()} readOnly className="w-full min-w-32 p-3 border-none shadow-none" />
    ),
  }),
  columnHelper.accessor("BI_REPORT_PATH", {
    header: "Report Path",
    cell: (info) => (
      <Input value={info.getValue()} readOnly className="w-full min-w-32 text-center p-0 border-none shadow-none" />
    ),
  }),
  columnHelper.accessor("BI_REPORT_NAME", {
    header: "Report Name",
    cell: (info) => (
      <Input value={info.getValue()} readOnly className="w-full min-w-32 text-center p-0 border-none shadow-none" />
    ),
  }),
  columnHelper.accessor("LAST_REFRESH_TIME", {
    header: "Input Date and Time",
    cell: (info) => {
      const rawDate = info.getValue();
      if (!rawDate) return "N/A"; // Handle null/undefined cases
  
      return format(new Date(rawDate), "dd-MMM-yyyy hh:mm:ss a");
    },
  }),
  
  // columnHelper.accessor("SCHEDULE_STATUS", {
  //   header: "Status",
  //   cell: (info) => info.getValue(),
  // }),

  columnHelper.accessor("SCHEDULE_STATUS", {
    header: "Status",
    cell: ({ row }) => {
      const { SCHEDULE_LIST_ID, SCHEDULE_STATUS } = row.original;
  
      return SCHEDULE_STATUS === "ERRORED" ? (
        <button
          className="text-blue-600 underline"
          onClick={() => onView(SCHEDULE_LIST_ID)}
        >
          {SCHEDULE_STATUS}
        </button>
      ) : (
        <span>{SCHEDULE_STATUS}</span>
      );
    },
  }),
  
  // columnHelper.accessor("ERROR_MESSAGE", {
  //   header: "Error Message",
  //   cell: (info) => info.getValue(),
  // }),

  columnHelper.accessor("ERROR_MESSAGE", {
    header: "Error Message",
    cell: ({ row }) => {
      const errorMessage = row.original.ERROR_MESSAGE;
      return errorMessage ? (
        <Input
          value={errorMessage}
          readOnly
          className="w-full min-w-32 border-none shadow-none"
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="flex text-gray-500 place-self-center"
          disabled
        >
          null
        </Button>
      );
    },
  }),
  
  columnHelper.accessor("PARAM_SEQUENCE_NO", {
    header: "Sequence No",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("REPORT_RECORD_COUNT", {
    header: "Report Record Count",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("CREATION_DATE", {
    header: "Creation Date",
    cell: (info) => {
      const rawDate = info.getValue();
      if (!rawDate) return "N/A"; // Handle null/undefined cases
  
      return format(new Date(rawDate), "dd-MMM-yyyy hh:mm:ss a");
    },
  }),
];