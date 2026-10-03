import * as React from 'react'
import { cn } from '@/lib/utils'

/** Raised panel: surface fill, hairline border, no shadow. */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[12px] border border-line bg-surface',
        className,
      )}
      {...props}
    />
  )
}

/** Section heading with an optional trailing link. */
export function SectionHead({
  title,
  action,
  className,
}: {
  title: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('flex items-baseline justify-between gap-4', className)}
    >
      <span className="text-[15px] font-normal text-ink">{title}</span>
      {action}
    </div>
  )
}

/** Page title with its Devanagari companion, as used on every screen header. */
export function PageTitle({
  children,
  deva,
  size = 'lg',
}: {
  children: React.ReactNode
  deva?: string
  size?: 'lg' | 'md'
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-0.5">
      <h1
        className={cn(
          'm-0 font-light leading-[1.1]',
          size === 'lg' ? 'text-[28px] sm:text-[34px]' : 'text-[26px] sm:text-[32px]',
        )}
      >
        {children}
      </h1>
      {deva ? (
        <span
          className={cn(
            'deva',
            size === 'lg' ? 'text-[21px] sm:text-[26px]' : 'text-[20px] sm:text-[24px]',
          )}
        >
          {deva}
        </span>
      ) : null}
    </div>
  )
}

/** Hatched placeholder standing in for a photo, cover or thumbnail. */
export function MediaPlaceholder({
  label,
  className,
  variant = 'default',
  src,
}: {
  label?: string
  /** Image to show; the hatch is kept as the fallback when omitted. */
  src?: string
  className?: string
  variant?: 'default' | 'tight' | 'wide'
}) {
  const hatch =
    variant === 'tight'
      ? 'placeholder-hatch-tight'
      : variant === 'wide'
        ? 'placeholder-hatch-wide'
        : 'placeholder-hatch'
  return (
    <div
      className={cn(
        hatch,
        'flex items-end overflow-hidden font-mono text-[11px] text-muted',
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label ?? ''} className="h-full w-full object-cover" />
      ) : label ? (
        <span className="p-3">{label}</span>
      ) : null}
    </div>
  )
}
