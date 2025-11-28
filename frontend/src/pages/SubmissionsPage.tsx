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
      header: 'Created At',
      cell: info => {
        const value = info.getValue<string>()
        return new Date(value).toLocaleString()
      },
    },
    {
      id: 'actions',
      header: 'Actions',
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-md bg-red-50 px-4 py-3 text-red-700">
          {error instanceof Error ? error.message : 'Failed to load submissions'}
        </div>
      </div>
    )
  }

  const canPrevious = page > 1
  const canNext = page < data.totalPages

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Submissions
            </h1>
            <p className="text-sm text-gray-500">
              Total {data.total} submissions across {data.totalPages} pages
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            Sort by date ({order === 'asc' ? '↑' : '↓'})
          </Button>
        </div>

        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
                    className="h-24 text-center"
                  >
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
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

        {selectedSubmission && (
          <div className="rounded-md border border-gray-200 bg-white px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Submission details</h2>
                <p className="text-xs text-gray-500">
                  ID {selectedSubmission.id} •{' '}
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
            <div className="space-y-1 text-sm">
              {Object.entries(selectedSubmission.data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-2"
                >
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="max-w-xs break-words text-gray-800">
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

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Page {data.page} of {data.totalPages}
            {isFetching && (
              <span className="ml-2 inline-flex items-center text-xs">
                <Spinner size="sm" className="mr-1" />
                Updating
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
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
