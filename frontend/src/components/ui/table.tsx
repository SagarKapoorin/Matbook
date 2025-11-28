import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react'

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  const base = 'w-full caption-bottom text-sm'
  const merged = [base, className].filter(Boolean).join(' ')
  return <table className={merged} {...props} />
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  const base = '[&_tr]:border-b'
  const merged = [base, className].filter(Boolean).join(' ')
  return <thead className={merged} {...props} />
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  const base = '[&_tr:last-child]:border-0'
  const merged = [base, className].filter(Boolean).join(' ')
  return <tbody className={merged} {...props} />
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  const base =
    'border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100'
  const merged = [base, className].filter(Boolean).join(' ')
  return <tr className={merged} {...props} />
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  const base =
    'h-10 px-3 text-left align-middle text-xs font-medium text-gray-500'
  const merged = [base, className].filter(Boolean).join(' ')
  return <th className={merged} {...props} />
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  const base = 'p-3 align-middle text-sm'
  const merged = [base, className].filter(Boolean).join(' ')
  return <td className={merged} {...props} />
}
