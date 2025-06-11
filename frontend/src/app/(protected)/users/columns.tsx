"use client";
import { Button } from "@/components/ui/button";
import { Users } from "@/types/users";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<Users>();

export const getUsersColumns = (
  onEdit: (app: Users) => void,
  onDelete: (app: Users) => void,
//eslint-disable-next-line @typescript-eslint/no-explicit-any
): ColumnDef<Users, any>[] => { 
  return [
    columnHelper.display({
      id: "actions",
      header: () => <div className="ml-2">Actions</div>,
      size: 20,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-1 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
              title="Edit User"
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(user)}
              title="Delete User"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        );
      },
    }),
    columnHelper.accessor("USER_NAME", {
      header: "Username",
      size: 150,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("ROLE", {
      header:"Role",
      size: 100,
      cell: (info) => info.getValue(),
    }),
  ];
};
