'use client'
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DataTableProps<T> = {
  columns: ColumnDef<T>[]; // 列定义
  dataSource: T[] | (() => Promise<T[]>); // 数据源可以是数组或异步加载函数
  loading?: boolean; // 是否正在加载
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
  }; // 分页配置
  rowKey?: keyof T | string; // 唯一标识字段
  searchableColumns?: string[]; // 可搜索的列名
  onChange?: (pagination: any, filters: any, sorter: any) => void; // 分页、筛选、排序的回调
  rowSelection?: {
    selectedRowKeys: (keyof T)[];
    onChange?: (selectedRowKeys: (keyof T)[], selectedRows: T[]) => void;
  }; // 行选择功能

  empty?: React.ReactNode; // 空数据时显示的内容
};

export function DataTable<T extends object>({
  columns,
  dataSource,
  loading = false,
  pagination,
  rowKey = "id",
  searchableColumns = [],
  onChange,
  empty,
  rowSelection,
}: DataTableProps<T>) { 
  const [data, setData] = React.useState<T[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelectionState, setRowSelectionState] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  // 处理数据加载
  React.useEffect(() => {
    if (typeof dataSource === "function") {
      dataSource().then(setData);
    } else {
      setData(dataSource);
    }
  }, [dataSource]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updating) => {
      setSorting(updating);
      onChange?.(pagination, columnFilters, updating); // 通知外部排序变化
    },
    onColumnFiltersChange: (filters) => {
      setColumnFilters(filters);
      onChange?.(pagination, filters, sorting); // 通知外部筛选变化
    },
    getRowId(originalRow, index, parent) {
      return originalRow[rowKey as keyof T] as string;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (newRowSelection) => {
      setRowSelectionState(newRowSelection);
      const selectRowIds = Object.entries(newRowSelection).filter(([key, value]) => !!value).map(([key]) => key) as Array<keyof T>
      const selectRows = data.filter(row => selectRowIds.includes(row[rowKey as keyof T] as keyof T))
      rowSelection?.onChange?.(selectRowIds, selectRows);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelectionState,
      globalFilter,
    },
  });

  // 处理分页器变化
  const handlePageChange = (page: number, pageSize: number) => {
    pagination?.onChange?.(page, pageSize);
  };

  return (
    <div className="w-full">
      {/* 搜索框 */}
      {searchableColumns.length > 0 && (
        <div className="flex items-center py-4">
          <Input
            placeholder="输入信息检索..."
            className="max-w-sm"
          />
        </div>
      )}

      {/* 表格主体 */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original[rowKey as keyof T] as string} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                {empty ?? "无数据"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页器 */}
      {pagination && pagination.total ? (
        <TablePagination 
         total={pagination.total}
          pageSize={pagination.pageSize} 
          page={pagination.current}
        />

      ) : null}
    </div>
  );
} 



export type TablePaginationProps = {
  total: number;
  pageSize: number;
  page: number;
  /**
   * 最多显示页面数量，超过后，要开始计算省略
   * @default 10
   */
  maxShowTotal?: number;
  onPageChange?: (page: number, pageSize: number) => void;
};

export function TablePagination(props: TablePaginationProps) {
  const totalPage = Math.ceil(props.total / props.pageSize);
  const [current,setCurrent] = React.useState(props.page);
  const maxShowTotal = props.maxShowTotal || 10;
  const pagesArray = buildPage( totalPage , current,maxShowTotal);
  const handlePageChange = (page: number) => {
    if (page !== current) {
      setCurrent(page);
      props.onPageChange?.(page, props.pageSize);
    }
  };

  return (
    <Pagination className="p-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(current - 1, 1))} />
        </PaginationItem>
        
        {pagesArray.map((page, index) => (
          page === -1 ? (
            <PaginationItem key={`ellpisis_${index}`}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink 
              isActive={page === current}
              onClick={() => handlePageChange(page)}>{page}</PaginationLink>
            </PaginationItem>
          )
        ))}

        <PaginationItem>
          <PaginationNext href="#" onClick={() => handlePageChange(Math.min(current + 1, totalPage))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
/**
 * 自动计算是否显示省略号来优化显示内容
 * @param totalPage 总页码
 * @param page  当前页码
 * @param maxShowPage  最多显示的数量
 * @returns 返回页面渲染的数组，其中用-1代表中间省略号
 */
function buildPage(totalPage: number, page: number, maxShowPage: number = 10) {
  // 如果总页码小于或等于最大显示页码，则直接返回所有页码
  console.log("buildPage", totalPage, page, maxShowPage)  

  if (totalPage <= maxShowPage) {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }

  const pages: (number | -1)[] = [];
  const halfRange = Math.floor(maxShowPage / 2);
  
  // 1. 如果当前页码较小，显示前面页码和尾部页码
  if (page <= halfRange) {
    pages.push(...Array.from({ length: maxShowPage -5 }, (_, i) => i + 1));
    if (totalPage > maxShowPage) {
      pages.push(-1);
      pages.push(...Array.from({ length: 5 }, (_, i) => totalPage - 2 + i));
    }
    console.log(pages)
  } 
  // 2. 如果当前页码接近尾部，显示前面页码和尾部页码
  else if (page > totalPage - halfRange) {
    pages.push(1, 2, 3,4,5);
    pages.push(-1);
    pages.push(...Array.from({ length: halfRange }, (_, i) => totalPage - halfRange +1 + i));

  } 
  // 3. 如果当前页码在中间，显示前面、中间和尾部页码
  else {
    pages.push(1, 2, 3);
    pages.push(-1);
    pages.push(...Array.from({ length: maxShowPage-6 }, (_, i) => page - (halfRange - 3) + i));
    pages.push(-1);
    pages.push(...Array.from({ length: 3 }, (_, i) => totalPage - 2 + i));
  }

  return Array.from(pages); // 去除重复项
}
