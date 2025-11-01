import { useMemo } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";

import { OPTIONS_ROWS_PER_PAGE } from "@/constants/main";

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}
export const PaginationControls = ({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationControlsProps): React.ReactElement | null => {
  const selectedKeys = useMemo(
    () => new Set([rowsPerPage.toString()]),
    [rowsPerPage],
  );

  return (
    <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 border-t border-divider p-4">
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-start">
        <p className="text-xs sm:text-sm whitespace-nowrap">Rows per page</p>
        <Select
          disallowEmptySelection
          aria-label="Rows per page"
          className="w-20 min-w-[80px]"
          selectedKeys={selectedKeys}
          size="sm"
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0];

            if (selectedValue) {
              onRowsPerPageChange(Number(selectedValue));
            }
          }}
        >
          {OPTIONS_ROWS_PER_PAGE.map((option: number) => (
            <SelectItem key={option.toString()}>{option.toString()}</SelectItem>
          ))}
        </Select>
      </div>
      {totalPages > 0 && (
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Pagination
            isCompact
            showControls
            showShadow
            classNames={{
              wrapper: "gap-0",
            }}
            color="primary"
            page={page}
            size="sm"
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
