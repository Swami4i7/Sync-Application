// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { PaginationControl } from "./PaginationControl";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   totalPages: number;
//   pageCount: number;
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   totalPages,
//   pageCount,
// }: Readonly<DataTableProps<TData, TValue>>) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   className="dark:text-white"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center dark:text-white"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <PaginationControl totalPages={totalPages} pageCount={pageCount} />
//     </>
//   );
// }


//swami's


// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { PaginationControl } from "./PaginationControl";
// import { useState } from "react";
// import { ArrowDownNarrowWide, ArrowDownWideNarrow, GripVertical } from "lucide-react";

// interface ColumnSizing {
//   id: string;
//   width: number;
// }

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   totalPages: number;
//   pageCount: number;
//   columnSizes?: ColumnSizing[];
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   totalPages,
//   pageCount,
//   columnSizes,
// }: Readonly<DataTableProps<TData, TValue>>) {
//   const [sorting, setSorting] = useState<SortingState>([]);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     state: {
//       sorting,
//     },
//     defaultColumn: {
//       size: 50,
//       minSize: 50, 
//       maxSize: 300,
//     },
//     enableColumnResizing: true,
//     columnResizeMode: "onChange",
//     initialState: {
//       columnSizing: columnSizes 
//         ? Object.fromEntries(columnSizes.map(({ id, width }) => [id, width]))
//         : {}
//     },
//   });

//   return (
//       <div className="rounded-md relative" style={{ overflow: 'auto' }}>
//         <div style={{ position: 'relative' }}>
//           <Table className="border ">
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead 
//                       key={header.id}
//                       style={{ 
//                         position: 'relative',
//                         width: header.getSize(),
//                       }}
//                       className="border-r dark:border-gray-600 last:border-r-0"
//                     >
//                       {header.isPlaceholder ? null : (
//                         <div
//                           className={`flex items-center ${
//                             header.column.getCanSort() ? 'cursor-pointer select-none' : ''
//                           }`}
//                           onClick={header.column.getToggleSortingHandler()}
//                         >
//                           <div className="flex items-center gap-2">
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                             {{
//                               asc: <ArrowDownNarrowWide className="h-4 w-4" />,
//                               desc: <ArrowDownWideNarrow className="h-4 w-4" />,
//                             }[header.column.getIsSorted() as string] ?? null}
//                           </div>
//                         </div>
//                       )}
//                       {header.column.getCanResize() && (
//                       <div
//                         onMouseDown={header.getResizeHandler()}
//                         onTouchStart={header.getResizeHandler()}
//                         className={`absolute right-0 top-0 h-full w-4 flex items-center justify-center select-none touch-none hover:bg-gray-200 dark:hover:bg-gray-600 
//                           ${header.column.getIsResizing() ? 'bg-gray-400 dark:bg-gray-400' : ''}`}
//                       >
//                         <GripVertical className="h-4 w-4 text-gray-500" />
//                       </div>
//                     )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                     className="dark:text-white"
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell 
//                         key={cell.id}
//                         style={{ width: cell.column.getSize() }}
//                         className="px-2 py-2 border-r dark:border-gray-600 last:border-r-0"
//                       >
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               )
//              : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-center py-6"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <PaginationControl totalPages={totalPages} pageCount={pageCount} />
//     </div>
//   );
// }

"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaginationControl } from "./PaginationControl";
import { useRef, useState } from "react";
import { ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages?: number;
  pageCount?: number;
  pagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalPages,
  pageCount,
  pagination,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const resizingCol = useRef<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
  });

  const handleMouseDown = (columnId: string, startX: number) => {
    resizingCol.current = columnId;
    const startWidth = columnSizing[columnId] ?? 150;

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(60, startWidth + delta);
      setColumnSizing((prev) => ({
        ...prev,
        [columnId]: newWidth,
      }));
    };

    const onMouseUp = () => {
      resizingCol.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      <div className="rounded-md border overflow-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const colSize = columnSizing[header.id] ?? 120;
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: colSize }}
                      className="relative px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-left border-r dark:border-gray-600 last:border-r-0"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowDownNarrowWide className="h-4 w-4" />,
                            desc: <ArrowDownWideNarrow className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}

                      {/* Resizer */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={(e) =>
                            handleMouseDown(header.id, e.clientX)
                          }
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-gray-400 dark:hover:bg-zinc-600 transition"
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="dark:text-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 border-r dark:border-gray-600 last:border-r-0 truncate"
                      style={{
                        width:
                          columnSizing[cell.column.id] ??
                          cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24 dark:text-white"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <PaginationControl totalPages={totalPages} pageCount={pageCount} /> */}
      {pagination && totalPages !== undefined && pageCount !== undefined && (
    <PaginationControl totalPages={totalPages} pageCount={pageCount} />
    )}
    </>
  );
}
 