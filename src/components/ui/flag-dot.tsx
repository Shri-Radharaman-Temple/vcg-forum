import { cn } from '@/lib/utils'
import { flagById } from '@/lib/flags'

/**
 * "Flags are a colored dot with a word, not a pill" — design chrome note.
 */
export function FlagDot({
  flagId,
  size = 6,
  className,
}: {
  flagId: string
  size?: number
  className?: string
}) {
  const flag = flagById(flagId)
  return (
    <span
      className={cn('inline-block shrink-0 rounded-full', className)}
      style={{ width: size, height: size, background: flag.color }}
      aria-hidden
    />
  )
}

export function FlagLabel({
  flagId,
  className,
  muted = false,
}: {
  flagId: string
  className?: string
  muted?: boolean
}) {
  const flag = flagById(flagId)
  return (
    <span
      className={cn('flex items-center gap-1.5 text-[13px] font-light', className)}
      style={{ color: muted ? undefined : flag.color }}
    >
      <FlagDot flagId={flagId} />
      {flag.label}
    </span>
  )
}

export function Dot({ color, size = 6 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color }}
      aria-hidden
    />
  )
}
