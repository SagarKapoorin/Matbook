import type { HTMLAttributes } from 'react'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const base = 'rounded-lg border border-gray-200 bg-white shadow-sm'
  const merged = [base, className].filter(Boolean).join(' ')
  return <div className={merged} {...props} />
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const base = 'flex flex-col gap-1 border-b border-gray-100 px-4 py-3'
  const merged = [base, className].filter(Boolean).join(' ')
  return <div className={merged} {...props} />
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  const base = 'text-lg font-semibold leading-none tracking-tight'
  const merged = [base, className].filter(Boolean).join(' ')
  return <h2 className={merged} {...props} />
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  const base = 'text-sm text-gray-500'
  const merged = [base, className].filter(Boolean).join(' ')
  return <p className={merged} {...props} />
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const base = 'px-4 py-4'
  const merged = [base, className].filter(Boolean).join(' ')
  return <div className={merged} {...props} />
}
