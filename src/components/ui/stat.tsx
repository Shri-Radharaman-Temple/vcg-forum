import { cn } from '@/lib/utils'

/**
 * The bordered number tile used for sadhna counts and admin metrics.
 * Numerals sit at Mukta 200 — the design leans on size, not weight.
 */
export function Stat({
  value,
  unit,
  label,
  className,
  accent = false,
}: {
  value: string | number
  unit?: string
  label: string
  className?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-[10px] border border-line p-3.5',
        className,
      )}
    >
      <span
        className={cn(
          'text-[24px] font-extralight leading-none sm:text-[28px]',
          accent && 'text-terracotta',
        )}
      >
        {value}
        {unit ? <span className="text-[15px]">{unit}</span> : null}
      </span>
      <span className="text-[13px] font-light text-muted">{label}</span>
    </div>
  )
}
