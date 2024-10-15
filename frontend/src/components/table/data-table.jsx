"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Controls } from "../controls";
import { cn } from "@/lib/utils";

export function DataTable({
  columns,
  data,
  tablePage,
  setTablePage,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  controlDisabled,
}) {
  const table = useReactTable({
    data: data.customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data.totalPages,
    onPaginationChange: setTablePage,
    state: {
      pagination: tablePage,
    },
    manualPagination: true,
  });
  const className = "px-3 py-1.5 rounded border text-center";
  return (
    <div className="min-h-[493.5px] flex flex-col justify-between">
      <Table className="h-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4 mx-5 mt-3.5">
        <Controls
          addNewCustomer={addNewCustomer}
          deleteCustomer={deleteCustomer}
          updateCustomer={updateCustomer}
          controlDisabled={controlDisabled}
        />
        <div>
          <button
            className={cn(
              className,
              !table.getCanPreviousPage()
                ? "cursor-not-allowed bg-gray-300"
                : "",
              "mx-2.5"
            )}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className={cn(
              className,
              !table.getCanNextPage() ? "cursor-not-allowed bg-gray-300" : "",
              "mx-2.5"
            )}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
