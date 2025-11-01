"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { SortDescriptor } from "@react-types/shared";
import dayjs from "dayjs";
import { AxiosError } from "axios";

import { DATE_TIME_FORMAT, OPTIONS_ROWS_PER_PAGE } from "@/constants/main";
import { ReservationHistory } from "@/types/reservation";
import { ReservationAPI } from "@/api/reservations/reservation";
import { PaginationControls } from "@/components/common/paginationControls";
import { handleApiResponse } from "@/utils/helper";

const columnHeader = [
  {
    label: "Date",
    key: "dateTime",
    sortable: true,
  },
  {
    label: "User",
    key: "userName",
    sortable: true,
  },
  {
    label: "Concert",
    key: "concertName",
    sortable: true,
  },
  {
    label: "Action",
    key: "status",
    sortable: true,
  },
];

export default function History() {
  const { data: session } = useSession();
  const userId = session?.user?.id as number;
  const [reservationHistory, setReservationHistory] = useState<
    ReservationHistory[]
  >([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "dateTime",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(OPTIONS_ROWS_PER_PAGE[0]);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when rows per page changes
  }, []);

  const fetchReservationHistory = useCallback(async () => {
    const { response, isError, error } =
      await ReservationAPI.getReservationHistory(userId);

    if (isError) {
      handleApiResponse(
        error as AxiosError<{ message: string }>,
        "Failed to fetch reservation history",
      );
    } else {
      setReservationHistory(response?.data || []);
    }
  }, [userId]);

  useEffect(() => {
    void fetchReservationHistory();
  }, [fetchReservationHistory]);

  // Sort and paginate data
  const sortedItems = useMemo(() => {
    if (!reservationHistory.length) return [];

    const column = String(sortDescriptor.column);
    const sorted = [...reservationHistory].sort((a, b) => {
      const first = a[column as keyof ReservationHistory];
      const second = b[column as keyof ReservationHistory];

      // Handle date comparison
      if (column === "dateTime") {
        const dateA = new Date(first as Date).getTime();
        const dateB = new Date(second as Date).getTime();
        const cmp = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }

      // Handle string comparison
      const cmp = String(first ?? "").localeCompare(String(second ?? ""));

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });

    return sorted;
  }, [reservationHistory, sortDescriptor]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedItems.length / rowsPerPage);
  }, [sortedItems.length, rowsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  const renderReservationHistory = useCallback(
    (history: ReservationHistory, index: number) => {
      return (
        <TableRow key={`history-row-${index}`}>
          <TableCell className="whitespace-nowrap">
            <span className="text-xs sm:text-sm">
              {dayjs(history.dateTime).format(DATE_TIME_FORMAT)}
            </span>
          </TableCell>
          <TableCell>
            <span className="text-xs sm:text-sm truncate max-w-[150px] block">
              {history.userName}
            </span>
          </TableCell>
          <TableCell>
            <span className="text-xs sm:text-sm truncate max-w-[200px] block">
              {history.concertName}
            </span>
          </TableCell>
          <TableCell>
            <span className="text-xs sm:text-sm">{history.status}</span>
          </TableCell>
        </TableRow>
      );
    },
    [],
  );

  return (
    <section className="flex flex-col w-full gap-4 p-4 md:p-6 lg:p-8">
      <div className="w-full rounded-lg border border-default-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] p-4 ">
          <Table
            isHeaderSticky
            removeWrapper
            aria-label="Reservation History Table"
            classNames={{
              base: "min-h-[400px]",
              table: "min-h-[400px]",
              thead: "",
              th: "bg-default-100",
              td: "text-sm",
            }}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              {columnHeader.map((header) => (
                <TableColumn key={header.key} allowsSorting={header.sortable}>
                  {header.label}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody emptyContent={"No history found"}>
              {paginatedItems.map((history, index) =>
                renderReservationHistory(history, index),
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-divider">
          <PaginationControls
            page={page}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            onPageChange={setPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </div>
    </section>
  );
}
