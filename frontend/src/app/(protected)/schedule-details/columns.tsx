/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScheduleList } from "@/types/scheduleDetails";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<ScheduleList>();

export const getScheduleDetailsColumns = ({
  onDelete,
  onView,
  onEdit,
}: {
  onDelete: (id: number, schedule_name: string) => void;
  onView: (id: number, schedule_name: string) => void;
  onEdit: (scheduleData: ScheduleList) => void; // Changed to accept the whole row data
}): ColumnDef<ScheduleList, any>[] => [
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { SCHEDULE_ID, SCHEDULE_NAME } = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(SCHEDULE_ID, SCHEDULE_NAME)}
            title="View/Edit Parameter"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(SCHEDULE_ID, SCHEDULE_NAME)}
            title="Delete Schedule"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  }),
  columnHelper.accessor("SCHEDULE_NAME", {
    header: "Schedule Name",
    cell: ({ row }) => {
      // const { SCHEDULE_ID, SCHEDULE_NAME, ...rest } = row.original; // Get all data for the row
      return (
        <Button
          variant="link"
          className="text-blue-600 underline p-0 "
          onClick={() => onEdit(row.original)} // Pass the whole row data to onEdit
          title="Edit Schedule"
        >
          {row.original.SCHEDULE_NAME}
        </Button>

      );

    },
    size: 200,
  }),
  columnHelper.accessor("BI_REPORT_NAME", {
    header: "Report Name",
    cell: (info) => (
      <Input
      value={info.getValue()}
      readOnly
      className="w-full min-w-32 border-none shadow-none p-0"
    />
  ),
  size: 150,
  }),
  columnHelper.accessor("BI_REPORT_PATH", {
    header: "Report Path",
    cell: (info) => (
      <Input
        value={info.getValue()}
        readOnly
        className="w-full min-w-32 border-none shadow-none p-0"
      />
    ),
    size: 150,
  }),
  columnHelper.accessor("FREQUENCY_MIN", {
    header: "Frequency Min",
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
    size: 150,
  }),
  columnHelper.accessor("DB_TABLE_NAME", {
    header: "Table Name",
    cell: (info) => (
      <Input
        value={info.getValue()}
        readOnly
        className="w-full min-w-32 border-none shadow-none p-0"
      />
    ),
    size: 200,
  }),
  columnHelper.accessor("DB_COLUMN_NAMES", {
    header: "Column Name",
    cell: (info) => (
      <Input
        value={info.getValue()}
        readOnly
        className="w-full min-w-32  border-none shadow-none p-0"
      />
    ),
    size: 200,
  }),
  columnHelper.accessor("OPERATION", {
    header: "Operation",
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor("DATE", {
    header: "Next Invocation Time",
    cell: ({ row }) => {
      const dateValue = row.original.DATE;
      return dateValue ? (
        <Input
          value={dateValue}
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

  columnHelper.accessor("STATUS", {
    header: "Active",
    cell: ({ getValue }) => {
      const isActive = getValue() === "Y";
      return <Switch checked={isActive} className="cursor-not-allowed" />;
    },
  }),
];
