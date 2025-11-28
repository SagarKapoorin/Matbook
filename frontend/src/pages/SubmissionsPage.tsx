import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import { getSubmissions, type Submission, type SubmissionsResponse } from '../api'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Spinner } from '../components/ui/spinner'

export default function SubmissionsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  )

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: info => {
        const value = info.getValue<string>()
        return new Date(value).toLocaleString()
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setSelectedSubmission(row.original)}
        >
          View
        </Button>
      ),
    },
  ]

  const { data, isLoading, isError, error, isFetching } =
    useQuery<SubmissionsResponse>({
      queryKey: ['submissions', { page, limit, sortBy: 'createdAt', order }],
      queryFn: () =>
        getSubmissions({
          page,
          limit,
          sortBy: 'createdAt',
          order,
        }),
    })

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-slate-950/60">
          <Spinner size="sm" className="mr-1" />
          Fetching submissions...
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-2xl border border-red-500/40 bg-red-950/40 px-5 py-4 text-sm text-red-50 shadow-[0_18px_45px_rgba(248,113,113,0.35)]">
          <div className="mb-1 flex items-center gap-2 text-red-100">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-400/70 bg-red-500/30 text-xs font-semibold">
              !
            </span>
            <p className="text-sm font-semibold">Unable to load submissions</p>
          </div>
          <p className="text-xs text-red-100/80">
            {error instanceof Error
              ? error.message
              : 'Something went wrong while loading the submissions list.'}
          </p>
        </div>
      </div>
    )
  }

  const canPrevious = page > 1
  const canNext = page < data.totalPages

  const from = (data.page - 1) * limit + 1
  const to = Math.min(data.page * limit, data.total)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-2 py-6 sm:px-4 md:py-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300 shadow-[0_10px_30px_rgba(15,23,42,0.85)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-[10px] font-semibold text-slate-950">
                ⧉
              </span>
              <span>Submission history & responses</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Submissions
              </h1>
              <p className="text-xs text-slate-300 sm:text-sm">
                Total {data.total} submissions across {data.totalPages} pages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:items-end">
            <span className="hidden text-[11px] text-slate-400 sm:inline">
              Sorted by most recent first
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
              }
            >
              Sort by date ({order === 'asc' ? 'Oldest first' : 'Newest first'})
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] xl:items-start">
          <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-[0_18px_60px_rgba(15,23,42,0.95)]">
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto sm:block">
              <Table className="w-full min-w-full">
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-slate-800/80 hover:bg-slate-900/80"
                    >
                      {headerGroup.headers.map(header => (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap bg-slate-900/80 text-[11px] font-medium uppercase tracking-wide text-slate-400"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm text-slate-400"
                      >
                        No submissions found
                      </TableCell>
                    </TableRow>
                  )}
                  {table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      className="border-slate-800/80 hover:bg-slate-900/80"
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-normal break-words text-sm text-slate-100"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="space-y-2 p-3 sm:hidden">
              {data.items.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">
                  No submissions found
                </p>
              )}
              {data.items.map(submission => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2"
                >
                  <div className="space-y-1 text-left">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      #{submission.id}
                    </p>
                    <p className="text-xs text-slate-300">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {selectedSubmission && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-slate-50 shadow-[0_18px_60px_rgba(15,23,42,0.95)]">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Submission details
                  </h2>
                  <p className="text-xs text-slate-400">
                    ID {selectedSubmission.id} ·{' '}
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="min-w-[5rem] text-xs font-medium uppercase tracking-wide text-slate-400">
                      {key}
                    </span>
                    <span className="max-w-xs break-words text-slate-100">
                      {Array.isArray(value)
                        ? value.join(', ')
                        : typeof value === 'object' && value !== null
                        ? JSON.stringify(value)
                        : String(value ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <div>
            <span>
              Showing {from}-{to} of {data.total} submissions (page {data.page} of{' '}
              {data.totalPages})
            </span>
            {isFetching && (
              <span className="ml-2 inline-flex items-center text-[11px] sm:text-xs">
                <Spinner size="sm" className="mr-1" />
                Updating
              </span>
            )}
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrevious}
              onClick={() => {
                if (canPrevious) setPage(p => p - 1)
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => {
                if (canNext) setPage(p => p + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
